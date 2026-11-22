"""Respuestas y validación comunes de la API de Cine Bogotá."""

import json
import logging
from functools import wraps

from django.core.exceptions import RequestDataTooBig
from django.db import DatabaseError, InterfaceError, OperationalError
from django.http import JsonResponse
from pymongo.errors import ConnectionFailure, PyMongoError

logger = logging.getLogger(__name__)


class ApiError(Exception):
    def __init__(self, http_status, code, message, *, errors=None):
        super().__init__(message)
        self.http_status = http_status
        self.code = code
        self.message = message
        self.errors = errors

    def respuesta(self):
        datos = {"status": "error", "code": self.code, "message": self.message}
        if self.errors is not None:
            datos["errors"] = self.errors
        return JsonResponse(datos, status=self.http_status)


def api_endpoint(*metodos):
    def decorar(vista):
        @wraps(vista)
        def responder(request, *args, **kwargs):
            if request.method not in metodos:
                respuesta = ApiError(
                    405, "metodo_no_permitido", "El método HTTP no está permitido en esta ruta."
                ).respuesta()
                respuesta["Allow"] = ", ".join(metodos)
                return respuesta

            try:
                return vista(request, *args, **kwargs)
            except ApiError as error:
                return error.respuesta()
            except RequestDataTooBig:
                return ApiError(
                    413, "solicitud_demasiado_grande", "El cuerpo supera el tamaño permitido."
                ).respuesta()
            except (OperationalError, InterfaceError) as error:
                _registrar_fallo(vista, error)
                return ApiError(
                    503, "postgresql_no_disponible", "No se pudo completar la operación en PostgreSQL."
                ).respuesta()
            except PyMongoError as error:
                _registrar_fallo(vista, error)
                if isinstance(error, ConnectionFailure) or getattr(error, "timeout", False):
                    return ApiError(
                        503, "mongodb_no_disponible", "No se pudo completar la operación en MongoDB."
                    ).respuesta()
                return ApiError(
                    500, "error_mongodb", "Ocurrió un error al procesar la operación en MongoDB."
                ).respuesta()
            except DatabaseError as error:
                _registrar_fallo(vista, error)
                return ApiError(
                    500, "error_postgresql", "Ocurrió un error al procesar la operación en PostgreSQL."
                ).respuesta()
            except Exception as error:
                _registrar_fallo(vista, error)
                return ApiError(500, "error_interno", "Ocurrió un error interno.").respuesta()

        return responder

    return decorar


def _registrar_fallo(vista, error):
    # No registrar la excepción cruda: puede incluir credenciales o datos personales.
    logger.error("Error en %s: %s", vista.__name__, type(error).__name__)


def leer_json(request):
    if request.content_type != "application/json":
        raise ApiError(415, "tipo_de_contenido_no_admitido", "Envía el cuerpo como application/json.")

    def rechazar_constante(valor):
        raise ValueError(valor)

    try:
        datos = json.loads(request.body.decode("utf-8"), parse_constant=rechazar_constante)
    except (ValueError, RecursionError) as error:
        raise ApiError(400, "json_invalido", "El cuerpo debe ser JSON válido en UTF-8.") from error
    if not isinstance(datos, dict):
        raise ApiError(400, "json_invalido", "El cuerpo JSON debe ser un objeto.")
    return datos


def entero(valor, campo, *, minimo=1, maximo=2147483647):
    # Los selectores del frontend también envían identificadores como texto.
    if isinstance(valor, str):
        valor = valor.strip()
        digitos = valor[1:] if valor.startswith(("+", "-")) else valor
        if len(digitos) <= len(str(maximo)) and digitos.isascii() and digitos.isdigit():
            valor = int(valor)
    if type(valor) is not int or not minimo <= valor <= maximo:
        mensaje = f"{campo} debe ser un entero entre {minimo} y {maximo}."
        raise ApiError(400, "datos_invalidos", mensaje, errors={campo: mensaje})
    return valor


def ruta_no_encontrada(request):
    return ApiError(404, "ruta_no_encontrada", "La ruta solicitada no existe.").respuesta()


def respuestas_api_json(get_response):
    """Convierte errores de Django ajenos a las vistas en respuestas JSON de la API."""
    errores = {
        400: ("solicitud_invalida", "La solicitud no es válida."),
        403: ("acceso_denegado", "No tienes permiso para realizar esta solicitud."),
        404: ("ruta_no_encontrada", "La ruta solicitada no existe."),
        405: ("metodo_no_permitido", "El método HTTP no está permitido en esta ruta."),
        413: ("solicitud_demasiado_grande", "El cuerpo supera el tamaño permitido."),
        500: ("error_interno", "Ocurrió un error interno."),
    }

    def responder(request):
        respuesta = get_response(request)
        ruta = request.path_info
        if ruta != "/api" and not ruta.startswith("/api/"):
            return respuesta
        if respuesta.status_code not in errores or respuesta.get("Content-Type", "").startswith("application/json"):
            return respuesta

        code, mensaje = errores[respuesta.status_code]
        nueva = ApiError(respuesta.status_code, code, mensaje).respuesta()
        for nombre, valor in respuesta.items():
            if nombre.lower() not in {"content-type", "content-length", "content-encoding"}:
                nueva[nombre] = valor
        nueva.cookies = respuesta.cookies
        return nueva

    return responder
