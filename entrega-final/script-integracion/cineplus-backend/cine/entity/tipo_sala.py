from django.db import models


class TipoSala(models.Model):
    id_tipo_sala = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = "Tipo_Sala"

    def __str__(self):
        return self.nombre