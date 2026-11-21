from django.db import models


class ActorDirector(models.Model):
    id_actor_director = models.AutoField(primary_key=True)
    primer_nombre = models.CharField(max_length=50)
    segundo_nombre = models.CharField(max_length=50, null=True, blank=True)
    primer_apellido = models.CharField(max_length=50)
    segundo_apellido = models.CharField(max_length=50, null=True, blank=True)
    rol = models.CharField(max_length=50)
    nacionalidad = models.CharField(max_length=50, null=True, blank=True)
    correo = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        managed = False
        db_table = "Actor_Director"

    def __str__(self):
        return f"{self.primer_nombre} {self.primer_apellido}"