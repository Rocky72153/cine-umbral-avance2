from cine.mongo import obtener_coleccion_mongo


class IncidenteMongoRepository:

    @staticmethod
    def contar_por_sala():
        coleccion = obtener_coleccion_mongo("reportes_incidentes")
        pipeline = [
            {
                "$group": {
                    "_id": {"id_sala": "$id_sala", "tipo": "$tipo_incidente"},
                    "total": {"$sum": 1},
                }
            }
        ]
        resultado = {}
        for fila in coleccion.aggregate(pipeline):
            id_sala = fila["_id"]["id_sala"]
            tipo = fila["_id"]["tipo"]
            sala = resultado.setdefault(id_sala, {"total": 0, "por_tipo": {}})
            sala["total"] += fila["total"]
            sala["por_tipo"][tipo] = fila["total"]
        return resultado