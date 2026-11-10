// Consultas demostrativas para mongosh sobre cine_bogota_avance2.
const cineDB = db.getSiblingDB("cine_bogota_avance2");

print("1) Fichas técnicas y versiones de la película 1");
printjson(cineDB.fichas_tecnicas_peliculas.find(
  { id_pelicula: 1 },
  { _id: 1, id_pelicula: 1, titulo: 1, version: 1, idiomas_audio: 1, subtitulos: 1 }
).sort({ "version.codigo": 1 }).toArray());

print("2) Requisitos registrados para la función 29 (incluye perfil pendiente de Dolby Atmos)");
printjson(cineDB.requisitos_proyeccion.findOne(
  { id_funcion: 29 },
  { _id: 0, id_funcion: 1, id_pelicula: 1, id_sala: 1, proyeccion: 1, requerimientos: 1, estado_validacion: 1 }
));

print("3) Reseñas recientes de la película 1");
printjson(cineDB.resenas_peliculas.find(
  { id_pelicula: 1 },
  { _id: 1, id_espectador: 1, calificacion: 1, fecha: 1, respuesta_empresa: 1 }
).sort({ fecha: -1 }).limit(5).toArray());

print("4) Aggregation: promedio y cantidad de reseñas por película, unido a la ficha 2D");
printjson(cineDB.resenas_peliculas.aggregate([
  {
    $group: {
      _id: "$id_pelicula",
      promedio: { $avg: "$calificacion" },
      total_resenas: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "fichas_tecnicas_peliculas",
      let: { peliculaId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$id_pelicula", "$$peliculaId"] } } },
        { $match: { "version.codigo": "2D" } },
        { $project: { _id: 0, titulo: 1 } },
        { $limit: 1 }
      ],
      as: "ficha"
    }
  },
  { $unwind: { path: "$ficha", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      _id: 0,
      id_pelicula: "$_id",
      titulo: "$ficha.titulo",
      promedio: { $round: ["$promedio", 2] },
      total_resenas: 1
    }
  },
  { $sort: { promedio: -1, id_pelicula: 1 } }
]).toArray());

print("5) Aggregation: incidentes agrupados por tipo y severidad");
printjson(cineDB.reportes_incidentes.aggregate([
  {
    $group: {
      _id: { tipo: "$tipo", severidad: "$severidad" },
      cantidad: { $sum: 1 },
      ultimo_registro: { $max: "$fecha" }
    }
  },
  { $sort: { "_id.tipo": 1, "_id.severidad": 1 } }
]).toArray());

print("6) Aggregation: cantidad de perfiles de proyección por formato");
printjson(cineDB.requisitos_proyeccion.aggregate([
  { $group: { _id: "$proyeccion.formato", funciones: { $sum: 1 } } },
  { $sort: { funciones: -1, _id: 1 } }
]).toArray());
