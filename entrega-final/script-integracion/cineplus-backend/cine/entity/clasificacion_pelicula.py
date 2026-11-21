from django.db import models


class ClasificacionPelicula(models.Model):
    id_clasificacion_pelicula = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = "Clasificacion_Pelicula"

    def __str__(self):
        return self.nombre