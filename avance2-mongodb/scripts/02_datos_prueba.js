//Datos de prueba: 25 documentos más por colección.
//Los 5 primeros de cada colección están en 01_creacion_colecciones.js; con este archivo quedan 30.

//Colección de fichas tecnicas
db.fichas_tecnicas_peliculas.insertMany([
  {
    id_pelicula: 6,
    elenco: [
      { rol: "Director", nombre: "Daniel Navarro León" },
      { rol: "Actor Principal", nombre: "Thiago Fuentes Romero" },
      { rol: "Actor", nombre: "Esteban Correa Mora" }
    ],
    duracion_por_version: { estandar: "130 min" },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] }
  },
  {
    id_pelicula: 7,
    elenco: [
      { rol: "Actriz Principal", nombre: "Mariana Paola Silva Mendoza" },
      { rol: "Actriz", nombre: "Antonella María Pardo Luna" },
      { rol: "Directora", nombre: "Abril Lucía Serrano Paz" }
    ],
    duracion_por_version: { estandar: "95 min" },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] }
  },
  {
    id_pelicula: 8,
    elenco: [
      { rol: "Actor Principal", nombre: "Sebastián Ortega Cruz" },
      { rol: "Director", nombre: "Gabriel Méndez Ibarra" },
      { rol: "Actor", nombre: "Maximiliano Patiño Arias" }
    ],
    duracion_por_version: { estandar: "122 min" },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español Latino"], subtitulos: ["Español"] }
  },
  {
    id_pelicula: 9,
    elenco: [
      { rol: "Directora", nombre: "Camila Andrea Vega Salazar" },
      { rol: "Actriz Principal", nombre: "Manuela Sofía Cortés Núñez" },
      { rol: "Actriz", nombre: "Elisa María Bustos Quintero" }
    ],
    duracion_por_version: { estandar: "108 min" },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] }
  },
  {
    id_pelicula: 10,
    elenco: [
      { rol: "Actor Principal", nombre: "Nicolás Molina Reyes" },
      { rol: "Actor", nombre: "Alejandro Reyes Montoya" },
      { rol: "Director", nombre: "Franco Beltrán Suárez" }
    ],
    duracion_por_version: { estandar: "118 min" },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] }
  },
  {
    id_pelicula: 1,
    elenco: [
      { rol: "Actriz Principal", nombre: "Alison Lohman" },
      { rol: "Director", nombre: "Sam Raimi" }
    ],
    duracion_por_version: { version_3d: "99 min" },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español Latino"], subtitulos: ["Español", "Inglés"] }
  },
  {
    id_pelicula: 2,
    elenco: [
      { rol: "Actor Principal", nombre: "Ryunosuke Kamiki" },
      { rol: "Directora", nombre: "Mone Kamishiraishi" },
      { rol: "Director", nombre: "Makoto Shinkai" }
    ],
    duracion_por_version: { version_3d: "112 min" },
    idiomas_y_subtitulos: { audio: ["Japonés", "Español Latino"], subtitulos: ["Español"] }
  },
  {
    id_pelicula: 3,
    elenco: [
      { rol: "Actriz Principal", nombre: "Erika Sawajiri" },
      { rol: "Directora", nombre: "Mika Ninagawa" }
    ],
    duracion_por_version: { version_3d: "120 min" },
    idiomas_y_subtitulos: { audio: ["Japonés"], subtitulos: ["Español", "Inglés"] }
  },
  {
    id_pelicula: 4,
    elenco: [
      { rol: "Actor Principal", nombre: "Jim Carrey" },
      { rol: "Actriz Principal", nombre: "Kate Winslet" },
      { rol: "Director", nombre: "Michel Gondry" }
    ],
    duracion_por_version: { version_3d: "108 min" },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español"], subtitulos: ["Español"] }
  },
  {
    id_pelicula: 5,
    elenco: [
      { rol: "Actriz Principal", nombre: "Vera Farmiga" },
      { rol: "Actor Principal", nombre: "Patrick Wilson" },
      { rol: "Director", nombre: "James Wan" }
    ],
    duracion_por_version: { version_3d: "112 min" },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español Latino"], subtitulos: ["Español"] }
  },
  {
    id_pelicula: 6,
    elenco: [
      { rol: "Director", nombre: "Daniel Navarro León" },
      { rol: "Actor Principal", nombre: "Thiago Fuentes Romero" },
      { rol: "Actor", nombre: "Esteban Correa Mora" }
    ],
    duracion_por_version: { version_3d: "130 min" },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] }
  },
  {
    id_pelicula: 7,
    elenco: [
      { rol: "Actriz Principal", nombre: "Mariana Paola Silva Mendoza" },
      { rol: "Actriz", nombre: "Antonella María Pardo Luna" },
      { rol: "Directora", nombre: "Abril Lucía Serrano Paz" }
    ],
    duracion_por_version: { version_3d: "95 min" },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] }
  },
  {
    id_pelicula: 8,
    elenco: [
      { rol: "Actor Principal", nombre: "Sebastián Ortega Cruz" },
      { rol: "Director", nombre: "Gabriel Méndez Ibarra" },
      { rol: "Actor", nombre: "Maximiliano Patiño Arias" }
    ],
    duracion_por_version: { version_3d: "122 min" },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español Latino"], subtitulos: ["Español"] }
  },
  {
    id_pelicula: 9,
    elenco: [
      { rol: "Directora", nombre: "Camila Andrea Vega Salazar" },
      { rol: "Actriz Principal", nombre: "Manuela Sofía Cortés Núñez" },
      { rol: "Actriz", nombre: "Elisa María Bustos Quintero" }
    ],
    duracion_por_version: { version_3d: "108 min" },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] }
  },
  {
    id_pelicula: 10,
    elenco: [
      { rol: "Actor Principal", nombre: "Nicolás Molina Reyes" },
      { rol: "Actor", nombre: "Alejandro Reyes Montoya" },
      { rol: "Director", nombre: "Franco Beltrán Suárez" }
    ],
    duracion_por_version: { version_3d: "118 min" },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] }
  },
  {
    id_pelicula: 1,
    elenco: [
      { rol: "Actriz Principal", nombre: "Alison Lohman" },
      { rol: "Director", nombre: "Sam Raimi" }
    ],
    duracion_por_version: { version_4d: "102 min" },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español Latino"], subtitulos: ["Español", "Inglés"] }
  },
  {
    id_pelicula: 2,
    elenco: [
      { rol: "Actor Principal", nombre: "Ryunosuke Kamiki" },
      { rol: "Directora", nombre: "Mone Kamishiraishi" },
      { rol: "Director", nombre: "Makoto Shinkai" }
    ],
    duracion_por_version: { version_4d: "115 min" },
    idiomas_y_subtitulos: { audio: ["Japonés", "Español Latino"], subtitulos: ["Español"] }
  },
  {
    id_pelicula: 3,
    elenco: [
      { rol: "Actriz Principal", nombre: "Erika Sawajiri" },
      { rol: "Directora", nombre: "Mika Ninagawa" }
    ],
    duracion_por_version: { version_4d: "123 min" },
    idiomas_y_subtitulos: { audio: ["Japonés"], subtitulos: ["Español", "Inglés"] }
  },
  {
    id_pelicula: 4,
    elenco: [
      { rol: "Actor Principal", nombre: "Jim Carrey" },
      { rol: "Actriz Principal", nombre: "Kate Winslet" },
      { rol: "Director", nombre: "Michel Gondry" }
    ],
    duracion_por_version: { version_4d: "111 min" },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español"], subtitulos: ["Español"] }
  },
  {
    id_pelicula: 5,
    elenco: [
      { rol: "Actriz Principal", nombre: "Vera Farmiga" },
      { rol: "Actor Principal", nombre: "Patrick Wilson" },
      { rol: "Director", nombre: "James Wan" }
    ],
    duracion_por_version: { version_4d: "115 min" },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español Latino"], subtitulos: ["Español"] }
  },
  {
    id_pelicula: 6,
    elenco: [
      { rol: "Director", nombre: "Daniel Navarro León" },
      { rol: "Actor Principal", nombre: "Thiago Fuentes Romero" },
      { rol: "Actor", nombre: "Esteban Correa Mora" }
    ],
    duracion_por_version: { version_4d: "133 min" },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] }
  },
  {
    id_pelicula: 7,
    elenco: [
      { rol: "Actriz Principal", nombre: "Mariana Paola Silva Mendoza" },
      { rol: "Actriz", nombre: "Antonella María Pardo Luna" },
      { rol: "Directora", nombre: "Abril Lucía Serrano Paz" }
    ],
    duracion_por_version: { version_4d: "98 min" },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] }
  },
  {
    id_pelicula: 8,
    elenco: [
      { rol: "Actor Principal", nombre: "Sebastián Ortega Cruz" },
      { rol: "Director", nombre: "Gabriel Méndez Ibarra" },
      { rol: "Actor", nombre: "Maximiliano Patiño Arias" }
    ],
    duracion_por_version: { version_4d: "125 min" },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español Latino"], subtitulos: ["Español"] }
  },
  {
    id_pelicula: 9,
    elenco: [
      { rol: "Directora", nombre: "Camila Andrea Vega Salazar" },
      { rol: "Actriz Principal", nombre: "Manuela Sofía Cortés Núñez" },
      { rol: "Actriz", nombre: "Elisa María Bustos Quintero" }
    ],
    duracion_por_version: { version_4d: "111 min" },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] }
  },
  {
    id_pelicula: 10,
    elenco: [
      { rol: "Actor Principal", nombre: "Nicolás Molina Reyes" },
      { rol: "Actor", nombre: "Alejandro Reyes Montoya" },
      { rol: "Director", nombre: "Franco Beltrán Suárez" }
    ],
    duracion_por_version: { version_4d: "121 min" },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] }
  }
]);

//Colección de requisitos de proyección
db.requisitos_proyeccion.insertMany([
  {
    id_funcion: 6,
    formato: "2D Estándar",
    requerimientos_audio: "Estéreo amplificado",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 7,
    formato: "2D Estándar",
    requerimientos_audio: "Dolby Atmos",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false, subtitulos: "Español" }
  },
  {
    id_funcion: 8,
    formato: "2D Estándar",
    requerimientos_audio: "Dolby Digital 5.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false, control_luces_sala: "atenuado" }
  },
  {
    id_funcion: 9,
    formato: "2D Estándar",
    requerimientos_audio: "Surround 7.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false, subtitulos: "Español para personas sordas" }
  },
  {
    id_funcion: 10,
    formato: "2D Estándar",
    requerimientos_audio: "Estéreo amplificado",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 11,
    formato: "3D",
    requerimientos_audio: "Surround 7.1",
    detalles_tecnicos: { proyector: "Láser 4K con modulador 3D", lentes_requeridos: true, gafas_3d: "Pasivas polarizadas" }
  },
  {
    id_funcion: 12,
    formato: "3D",
    requerimientos_audio: "Dolby Atmos",
    detalles_tecnicos: { proyector: "Láser 4K con modulador 3D", lentes_requeridos: true, gafas_3d: "Pasivas polarizadas" }
  },
  {
    id_funcion: 13,
    formato: "3D",
    requerimientos_audio: "Surround 7.1",
    detalles_tecnicos: { proyector: "Láser 4K con modulador 3D", lentes_requeridos: true, gafas_3d: "Pasivas polarizadas" }
  },
  {
    id_funcion: 14,
    formato: "3D",
    requerimientos_audio: "Dolby Atmos",
    detalles_tecnicos: { proyector: "Láser 4K con modulador 3D", lentes_requeridos: true, gafas_3d: "Pasivas polarizadas" }
  },
  {
    id_funcion: 15,
    formato: "3D",
    requerimientos_audio: "Surround 7.1",
    detalles_tecnicos: { proyector: "Láser 4K con modulador 3D", lentes_requeridos: true, gafas_3d: "Pasivas polarizadas" }
  },
  {
    id_funcion: 16,
    formato: "3D",
    requerimientos_audio: "Dolby Atmos",
    detalles_tecnicos: { proyector: "Láser 4K con modulador 3D", lentes_requeridos: true, gafas_3d: "Pasivas polarizadas" }
  },
  {
    id_funcion: 17,
    formato: "4D",
    requerimientos_audio: "Dolby Atmos (sincronizado con efectos de butaca)",
    detalles_tecnicos: { proyector: "Láser 4K", lentes_requeridos: false, efectos_4d: ["movimiento", "vibración", "viento"] }
  },
  {
    id_funcion: 18,
    formato: "4D",
    requerimientos_audio: "Dolby Atmos (sincronizado con efectos de butaca)",
    detalles_tecnicos: { proyector: "Láser 4K", lentes_requeridos: false, efectos_4d: ["movimiento", "agua", "niebla"] }
  },
  {
    id_funcion: 19,
    formato: "4D",
    requerimientos_audio: "Dolby Atmos (sincronizado con efectos de butaca)",
    detalles_tecnicos: { proyector: "Láser 4K", lentes_requeridos: false, efectos_4d: ["movimiento", "luces", "aroma"] }
  },
  {
    id_funcion: 20,
    formato: "4D",
    requerimientos_audio: "Dolby Atmos (sincronizado con efectos de butaca)",
    detalles_tecnicos: { proyector: "Láser 4K", lentes_requeridos: false, efectos_4d: ["movimiento", "viento", "agua"] }
  },
  {
    id_funcion: 21,
    formato: "2D Estándar",
    requerimientos_audio: "Surround 7.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 22,
    formato: "2D Estándar",
    requerimientos_audio: "Estéreo amplificado",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false, subtitulos: "Español" }
  },
  {
    id_funcion: 23,
    formato: "2D Estándar",
    requerimientos_audio: "Dolby Atmos",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false, control_luces_sala: "atenuado" }
  },
  {
    id_funcion: 24,
    formato: "2D Estándar",
    requerimientos_audio: "Dolby Digital 5.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false, subtitulos: "Español para personas sordas" }
  },
  {
    id_funcion: 25,
    formato: "2D Estándar",
    requerimientos_audio: "Surround 7.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 26,
    formato: "2D Estándar",
    requerimientos_audio: "Estéreo amplificado",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 27,
    formato: "2D Estándar",
    requerimientos_audio: "Dolby Atmos",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false, subtitulos: "Español" }
  },
  {
    id_funcion: 28,
    formato: "2D Estándar",
    requerimientos_audio: "Dolby Digital 5.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false, control_luces_sala: "atenuado" }
  },
  {
    id_funcion: 29,
    formato: "2D Estándar",
    requerimientos_audio: "Surround 7.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false, subtitulos: "Español para personas sordas" }
  },
  {
    id_funcion: 30,
    formato: "2D Estándar",
    requerimientos_audio: "Estéreo amplificado",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  }
]);

//Colección de reseñas de peliculas
db.resenas_peliculas.insertMany([
  {
    id_pelicula: 6,
    id_espectador: 6,
    calificacion: 3,
    texto_libre: "La trama es interesante, pero el final se siente apresurado.",
    fecha: new Date("2026-10-17T20:42:00Z")
  },
  {
    id_pelicula: 7,
    id_espectador: 7,
    calificacion: 5,
    texto_libre: "Perfecta para ir en familia, mis hijos salieron felices.",
    fecha: new Date("2026-10-18T00:49:00Z"),
    respuesta_empresa: "¡Nos alegra mucho! Los esperamos de nuevo."
  },
  {
    id_pelicula: 8,
    id_espectador: 8,
    calificacion: 2,
    texto_libre: "El sonido estuvo demasiado alto en algunas escenas y molestaba.",
    fecha: new Date("2026-10-19T00:56:00Z")
  },
  {
    id_pelicula: 9,
    id_espectador: 9,
    calificacion: 4,
    texto_libre: "Atmósfera oscura muy bien construida. No es para todo el mundo.",
    fecha: new Date("2026-10-17T16:03:00Z")
  },
  {
    id_pelicula: 10,
    id_espectador: 10,
    calificacion: 5,
    texto_libre: "Muy buen ritmo de principio a fin.",
    fecha: new Date("2026-10-18T20:10:00Z"),
    respuesta_empresa: "Gracias por tu calificación."
  },
  {
    id_pelicula: 1,
    id_espectador: 11,
    calificacion: 4,
    texto_libre: "En 3D se aprovechan muy bien las escenas de acción.",
    fecha: new Date("2026-10-20T00:17:00Z")
  },
  {
    id_pelicula: 2,
    id_espectador: 12,
    calificacion: 1,
    texto_libre: "Las gafas 3D estaban rayadas y la imagen se veía borrosa.",
    fecha: new Date("2026-10-18T00:24:00Z"),
    respuesta_empresa: "Lamentamos lo ocurrido. Ya revisamos el lote de gafas de la sala 12."
  },
  {
    id_pelicula: 3,
    id_espectador: 13,
    calificacion: 3,
    texto_libre: "Buena historia, aunque el 3D no aporta tanto en esta película.",
    fecha: new Date("2026-10-19T16:31:00Z")
  },
  {
    id_pelicula: 4,
    id_espectador: 14,
    calificacion: 5,
    texto_libre: "En 3D es otra experiencia. Muy recomendada.",
    fecha: new Date("2026-10-20T20:38:00Z")
  },
  {
    id_pelicula: 5,
    id_espectador: 15,
    calificacion: 2,
    texto_libre: "Mucha gente usando el celular durante la función y nadie dijo nada.",
    fecha: new Date("2026-10-18T00:45:00Z")
  },
  {
    id_pelicula: 6,
    id_espectador: 16,
    calificacion: 4,
    texto_libre: "El 3D en las escenas de persecución quedó muy bien.",
    fecha: new Date("2026-10-19T00:52:00Z")
  },
  {
    id_pelicula: 7,
    id_espectador: 17,
    calificacion: 5,
    texto_libre: "La experiencia 4D con viento y movimiento fue muy divertida.",
    fecha: new Date("2026-10-20T16:59:00Z"),
    respuesta_empresa: "¡Gracias! Nos alegra que hayas disfrutado la sala 4D."
  },
  {
    id_pelicula: 8,
    id_espectador: 18,
    calificacion: 3,
    texto_libre: "La butaca se movía demasiado para mi gusto, pero la película es buena.",
    fecha: new Date("2026-10-18T20:06:00Z")
  },
  {
    id_pelicula: 9,
    id_espectador: 19,
    calificacion: 4,
    texto_libre: "El 4D suma tensión a una película que ya es de miedo.",
    fecha: new Date("2026-10-19T00:13:00Z")
  },
  {
    id_pelicula: 10,
    id_espectador: 20,
    calificacion: 5,
    texto_libre: "Increíble en 4D. El agua en las escenas del río fue un detalle genial.",
    fecha: new Date("2026-10-20T00:20:00Z")
  },
  {
    id_pelicula: 1,
    id_espectador: 21,
    calificacion: 4,
    texto_libre: "Segunda vez que la veo y sigue gustándome igual.",
    fecha: new Date("2026-10-19T16:27:00Z")
  },
  {
    id_pelicula: 2,
    id_espectador: 22,
    calificacion: 2,
    texto_libre: "La función empezó veinte minutos tarde y no dieron explicación.",
    fecha: new Date("2026-10-20T20:34:00Z")
  },
  {
    id_pelicula: 3,
    id_espectador: 23,
    calificacion: 4,
    texto_libre: "Buen ritmo y buenas actuaciones. La recomiendo.",
    fecha: new Date("2026-10-21T00:41:00Z"),
    respuesta_empresa: "Gracias por tu reseña."
  },
  {
    id_pelicula: 4,
    id_espectador: 24,
    calificacion: 3,
    texto_libre: "Correcta, sin más. Se hace un poco larga.",
    fecha: new Date("2026-10-19T00:48:00Z")
  },
  {
    id_pelicula: 5,
    id_espectador: 25,
    calificacion: 1,
    texto_libre: "Proyección con cortes de imagen. Pedimos ayuda y tardaron mucho.",
    fecha: new Date("2026-10-20T16:55:00Z")
  },
  {
    id_pelicula: 6,
    id_espectador: 26,
    calificacion: 5,
    texto_libre: "Me encantó el giro final. La mejor película del año para mí.",
    fecha: new Date("2026-10-21T20:02:00Z")
  },
  {
    id_pelicula: 7,
    id_espectador: 27,
    calificacion: 4,
    texto_libre: "Tierna y divertida. Ideal para ver con amigos.",
    fecha: new Date("2026-10-19T00:09:00Z")
  },
  {
    id_pelicula: 8,
    id_espectador: 28,
    calificacion: 2,
    texto_libre: "La sala estaba muy fría durante toda la película.",
    fecha: new Date("2026-10-20T00:16:00Z"),
    respuesta_empresa: "Gracias por avisarnos, ya ajustamos la climatización de la sala 8."
  },
  {
    id_pelicula: 9,
    id_espectador: 29,
    calificacion: 5,
    texto_libre: "Me dejó pensando varios días. Excelente.",
    fecha: new Date("2026-10-21T16:23:00Z")
  },
  {
    id_pelicula: 10,
    id_espectador: 30,
    calificacion: 3,
    texto_libre: "Entretenida, aunque algunas escenas se alargan más de la cuenta.",
    fecha: new Date("2026-10-19T20:30:00Z")
  }
]);

//Colección de reportes de incidentes
db.reportes_incidentes.insertMany([
  {
    id_sala: 6,
    id_funcion: 6,
    id_staff: 1,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: { zona: "Entrada principal", descripcion: "Discusión entre dos espectadores por puestos asignados." },
    fecha_reporte: new Date("2026-10-16T18:30:00Z")
  },
  {
    id_sala: 7,
    id_funcion: 7,
    id_staff: 2,
    tipo_incidente: "Falla técnica",
    detalles_especificos: { equipo: "Climatización", descripcion: "El aire acondicionado dejó de funcionar a mitad de la función." },
    fecha_reporte: new Date("2026-10-16T21:37:00Z")
  },
  {
    id_sala: 8,
    id_funcion: 8,
    id_staff: 3,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Sala", descripcion: "Sala fría durante toda la función." },
    fecha_reporte: new Date("2026-10-17T00:44:00Z")
  },
  {
    id_sala: 9,
    id_funcion: 9,
    id_staff: 4,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: { zona: "Parqueadero", descripcion: "Vehículo con vidrio roto reportado al salir de la función." },
    fecha_reporte: new Date("2026-10-16T15:51:00Z")
  },
  {
    id_sala: 10,
    id_funcion: 10,
    id_staff: 5,
    tipo_incidente: "Falla técnica",
    detalles_especificos: { equipo: "Iluminación", descripcion: "Las luces de la sala se encendieron diez minutos antes del final." },
    fecha_reporte: new Date("2026-10-16T18:58:00Z")
  },
  {
    id_sala: 11,
    id_funcion: 11,
    id_staff: 1,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Atención al cliente", descripcion: "El espectador pidió cambio de función y no le dieron respuesta clara." },
    fecha_reporte: new Date("2026-10-17T22:05:00Z")
  },
  {
    id_sala: 12,
    id_funcion: 12,
    id_staff: 2,
    tipo_incidente: "Falla técnica",
    detalles_especificos: { equipo: "Proyector", descripcion: "Imagen 3D desalineada; el modulador perdió la calibración." },
    fecha_reporte: new Date("2026-10-18T01:12:00Z")
  },
  {
    id_sala: 13,
    id_funcion: 13,
    id_staff: 3,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: { zona: "Sala 13", descripcion: "Objeto olvidado (morral) revisado por seguridad." },
    fecha_reporte: new Date("2026-10-17T16:19:00Z")
  },
  {
    id_sala: 14,
    id_funcion: 14,
    id_staff: 4,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Sala", descripcion: "Gafas 3D rayadas entregadas en la entrada." },
    fecha_reporte: new Date("2026-10-17T19:26:00Z")
  },
  {
    id_sala: 15,
    id_funcion: 15,
    id_staff: 5,
    tipo_incidente: "Falla técnica",
    detalles_especificos: { equipo: "Pantalla", descripcion: "Mancha visible en la esquina inferior de la pantalla." },
    fecha_reporte: new Date("2026-10-17T21:33:00Z")
  },
  {
    id_sala: 16,
    id_funcion: 16,
    id_staff: 1,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: { zona: "Escaleras", descripcion: "Espectador resbaló en la escalera de salida; se le prestaron primeros auxilios." },
    fecha_reporte: new Date("2026-10-18T00:40:00Z")
  },
  {
    id_sala: 17,
    id_funcion: 17,
    id_staff: 2,
    tipo_incidente: "Falla técnica",
    detalles_especificos: { equipo: "Butacas 4D", descripcion: "Tres butacas de la fila C no se movieron durante la función." },
    fecha_reporte: new Date("2026-10-17T15:47:00Z")
  },
  {
    id_sala: 18,
    id_funcion: 18,
    id_staff: 3,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Sala", descripcion: "El movimiento de las butacas 4D causó mareo a un espectador." },
    fecha_reporte: new Date("2026-10-17T18:54:00Z")
  },
  {
    id_sala: 19,
    id_funcion: 19,
    id_staff: 4,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: { zona: "Sala 19", descripcion: "Alarma de humo activada por la máquina de niebla 4D." },
    fecha_reporte: new Date("2026-10-17T22:01:00Z")
  },
  {
    id_sala: 20,
    id_funcion: 20,
    id_staff: 5,
    tipo_incidente: "Falla técnica",
    detalles_especificos: { equipo: "Butacas 4D", descripcion: "Fuga de agua en el sistema de efectos de la sala 20." },
    fecha_reporte: new Date("2026-10-18T01:08:00Z")
  },
  {
    id_sala: 1,
    id_funcion: 21,
    id_staff: 1,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Baños", descripcion: "Baños del segundo piso sin papel durante la tarde." },
    fecha_reporte: new Date("2026-10-18T16:15:00Z")
  },
  {
    id_sala: 2,
    id_funcion: 22,
    id_staff: 2,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Taquilla", descripcion: "La función empezó veinte minutos tarde sin explicación." },
    fecha_reporte: new Date("2026-10-18T19:22:00Z")
  },
  {
    id_sala: 3,
    id_funcion: 23,
    id_staff: 3,
    tipo_incidente: "Falla técnica",
    detalles_especificos: { equipo: "Sistema de sonido", descripcion: "Canal izquierdo sin audio durante los primeros minutos." },
    fecha_reporte: new Date("2026-10-18T22:29:00Z")
  },
  {
    id_sala: 4,
    id_funcion: 24,
    id_staff: 4,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: { zona: "Confitería", descripcion: "Intento de pago con billete falso." },
    fecha_reporte: new Date("2026-10-19T00:36:00Z")
  },
  {
    id_sala: 5,
    id_funcion: 25,
    id_staff: 5,
    tipo_incidente: "Falla técnica",
    detalles_especificos: { equipo: "Proyector", descripcion: "Cortes de imagen intermitentes; se cambió la lámpara." },
    fecha_reporte: new Date("2026-10-18T15:43:00Z")
  },
  {
    id_sala: 6,
    id_funcion: 26,
    id_staff: 1,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Atención al cliente", descripcion: "Demora en la atención cuando se reportó la falla del proyector." },
    fecha_reporte: new Date("2026-10-18T18:50:00Z")
  },
  {
    id_sala: 7,
    id_funcion: 27,
    id_staff: 2,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: { zona: "Sala 7", descripcion: "Menor de edad sin acompañante en la función; se ubicó a su familia." },
    fecha_reporte: new Date("2026-10-18T21:57:00Z")
  },
  {
    id_sala: 8,
    id_funcion: 28,
    id_staff: 3,
    tipo_incidente: "Falla técnica",
    detalles_especificos: { equipo: "Climatización", descripcion: "Temperatura de la sala por debajo de 17 °C." },
    fecha_reporte: new Date("2026-10-19T01:04:00Z")
  },
  {
    id_sala: 9,
    id_funcion: 29,
    id_staff: 4,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: { zona: "Entrada principal", descripcion: "Persona intentó ingresar sin boleta durante la función." },
    fecha_reporte: new Date("2026-10-18T16:11:00Z")
  },
  {
    id_sala: 10,
    id_funcion: 30,
    id_staff: 5,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Confitería", descripcion: "Cobro doble en la compra de un combo con tarjeta." },
    fecha_reporte: new Date("2026-10-18T19:18:00Z")
  }
]);
