from django.db import connection


class FuncionRepository:

    @staticmethod
    def obtener_funciones_por_pelicula(id_pelicula: int):
        sql = """
            SELECT
                f.id_funcion,
                f.id_pelicula,
                f.id_sala,
                f.fecha,
                f.hora_inicio,
                f.hora_fin,
                ts.nombre AS tipo_sala
            FROM Funcion f
            INNER JOIN Sala s ON f.id_sala = s.id_sala
            INNER JOIN Tipo_Sala ts ON s.id_tipo_sala = ts.id_tipo_sala
            WHERE f.id_pelicula = %s AND f.fecha >= CURRENT_DATE
            ORDER BY f.fecha ASC, f.hora_inicio ASC
        """
        with connection.cursor() as cursor:
            cursor.execute(sql, [id_pelicula])
            filas = cursor.fetchall()

        return [
            {
                "id_funcion": fila[0],
                "id_pelicula": fila[1],
                "id_sala": fila[2],
                "fecha": fila[3].isoformat(),
                "hora": fila[4].strftime("%H:%M"),
                "hora_fin": fila[5].strftime("%H:%M"),
                "tipo_sala": fila[6],
            }
            for fila in filas
        ]

    @staticmethod
    def obtener_detalle(id_funcion: int):
        sql = """
            SELECT
                f.id_funcion,
                f.fecha,
                f.hora_inicio,
                f.hora_fin,
                p.id_pelicula,
                p.titulo,
                s.id_sala,
                s.capacidad,
                ts.nombre AS tipo_sala,
                es.nombre AS estado_sala
            FROM Funcion f
            INNER JOIN Pelicula p ON f.id_pelicula = p.id_pelicula
            INNER JOIN Sala s ON f.id_sala = s.id_sala
            INNER JOIN Tipo_Sala ts ON s.id_tipo_sala = ts.id_tipo_sala
            INNER JOIN Estado_Sala es ON s.id_estado_sala = es.id_estado_sala
            WHERE f.id_funcion = %s
        """
        with connection.cursor() as cursor:
            cursor.execute(sql, [id_funcion])
            fila = cursor.fetchone()

        if not fila:
            return None
        return {
            "id_funcion": fila[0],
            "fecha": fila[1].isoformat(),
            "hora_inicio": fila[2].strftime("%H:%M"),
            "hora_fin": fila[3].strftime("%H:%M"),
            "id_pelicula": fila[4],
            "pelicula": fila[5],
            "id_sala": fila[6],
            "capacidad_sala": fila[7],
            "tipo_sala": fila[8],
            "estado_sala": fila[9],
        }