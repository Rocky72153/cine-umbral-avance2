// Colecciones y validadores del avance 2 de Cine Bogotá.
// Ejecutar con mongosh; el script se puede volver a ejecutar sin borrar datos.
const cineDB = db.getSiblingDB("cine_bogota_avance2");

const schemas = {
  fichas_tecnicas_peliculas: {
    bsonType: "object",
    required: ["_id", "id_pelicula", "titulo", "id_clasificacion_pelicula", "pais_origen", "version", "elenco", "idiomas_audio", "subtitulos", "clasificaciones_por_pais"],
    properties: {
      _id: { bsonType: "string" },
      id_pelicula: { bsonType: ["int", "long", "double"] },
      titulo: { bsonType: "string", minLength: 1 },
      id_clasificacion_pelicula: { bsonType: ["int", "long", "double"] },
      pais_origen: { bsonType: "string" },
      version: {
        bsonType: "object",
        required: ["codigo", "formato", "duracion_minutos"],
        properties: {
          codigo: { bsonType: "string" },
          formato: { enum: ["2D Digital", "3D", "4D", "IMAX"] },
          duracion_minutos: { bsonType: ["int", "long", "double"], minimum: 1 }
        }
      },
      elenco: {
        bsonType: "array",
        items: {
          bsonType: "object",
          required: ["id_actor_director", "nombre", "rol_en_pelicula"],
          properties: {
            id_actor_director: { bsonType: ["int", "long", "double"] },
            nombre: { bsonType: "string" },
            rol_en_pelicula: { enum: ["actuacion", "direccion"] }
          }
        }
      },
      idiomas_audio: { bsonType: "array", items: { bsonType: "string" }, minItems: 1 },
      subtitulos: { bsonType: "array", items: { bsonType: "string" } },
      clasificaciones_por_pais: {
        bsonType: "array",
        minItems: 1,
        items: {
          bsonType: "object",
          required: ["pais", "sistema", "etiqueta"],
          properties: {
            pais: { bsonType: "string" },
            sistema: { bsonType: "string" },
            etiqueta: { bsonType: "string" },
            id_clasificacion_pelicula: { bsonType: ["int", "long", "double"] }
          }
        }
      },
      actualizado_en: { bsonType: "date" }
    }
  },
  requisitos_proyeccion: {
    bsonType: "object",
    required: ["_id", "id_funcion", "id_pelicula", "id_sala", "fecha_funcion", "proyeccion", "requerimientos", "estado_validacion"],
    properties: {
      _id: { bsonType: "string" },
      id_funcion: { bsonType: ["int", "long", "double"] },
      id_pelicula: { bsonType: ["int", "long", "double"] },
      id_sala: { bsonType: ["int", "long", "double"] },
      fecha_funcion: { bsonType: "date" },
      proyeccion: {
        bsonType: "object",
        required: ["formato", "resolucion", "audio"],
        properties: {
          formato: { enum: ["2D Digital", "3D", "4D"] },
          resolucion: { bsonType: "string" },
          relacion_aspecto: { bsonType: "string" },
          audio: { bsonType: "string" }
        }
      },
      requerimientos: {
        bsonType: "array",
        items: {
          bsonType: "object",
          required: ["codigo", "estado"],
          properties: {
            codigo: { bsonType: "string" },
            estado: { enum: ["registrado", "por_validar", "no_soportado"] },
            detalle: { bsonType: "string" },
            obligatorio: { bsonType: "bool" }
          }
        }
      },
      estado_validacion: { enum: ["registrado", "pendiente_revision"] },
      observado_en: { bsonType: "date" }
    }
  },
  resenas_peliculas: {
    bsonType: "object",
    required: ["_id", "id_pelicula", "id_espectador", "calificacion", "texto", "fecha", "respuesta_empresa"],
    properties: {
      _id: { bsonType: "string" },
      id_pelicula: { bsonType: ["int", "long", "double"] },
      id_espectador: { bsonType: ["int", "long", "double"] },
      calificacion: { bsonType: ["int", "long", "double"], minimum: 1, maximum: 5 },
      texto: { bsonType: "string", minLength: 1 },
      fecha: { bsonType: "date" },
      respuesta_empresa: {
        bsonType: ["object", "null"],
        properties: {
          mensaje: { bsonType: "string" },
          fecha: { bsonType: "date" }
        }
      }
    }
  },
  reportes_incidentes: {
    bsonType: "object",
    required: ["_id", "tipo", "id_funcion", "id_sala", "fecha", "severidad", "estado", "descripcion", "detalles", "reportado_por"],
    properties: {
      _id: { bsonType: "string" },
      tipo: { enum: ["tecnico", "servicio", "seguridad"] },
      id_funcion: { bsonType: ["int", "long", "double"] },
      id_sala: { bsonType: ["int", "long", "double"] },
      id_venta: { bsonType: ["int", "long", "double", "null"] },
      id_espectador: { bsonType: ["int", "long", "double", "null"] },
      fecha: { bsonType: "date" },
      severidad: { enum: ["baja", "media", "alta", "critica"] },
      estado: { enum: ["abierto", "en_revision", "cerrado"] },
      descripcion: { bsonType: "string", minLength: 1 },
      detalles: { bsonType: "object" },
      reportado_por: {
        bsonType: "object",
        required: ["tipo"],
        properties: {
          tipo: { enum: ["staff", "espectador", "sistema"] },
          id_staff: { bsonType: ["int", "long", "double"] }
        }
      },
      actualizado_en: { bsonType: "date" }
    }
  }
};

for (const [nombre, esquema] of Object.entries(schemas)) {
  const info = cineDB.getCollectionInfos({ name: nombre })[0];
  if (info) {
    const resultado = cineDB.runCommand({
      collMod: nombre,
      validator: { $jsonSchema: esquema },
      validationLevel: "strict",
      validationAction: "error"
    });
    if (resultado.ok !== 1) {
      throw new Error(`No se pudo actualizar el validador de ${nombre}: ${tojson(resultado)}`);
    }
  } else {
    cineDB.createCollection(nombre, {
      validator: { $jsonSchema: esquema },
      validationLevel: "strict",
      validationAction: "error"
    });
  }
  print(`Coleccion lista con validador: ${nombre}`);
}

const indices = [
  ["fichas_tecnicas_peliculas", { id_pelicula: 1, "version.codigo": 1 }, { unique: true, name: "uk_pelicula_version" }],
  ["requisitos_proyeccion", { id_funcion: 1 }, { unique: true, name: "uk_requisitos_funcion" }],
  ["resenas_peliculas", { id_pelicula: 1, fecha: -1 }, { name: "ix_resenas_pelicula_fecha" }],
  ["resenas_peliculas", { id_espectador: 1 }, { name: "ix_resenas_espectador" }],
  ["reportes_incidentes", { tipo: 1, fecha: -1 }, { name: "ix_incidentes_tipo_fecha" }],
  ["reportes_incidentes", { id_funcion: 1, id_sala: 1 }, { name: "ix_incidentes_funcion_sala" }]
];

for (const [coleccion, claves, opciones] of indices) {
  cineDB.getCollection(coleccion).createIndex(claves, opciones);
}

print(`Base ${cineDB.getName()}: cuatro colecciones y seis indices configurados.`);
