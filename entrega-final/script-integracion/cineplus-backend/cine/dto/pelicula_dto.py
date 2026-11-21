from dataclasses import dataclass
from typing import Any


@dataclass
class PeliculaCatalogoDTO:
    id: int
    titulo: str
    tituloOriginal: str
    poster: str
    clasificacion: str
    duracion: str
    idiomaOriginal: str
    audios: list[str]
    subtitulos: list[str]
    sinopsis: str
    elenco: list[dict[str, str]]
    funciones: list[dict[str, Any]]
    resenas: list[dict[str, Any]]