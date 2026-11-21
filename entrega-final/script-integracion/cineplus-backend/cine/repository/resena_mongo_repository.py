from cine.mongo import obtener_coleccion_mongo


class ResenaMongoRepository:

    @staticmethod
    def obtener_por_id_pelicula(id_pelicula: int, limite: int = 50):
        coleccion = obtener_coleccion_mongo("resenas_peliculas")
        cursor = (
            coleccion.find({"id_pelicula": id_pelicula}, {"_id": 0})
            .sort("fecha", -1)
            .limit(limite)
        )
        return list(cursor)