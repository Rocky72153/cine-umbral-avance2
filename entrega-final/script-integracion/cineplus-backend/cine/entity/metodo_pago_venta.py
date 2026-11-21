from django.db import models


class MetodoPagoVenta(models.Model):
    id_metodo_pago = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = "Metodo_Pago_Venta"

    def __str__(self):
        return self.nombre