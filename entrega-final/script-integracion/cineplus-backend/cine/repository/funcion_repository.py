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
            WHERE f.id_pelicula = %s
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