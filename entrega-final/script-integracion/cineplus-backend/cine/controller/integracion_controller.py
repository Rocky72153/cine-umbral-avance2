from functools import wraps

from django.db import DatabaseError
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from pymongo.errors import PyMongoError

from cine.service.integracion_service import IntegracionService, NoEncontradoError


def manejar_errores(vista):
    @wraps(vista)
    def envoltura(request, *args, **kwargs):
        try:
            return vista(request, *args, **kwargs)
        except NoEncontradoError as error:
            return JsonResponse({"status": "error", "message": str(error)}, status=404)
        except PyMongoError:
            return JsonResponse(
                {"status": "error", "message": "No se pudo consultar MongoDB"}, status=503
            )
        except DatabaseError:
            return JsonResponse(
                {"status": "error", "message": "No se pudo consultar PostgreSQL"}, status=503
            )
    return envoltura


@require_http_methods(["GET"])
@manejar_errores
def pelicula_con_resenas_view(request, id_pelicula):
    datos = IntegracionService.pelicula_con_resenas(id_pelicula)
    return JsonResponse({"status": "success", "data": datos}, status=200)


@require_http_methods(["GET"])
@manejar_errores
def funcion_con_requisitos_view(request, id_funcion):
    datos = IntegracionService.funcion_con_requisitos(id_funcion)
    return JsonResponse({"status": "success", "data": datos}, status=200)


@require_http_methods(["GET"])
@manejar_errores
def ventas_incidentes_por_sala_view(request):
    datos = IntegracionService.ventas_e_incidentes_por_sala()
    return JsonResponse({"status": "success", "data": datos}, status=200)