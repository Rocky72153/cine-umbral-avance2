from django.db import models

from .cargo_staff import CargoStaff
from .estado_staff import EstadoStaff
from .tipo_documento import TipoDocumento


class Staff(models.Model):
    id_staff = models.AutoField(primary_key=True)
    cargo_staff = models.ForeignKey(
        CargoStaff,
        on_delete=models.DO_NOTHING,
        db_column="id_cargo_staff",
        related_name="staffs",
    )
    estado_staff = models.ForeignKey(
        EstadoStaff,
        on_delete=models.DO_NOTHING,
        db_column="id_estado_staff",
        related_name="staffs",
    )
    tipo_documento = models.ForeignKey(
        TipoDocumento,
        on_delete=models.DO_NOTHING,
        db_column="id_tipo_documento",
        related_name="staffs",
    )
    primer_nombre = models.CharField(max_length=50)
    segundo_nombre = models.CharField(max_length=50, null=True, blank=True)
    primer_apellido = models.CharField(max_length=50)
    segundo_apellido = models.CharField(max_length=50, null=True, blank=True)
    numero_documento = models.CharField(max_length=20, unique=True)
    correo = models.CharField(max_length=100, unique=True, null=True, blank=True)
    usuario = models.CharField(max_length=50, unique=True)
    contrasenia = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = "Staff"

    def __str__(self):
        return self.usuario