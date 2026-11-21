from django.db import models

from .tipo_boleta import TipoBoleta
from .venta import Venta


class Boleta(models.Model):
    id_boleta = models.AutoField(primary_key=True)
    venta = models.ForeignKey(
        Venta,
        on_delete=models.DO_NOTHING,
        db_column="id_venta",
        related_name="boletas",
    )
    tipo_boleta = models.ForeignKey(
        TipoBoleta,
        on_delete=models.DO_NOTHING,
        db_column="id_tipo_boleta",
        related_name="boletas",
    )
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    numero_asiento = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = "Boleta"

    def __str__(self):
        return f"Boleta {self.id_boleta} - {self.numero_asiento}"