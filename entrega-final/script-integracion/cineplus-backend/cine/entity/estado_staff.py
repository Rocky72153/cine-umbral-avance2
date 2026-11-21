from django.db import models


class EstadoStaff(models.Model):
    id_estado_staff = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = "Estado_Staff"

    def __str__(self):
        return self.nombre