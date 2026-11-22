from django.http import JsonResponse

from cine.api_errors import api_endpoint
from cine.service.pelicula_service import PeliculaService


@api_endpoint("GET")
def listar_peliculas_view(request):
    peliculas = PeliculaService.listar_catalogo_completo()
    return JsonResponse({"status": "success", "data": peliculas}, status=200)
