"""Primera consulta integrada de Cine Bogotá. Operaciones de solo lectura."""

import os

import psycopg
from flask import Flask, jsonify
from psycopg.rows import dict_row
from pymongo import MongoClient
from pymongo.errors import PyMongoError


def create_app():
    app = Flask(__name__)

    def postgres_url():
        url = os.environ.get("POSTGRES_URL")
        if not url:
            raise ValueError("Falta configurar POSTGRES_URL.")
        return url

    def mongo_url():
        url = os.environ.get("MONGODB_URI")
        if not url:
            raise ValueError("Falta configurar MONGODB_URI.")
        return url

    @app.errorhandler(ValueError)
    def configuracion_incompleta(error):
        return jsonify(error=str(error)), 503

    @app.errorhandler(psycopg.Error)
    def error_postgres(_error):
        return jsonify(error="No fue posible consultar PostgreSQL."), 503

    @app.errorhandler(PyMongoError)
    def error_mongodb(_error):
        return jsonify(error="No fue posible consultar MongoDB."), 503

    @app.get("/")
    def inicio():
        return jsonify(
            proyecto="Cine Bogotá",
            descripcion="Consulta de películas entre PostgreSQL y MongoDB",
            peliculas="/api/peliculas",
            ejemplo_detalle="/api/peliculas/1",
        )

    @app.get("/api/peliculas")
    def peliculas():
        with psycopg.connect(postgres_url(), row_factory=dict_row, connect_timeout=3) as conexion:
            registros = conexion.execute(
                "SELECT id_pelicula, titulo, duracion, anio, pais_origen "
                "FROM pelicula ORDER BY id_pelicula"
            ).fetchall()
        return jsonify(peliculas=registros)

    @app.get("/api/peliculas/<int:id_pelicula>")
    def detalle_pelicula(id_pelicula):
        with psycopg.connect(postgres_url(), row_factory=dict_row, connect_timeout=3) as conexion:
            pelicula = conexion.execute(
                "SELECT id_pelicula, titulo, duracion, anio, pais_origen, "
                "id_clasificacion_pelicula FROM pelicula WHERE id_pelicula = %s",
                (id_pelicula,),
            ).fetchone()
        if pelicula is None:
            return jsonify(error="Película no encontrada en PostgreSQL."), 404

        nombre_db = os.environ.get("MONGODB_DATABASE", "cine_bogota_avance2")
        with MongoClient(mongo_url(), serverSelectionTimeoutMS=3000) as cliente:
            base = cliente[nombre_db]
            fichas = list(base.fichas_tecnicas_peliculas.find(
                {"id_pelicula": id_pelicula}, {"_id": 0}
            ).sort("version.codigo", 1))
            resenas = list(base.resenas_peliculas.find(
                {"id_pelicula": id_pelicula}, {"_id": 0}
            ).sort("fecha", -1).limit(50))
        return jsonify(pelicula=pelicula, fichas_tecnicas=fichas, resenas=resenas)

    return app


app = create_app()
