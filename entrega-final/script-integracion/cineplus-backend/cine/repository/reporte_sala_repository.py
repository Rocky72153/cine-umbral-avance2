from django.db import connection


class ReporteSalaRepository:

    @staticmethod
    def resumen_ventas_por_sala():
        sql = """
            SELECT
                s.id_sala,
                ts.nombre AS tipo_sala,
                s.capacidad,
                COUNT(DISTINCT f.id_funcion) AS funciones,
                COUNT(DISTINCT v.id_venta) AS ventas,
                COUNT(b.id_boleta) AS boletas,
                COALESCE(SUM(b.precio), 0) AS ingresos
            FROM Sala s
            INNER JOIN Tipo_Sala ts ON s.id_tipo_sala = ts.id_tipo_sala
            LEFT JOIN Funcion f ON f.id_sala = s.id_sala
            LEFT JOIN Venta v ON v.id_funcion = f.id_funcion
            LEFT JOIN Boleta b ON b.id_venta = v.id_venta
            GROUP BY s.id_sala, ts.nombre, s.capacidad
            ORDER BY s.id_sala ASC
        """
        with connection.cursor() as cursor:
            cursor.execute(sql)
            filas = cursor.fetchall()

        return [
            {
                "id_sala": fila[0],
                "tipo_sala": fila[1],
                "capacidad": fila[2],
                "funciones": fila[3],
                "ventas": fila[4],
                "boletas": fila[5],
                "ingresos": float(fila[6]),
            }
            for fila in filas
        ]