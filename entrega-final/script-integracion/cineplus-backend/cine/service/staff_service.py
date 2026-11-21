from django.contrib.auth.hashers import check_password, make_password
from django.db import DatabaseError, transaction

from cine.repository.staff_repository import StaffRepository


CAMPOS_OBLIGATORIOS = [
    "id_cargo_staff", "id_estado_staff", "id_tipo_documento",
    "primer_nombre", "primer_apellido", "numero_documento", "correo",
    "usuario", "contrasenia", "id_tipo_contrato", "fecha_inicio", "salario",
]


class StaffService:

    @staticmethod
    def login(usuario, contrasenia):
        staff = StaffRepository.buscar_por_usuario(usuario or "")
        if not staff:
            return None

        guardada = staff.pop("contrasenia")
        
        if guardada == contrasenia or check_password(contrasenia or "", guardada):
            return staff
        return None

    @staticmethod
    def listar():
        return StaffRepository.listar()

    @staticmethod
    def contratar(datos: dict) -> dict:
        faltantes = [c for c in CAMPOS_OBLIGATORIOS if datos.get(c) in (None, "")]
        if faltantes:
            return {"ok": False, "mensaje": "Faltan campos: " + ", ".join(faltantes)}

        datos["contrasenia"] = make_password(datos["contrasenia"])
        try:
           
            with transaction.atomic():
                id_staff = StaffRepository.guardar_staff_y_contrato(datos)
        except DatabaseError as error:
            mensaje = str(error).split("\n")[0]
            if "numero_documento" in mensaje:
                mensaje = "Ya existe un staff con ese número de documento"
            elif "correo" in mensaje:
                mensaje = "Ya existe un staff con ese correo"
            elif "usuario" in mensaje:
                mensaje = "Ya existe un staff con ese usuario"
            return {"ok": False, "mensaje": mensaje}

        return {"ok": True, "id_staff": id_staff}