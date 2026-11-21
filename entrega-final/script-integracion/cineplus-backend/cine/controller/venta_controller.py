import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from cine.service.venta_service import VentaService


@csrf_exempt
@require_http_methods(["POST"])
def registrar_venta_view(request):
    try:
        cuerpo = json.loads(request.body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return JsonResponse(
            {"status": "error", "message": "El cuerpo de la petición no es un JSON válido"},
            status=400,
        )

    resultado = VentaService.registrar_compra(cuerpo)
    if not resultado["ok"]:
        return JsonResponse({"status": "error", "errors": resultado["errores"]}, status=400)

    return JsonResponse({"status": "success", "data": resultado["venta"]}, status=201)