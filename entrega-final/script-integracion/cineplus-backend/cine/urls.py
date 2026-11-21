from django.urls import path

from cine.controller.espectador_controller import (
    listar_tipos_documento_view,
    registrar_espectador_view,
)
from cine.controller.integracion_controller import (
    funcion_con_requisitos_view,
    pelicula_con_resenas_view,
    ventas_incidentes_por_sala_view,
)
from cine.controller.pelicula_controller import listar_peliculas_view
from cine.controller.venta_controller import registrar_venta_view
from cine.controller.staff_controller import (
    contratar_staff_view,
    listar_staff_view,
    login_staff_view,
)
urlpatterns = [
    path("tipos-documento/", listar_tipos_documento_view),
    path("espectadores/registro/", registrar_espectador_view),
    path("peliculas/", listar_peliculas_view),
    path("peliculas/<int:id_pelicula>/resenas/", pelicula_con_resenas_view),
    path("funciones/<int:id_funcion>/requisitos/", funcion_con_requisitos_view),
    path("reportes/ventas-incidentes-sala/", ventas_incidentes_por_sala_view),
    path("ventas/", registrar_venta_view),
    path("staff/", listar_staff_view),
    path("staff/login/", login_staff_view),
    path("staff/contratar/", contratar_staff_view),
]