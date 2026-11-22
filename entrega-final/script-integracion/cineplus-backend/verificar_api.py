"""Comprueba respuestas HTTP de Django sin registrar ventas ni crear usuarios."""

import argparse
import json
from dataclasses import dataclass
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


@dataclass(frozen=True)
class Caso:
    ruta: str
    http: int
    codigo: str | None = None
    cuerpo: bytes | None = None
    contenido: str = "application/json"
    allow: str | None = None
    campo: str | None = None
    datos: type | None = None
    claves: tuple[str, ...] = ()

    @property
    def metodo(self):
        return "GET" if self.cuerpo is None else "POST"


def comprobar(base, caso, timeout):
    encabezados = {"Accept": "application/json"}
    if caso.cuerpo is not None:
        encabezados["Content-Type"] = caso.contenido
    solicitud = Request(base + caso.ruta, data=caso.cuerpo, headers=encabezados)
    try:
        respuesta = urlopen(solicitud, timeout=timeout)
    except HTTPError as error:
        respuesta = error
    except (URLError, OSError, TimeoutError) as error:
        return f"no se obtuvo respuesta HTTP ({type(error).__name__})"

    with respuesta:
        if respuesta.status != caso.http:
            return f"HTTP {respuesta.status}; se esperaba {caso.http}"
        if respuesta.headers.get_content_type() != "application/json":
            return "Content-Type no es application/json"
        if caso.allow is not None and respuesta.headers.get("Allow") != caso.allow:
            return f"falta Allow: {caso.allow}"
        try:
            contenido = json.load(respuesta)
        except (ValueError, OSError, TimeoutError):
            return "respuesta JSON ilegible"

    if not isinstance(contenido, dict):
        return "la respuesta no es un objeto JSON"
    if caso.codigo is not None:
        if contenido.get("status") != "error" or contenido.get("code") != caso.codigo:
            return f"se esperaba status=error y code={caso.codigo}"
        if not isinstance(contenido.get("message"), str) or not contenido["message"].strip():
            return "falta un mensaje de error"
        if caso.campo:
            campos = contenido.get("errors")
            if not isinstance(campos, dict) or not isinstance(campos.get(caso.campo), str):
                return f"falta error por campo: {caso.campo}"
    else:
        datos = contenido.get("data")
        if contenido.get("status") != "success" or not isinstance(datos, caso.datos):
            return "se esperaba status=success con data"
        if any(clave not in datos for clave in caso.claves):
            return "faltan campos del cruce entre motores"
    return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("base", nargs="?", default="http://127.0.0.1:8000", help="URL base de Django")
    parser.add_argument("--pelicula", type=int, default=1, help="ID de una película existente")
    parser.add_argument("--funcion", type=int, default=1, help="ID de una función existente")
    parser.add_argument("--espectador", type=int, default=1, help="ID de un espectador existente")
    parser.add_argument("--id-ausente", type=int, default=2_147_483_647, help="ID sin registros en la demo")
    parser.add_argument("--solo-errores", action="store_true", help="omite las consultas a las bases")
    parser.add_argument("--timeout", type=float, default=12, help="segundos de espera por solicitud")
    args = parser.parse_args()
    base = args.base.rstrip("/")

    casos = [
        Caso("/api/ventas/", 405, "metodo_no_permitido", allow="POST"),
        Caso("/api/ventas/", 415, "tipo_de_contenido_no_admitido", b"{}", "text/plain"),
        Caso("/api/ventas/", 400, "json_invalido", b"{"),
        Caso("/api/espectadores/registro/", 400, "json_invalido", b"[]"),
        Caso("/api/ventas/", 400, "datos_venta_invalidos", b"{}", campo="boletas"),
        Caso("/api/espectadores/registro/", 400, "datos_invalidos", b"{}"),
        Caso("/api/espectadores/registro/", 400, "datos_invalidos", b'{"id_tipo_documento":1}', campo="correo"),
        Caso("/api/staff/login/", 400, "datos_invalidos", b'{"usuario":true}'),
        Caso("/api/staff/contratar/", 400, "datos_invalidos", b"{}", campo="id_cargo_staff"),
        Caso("/api/peliculas/abc/resenas/", 400, "datos_invalidos", campo="id_pelicula"),
        Caso("/api/funciones/0/requisitos/", 400, "datos_invalidos", campo="id_funcion"),
        Caso("/api/espectadores/-1/boletas/", 400, "datos_invalidos", campo="id_espectador"),
        Caso("/api/ruta-inexistente/", 404, "ruta_no_encontrada"),
    ]
    if not args.solo_errores:
        casos += [
            Caso("/api/tipos-documento/", 200, datos=list),
            Caso("/api/peliculas/", 200, datos=list),
            Caso(
                f"/api/peliculas/{args.pelicula}/resenas/",
                200,
                datos=dict,
                claves=("pelicula", "resenas"),
            ),
            Caso(
                f"/api/funciones/{args.funcion}/requisitos/",
                200,
                datos=dict,
                claves=("funcion", "requisitos_proyeccion"),
            ),
            Caso("/api/reportes/ventas-incidentes-sala/", 200, datos=list),
            Caso(f"/api/espectadores/{args.espectador}/boletas/", 200, datos=list),
            Caso("/api/staff/", 200, datos=list),
            Caso(f"/api/funciones/{args.id_ausente}/requisitos/", 404, "no_encontrado"),
            Caso(f"/api/espectadores/{args.id_ausente}/boletas/", 404, "espectador_no_encontrado"),
        ]

    fallos = 0
    for caso in casos:
        fallo = comprobar(base, caso, args.timeout)
        if fallo:
            fallos += 1
            print(f"FALLO {caso.metodo} {caso.ruta}: {fallo}")
        else:
            detalle = f" / {caso.codigo}" if caso.codigo else ""
            print(f"OK    {caso.metodo} {caso.ruta}: {caso.http}{detalle}")
    print(f"Comprobaciones aprobadas: {len(casos) - fallos}/{len(casos)}")
    return int(fallos > 0)


if __name__ == "__main__":
    raise SystemExit(main())
