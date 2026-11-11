"""Aplicación local de demostración de Cine Bogotá."""

import os
import uuid
from datetime import date, datetime, time, timezone
from decimal import Decimal, InvalidOperation

import psycopg
from flask import Flask, jsonify, render_template, request
from psycopg.rows import dict_row
from pymongo import MongoClient
from pymongo.errors import PyMongoError, WriteError


def create_app():
    app = Flask(__name__)

    def postgres():
        url = os.environ.get("POSTGRES_URL")
        if not url:
            raise RuntimeError("Falta configurar POSTGRES_URL.")
        return psycopg.connect(url, row_factory=dict_row, connect_timeout=3)

    def mongo():
        url = os.environ.get("MONGODB_URI")
        if not url:
            raise RuntimeError("Falta configurar MONGODB_URI.")
        return MongoClient(url, serverSelectionTimeoutMS=3000)

    def base(cliente):
        return cliente[os.environ.get("MONGODB_DATABASE", "cine_bogota_avance2")]

    def cuerpo():
        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            raise ValueError("La solicitud debe contener datos válidos.")
        return data

    def entero(data, campo):
        valor = data.get(campo)
        if isinstance(valor, bool) or not str(valor).isdigit() or int(valor) < 1:
            raise ValueError(f"Selecciona un valor válido para {campo}.")
        return int(valor)

    def texto(data, campo, limite=500):
        valor = data.get(campo)
        if not isinstance(valor, str) or not valor.strip() or len(valor.strip()) > limite:
            raise ValueError(f"Completa {campo} (máximo {limite} caracteres).")
        return valor.strip()

    @app.errorhandler(ValueError)
    def error_datos(error):
        return jsonify(error=str(error)), 400

    @app.errorhandler(RuntimeError)
    def error_config(error):
        return jsonify(error=str(error)), 503

    @app.errorhandler(psycopg.OperationalError)
    def error_conexion_pg(_error):
        return jsonify(error="No fue posible conectar con PostgreSQL."), 503

    @app.errorhandler(psycopg.Error)
    def error_postgres(error):
        if error.sqlstate and (error.sqlstate.startswith(("22", "23")) or error.sqlstate == "P0001"):
            return jsonify(error=error.diag.message_primary or "Los datos no son válidos."), 400
        return jsonify(error="No fue posible completar la operación en PostgreSQL."), 503

    @app.errorhandler(WriteError)
    def error_validacion_mongo(_error):
        return jsonify(error="MongoDB rechazó el documento por sus reglas de validación."), 400

    @app.errorhandler(PyMongoError)
    def error_mongodb(_error):
        return jsonify(error="No fue posible completar la operación en MongoDB."), 503

    @app.get("/")
    def inicio():
        return render_template("index.html")

    @app.get("/api/peliculas")
    def peliculas():
        with postgres() as con:
            rows = con.execute(
                "SELECT id_pelicula, titulo, duracion, anio, pais_origen "
                "FROM pelicula ORDER BY id_pelicula"
            ).fetchall()
        return jsonify(peliculas=rows)

    @app.get("/api/peliculas/<int:id_pelicula>")
    def detalle_pelicula(id_pelicula):
        with postgres() as con:
            pelicula = con.execute(
                "SELECT id_pelicula, titulo, duracion, anio, pais_origen, id_clasificacion_pelicula "
                "FROM pelicula WHERE id_pelicula = %s", (id_pelicula,)
            ).fetchone()
        if pelicula is None:
            return jsonify(error="Película no encontrada."), 404
        with mongo() as cliente:
            db = base(cliente)
            fichas = list(db.fichas_tecnicas_peliculas.find(
                {"id_pelicula": id_pelicula}, {"_id": 0}
            ).sort("version.codigo", 1))
            resenas = list(db.resenas_peliculas.find(
                {"id_pelicula": id_pelicula}, {"_id": 0}
            ).sort("fecha", -1).limit(50))
        return jsonify(pelicula=pelicula, fichas_tecnicas=fichas, resenas=resenas)

    @app.post("/api/peliculas/<int:id_pelicula>/resenas")
    def registrar_resena(id_pelicula):
        data = cuerpo()
        espectador = entero(data, "id_espectador")
        calificacion = entero(data, "calificacion")
        if calificacion > 5:
            raise ValueError("La calificación debe estar entre 1 y 5.")
        comentario = texto(data, "texto", 1000)
        with postgres() as con:
            existe = con.execute(
                "SELECT EXISTS(SELECT 1 FROM pelicula WHERE id_pelicula=%s) AS pelicula, "
                "EXISTS(SELECT 1 FROM espectador WHERE id_espectador=%s) AS espectador",
                (id_pelicula, espectador)
            ).fetchone()
        if not all(existe.values()):
            raise ValueError("La película o el espectador no existen.")
        documento = {"_id": "RE-" + uuid.uuid4().hex, "id_pelicula": id_pelicula,
                     "id_espectador": espectador, "calificacion": calificacion, "texto": comentario,
                     "fecha": datetime.now(timezone.utc), "respuesta_empresa": None}
        with mongo() as cliente:
            base(cliente).resenas_peliculas.insert_one(documento)
        return jsonify(mensaje="Reseña registrada."), 201

    @app.get("/api/funciones")
    def funciones():
        with postgres() as con:
            rows = con.execute(
                "SELECT f.id_funcion, f.id_pelicula, f.id_sala, p.titulo, "
                "to_char(f.fecha, 'YYYY-MM-DD') AS fecha, "
                "to_char(f.hora_inicio, 'HH24:MI') AS hora_inicio, "
                "to_char(f.hora_fin, 'HH24:MI') AS hora_fin, t.nombre AS formato "
                "FROM funcion f JOIN pelicula p ON p.id_pelicula=f.id_pelicula "
                "JOIN sala s ON s.id_sala=f.id_sala JOIN tipo_sala t ON t.id_tipo_sala=s.id_tipo_sala "
                "ORDER BY f.fecha, f.hora_inicio, f.id_funcion"
            ).fetchall()
        return jsonify(funciones=rows)

    @app.get("/api/funciones/<int:id_funcion>/requisitos")
    def requisitos(id_funcion):
        with postgres() as con:
            existe = con.execute("SELECT 1 FROM funcion WHERE id_funcion=%s", (id_funcion,)).fetchone()
        if not existe:
            return jsonify(error="Función no encontrada."), 404
        with mongo() as cliente:
            documento = base(cliente).requisitos_proyeccion.find_one({"id_funcion": id_funcion}, {"_id": 0})
        return jsonify(requisitos=documento)

    @app.get("/api/catalogos")
    def catalogos():
        with postgres() as con:
            return jsonify(
                staff=con.execute("SELECT id_staff AS id, primer_nombre || ' ' || primer_apellido AS nombre FROM staff ORDER BY id_staff").fetchall(),
                espectadores=con.execute("SELECT id_espectador AS id, primer_nombre || ' ' || primer_apellido AS nombre FROM espectador ORDER BY id_espectador").fetchall(),
                pagos=con.execute("SELECT id_metodo_pago AS id, nombre FROM metodo_pago_venta ORDER BY id_metodo_pago").fetchall(),
                tipos_boleta=con.execute("SELECT id_tipo_boleta AS id, nombre FROM tipo_boleta ORDER BY id_tipo_boleta").fetchall(),
                estados_sala=con.execute("SELECT id_estado_sala AS id, nombre FROM estado_sala ORDER BY id_estado_sala").fetchall(),
                estados_staff=con.execute("SELECT id_estado_staff AS id, nombre FROM estado_staff ORDER BY id_estado_staff").fetchall(),
                tipos_contrato=con.execute("SELECT id_tipo_contrato AS id, nombre FROM tipo_contrato ORDER BY id_tipo_contrato").fetchall(),
                cargos=con.execute("SELECT id_cargo_staff AS id, nombre FROM cargo_staff ORDER BY id_cargo_staff").fetchall(),
                tipos_documento=con.execute("SELECT id_tipo_documento AS id, nombre FROM tipo_documento ORDER BY id_tipo_documento").fetchall()
            )

    @app.post("/api/funciones")
    def crear_funcion():
        data = cuerpo()
        pelicula, sala = entero(data, "id_pelicula"), entero(data, "id_sala")
        try:
            dia = date.fromisoformat(data.get("fecha", ""))
            inicio = time.fromisoformat(data.get("hora_inicio", ""))
            fin = time.fromisoformat(data.get("hora_fin", ""))
        except (ValueError, TypeError) as exc:
            raise ValueError("Indica una fecha y horarios válidos.") from exc
        with postgres() as con:
            fila = con.execute(
                "INSERT INTO funcion (id_pelicula,id_sala,fecha,hora_inicio,hora_fin) "
                "VALUES (%s,%s,%s,%s,%s) RETURNING id_funcion",
                (pelicula, sala, dia, inicio, fin)
            ).fetchone()
        return jsonify(mensaje="Función registrada.", id_funcion=fila["id_funcion"]), 201

    @app.post("/api/salas/<int:id_sala>/capacidad")
    def capacidad_sala(id_sala):
        capacidad = entero(cuerpo(), "capacidad")
        with postgres() as con:
            fila = con.execute("UPDATE sala SET capacidad=%s WHERE id_sala=%s RETURNING id_sala",
                               (capacidad, id_sala)).fetchone()
        if not fila:
            return jsonify(error="Sala no encontrada."), 404
        return jsonify(mensaje="Capacidad de la sala actualizada.")

    @app.post("/api/contratos")
    def crear_contrato():
        data = cuerpo()
        staff, tipo = entero(data, "id_staff"), entero(data, "id_tipo_contrato")
        try:
            inicio = date.fromisoformat(data.get("fecha_inicio", ""))
            salario = Decimal(str(data.get("salario", "")))
            if not salario.is_finite() or abs(salario) > Decimal("99999999.99"):
                raise ValueError("Indica un salario válido.")
        except (InvalidOperation, ValueError, TypeError) as exc:
            raise ValueError("Indica una fecha y un salario válidos.") from exc
        with postgres() as con:
            fila = con.execute(
                "INSERT INTO contrato (id_staff,id_tipo_contrato,fecha_inicio,salario) "
                "VALUES (%s,%s,%s,%s) RETURNING id_contrato", (staff, tipo, inicio, salario)
            ).fetchone()
        return jsonify(mensaje="Contrato registrado.", id_contrato=fila["id_contrato"]), 201

    @app.post("/api/staff")
    def crear_staff():
        data = cuerpo()
        cargo, documento = entero(data, "id_cargo_staff"), entero(data, "id_tipo_documento")
        nombre, apellido = texto(data, "primer_nombre", 50), texto(data, "primer_apellido", 50)
        numero = texto(data, "numero_documento", 20)
        with postgres() as con:
            inactivo = con.execute("SELECT id_estado_staff FROM estado_staff WHERE lower(nombre)='inactivo'").fetchone()
            if not inactivo:
                raise ValueError("No existe el estado Inactivo en el catálogo.")
            fila = con.execute(
                "INSERT INTO staff (id_cargo_staff,id_estado_staff,id_tipo_documento,primer_nombre,primer_apellido,numero_documento) "
                "VALUES (%s,%s,%s,%s,%s,%s) RETURNING id_staff",
                (cargo, inactivo["id_estado_staff"], documento, nombre, apellido, numero)
            ).fetchone()
        return jsonify(mensaje="Personal registrado como inactivo.", id_staff=fila["id_staff"]), 201

    @app.post("/api/staff/<int:id_staff>/estado")
    def estado_staff(id_staff):
        estado = entero(cuerpo(), "id_estado_staff")
        with postgres() as con:
            fila = con.execute("UPDATE staff SET id_estado_staff=%s WHERE id_staff=%s RETURNING id_staff",
                               (estado, id_staff)).fetchone()
        if not fila:
            return jsonify(error="Integrante de staff no encontrado."), 404
        return jsonify(mensaje="Estado del personal actualizado.")

    @app.post("/api/espectadores/<int:id_espectador>/correo")
    def correo_espectador(id_espectador):
        correo = texto(cuerpo(), "correo", 100)
        with postgres() as con:
            fila = con.execute("UPDATE espectador SET correo=%s WHERE id_espectador=%s RETURNING id_espectador",
                               (correo, id_espectador)).fetchone()
        if not fila:
            return jsonify(error="Espectador no encontrado."), 404
        return jsonify(mensaje="Correo actualizado.")

    @app.post("/api/ventas")
    def registrar_venta():
        data = cuerpo()
        staff, funcion = entero(data, "id_staff"), entero(data, "id_funcion")
        espectador, pago = entero(data, "id_espectador"), entero(data, "id_metodo_pago")
        boletas = data.get("boletas")
        if not isinstance(boletas, list) or not 1 <= len(boletas) <= 20 or not all(isinstance(b, dict) for b in boletas):
            raise ValueError("Indica entre 1 y 20 boletas.")
        asientos, tipos, precios = [], [], []
        for boleta in boletas:
            asientos.append(texto(boleta, "asiento", 10))
            tipos.append(entero(boleta, "id_tipo_boleta"))
            try:
                precio = Decimal(str(boleta.get("precio", "")))
                if not precio.is_finite() or abs(precio) > Decimal("99999999.99"):
                    raise ValueError("Indica un precio válido.")
                precios.append(precio)
            except InvalidOperation as exc:
                raise ValueError("Indica un precio válido.") from exc
        with postgres() as con:
            result = con.execute(
                "CALL sp_registrar_venta(%s, %s, %s, %s, %s::text[], %s::integer[], %s::numeric[], NULL)",
                (staff, funcion, espectador, pago, asientos, tipos, precios)
            ).fetchone()
        return jsonify(mensaje="Venta registrada.", id_venta=result["p_id_venta"]), 201

    @app.get("/api/reportes/ventas")
    def reporte_ventas():
        try:
            desde = date.fromisoformat(request.args.get("desde", ""))
            hasta = date.fromisoformat(request.args.get("hasta", ""))
        except ValueError as exc:
            raise ValueError("Selecciona fechas válidas.") from exc
        if desde > hasta:
            raise ValueError("La fecha inicial no puede ser posterior a la fecha final.")
        with postgres() as con:
            con.execute("CALL sp_reporte_ventas_por_funcion(%s, %s, %s::refcursor)", (desde, hasta, "reporte_cine"))
            rows = con.execute("FETCH ALL FROM reporte_cine").fetchall()
            for row in rows:
                row["fecha"] = row["fecha"].isoformat()
                row["hora_inicio"] = row["hora_inicio"].strftime("%H:%M")
        return jsonify(reporte=rows)

    @app.get("/api/salas")
    def salas():
        with postgres() as con:
            rows = con.execute(
                "SELECT s.id_sala, s.capacidad, e.nombre AS estado, t.nombre AS tipo "
                "FROM sala s JOIN estado_sala e ON e.id_estado_sala=s.id_estado_sala "
                "JOIN tipo_sala t ON t.id_tipo_sala=s.id_tipo_sala ORDER BY s.id_sala"
            ).fetchall()
        return jsonify(salas=rows)

    @app.post("/api/salas/<int:id_sala>/estado")
    def estado_sala(id_sala):
        estado = entero(cuerpo(), "id_estado_sala")
        with postgres() as con:
            con.execute("CALL sp_actualizar_estado_sala(%s, %s)", (id_sala, estado))
        return jsonify(mensaje="Estado de la sala actualizado.")

    @app.get("/api/incidentes")
    def incidentes():
        with mongo() as cliente:
            rows = list(base(cliente).reportes_incidentes.find({}, {"_id": 0}).sort("fecha", -1).limit(30))
        return jsonify(incidentes=rows)

    @app.post("/api/incidentes")
    def registrar_incidente():
        data = cuerpo()
        funcion, staff = entero(data, "id_funcion"), entero(data, "id_staff")
        tipo, severidad = data.get("tipo"), data.get("severidad")
        if tipo not in ("tecnico", "servicio", "seguridad") or severidad not in ("baja", "media", "alta", "critica"):
            raise ValueError("Selecciona un tipo y severidad válidos.")
        descripcion = texto(data, "descripcion", 1000)
        with postgres() as con:
            fila = con.execute("SELECT id_sala FROM funcion WHERE id_funcion=%s", (funcion,)).fetchone()
            responsable = con.execute("SELECT 1 FROM staff WHERE id_staff=%s", (staff,)).fetchone()
        if not fila or not responsable:
            raise ValueError("La función o el integrante de staff no existen.")
        ahora = datetime.now(timezone.utc)
        documento = {"_id": "IN-" + uuid.uuid4().hex, "tipo": tipo, "id_funcion": funcion,
                     "id_sala": fila["id_sala"], "id_venta": None, "id_espectador": None,
                     "fecha": ahora, "severidad": severidad, "estado": "abierto",
                     "descripcion": descripcion, "detalles": {}, "reportado_por": {"tipo": "staff", "id_staff": staff},
                     "actualizado_en": ahora}
        with mongo() as cliente:
            base(cliente).reportes_incidentes.insert_one(documento)
        return jsonify(mensaje="Incidente registrado."), 201

    return app


app = create_app()
