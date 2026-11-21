from django.db import models

from .staff import Staff
from .tipo_contrato import TipoContrato


class Contrato(models.Model):
    id_contrato = models.AutoField(primary_key=True)
    staff = models.ForeignKey(
        Staff,
        on_delete=models.DO_NOTHING,
        db_column="id_staff",
        related_name="contratos",
    )
    tipo_contrato = models.ForeignKey(
        TipoContrato,
        on_delete=models.DO_NOTHING,
        db_column="id_tipo_contrato",
        related_name="contratos",
    )
    fecha_inicio = models.DateField()
    salario = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False
        db_table = "Contrato"

    def __str__(self):
        return f"Contrato {self.id_contrato}"