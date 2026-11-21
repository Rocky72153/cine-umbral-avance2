from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from cine.service.pelicula_service import PeliculaService


@require_http_methods(["GET"])
def listar_peliculas_view(request):
    peliculas = PeliculaService.listar_catalogo_completo()
    return JsonResponse({"status": "success", "data": peliculas}, status=200)