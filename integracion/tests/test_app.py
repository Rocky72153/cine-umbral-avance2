"""Comprobaciones de rutas y validaciones con conexiones simuladas."""

import os
import unittest
from datetime import date, time
from decimal import Decimal
from unittest.mock import patch

from integracion.app import app


class AplicacionTest(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.client = app.test_client()
        self.env = patch.dict(os.environ, {"POSTGRES_URL": "postgresql://demo", "MONGODB_URI": "mongodb://demo"})
        self.env.start()

    def tearDown(self):
        self.env.stop()

    def test_portada_y_archivos(self):
        for ruta in ("/", "/static/app.js", "/static/estilos.css"):
            respuesta = self.client.get(ruta)
            self.assertEqual(respuesta.status_code, 200)
            respuesta.close()

    def test_detalle_combina_pelicula_y_documentos(self):
        with patch("integracion.app.psycopg.connect") as conectar, patch("integracion.app.MongoClient") as mongo:
            con = conectar.return_value.__enter__.return_value
            con.execute.return_value.fetchone.return_value = {"id_pelicula": 1, "titulo": "Película"}
            db = mongo.return_value.__enter__.return_value.__getitem__.return_value
            db.fichas_tecnicas_peliculas.find.return_value = [{"id_pelicula": 1, "duracion_por_version": {"cine": "99 min"}}]
            db.resenas_peliculas.find.return_value.sort.return_value.limit.return_value = [{"id_pelicula": 1, "texto_libre": "Bien"}]
            r = self.client.get("/api/peliculas/1")
            self.assertEqual(r.status_code, 200)
            self.assertEqual(r.json["pelicula"]["id_pelicula"], 1)
            self.assertEqual(len(r.json["fichas_tecnicas"]), 1)
            self.assertEqual(len(r.json["resenas"]), 1)

    def test_reporte_usa_cursor_y_devuelve_resultados(self):
        with patch("integracion.app.psycopg.connect") as conectar:
            con = conectar.return_value.__enter__.return_value
            con.execute.return_value.fetchall.return_value = [{
                "id_funcion": 1, "titulo": "Película", "fecha": date(2026, 10, 16),
                "hora_inicio": time(10, 0), "recaudo": Decimal("18000"),
                "cantidad_ventas": 1, "cantidad_boletas": 1,
            }]
            r = self.client.get("/api/reportes/ventas?desde=2026-10-16&hasta=2026-10-18")
            self.assertEqual(r.status_code, 200)
            self.assertEqual(r.json["reporte"][0]["hora_inicio"], "10:00")
            self.assertEqual(con.execute.call_count, 2)

    def test_venta_con_varias_boletas_llama_procedimiento(self):
        with patch("integracion.app.psycopg.connect") as conectar:
            con = conectar.return_value.__enter__.return_value
            con.execute.return_value.fetchone.return_value = {"p_id_venta": 42}
            respuesta = self.client.post("/api/ventas", json={
                "id_staff": 1, "id_funcion": 1, "id_espectador": 1, "id_metodo_pago": 1,
                "boletas": [{"asiento": "A05", "id_tipo_boleta": 1, "precio": "18000"},
                            {"asiento": "A06", "id_tipo_boleta": 2, "precio": "14000"}],
            })
            self.assertEqual(respuesta.status_code, 201)
            self.assertEqual(respuesta.json["id_venta"], 42)
            sql, parametros = con.execute.call_args.args
            self.assertIn("sp_registrar_venta", sql)
            self.assertEqual(parametros[4], ["A05", "A06"])
            self.assertEqual(parametros[5], [1, 2])

    def test_venta_invalida_no_se_envia_a_postgresql(self):
        with patch("integracion.app.psycopg.connect") as conectar:
            respuesta = self.client.post("/api/ventas", json={
                "id_staff": 1, "id_funcion": 1, "id_espectador": 1, "id_metodo_pago": 1,
                "boletas": [{"asiento": "A01", "id_tipo_boleta": 1, "precio": "invalido"}],
            })
            self.assertEqual(respuesta.status_code, 400)
            conectar.assert_not_called()

    def test_resena_verifica_referencias_antes_de_escribir(self):
        with patch("integracion.app.psycopg.connect") as conectar, patch("integracion.app.MongoClient") as mongo:
            con = conectar.return_value.__enter__.return_value
            con.execute.return_value.fetchone.return_value = {"pelicula": True, "espectador": False}
            respuesta = self.client.post("/api/peliculas/1/resenas", json={
                "id_espectador": 9, "calificacion": 4, "texto": "Buena película"
            })
            self.assertEqual(respuesta.status_code, 400)
            mongo.assert_not_called()

    def test_resena_valida_se_guarda_en_mongodb(self):
        with patch("integracion.app.psycopg.connect") as conectar, patch("integracion.app.MongoClient") as mongo:
            con = conectar.return_value.__enter__.return_value
            con.execute.return_value.fetchone.return_value = {"pelicula": True, "espectador": True}
            respuesta = self.client.post("/api/peliculas/1/resenas", json={
                "id_espectador": 3, "calificacion": 5, "texto": "Muy buena"
            })
            self.assertEqual(respuesta.status_code, 201)
            coleccion = mongo.return_value.__enter__.return_value.__getitem__.return_value.resenas_peliculas
            guardado = coleccion.insert_one.call_args.args[0]
            self.assertEqual((guardado["id_pelicula"], guardado["id_espectador"]), (1, 3))
            self.assertEqual(guardado["texto_libre"], "Muy buena")
            self.assertNotIn("respuesta_empresa", guardado)

    def test_incidente_guarda_campos_del_esquema_actual(self):
        with patch("integracion.app.psycopg.connect") as conectar, patch("integracion.app.MongoClient") as mongo:
            con = conectar.return_value.__enter__.return_value
            con.execute.return_value.fetchone.side_effect = [{"id_sala": 2}, {"existe": 1}]
            respuesta = self.client.post("/api/incidentes", json={
                "id_funcion": 1, "id_staff": 3, "tipo": "tecnico", "severidad": "alta",
                "descripcion": "Falla de audio",
            })
            self.assertEqual(respuesta.status_code, 201)
            coleccion = mongo.return_value.__enter__.return_value.__getitem__.return_value.reportes_incidentes
            guardado = coleccion.insert_one.call_args.args[0]
            self.assertEqual(guardado["tipo_incidente"], "Falla técnica")
            self.assertEqual((guardado["id_sala"], guardado["id_staff"]), (2, 3))
            self.assertEqual(guardado["detalles_especificos"], {"descripcion": "Falla de audio", "severidad": "alta"})
            self.assertIn("fecha_reporte", guardado)

    def test_reporte_rechaza_rango_invertido(self):
        with patch("integracion.app.psycopg.connect") as conectar:
            r = self.client.get("/api/reportes/ventas?desde=2026-11-10&hasta=2026-11-01")
            self.assertEqual(r.status_code, 400)
            conectar.assert_not_called()

    def test_mensaje_si_falta_configuracion(self):
        with patch.dict(os.environ, {}, clear=True):
            r = self.client.get("/api/peliculas")
            self.assertEqual(r.status_code, 503)
            self.assertIn("POSTGRES_URL", r.json["error"])


if __name__ == "__main__":
    unittest.main()
