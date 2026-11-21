from django.db import models


class CargoStaff(models.Model):
    id_cargo_staff = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = "Cargo_Staff"

    def __str__(self):
        return self.nombre