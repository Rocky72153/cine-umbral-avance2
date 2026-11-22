import logging
from datetime import date, datetime, time, timezone
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

from django.db import DatabaseError, InterfaceError, OperationalError, transaction
from pymongo.errors import ConnectionFailure, PyMongoError

from cine.api_errors import ApiError, entero
from cine.repository.funcion_repository import FuncionRepository
from cine.repository.venta_mongo_repository import VentaMongoRepository
from cine.repository.venta_repository import VentaRepository


logger = logging.getLogger(__name__)
_CENTAVO = Decimal("0.01")
_MAXIMO_MONTO = Decimal("99999999.99")


def _asiento(valor):
    if not isinstance(valor, str):
        return None
    asiento = valor.strip()
    if not asiento or len(asiento) > 10 or "\x00" in asiento:
        return None
    try:
        asiento.encode("utf-8")
    except UnicodeEncodeError:
        return None
    return asiento


def _precio(valor):
    if not isinstance(valor, (int, float, str)) or isinstance(valor, bool):
        return None
    try:
        precio = Decimal(str(valor))
        if not precio.is_finite() or not Decimal("0.005") <= precio <= _MAXIMO_MONTO:
            return None
        return precio.quantize(_CENTAVO, rounding=ROUND_HALF_UP)
    except (InvalidOperation, ValueError):
        return None


def _error_venta_postgresql(error):
    causa = error.__cause__
    codigo = getattr(causa, "sqlstate", None) or getattr(causa, "pgcode", None)
    if codigo == "23505":
        return _error_compra(
            409, "venta_conflicto", "La venta entra en conflicto con un registro existente. Revisa los asientos."
        )
    if codigo == "23503":
        return _error_compra(
            404, "referencia_venta_no_encontrada",
            "No existe el personal, función, espectador, método de pago o tipo de boleta indicado."
        )
    if codigo in {"22023", "22003", "22001", "23514"}:
        return _error_compra(400, "datos_venta_invalidos", "Revisa los datos de la venta y los precios de las boletas.")
    return None


def _error_compra(status, code, mensaje):
    # La pantalla de compra ya muestra los mensajes que llegan en errors.
    return ApiError(status, code, mensaje, errors={"venta": mensaje})


class VentaService:

    @staticmethod
    def registrar_compra(datos: dict) -> dict:
        errores = {}

        def validar_id(campo):
            try:
                return entero(datos.get(campo), campo)
            except ApiError:
                errores[campo] = f"{campo} debe ser un identificador entero positivo válido."
                return None

        id_staff = validar_id("id_staff")
        id_espectador = validar_id("id_espectador")
        id_metodo_pago = validar_id("id_metodo_pago")
        id_funcion = None
        id_pelicula = None
        if datos.get("id_funcion") is not None:
            id_funcion = validar_id("id_funcion")
        else:
            id_pelicula = validar_id("id_pelicula")
            try:
                fecha = date.fromisoformat(datos.get("fecha")).isoformat()
                if fecha != datos.get("fecha"):
                    raise ValueError
            except (TypeError, ValueError):
                errores["fecha"] = "Indica la fecha de la función (AAAA-MM-DD)."
            try:
                hora = time.fromisoformat(datos.get("hora")).strftime("%H:%M")
                if hora != datos.get("hora"):
                    raise ValueError
            except (TypeError, ValueError):
                errores["hora"] = "Indica la hora de la función (HH:MM)."

        boletas = datos.get("boletas")
        if not isinstance(boletas, list) or not boletas:
            errores["boletas"] = "Debe comprar al menos una boleta."
            boletas = []

        asientos, tipos_boleta, precios = [], [], []
        asientos_normalizados = set()
        for boleta in boletas:
            if not isinstance(boleta, dict):
                errores["boletas"] = "Cada boleta debe ser un objeto con asiento, tipo y precio."
                break

            asiento = _asiento(boleta.get("asiento"))
            precio = _precio(boleta.get("precio"))
            try:
                id_tipo = entero(boleta.get("id_tipo_boleta"), "id_tipo_boleta")
            except ApiError:
                id_tipo = None

            if asiento is None or id_tipo is None or precio is None:
                errores["boletas"] = (
                    "Cada boleta requiere un asiento de hasta 10 caracteres, "
                    "un tipo válido y un precio positivo admitido."
                )
                break

            asiento_normalizado = asiento.upper()
            if asiento_normalizado in asientos_normalizados:
                errores["boletas"] = "La solicitud contiene asientos repetidos."
                break

            asientos_normalizados.add(asiento_normalizado)
            asientos.append(asiento)
            tipos_boleta.append(id_tipo)
            precios.append(precio)

        if "boletas" not in errores and sum(precios) > _MAXIMO_MONTO:
            errores["boletas"] = "El total de las boletas supera el monto permitido."

        if errores:
            raise ApiError(400, "datos_venta_invalidos", "Revisa los datos de la venta.", errors=errores)

        if id_funcion is None:
            # El frontend actual identifica la función por película, fecha y hora.
            funciones = [
                funcion["id_funcion"]
                for funcion in FuncionRepository.obtener_funciones_por_pelicula(id_pelicula)
                if funcion["fecha"] == fecha and funcion["hora"] == hora
            ]
            if not funciones:
                raise _error_compra(404, "funcion_no_encontrada", "No hay una función para la película, fecha y hora indicadas.")
            if len(funciones) > 1:
                raise _error_compra(409, "funcion_ambigua", "Hay varias funciones en ese horario. Indica el id_funcion.")
            id_funcion = funciones[0]

        mongo_confirmado = False
        try:
            with transaction.atomic():
                try:
                    id_venta = VentaRepository.registrar_venta(
                        id_staff, id_funcion, id_espectador, id_metodo_pago,
                        asientos, tipos_boleta, precios,
                    )
                except DatabaseError as error:
                    error_publico = _error_venta_postgresql(error)
                    if error_publico is not None:
                        raise error_publico from error
                    raise

                venta = VentaRepository.obtener_por_id(id_venta)
                if venta is None or len(venta["boletas"]) != len(asientos):
                    raise DatabaseError("No se recuperó la venta con todas sus boletas.")
                id_registro = VentaMongoRepository.guardar_registro({
                    **venta,
                    "canal": "web",
                    "estado": "confirmada",
                    "registrado_en": datetime.now(timezone.utc),
                })
                mongo_confirmado = True
        except PyMongoError as error:
            logger.error("Fallo al registrar la venta en MongoDB: %s", type(error).__name__)
            temporal = isinstance(error, ConnectionFailure) or getattr(error, "timeout", False)
            raise _error_compra(
                503 if temporal else 500,
                "venta_estado_no_confirmado",
                "No se pudo confirmar el registro en MongoDB. Verifica el estado de la venta antes de repetirla.",
            ) from error
        except (DatabaseError, InterfaceError) as error:
            if not mongo_confirmado:
                raise
            logger.error("Fallo al confirmar PostgreSQL tras el registro en MongoDB: %s", type(error).__name__)
            raise _error_compra(
                503 if isinstance(error, (OperationalError, InterfaceError)) else 500,
                "venta_estado_no_confirmado",
                "MongoDB registró la operación, pero no se pudo confirmar en PostgreSQL. "
                "Verifica el estado de la venta antes de repetirla.",
            ) from error

        venta["id_registro_mongo"] = id_registro
        return venta

    @staticmethod
    def listar_boletas_espectador(id_espectador: int) -> list:
        ventas = VentaRepository.listar_por_espectador(id_espectador)
        if not ventas:
            if not VentaRepository.existe_espectador(id_espectador):
                raise ApiError(404, "espectador_no_encontrado", "No existe el espectador indicado.")
            return ventas
        estados = VentaMongoRepository.obtener_estados([v["id_venta"] for v in ventas])

        for venta in ventas:
            venta["estado_mongo"] = estados.get(venta["id_venta"], "sin registro en MongoDB")
        return ventas
