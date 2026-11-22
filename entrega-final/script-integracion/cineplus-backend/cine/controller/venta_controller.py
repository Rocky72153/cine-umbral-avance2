from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from cine.api_errors import api_endpoint, entero, leer_json
from cine.service.venta_service import VentaService


@csrf_exempt
@api_endpoint("POST")
def registrar_venta_view(request):
    venta = VentaService.registrar_compra(leer_json(request))
    return JsonResponse({"status": "success", "data": venta}, status=201)


@api_endpoint("GET")
def boletas_espectador_view(request, id_espectador):
    boletas = VentaService.listar_boletas_espectador(entero(id_espectador, "id_espectador"))
    return JsonResponse({"status": "success", "data": boletas}, status=200)
