from django.db import connection


class StaffRepository:

    @staticmethod
    def buscar_por_usuario(usuario: str):
        sql = """
            SELECT s.id_staff, s.primer_nombre, s.primer_apellido, s.usuario,
                   s.contrasenia, s.id_cargo_staff, c.nombre AS cargo
            FROM Staff s
            INNER JOIN Cargo_Staff c ON s.id_cargo_staff = c.id_cargo_staff
            WHERE s.usuario = %s OR s.correo = %s
        """
        with connection.cursor() as cursor:
            cursor.execute(sql, [usuario, usuario])
            fila = cursor.fetchone()

        if not fila:
            return None
        return {
            "id_staff": fila[0],
            "primer_nombre": fila[1],
            "primer_apellido": fila[2],
            "usuario": fila[3],
            "contrasenia": fila[4],
            "id_cargo_staff": fila[5],
            "cargo_nombre": fila[6],
        }

    @staticmethod
    def listar():
       
        sql = """
            SELECT DISTINCT ON (s.id_staff)
                s.id_staff, s.id_cargo_staff, c.nombre, s.id_estado_staff, e.nombre,
                s.id_tipo_documento, s.primer_nombre, s.segundo_nombre,
                s.primer_apellido, s.segundo_apellido, s.numero_documento,
                s.correo, s.usuario, ct.id_tipo_contrato, tc.nombre,
                ct.fecha_inicio, ct.salario
            FROM Staff s
            INNER JOIN Cargo_Staff c ON s.id_cargo_staff = c.id_cargo_staff
            INNER JOIN Estado_Staff e ON s.id_estado_staff = e.id_estado_staff
            LEFT JOIN Contrato ct ON ct.id_staff = s.id_staff
            LEFT JOIN Tipo_Contrato tc ON ct.id_tipo_contrato = tc.id_tipo_contrato
            ORDER BY s.id_staff, ct.fecha_inicio DESC
        """
        with connection.cursor() as cursor:
            cursor.execute(sql)
            filas = cursor.fetchall()

        return [
            {
                "id_staff": f[0],
                "id_cargo_staff": f[1],
                "cargo_nombre": f[2],
                "id_estado_staff": f[3],
                "estado_nombre": f[4],
                "id_tipo_documento": f[5],
                "primer_nombre": f[6],
                "segundo_nombre": f[7],
                "primer_apellido": f[8],
                "segundo_apellido": f[9],
                "numero_documento": f[10],
                "correo": f[11],
                "usuario": f[12],
                "id_tipo_contrato": f[13],
                "tipo_contrato_nombre": f[14],
                "fecha_inicio": f[15].isoformat() if f[15] else "",
                "salario": float(f[16]) if f[16] is not None else 0,
            }
            for f in filas
        ]

    @staticmethod
    def guardar_staff_y_contrato(datos: dict) -> int:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO Staff (
                    id_cargo_staff, id_estado_staff, id_tipo_documento,
                    primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
                    numero_documento, correo, usuario, contrasenia
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id_staff
                """,
                [
                    datos["id_cargo_staff"], datos["id_estado_staff"], datos["id_tipo_documento"],
                    datos["primer_nombre"], datos.get("segundo_nombre"),
                    datos["primer_apellido"], datos.get("segundo_apellido"),
                    datos["numero_documento"], datos["correo"],
                    datos["usuario"], datos["contrasenia"],
                ],
            )
            id_staff = cursor.fetchone()[0]

            cursor.execute(
                """
                INSERT INTO Contrato (id_staff, id_tipo_contrato, fecha_inicio, salario)
                VALUES (%s, %s, %s, %s)
                """,
                [id_staff, datos["id_tipo_contrato"], datos["fecha_inicio"], datos["salario"]],
            )

        return id_staff