from django.db import models

from .actor_director import ActorDirector
from .pelicula import Pelicula


class ActorDirectorPelicula(models.Model):
    actor_director = models.ForeignKey(
        ActorDirector,
        on_delete=models.DO_NOTHING,
        db_column="id_actor_director",
        primary_key=True,
    )
    pelicula = models.ForeignKey(
        Pelicula,
        on_delete=models.DO_NOTHING,
        db_column="id_pelicula",
        related_name="participaciones",
    )

    class Meta:
        managed = False
        db_table = "Actor_Director_Pelicula"
        unique_together = (("actor_director", "pelicula"),)

    def __str__(self):
        return f"{self.actor_director_id} - {self.pelicula_id}"