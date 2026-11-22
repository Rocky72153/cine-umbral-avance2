from django.db import DatabaseError, connection


class VentaRepository:

    @staticmethod
    def existe_espectador(id_espectador: int) -> bool:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1 FROM Espectador WHERE id_espectador = %s", [id_espectador])
            return cursor.fetchone() is not None

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

        if not fila or type(fila[0]) is not int or fila[0] <= 0:
            raise DatabaseError("El procedimiento no devolvió un identificador de venta válido.")
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

    @staticmethod
    def listar_por_espectador(id_espectador: int):
        sql_ventas = """
            SELECT
                v.id_venta,
                v.fecha,
                v.monto_total,
                p.titulo,
                f.fecha,
                f.hora_inicio,
                f.id_sala,
                mp.nombre,
                s.primer_nombre || ' ' || s.primer_apellido
            FROM Venta v
            INNER JOIN Funcion f ON v.id_funcion = f.id_funcion
            INNER JOIN Pelicula p ON f.id_pelicula = p.id_pelicula
            INNER JOIN Metodo_Pago_Venta mp ON v.id_metodo_pago = mp.id_metodo_pago
            INNER JOIN Staff s ON v.id_staff = s.id_staff
            WHERE v.id_espectador = %s
            ORDER BY v.id_venta DESC
        """
        sql_boletas = """
            SELECT b.id_venta, b.numero_asiento, t.nombre, b.precio
            FROM Boleta b
            INNER JOIN Tipo_Boleta t ON b.id_tipo_boleta = t.id_tipo_boleta
            INNER JOIN Venta v ON b.id_venta = v.id_venta
            WHERE v.id_espectador = %s
            ORDER BY b.id_boleta
        """
        with connection.cursor() as cursor:
            cursor.execute(sql_ventas, [id_espectador])
            ventas = cursor.fetchall()
            cursor.execute(sql_boletas, [id_espectador])
            boletas = cursor.fetchall()

        return [
            {
                "id_venta": v[0],
                "fecha_compra": v[1].isoformat(),
                "monto_total": float(v[2]),
                "pelicula": v[3],
                "fecha_funcion": v[4].isoformat(),
                "hora_funcion": v[5].strftime("%H:%M"),
                "sala": v[6],
                "metodo_pago": v[7],
                "staff": v[8],
                "boletas": [
                    {"asiento": b[1], "tipo": b[2], "precio": float(b[3])}
                    for b in boletas if b[0] == v[0]
                ],
            }
            for v in ventas
        ]
