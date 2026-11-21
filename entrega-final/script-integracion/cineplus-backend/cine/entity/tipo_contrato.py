from django.db import models


class TipoContrato(models.Model):
    id_tipo_contrato = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = "Tipo_Contrato"

    def __str__(self):
        return self.nombre