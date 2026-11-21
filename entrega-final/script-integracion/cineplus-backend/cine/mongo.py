from django.conf import settings
from pymongo import MongoClient

_cliente = None


def obtener_base_datos_mongo():
    global _cliente
    if _cliente is None:
        _cliente = MongoClient(settings.MONGO_URI)
    return _cliente[settings.MONGO_DB_NAME]


def obtener_coleccion_mongo(nombre_coleccion: str):
    return obtener_base_datos_mongo()[nombre_coleccion]