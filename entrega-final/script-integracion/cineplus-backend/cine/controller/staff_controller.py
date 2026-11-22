from datetime import date
from decimal import Decimal, InvalidOperation

from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import DatabaseError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from cine.api_errors import ApiError, api_endpoint, entero, leer_json
from cine.service.staff_service import StaffService


def _texto(cuerpo, campo, *, maximo, opcional=False, conservar=False):
    dato = cuerpo.get(campo)
    if dato is None and opcional:
        return None
    if isinstance(dato, str) and "\x00" not in dato:
        limpio = dato.strip()
        if not limpio and opcional:
            return None
        valor = dato if conservar else limpio
        if limpio and len(valor) <= maximo:
            try:
                valor.encode("utf-8")
            except UnicodeEncodeError:
                pass
            else:
                return valor
    raise ApiError(
        400, "datos_invalidos", f"{campo} debe contener texto de hasta {maximo} caracteres"
    )


def _fecha_inicio(valor):
    if isinstance(valor, str):
        try:
            fecha = date.fromisoformat(valor)
            if fecha.isoformat() == valor:
                return fecha
        except ValueError:
            pass
    raise ApiError(400, "datos_invalidos", "La fecha de inicio debe tener el formato AAAA-MM-DD")


def _salario(valor):
    try:
        if isinstance(valor, bool) or not isinstance(valor, (str, int, float)):
            raise InvalidOperation
        salario = Decimal(str(valor))
        if salario.is_finite() and 0 < salario <= 20_000_000:
            if salario == salario.quantize(Decimal("0.01")):
                return salario
    except (InvalidOperation, ValueError):
        pass
    raise ApiError(
        400,
        "datos_invalidos",
        "El salario debe ser mayor que cero, no superar 20.000.000 y tener hasta dos decimales",
    )


@csrf_exempt
@api_endpoint("POST")
def login_staff_view(request):
    cuerpo = leer_json(request)
    usuario = _texto(cuerpo, "usuario", maximo=100)
    contrasenia = _texto(cuerpo, "contrasenia", maximo=4096, conservar=True)
    staff = StaffService.login(usuario, contrasenia)
    if not staff:
        raise ApiError(401, "credenciales_invalidas", "Usuario o contraseña incorrectos")

    return JsonResponse({"status": "success", "data": staff}, status=200)


@api_endpoint("GET")
def listar_staff_view(request):
    return JsonResponse({"status": "success", "data": StaffService.listar()}, status=200)


@csrf_exempt
@api_endpoint("POST")
def contratar_staff_view(request):
    cuerpo = leer_json(request)
    datos = {
        campo: entero(cuerpo.get(campo), campo)
        for campo in ("id_cargo_staff", "id_estado_staff", "id_tipo_documento", "id_tipo_contrato")
    }
    datos.update(
        primer_nombre=_texto(cuerpo, "primer_nombre", maximo=50),
        segundo_nombre=_texto(cuerpo, "segundo_nombre", maximo=50, opcional=True),
        primer_apellido=_texto(cuerpo, "primer_apellido", maximo=50),
        segundo_apellido=_texto(cuerpo, "segundo_apellido", maximo=50, opcional=True),
        numero_documento=_texto(cuerpo, "numero_documento", maximo=20),
        correo=_texto(cuerpo, "correo", maximo=100),
        usuario=_texto(cuerpo, "usuario", maximo=50),
        contrasenia=_texto(cuerpo, "contrasenia", maximo=4096, conservar=True),
        fecha_inicio=_fecha_inicio(cuerpo.get("fecha_inicio")),
        salario=_salario(cuerpo.get("salario")),
    )
    try:
        validate_email(datos["correo"])
    except ValidationError as error:
        raise ApiError(400, "datos_invalidos", "Ingresa un correo electrónico válido") from error

    try:
        resultado = StaffService.contratar(datos)
    except DatabaseError as error:
        causa = error.__cause__
        sqlstate = getattr(causa, "sqlstate", None) or getattr(causa, "pgcode", None)
        if sqlstate == "23505":
            raise ApiError(
                409, "registro_duplicado", "Ya existe personal con ese documento, correo o usuario"
            ) from error
        if sqlstate == "23503":
            raise ApiError(
                400, "referencia_invalida", "El cargo, estado, tipo de documento o contrato no existe"
            ) from error
        if sqlstate == "P0001":
            mensaje = getattr(getattr(causa, "diag", None), "message_primary", "") or ""
            if mensaje.startswith("La fecha de inicio del contrato"):
                raise ApiError(
                    400, "datos_invalidos", "La fecha de inicio no puede ser posterior a la fecha actual"
                ) from error
        raise

    return JsonResponse({"status": "success", "data": {"id_staff": resultado["id_staff"]}}, status=201)
