from django.db import models

from .pelicula import Pelicula
from .sala import Sala


class Funcion(models.Model):
    id_funcion = models.AutoField(primary_key=True)
    pelicula = models.ForeignKey(
        Pelicula,
        on_delete=models.DO_NOTHING,
        db_column="id_pelicula",
        related_name="funciones",
    )
    sala = models.ForeignKey(
        Sala,
        on_delete=models.DO_NOTHING,
        db_column="id_sala",
        related_name="funciones",
    )
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()

    class Meta:
        managed = False
        db_table = "Funcion"

    def __str__(self):
        return f"Función {self.id_funcion}"