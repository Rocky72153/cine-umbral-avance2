from cine.dto.pelicula_dto import PeliculaCatalogoDTO
from cine.repository.ficha_tecnica_mongo_repository import FichaTecnicaMongoRepository
from cine.repository.funcion_repository import FuncionRepository
from cine.repository.pelicula_repository import PeliculaRepository


METADATOS_VISUALES = {
    1: {
        "titulo_original": "Drag Me to Hell",
        "poster": "https://m.media-amazon.com/images/M/MV5BNWE1OTYyNmMtOGUwZS00NjY1LWE4NzgtYTUxOGRkODg1ZjI4XkEyXkFqcGc@._V1_.jpg",
        "sinopsis": "Un joven oficial de préstamos bancarios rechaza extender una prórroga a una anciana gitana y es maldecida con un espíritu maligno que la perseguirá durante tres días antes de arrastrarla al infierno.",
        "precio_boleta": 18000,
        "cargo_servicio": 1500,
        "requisitos_sala": "Clasificación +15: requiere documento válido para mayores de 15 años o acompañante adulto según normativa de sala.",
    },
    2: {
        "titulo_original": "Kimi no Na wa",
        "poster": "https://m.media-amazon.com/images/M/MV5BM2U1YzcyOGQtNjY5NC00ZWM0LTk0ZDItMTVhN2E2ODk3MWQ4XkEyXkFqcGc@._V1_.jpg",
        "sinopsis": "Dos jóvenes desconocidos que viven en distintos lugares comienzan a intercambiar cuerpos de manera inexplicable mientras un cometa se aproxima a la Tierra.",
        "precio_boleta": 18000,
        "cargo_servicio": 1500,
        "requisitos_sala": "Clasificación +12: recomendada para mayores de 12 años; ingreso permitido con acompañamiento adulto.",
    },
    3: {
        "titulo_original": "Helter Skelter",
        "poster": "https://www.onderhond.com/thumbs/img/posters/300xauto/helter-skelter.webp",
        "sinopsis": "Una famosa modelo sometida a cirugías estéticas extremas ve cómo su belleza artificial y su carrera comienzan a desmoronarse mientras salen a la luz oscuros secretos.",
        "precio_boleta": 19000,
        "cargo_servicio": 1500,
        "requisitos_sala": "Clasificación +18: acceso exclusivo para mayores de 18 años con documento de identidad.",
    },
    4: {
        "titulo_original": "Eternal Sunshine of the Spotless Mind",
        "poster": "https://m.media-amazon.com/images/M/MV5BYjcxNDFhZDktYTllZS00ZjE2LWFlOWMtN2Y5ZGUyZGRhMDA4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
        "sinopsis": "Tras una ruptura dolorosa, un hombre decide someterse a un procedimiento médico para borrar de su memoria los recuerdos de su expareja, pero al hacerlo descubre cuánto la ama.",
        "precio_boleta": 18000,
        "cargo_servicio": 1500,
        "requisitos_sala": "Clasificación +12: recomendada para mayores de 12 años; ingreso permitido con acompañamiento adulto.",
    },
    5: {
        "titulo_original": "The Conjuring",
        "poster": "https://m.media-amazon.com/images/M/MV5BYWQyNTQwNTAtZDE2Yy00NjlhLWE4N2YtYjBkYTM4ZmM3ZDk0XkEyXkFqcGc@._V1_.jpg",
        "sinopsis": "Los investigadores paranormales Ed y Lorraine Warren acuden a ayudar a una familia que vive sucesos aterradores en una antigua granja aislada.",
        "precio_boleta": 18500,
        "cargo_servicio": 1500,
        "requisitos_sala": "Clasificación +15: requiere documento válido para mayores de 15 años o acompañante adulto según normativa de sala.",
    },
}


class PeliculaService:

    @staticmethod
    def listar_catalogo_completo() -> list[dict]:
        peliculas_sql = PeliculaRepository.obtener_todas_con_clasificacion()
        resultado: list[dict] = []

        for pel in peliculas_sql:
            id_pelicula = pel["id_pelicula"]
            ficha = FichaTecnicaMongoRepository.obtener_por_id_pelicula(id_pelicula) or {}
            funciones_sql = FuncionRepository.obtener_funciones_por_pelicula(id_pelicula)

            meta = METADATOS_VISUALES.get(
                id_pelicula,
                {
                    "titulo_original": pel["titulo"],
                    "poster": "/logo-cine.jpeg",
                    "sinopsis": f"Función de {pel['titulo']} ({pel['anio']}).",
                    "precio_boleta": 18000,
                    "cargo_servicio": 1500,
                    "requisitos_sala": f"Clasificación {pel['clasificacion']}: sujeta a normativa de la sala.",
                },
            )

            idiomas_sub = ficha.get("idiomas_y_subtitulos") or {}
            audios = idiomas_sub.get("audio") or ["Español"]
            subtitulos = idiomas_sub.get("subtitulos") or ["Español"]
            idioma_original = audios[0] if audios else "Español"
            elenco = ficha.get("elenco") or []

            agrupadas_por_fecha: dict[str, dict] = {}
            for func in funciones_sql:
                fecha_str = func["fecha"]
                if fecha_str not in agrupadas_por_fecha:
                    agrupadas_por_fecha[fecha_str] = {
                        "fecha": fecha_str,
                        "horas": [],
                        "tipoSala": func["tipo_sala"],
                        "requisitosSala": meta["requisitos_sala"],
                        "precioBoleta": meta["precio_boleta"],
                        "cargoServicio": meta["cargo_servicio"],
                    }
                agrupadas_por_fecha[fecha_str]["horas"].append(func["hora"])

            dto = PeliculaCatalogoDTO(
                id=id_pelicula,
                titulo=pel["titulo"],
                tituloOriginal=meta["titulo_original"],
                poster=meta["poster"],
                clasificacion=pel["clasificacion"],
                duracion=f"{pel['duracion']} min",
                idiomaOriginal=idioma_original,
                audios=audios,
                subtitulos=subtitulos,
                sinopsis=meta["sinopsis"],
                elenco=elenco,
                funciones=list(agrupadas_por_fecha.values()),
                resenas=[],
            )
            resultado.append(dto.__dict__)

        return resultado