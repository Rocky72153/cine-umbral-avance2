import re

from django.contrib.auth.hashers import make_password
from django.db import transaction

from cine.dto.espectador_dto import EspectadorRegistradoDTO, RegistroEspectadorDTO
from cine.repository.espectador_repository import EspectadorRepository
from cine.repository.tipo_documento_repository import TipoDocumentoRepository


def convertir_a_dto(datos: dict) -> EspectadorRegistradoDTO:
    return EspectadorRegistradoDTO(
        id_espectador=datos["id_espectador"],
        id_tipo_documento=datos["id_tipo_documento"],
        tipo_documento=datos["tipo_documento"],
        primer_nombre=datos["primer_nombre"],
        segundo_nombre=datos["segundo_nombre"],
        primer_apellido=datos["primer_apellido"],
        segundo_apellido=datos["segundo_apellido"],
        numero_documento=datos["numero_documento"],
        correo=datos["correo"],
        usuario=datos["usuario"],
    )


class EspectadorService:

    @staticmethod
    def listar_tipos_documento() -> list[dict]:
        return TipoDocumentoRepository.obtener_todos()

    @staticmethod
    @transaction.atomic
    def registrar_espectador(dto: RegistroEspectadorDTO) -> dict:
        errores = {}

        primer_nombre = dto.primer_nombre.strip() if isinstance(dto.primer_nombre, str) else ""
        segundo_nombre = dto.segundo_nombre.strip() if isinstance(dto.segundo_nombre, str) and dto.segundo_nombre.strip() else None
        primer_apellido = dto.primer_apellido.strip() if isinstance(dto.primer_apellido, str) else ""
        segundo_apellido = dto.segundo_apellido.strip() if isinstance(dto.segundo_apellido, str) and dto.segundo_apellido.strip() else None
        numero_documento = dto.numero_documento.strip() if isinstance(dto.numero_documento, str) else ""
        correo = dto.correo.strip() if isinstance(dto.correo, str) else ""
        usuario = dto.usuario.strip() if isinstance(dto.usuario, str) else ""
        contrasenia = dto.contrasenia if isinstance(dto.contrasenia, str) else ""

        try:
            id_tipo_documento = int(dto.id_tipo_documento)
        except (TypeError, ValueError):
            id_tipo_documento = 0

        if not primer_nombre:
            errores["primer_nombre"] = "El primer nombre es obligatorio"
        elif len(primer_nombre) > 50:
            errores["primer_nombre"] = "El primer nombre no puede superar 50 caracteres"

        if segundo_nombre and len(segundo_nombre) > 50:
            errores["segundo_nombre"] = "El segundo nombre no puede superar 50 caracteres"

        if not primer_apellido:
            errores["primer_apellido"] = "El primer apellido es obligatorio"
        elif len(primer_apellido) > 50:
            errores["primer_apellido"] = "El primer apellido no puede superar 50 caracteres"

        if segundo_apellido and len(segundo_apellido) > 50:
            errores["segundo_apellido"] = "El segundo apellido no puede superar 50 caracteres"

        tipo_documento = TipoDocumentoRepository.obtener_por_id(id_tipo_documento)
        if not tipo_documento:
            errores["id_tipo_documento"] = "El tipo de documento seleccionado no existe"

        if not numero_documento:
            errores["numero_documento"] = "El número de documento es obligatorio"
        elif len(numero_documento) > 20:
            errores["numero_documento"] = "El número de documento no puede superar 20 caracteres"
        elif EspectadorRepository.existe_documento(numero_documento):
            errores["numero_documento"] = "Ya existe un espectador con ese número de documento"

        if not correo or not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", correo):
            errores["correo"] = "Ingresa un correo electrónico válido"
        elif len(correo) > 100:
            errores["correo"] = "El correo no puede superar 100 caracteres"
        elif EspectadorRepository.existe_correo(correo):
            errores["correo"] = "Ya existe un espectador con ese correo"

        if not usuario:
            errores["usuario"] = "El nombre de usuario es obligatorio"
        elif len(usuario) > 50:
            errores["usuario"] = "El nombre de usuario no puede superar 50 caracteres"
        elif EspectadorRepository.existe_usuario(usuario):
            errores["usuario"] = "Ya existe un espectador con ese nombre de usuario"

        if not contrasenia or len(contrasenia) < 6:
            errores["contrasenia"] = "La contraseña debe tener al menos 6 caracteres"

        if errores:
            return {"ok": False, "errores": errores}

        nuevo_id = EspectadorRepository.guardar({
            "id_tipo_documento": tipo_documento["id_tipo_documento"],
            "primer_nombre": primer_nombre,
            "segundo_nombre": segundo_nombre,
            "primer_apellido": primer_apellido,
            "segundo_apellido": segundo_apellido,
            "numero_documento": numero_documento,
            "correo": correo,
            "usuario": usuario,
            "contrasenia": make_password(contrasenia),
        })
        espectador_creado = EspectadorRepository.obtener_por_id(nuevo_id)
        return {"ok": True, "espectador": convertir_a_dto(espectador_creado).__dict__}