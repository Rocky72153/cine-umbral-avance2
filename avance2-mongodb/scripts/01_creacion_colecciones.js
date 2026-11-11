//Colección de fichas tecnicas
db.createCollection("fichas_tecnicas_peliculas");

db.fichas_tecnicas_peliculas.insertMany([
  {
    id_pelicula: 201,
    elenco: [
      { rol: "Actriz Principal", nombre: "Alison Lohman" },
      { rol: "Director", nombre: "Sam Raimi" }
    ],
    duracion_por_version: { cine: "99 min" },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español Latino"], subtitulos: ["Español", "Inglés"] }
  },
  {
    id_pelicula: 202,
    elenco: [
      { rol: "Actor Principal", nombre: "Ryunosuke Kamiki" },
      { rol: "Directora", nombre: "Mone Kamishiraishi" },
      { rol: "Director", nombre: "Makoto Shinkai" }
    ],
    duracion_por_version: { estandar: "112 min" },
    idiomas_y_subtitulos: { audio: ["Japonés", "Español Latino"], subtitulos: ["Español"] }
  },
  {
    id_pelicula: 203,
    elenco: [
      { rol: "Actriz Principal", nombre: "Erika Sawajiri" },
      { rol: "Directora", nombre: "Mika Ninagawa" }
    ],
    duracion_por_version: { estandar: "120 min" },
    idiomas_y_subtitulos: { audio: ["Japonés"], subtitulos: ["Español", "Inglés"] }
  },
  {
    id_pelicula: 204,
    elenco: [
      { rol: "Actor Principal", nombre: "Jim Carrey" },
      { rol: "Actriz Principal", nombre: "Kate Winslet" },
      { rol: "Director", nombre: "Michel Gondry" }
    ],
    duracion_por_version: { estandar: "108 min" },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español"], subtitulos: ["Español"] }
  },
  {
    id_pelicula: 205,
    elenco: [
      { rol: "Actriz Principal", nombre: "Vera Farmiga" },
      { rol: "Actor Principal", nombre: "Patrick Wilson" },
      { rol: "Director", nombre: "James Wan" }
    ],
    duracion_por_version: { estandar: "112 min" },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español Latino"], subtitulos: ["Español"] }
  }
]);

//Colección de requisistos de proyección
db.createCollection("requisitos_proyeccion");

db.requisitos_proyeccion.insertMany([
  {
    id_funcion: 601,
    formato: "2D Estándar",
    requerimientos_audio: "Dolby Digital 5.1 (Realce en efectos de terror y sobresaltos)",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 602,
    formato: "IMAX 2D",
    requerimientos_audio: "Dolby Atmos (Optimizado para banda sonora musical)",
    detalles_tecnicos: { proyector: "Láser 4K IMAX", lentes_requeridos: false }
  },
  {
    id_funcion: 603,
    formato: "Digital Estándar",
    requerimientos_audio: "Surround 7.1",
    detalles_tecnicos: { proyector: "Digital 2K", control_luces_sala: "atenuado" }
  },
  {
    id_funcion: 604,
    formato: "Ciclo de Cine Arte",
    requerimientos_audio: "Estéreo amplificado",
    detalles_tecnicos: { proyector: "Restaurado HD", formato_proyeccion: "1.85:1" }
  },
  {
    id_funcion: 605,
    formato: "Sala Macro XE / Terror",
    requerimientos_audio: "Dolby Atmos (Graves profundos para escenas de tensión)",
    detalles_tecnicos: { proyector: "Dual Láser 4K", aislamiento_acustico: "reforzado" }
  }
]);

//Colección de reseñas de peliculas
db.createCollection("resenas_peliculas");

db.resenas_peliculas.insertMany([
  {
    id_pelicula: 201,
    id_espectador: 901,
    calificacion: 4,
    texto_libre: "¡De lo mejor de Sam Raimi! Mezcla perfecta de horror y comedia negra.",
    fecha: new Date("2026-10-10T22:00:00Z"),
    respuesta_empresa: "¡Totalmente de acuerdo! Una montaña rusa de sustos."
  },
  {
    id_pelicula: 202,
    id_espectador: 902,
    calificacion: 5,
    texto_libre: "Visualmente impresionante y una historia que te llega al corazón.",
    fecha: new Date("2026-10-12T19:30:00Z")
  },
  {
    id_pelicula: 203,
    id_espectador: 903,
    calificacion: 4,
    texto_libre: "Una locura visual muy intensa y cruda sobre la fama y la obsesión.",
    fecha: new Date("2026-10-15T21:15:00Z"),
    respuesta_empresa: "Gracias por tu opinión sobre este título de culto."
  },
  {
    id_pelicula: 204,
    id_espectador: 904,
    calificacion: 5,
    texto_libre: "Una obra maestra sobre el amor, la memoria y el dolor de olvidar.",
    fecha: new Date("2026-10-18T18:00:00Z")
  },
  {
    id_pelicula: 205,
    id_espectador: 905,
    calificacion: 5,
    texto_libre: "El cine de terror moderno en su máxima expresión. Los sustos están muy bien logrados.",
    fecha: new Date("2026-10-20T23:00:00Z"),
    respuesta_empresa: "¡Gracias por visitarnos! Esperamos que hayas dormido bien después de la función."
  }
]);

//Colección de fichas tecnicas
db.createCollection("reportes_incidentes");

db.reportes_incidentes.insertMany([
  {
    id_sala: 2,
    id_funcion: 601,
    id_staff: 14,
    tipo_incidente: "Falla técnica",
    detalles_especificos: { equipo: "Sistema de sonido", descripcion: "Alerta de volumen alto durante el clímax de la película de terror." },
    fecha_reporte: new Date("2026-10-10T23:45:00Z")
  },
  {
    id_sala: 5,
    id_funcion: 602,
    id_staff: 19,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Taquilla", descripcion: "Larga fila de espectadores buscando entradas para la función de estreno." },
    fecha_reporte: new Date("2026-10-12T18:30:00Z")
  },
  {
    id_sala: 1,
    id_funcion: 603,
    id_staff: 11,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: { zona: "Pasillo central", descripcion: "Espectador intentando grabar fragmentos de la proyección con dispositivo móvil." },
    fecha_reporte: new Date("2026-10-15T22:20:00Z")
  },
  {
    id_sala: 3,
    id_funcion: 604,
    id_staff: 21,
    tipo_incidente: "Falla técnica",
    detalles_especificos: { equipo: "Proyector", descripcion: "Breve retraso en la sincronización de subtítulos al inicio de la función." },
    fecha_reporte: new Date("2026-10-18T17:50:00Z")
  },
  {
    id_sala: 4,
    id_funcion: 605,
    id_staff: 16,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Confitería", descripcion: "Falta de stock temporal de vasos coleccionables temáticos de la película." },
    fecha_reporte: new Date("2026-10-20T21:10:00Z")
  }
]);
