from django.db import models

from .clasificacion_pelicula import ClasificacionPelicula


class Pelicula(models.Model):
    id_pelicula = models.AutoField(primary_key=True)
    clasificacion_pelicula = models.ForeignKey(
        ClasificacionPelicula,
        on_delete=models.DO_NOTHING,
        db_column="id_clasificacion_pelicula",
        related_name="peliculas",
    )
    titulo = models.CharField(max_length=150)
    duracion = models.IntegerField()
    anio = models.IntegerField()
    pais_origen = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        managed = False
        db_table = "Pelicula"

    def __str__(self):
        return self.titulo