from django.http import JsonResponse

from cine.api_errors import ApiError, api_endpoint, entero
from cine.service.integracion_service import IntegracionService, NoEncontradoError


@api_endpoint("GET")
def pelicula_con_resenas_view(request, id_pelicula):
    id_pelicula = entero(id_pelicula, "id_pelicula")
    try:
        datos = IntegracionService.pelicula_con_resenas(id_pelicula)
    except NoEncontradoError as error:
        raise ApiError(404, "no_encontrado", str(error)) from error
    return JsonResponse({"status": "success", "data": datos}, status=200)


@api_endpoint("GET")
def funcion_con_requisitos_view(request, id_funcion):
    id_funcion = entero(id_funcion, "id_funcion")
    try:
        datos = IntegracionService.funcion_con_requisitos(id_funcion)
    except NoEncontradoError as error:
        raise ApiError(404, "no_encontrado", str(error)) from error
    return JsonResponse({"status": "success", "data": datos}, status=200)


@api_endpoint("GET")
def ventas_incidentes_por_sala_view(request):
    datos = IntegracionService.ventas_e_incidentes_por_sala()
    return JsonResponse({"status": "success", "data": datos}, status=200)
