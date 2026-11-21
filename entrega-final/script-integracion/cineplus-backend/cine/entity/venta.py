from django.db import models

from .espectador import Espectador
from .funcion import Funcion
from .metodo_pago_venta import MetodoPagoVenta
from .staff import Staff


class Venta(models.Model):
    id_venta = models.AutoField(primary_key=True)
    staff = models.ForeignKey(
        Staff,
        on_delete=models.DO_NOTHING,
        db_column="id_staff",
        related_name="ventas",
    )
    funcion = models.ForeignKey(
        Funcion,
        on_delete=models.DO_NOTHING,
        db_column="id_funcion",
        related_name="ventas",
    )
    espectador = models.ForeignKey(
        Espectador,
        on_delete=models.DO_NOTHING,
        db_column="id_espectador",
        related_name="ventas",
    )
    metodo_pago = models.ForeignKey(
        MetodoPagoVenta,
        on_delete=models.DO_NOTHING,
        db_column="id_metodo_pago",
        related_name="ventas",
    )
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "Venta"

    def __str__(self):
        return f"Venta {self.id_venta}"