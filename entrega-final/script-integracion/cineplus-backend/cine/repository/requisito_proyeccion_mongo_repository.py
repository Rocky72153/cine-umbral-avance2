from cine.mongo import obtener_coleccion_mongo


class RequisitoProyeccionMongoRepository:

    @staticmethod
    def obtener_por_id_funcion(id_funcion: int):
        coleccion = obtener_coleccion_mongo("requisitos_proyeccion")
        return coleccion.find_one({"id_funcion": id_funcion}, {"_id": 0})