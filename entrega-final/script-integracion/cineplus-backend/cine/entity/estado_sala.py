from django.db import models


class EstadoSala(models.Model):
    id_estado_sala = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = "Estado_Sala"

    def __str__(self):
        return self.nombre