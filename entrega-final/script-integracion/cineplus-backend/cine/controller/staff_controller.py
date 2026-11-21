import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from cine.service.staff_service import StaffService


@csrf_exempt
@require_http_methods(["POST"])
def login_staff_view(request):
    try:
        cuerpo = json.loads(request.body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return JsonResponse({"status": "error", "message": "JSON inválido"}, status=400)

    staff = StaffService.login(cuerpo.get("usuario"), cuerpo.get("contrasenia"))
    if not staff:
        return JsonResponse({"status": "error", "message": "Usuario o contraseña incorrectos"}, status=401)

    return JsonResponse({"status": "success", "data": staff}, status=200)


@require_http_methods(["GET"])
def listar_staff_view(request):
    return JsonResponse({"status": "success", "data": StaffService.listar()}, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def contratar_staff_view(request):
    try:
        cuerpo = json.loads(request.body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return JsonResponse({"status": "error", "message": "JSON inválido"}, status=400)

    resultado = StaffService.contratar(cuerpo)
    if not resultado["ok"]:
        return JsonResponse({"status": "error", "message": resultado["mensaje"]}, status=400)

    return JsonResponse({"status": "success", "data": {"id_staff": resultado["id_staff"]}}, status=201)