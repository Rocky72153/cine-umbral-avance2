from django.urls import path

from cine.controller.espectador_controller import (
    listar_tipos_documento_view,
    registrar_espectador_view,
)
from cine.controller.pelicula_controller import listar_peliculas_view

urlpatterns = [
    path("tipos-documento/", listar_tipos_documento_view),
    path("espectadores/registro/", registrar_espectador_view),
    path("peliculas/", listar_peliculas_view),
]