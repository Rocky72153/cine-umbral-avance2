from dataclasses import dataclass
from typing import Any, Optional


@dataclass
class RegistroEspectadorDTO:
    id_tipo_documento: Any
    primer_nombre: Any
    primer_apellido: Any
    numero_documento: Any
    correo: Any
    usuario: Any
    contrasenia: Any
    segundo_nombre: Any = None
    segundo_apellido: Any = None


@dataclass
class EspectadorRegistradoDTO:
    id_espectador: int
    id_tipo_documento: int
    tipo_documento: str
    primer_nombre: str
    segundo_nombre: Optional[str]
    primer_apellido: str
    segundo_apellido: Optional[str]
    numero_documento: str
    correo: Optional[str]
    usuario: str