from django.db import models


class TipoBoleta(models.Model):
    id_tipo_boleta = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = "Tipo_Boleta"

    def __str__(self):
        return self.nombre