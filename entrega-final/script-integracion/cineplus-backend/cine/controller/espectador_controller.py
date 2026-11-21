import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from cine.dto.espectador_dto import RegistroEspectadorDTO
from cine.service.espectador_service import EspectadorService


@require_http_methods(["GET"])
def listar_tipos_documento_view(request):
    tipos = EspectadorService.listar_tipos_documento()
    return JsonResponse({"status": "success", "data": tipos}, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def registrar_espectador_view(request):
    try:
        cuerpo = json.loads(request.body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return JsonResponse(
            {"status": "error", "message": "ERROR"},
            status=400,
        )

    dto = RegistroEspectadorDTO(
        id_tipo_documento=cuerpo.get("id_tipo_documento"),
        primer_nombre=cuerpo.get("primer_nombre"),
        segundo_nombre=cuerpo.get("segundo_nombre"),
        primer_apellido=cuerpo.get("primer_apellido"),
        segundo_apellido=cuerpo.get("segundo_apellido"),
        numero_documento=cuerpo.get("numero_documento"),
        correo=cuerpo.get("correo"),
        usuario=cuerpo.get("usuario"),
        contrasenia=cuerpo.get("contrasenia"),
    )

    resultado = EspectadorService.registrar_espectador(dto)
    if not resultado["ok"]:
        return JsonResponse({"status": "error", "errors": resultado["errores"]}, status=400)

    return JsonResponse({"status": "success", "data": resultado["espectador"]}, status=201)