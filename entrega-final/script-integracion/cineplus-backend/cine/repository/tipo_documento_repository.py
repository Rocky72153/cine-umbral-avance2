from django.db import connection


class TipoDocumentoRepository:

    @staticmethod
    def obtener_todos():
        sql = """
            SELECT id_tipo_documento, nombre
            FROM Tipo_Documento
            ORDER BY id_tipo_documento ASC
        """
        with connection.cursor() as cursor:
            cursor.execute(sql)
            filas = cursor.fetchall()

        return [
            {"id_tipo_documento": fila[0], "nombre": fila[1]}
            for fila in filas
        ]

    @staticmethod
    def obtener_por_id(id_tipo_documento):
        sql = """
            SELECT id_tipo_documento, nombre
            FROM Tipo_Documento
            WHERE id_tipo_documento = %s
        """
        with connection.cursor() as cursor:
            cursor.execute(sql, [id_tipo_documento])
            fila = cursor.fetchone()

        if not fila:
            return None
        return {"id_tipo_documento": fila[0], "nombre": fila[1]}