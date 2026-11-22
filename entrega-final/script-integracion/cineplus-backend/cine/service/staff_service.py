from django.contrib.auth.hashers import check_password, make_password
from django.db import transaction

from cine.repository.staff_repository import StaffRepository


class StaffService:

    @staticmethod
    def login(usuario, contrasenia):
        staff = StaffRepository.buscar_por_usuario(usuario or "")
        if not staff:
            return None

        guardada = staff.pop("contrasenia")
        if not isinstance(guardada, str) or not guardada:
            return None

        if guardada == contrasenia or check_password(contrasenia or "", guardada):
            return staff
        return None

    @staticmethod
    def listar():
        return StaffRepository.listar()

    @staticmethod
    def contratar(datos: dict) -> dict:
        datos = {**datos, "contrasenia": make_password(datos["contrasenia"])}
        with transaction.atomic():
            id_staff = StaffRepository.guardar_staff_y_contrato(datos)

        return {"ok": True, "id_staff": id_staff}
