from django.db import connection


def _mapear_espectador(fila):
    if not fila:
        return None
    return {
        "id_espectador": fila[0],
        "id_tipo_documento": fila[1],
        "tipo_documento": fila[2],
        "primer_nombre": fila[3],
        "segundo_nombre": fila[4],
        "primer_apellido": fila[5],
        "segundo_apellido": fila[6],
        "numero_documento": fila[7],
        "correo": fila[8],
        "usuario": fila[9],
        "contrasenia": fila[10],
    }


class EspectadorRepository:

    @staticmethod
    def obtener_por_id(id_espectador):
        sql = """
            SELECT
                e.id_espectador,
                e.id_tipo_documento,
                td.nombre AS tipo_documento,
                e.primer_nombre,
                e.segundo_nombre,
                e.primer_apellido,
                e.segundo_apellido,
                e.numero_documento,
                e.correo,
                e.usuario,
                e.contrasenia
            FROM Espectador e
            INNER JOIN Tipo_Documento td ON e.id_tipo_documento = td.id_tipo_documento
            WHERE e.id_espectador = %s
        """
        with connection.cursor() as cursor:
            cursor.execute(sql, [id_espectador])
            fila = cursor.fetchone()

        return _mapear_espectador(fila)

    @staticmethod
    def existe_correo(correo: str, excluir_id=None) -> bool:
        if excluir_id is not None:
            sql = """
                SELECT 1
                FROM Espectador
                WHERE LOWER(correo) = LOWER(%s) AND id_espectador <> %s
                LIMIT 1
            """
            params = [correo, excluir_id]
        else:
            sql = """
                SELECT 1
                FROM Espectador
                WHERE LOWER(correo) = LOWER(%s)
                LIMIT 1
            """
            params = [correo]

        with connection.cursor() as cursor:
            cursor.execute(sql, params)
            return cursor.fetchone() is not None

    @staticmethod
    def existe_usuario(usuario: str, excluir_id=None) -> bool:
        if excluir_id is not None:
            sql = """
                SELECT 1
                FROM Espectador
                WHERE LOWER(usuario) = LOWER(%s) AND id_espectador <> %s
                LIMIT 1
            """
            params = [usuario, excluir_id]
        else:
            sql = """
                SELECT 1
                FROM Espectador
                WHERE LOWER(usuario) = LOWER(%s)
                LIMIT 1
            """
            params = [usuario]

        with connection.cursor() as cursor:
            cursor.execute(sql, params)
            return cursor.fetchone() is not None

    @staticmethod
    def existe_documento(numero_documento: str, excluir_id=None) -> bool:
        if excluir_id is not None:
            sql = """
                SELECT 1
                FROM Espectador
                WHERE numero_documento = %s AND id_espectador <> %s
                LIMIT 1
            """
            params = [numero_documento, excluir_id]
        else:
            sql = """
                SELECT 1
                FROM Espectador
                WHERE numero_documento = %s
                LIMIT 1
            """
            params = [numero_documento]

        with connection.cursor() as cursor:
            cursor.execute(sql, params)
            return cursor.fetchone() is not None

    @staticmethod
    def guardar(datos: dict) -> int:
        sql = """
            INSERT INTO Espectador (
                id_tipo_documento,
                primer_nombre,
                segundo_nombre,
                primer_apellido,
                segundo_apellido,
                numero_documento,
                correo,
                usuario,
                contrasenia
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id_espectador
        """
        params = [
            datos["id_tipo_documento"],
            datos["primer_nombre"],
            datos["segundo_nombre"],
            datos["primer_apellido"],
            datos["segundo_apellido"],
            datos["numero_documento"],
            datos["correo"],
            datos["usuario"],
            datos["contrasenia"],
        ]
        with connection.cursor() as cursor:
            cursor.execute(sql, params)
            nuevo_id = cursor.fetchone()[0]

        return nuevo_id