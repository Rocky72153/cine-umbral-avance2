from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from cine.api_errors import ApiError, api_endpoint, entero, leer_json
from cine.dto.espectador_dto import RegistroEspectadorDTO
from cine.service.espectador_service import EspectadorService


@api_endpoint("GET")
def listar_tipos_documento_view(request):
    tipos = EspectadorService.listar_tipos_documento()
    return JsonResponse({"status": "success", "data": tipos}, status=200)


@csrf_exempt
@api_endpoint("POST")
def registrar_espectador_view(request):
    cuerpo = leer_json(request)
    errores = {}
    for campo in (
        "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido",
        "numero_documento", "correo", "usuario", "contrasenia",
    ):
        valor = cuerpo.get(campo)
        if isinstance(valor, str):
            try:
                valor.encode("utf-8")
            except UnicodeEncodeError:
                errores[campo] = f"{campo} debe contener texto válido"
            if "\x00" in valor:
                errores[campo] = f"{campo} debe contener texto válido"
    if errores:
        raise ApiError(400, "datos_invalidos", "Revisa los datos del espectador", errors=errores)

    dto = RegistroEspectadorDTO(
        id_tipo_documento=entero(cuerpo.get("id_tipo_documento"), "id_tipo_documento"),
        primer_nombre=cuerpo.get("primer_nombre"),
        segundo_nombre=cuerpo.get("segundo_nombre"),
        primer_apellido=cuerpo.get("primer_apellido"),
        segundo_apellido=cuerpo.get("segundo_apellido"),
        numero_documento=cuerpo.get("numero_documento"),
        correo=cuerpo.get("correo"),
        usuario=cuerpo.get("usuario"),
        contrasenia=cuerpo.get("contrasenia"),
    )

    try:
        resultado = EspectadorService.registrar_espectador(dto)
    except IntegrityError as error:
        causa = error.__cause__
        sqlstate = getattr(causa, "sqlstate", None) or getattr(causa, "pgcode", None)
        if sqlstate == "23505":
            raise ApiError(409, "registro_duplicado", "Ya existe un espectador con esos datos") from error
        if sqlstate == "23503":
            raise ApiError(400, "referencia_invalida", "El tipo de documento seleccionado no existe") from error
        raise
    if not resultado["ok"]:
        if resultado.get("duplicado"):
            raise ApiError(
                409, "registro_duplicado", "El espectador ya está registrado", errors=resultado["errores"]
            )
        raise ApiError(400, "datos_invalidos", "Revisa los datos del espectador", errors=resultado["errores"])

    return JsonResponse({"status": "success", "data": resultado["espectador"]}, status=201)
