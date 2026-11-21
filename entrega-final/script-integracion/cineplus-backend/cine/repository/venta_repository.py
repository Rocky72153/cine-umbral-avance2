from django.db import connection


class VentaRepository:

    @staticmethod
    def registrar_venta(id_staff, id_funcion, id_espectador, id_metodo_pago,
                        asientos, tipos_boleta, precios) -> int:

        sql = """
            CALL sp_registrar_venta(
                %s, %s, %s, %s,
                %s::text[], %s::int[], %s::numeric[],
                NULL
            )
        """
        with connection.cursor() as cursor:
            cursor.execute(sql, [
                id_staff, id_funcion, id_espectador, id_metodo_pago,
                asientos, tipos_boleta, precios,
            ])
            fila = cursor.fetchone()

        return fila[0]

    @staticmethod
    def obtener_por_id(id_venta):
        sql = """
            SELECT
                v.id_venta,
                v.id_funcion,
                v.id_espectador,
                v.id_staff,
                s.primer_nombre || ' ' || s.primer_apellido AS staff,
                mp.nombre AS metodo_pago,
                v.monto_total,
                v.fecha
            FROM Venta v
            INNER JOIN Staff s ON v.id_staff = s.id_staff
            INNER JOIN Metodo_Pago_Venta mp ON v.id_metodo_pago = mp.id_metodo_pago
            WHERE v.id_venta = %s
        """
        with connection.cursor() as cursor:
            cursor.execute(sql, [id_venta])
            fila = cursor.fetchone()

            cursor.execute(
                "SELECT numero_asiento, id_tipo_boleta, precio FROM Boleta WHERE id_venta = %s ORDER BY id_boleta",
                [id_venta],
            )
            boletas = cursor.fetchall()

        if not fila:
            return None

        return {
            "id_venta": fila[0],
            "id_funcion": fila[1],
            "id_espectador": fila[2],
            "id_staff": fila[3],
            "staff": fila[4],
            "metodo_pago": fila[5],
            "monto_total": float(fila[6]),
            "fecha": fila[7].isoformat(),
            "boletas": [
                {"asiento": b[0], "id_tipo_boleta": b[1], "precio": float(b[2])}
                for b in boletas
            ],
        }