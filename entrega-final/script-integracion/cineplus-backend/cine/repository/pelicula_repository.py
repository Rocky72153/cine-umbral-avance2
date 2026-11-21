from django.db import connection


class PeliculaRepository:

    @staticmethod
    def obtener_todas_con_clasificacion():
        sql = """
            SELECT
                p.id_pelicula,
                p.titulo,
                p.duracion,
                p.anio,
                p.pais_origen,
                cp.nombre AS clasificacion
            FROM Pelicula p
            INNER JOIN Clasificacion_Pelicula cp
                ON p.id_clasificacion_pelicula = cp.id_clasificacion_pelicula
            ORDER BY p.id_pelicula ASC
        """
        with connection.cursor() as cursor:
            cursor.execute(sql)
            filas = cursor.fetchall()

        return [
            {
                "id_pelicula": fila[0],
                "titulo": fila[1],
                "duracion": fila[2],
                "anio": fila[3],
                "pais_origen": fila[4],
                "clasificacion": fila[5],
            }
            for fila in filas
        ]

    @staticmethod
    def obtener_por_id(id_pelicula: int):
        sql = """
            SELECT
                p.id_pelicula,
                p.titulo,
                p.duracion,
                p.anio,
                p.pais_origen,
                cp.nombre AS clasificacion
            FROM Pelicula p
            INNER JOIN Clasificacion_Pelicula cp
                ON p.id_clasificacion_pelicula = cp.id_clasificacion_pelicula
            WHERE p.id_pelicula = %s
        """
        with connection.cursor() as cursor:
            cursor.execute(sql, [id_pelicula])
            fila = cursor.fetchone()

        if not fila:
            return None
        return {
            "id_pelicula": fila[0],
            "titulo": fila[1],
            "duracion": fila[2],
            "anio": fila[3],
            "pais_origen": fila[4],
            "clasificacion": fila[5],
        }

    