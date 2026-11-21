from django.db import models

from .estado_sala import EstadoSala
from .tipo_sala import TipoSala


class Sala(models.Model):
    id_sala = models.AutoField(primary_key=True)
    estado_sala = models.ForeignKey(
        EstadoSala,
        on_delete=models.DO_NOTHING,
        db_column="id_estado_sala",
        related_name="salas",
    )
    tipo_sala = models.ForeignKey(
        TipoSala,
        on_delete=models.DO_NOTHING,
        db_column="id_tipo_sala",
        related_name="salas",
    )
    capacidad = models.IntegerField()

    class Meta:
        managed = False
        db_table = "Sala"

    def __str__(self):
        return f"Sala {self.id_sala}"