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
            SELECT s.id_staff, s.primer_nombre, s.primer_apellido, s.usuario,
                   s.id_cargo_staff, c.nombre AS cargo, e.nombre AS estado
            FROM Staff s
            INNER JOIN Cargo_Staff c ON s.id_cargo_staff = c.id_cargo_staff
            INNER JOIN Estado_Staff e ON s.id_estado_staff = e.id_estado_staff
            ORDER BY s.id_staff
        """
        with connection.cursor() as cursor:
            cursor.execute(sql)
            filas = cursor.fetchall()

        return [
            {
                "id_staff": f[0],
                "primer_nombre": f[1],
                "primer_apellido": f[2],
                "usuario": f[3],
                "id_cargo_staff": f[4],
                "cargo_nombre": f[5],
                "estado_nombre": f[6],
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