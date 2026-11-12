//Consulta 1 -  reseñas de 1 o 2 estrellas que la empresa no ha respondido
db.resenas_peliculas.find(
  { calificacion: { $lte: 2 }, respuesta_empresa: { $exists: false } },
  { _id: 0, id_pelicula: 1, id_espectador: 1, calificacion: 1, texto_libre: 1, fecha: 1 }
).sort({ calificacion: 1, fecha: -1 })
//Consulta 2 - funciones que requieren gafas 3D
db.requisitos_proyeccion.find(
  { "detalles_tecnicos.lentes_requeridos": true },
  { _id: 0, id_funcion: 1, formato: 1, requerimientos_audio: 1, "detalles_tecnicos.gafas_3d": 1 }
).sort({ id_funcion: 1 })
//Consulta 3 calificación promedio y numero de reseñas por pelicula
db.resenas_peliculas.aggregate([
  { $group: {
      _id: "$id_pelicula",
      promedio: { $avg: "$calificacion" },
      total_resenas: { $sum: 1 }
  }},
  { $sort: { promedio: -1 } }
])
////Consulta 4 - cantidad de incidentes por tipo y salas afectadas
db.reportes_incidentes.aggregate([
  { $group: {
      _id: "$tipo_incidente",
      total: { $sum: 1 },
      salas_afectadas: { $addToSet: "$id_sala" }
  }},
  { $sort: { total: -1 } }
])
