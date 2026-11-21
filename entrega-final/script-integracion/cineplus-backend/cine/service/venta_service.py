from datetime import datetime, timezone

from django.db import DatabaseError, transaction
from pymongo.errors import PyMongoError

from cine.repository.funcion_repository import FuncionRepository
from cine.repository.venta_mongo_repository import VentaMongoRepository
from cine.repository.venta_repository import VentaRepository


def _entero(valor):
    try:
        return int(valor)
    except (TypeError, ValueError):
        return None


class VentaService:

    @staticmethod
    def registrar_compra(datos: dict) -> dict:
        errores = {}

        id_staff = _entero(datos.get("id_staff"))
        id_funcion = _entero(datos.get("id_funcion"))
        if id_funcion is None and _entero(datos.get("id_pelicula")):
            for funcion in FuncionRepository.obtener_funciones_por_pelicula(_entero(datos["id_pelicula"])):
                if funcion["fecha"] == datos.get("fecha") and funcion["hora"] == datos.get("hora"):
                    id_funcion = funcion["id_funcion"]
        id_espectador = _entero(datos.get("id_espectador"))
        id_metodo_pago = _entero(datos.get("id_metodo_pago"))

        if id_staff is None:
            errores["id_staff"] = "El staff es obligatorio"
        if id_funcion is None:
            errores["id_funcion"] = "La función es obligatoria"
        if id_espectador is None:
            errores["id_espectador"] = "El espectador es obligatorio"
        if id_metodo_pago is None:
            errores["id_metodo_pago"] = "El método de pago es obligatorio"

        boletas = datos.get("boletas")
        if not isinstance(boletas, list) or len(boletas) == 0:
            errores["boletas"] = "Debe comprar al menos una boleta"
            boletas = []

        asientos, tipos_boleta, precios = [], [], []
        for boleta in boletas:
            asiento = str(boleta.get("asiento", "")).strip()
            id_tipo = _entero(boleta.get("id_tipo_boleta"))
            try:
                precio = float(boleta.get("precio"))
            except (TypeError, ValueError):
                precio = None

            if not asiento or id_tipo is None or precio is None or precio <= 0:
                errores["boletas"] = "Cada boleta necesita asiento, id_tipo_boleta y un precio mayor a 0"
                break

            asientos.append(asiento)
            tipos_boleta.append(id_tipo)
            precios.append(precio)

        if errores:
            return {"ok": False, "errores": errores}

        try:
            with transaction.atomic():
               
                id_venta = VentaRepository.registrar_venta(
                    id_staff, id_funcion, id_espectador, id_metodo_pago,
                    asientos, tipos_boleta, precios,
                )
                venta = VentaRepository.obtener_por_id(id_venta)

               
                id_registro = VentaMongoRepository.guardar_registro({
                    **venta,
                    "canal": "web",
                    "estado": "confirmada",
                    "registrado_en": datetime.now(timezone.utc),
                })
               
        except DatabaseError as error:
            mensaje = str(error).split("\n")[0].replace("sp_registrar_venta: ", "")
            return {"ok": False, "errores": {"venta": mensaje}}
        except PyMongoError:
            return {"ok": False, "errores": {"venta": "No se pudo guardar el registro en MongoDB; la venta no se registró en PostgreSQL"}}

        venta["id_registro_mongo"] = id_registro
        return {"ok": True, "venta": venta}