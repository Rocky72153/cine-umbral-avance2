from cine.repository.funcion_repository import FuncionRepository
from cine.repository.incidente_mongo_repository import IncidenteMongoRepository
from cine.repository.pelicula_repository import PeliculaRepository
from cine.repository.reporte_sala_repository import ReporteSalaRepository
from cine.repository.requisito_proyeccion_mongo_repository import RequisitoProyeccionMongoRepository
from cine.repository.resena_mongo_repository import ResenaMongoRepository


class NoEncontradoError(Exception):
    pass


class IntegracionService:

    @staticmethod
    def pelicula_con_resenas(id_pelicula: int) -> dict:
        pelicula = PeliculaRepository.obtener_por_id(id_pelicula)
        if not pelicula:
            raise NoEncontradoError(f"No existe la película con id {id_pelicula}")

        resenas = ResenaMongoRepository.obtener_por_id_pelicula(id_pelicula)
        calificaciones = [r["calificacion"] for r in resenas if "calificacion" in r]
        promedio = round(sum(calificaciones) / len(calificaciones), 2) if calificaciones else None

        return {
            "pelicula": pelicula,
            "total_resenas": len(resenas),
            "calificacion_promedio": promedio,
            "resenas": resenas,
        }

    @staticmethod
    def funcion_con_requisitos(id_funcion: int) -> dict:
        funcion = FuncionRepository.obtener_detalle(id_funcion)
        if not funcion:
            raise NoEncontradoError(f"No existe la función con id {id_funcion}")

        requisitos = RequisitoProyeccionMongoRepository.obtener_por_id_funcion(id_funcion)
        return {
            "funcion": funcion,
            "requisitos_proyeccion": requisitos,
            "tiene_requisitos": requisitos is not None,
        }

    @staticmethod
    def ventas_e_incidentes_por_sala() -> list[dict]:
        salas = ReporteSalaRepository.resumen_ventas_por_sala()
        incidentes = IncidenteMongoRepository.contar_por_sala()

        for sala in salas:
            datos = incidentes.get(sala["id_sala"], {"total": 0, "por_tipo": {}})
            sala["incidentes"] = datos["total"]
            sala["incidentes_por_tipo"] = datos["por_tipo"]
            sala["incidentes_por_cada_10_ventas"] = (
                round(datos["total"] * 10 / sala["ventas"], 2) if sala["ventas"] else None
            )
        return salas