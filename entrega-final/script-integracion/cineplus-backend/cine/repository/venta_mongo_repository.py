from cine.mongo import obtener_coleccion_mongo


class VentaMongoRepository:

    @staticmethod
    def guardar_registro(documento: dict) -> str:
        coleccion = obtener_coleccion_mongo("registros_ventas")
        resultado = coleccion.insert_one(dict(documento))
        return str(resultado.inserted_id)