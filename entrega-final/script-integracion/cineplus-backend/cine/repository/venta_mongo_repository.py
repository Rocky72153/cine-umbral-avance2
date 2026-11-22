from pymongo.errors import PyMongoError

from cine.mongo import obtener_coleccion_mongo


class VentaMongoRepository:

    @staticmethod
    def guardar_registro(documento: dict) -> str:
        coleccion = obtener_coleccion_mongo("registros_ventas")
        resultado = coleccion.insert_one(dict(documento))
        if not resultado.acknowledged or resultado.inserted_id is None:
            raise PyMongoError("MongoDB no confirmó el registro de venta.")
        return str(resultado.inserted_id)

    @staticmethod
    def obtener_estados(ids_venta: list) -> dict:
        coleccion = obtener_coleccion_mongo("registros_ventas")
        documentos = coleccion.find({"id_venta": {"$in": ids_venta}}, {"_id": 0, "id_venta": 1, "estado": 1})
        return {d["id_venta"]: d.get("estado", "") for d in documentos}
