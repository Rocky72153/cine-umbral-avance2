from cine.mongo import obtener_coleccion_mongo


class FichaTecnicaMongoRepository:

    @staticmethod
    def obtener_por_id_pelicula(id_pelicula: int):
        coleccion = obtener_coleccion_mongo("fichas_tecnicas_peliculas")
        return coleccion.find_one({"id_pelicula": id_pelicula}, {"_id": 0})