// Cine Bogotá · Avance 2 · Datos de prueba (MongoDB)
// 02_datos_prueba.js
//
// Inserta 30 documentos en cada colección. Ejecutar después de 01_creacion_colecciones.js
// sobre la base cine_bogota_avance2:
//   mongosh cine_bogota_avance2 --file 02_datos_prueba.js
//
// Todos los IDs existen en avance1-postgresql/scripts/02_datos_prueba.sql:
// Pelicula 1-10, Funcion 1-30, Sala 1-20, Espectador 1-30, Venta 1-30, Staff 1-5
// y Actor_Director 1-30. Los 5 primeros documentos de requisitos, reseñas e
// incidentes son los que propuso Amelia, con sus IDs corregidos.

//Colección de fichas técnicas
// Una ficha por película y versión (2D, 3D, 4D): 10 películas x 3 versiones = 30 fichas.
// id_pelicula e id_actor_director son los de PostgreSQL (Pelicula y Actor_Director).
db.fichas_tecnicas_peliculas.insertMany([
  {
    id_pelicula: 1,
    titulo: "La ciudad de los sueños",
    version: "2D",
    elenco: [
      { id_actor_director: 1, rol: "Actor", nombre: "Sofía Isabel Ramírez Vargas" },
      { id_actor_director: 11, rol: "Actor", nombre: "Gabriela Elena Castillo Lara" },
      { id_actor_director: 21, rol: "Director", nombre: "Renata Isabel Duarte Vidal" }
    ],
    duracion_por_version: { estandar: 110 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés", "Español para personas sordas"] },
    clasificacion_por_pais: [{ pais: "Colombia", clasificacion: "Todo público", id_clasificacion_pelicula: 1 }],
    premios: ["Mejor guion, Festival de Cine de Bogotá 2022"]
  },
  {
    id_pelicula: 1,
    titulo: "La ciudad de los sueños",
    version: "3D",
    elenco: [
      { id_actor_director: 1, rol: "Actor", nombre: "Sofía Isabel Ramírez Vargas" },
      { id_actor_director: 11, rol: "Actor", nombre: "Gabriela Elena Castillo Lara" },
      { id_actor_director: 21, rol: "Director", nombre: "Renata Isabel Duarte Vidal" }
    ],
    duracion_por_version: { estandar: 110 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] },
    clasificacion_por_pais: [{ pais: "Colombia", clasificacion: "Todo público", id_clasificacion_pelicula: 1 }]
  },
  {
    id_pelicula: 1,
    titulo: "La ciudad de los sueños",
    version: "4D",
    elenco: [
      { id_actor_director: 1, rol: "Actor", nombre: "Sofía Isabel Ramírez Vargas" },
      { id_actor_director: 11, rol: "Actor", nombre: "Gabriela Elena Castillo Lara" },
      { id_actor_director: 21, rol: "Director", nombre: "Renata Isabel Duarte Vidal" }
    ],
    duracion_por_version: { estandar: 110, con_presentacion_4d: 113 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] },
    clasificacion_por_pais: [{ pais: "Colombia", clasificacion: "Todo público", id_clasificacion_pelicula: 1 }]
  },
  {
    id_pelicula: 2,
    titulo: "Misión en la montaña",
    version: "2D",
    elenco: [
      { id_actor_director: 2, rol: "Actor", nombre: "Mateo Cárdenas Ruiz" },
      { id_actor_director: 12, rol: "Director", nombre: "Tomás Aguilar Soto" },
      { id_actor_director: 22, rol: "Actor", nombre: "Benjamín Ocampo Prieto" }
    ],
    duracion_por_version: { estandar: 125 },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español latino"], subtitulos: ["Español", "Español para personas sordas"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Mayores de 12 años", id_clasificacion_pelicula: 3 },
      { pais: "Estados Unidos", clasificacion: "PG-13" }
    ]
  },
  {
    id_pelicula: 2,
    titulo: "Misión en la montaña",
    version: "3D",
    elenco: [
      { id_actor_director: 2, rol: "Actor", nombre: "Mateo Cárdenas Ruiz" },
      { id_actor_director: 12, rol: "Director", nombre: "Tomás Aguilar Soto" },
      { id_actor_director: 22, rol: "Actor", nombre: "Benjamín Ocampo Prieto" }
    ],
    duracion_por_version: { estandar: 125 },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español latino"], subtitulos: ["Español"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Mayores de 12 años", id_clasificacion_pelicula: 3 },
      { pais: "Estados Unidos", clasificacion: "PG-13" }
    ]
  },
  {
    id_pelicula: 2,
    titulo: "Misión en la montaña",
    version: "4D",
    elenco: [
      { id_actor_director: 2, rol: "Actor", nombre: "Mateo Cárdenas Ruiz" },
      { id_actor_director: 12, rol: "Director", nombre: "Tomás Aguilar Soto" },
      { id_actor_director: 22, rol: "Actor", nombre: "Benjamín Ocampo Prieto" }
    ],
    duracion_por_version: { estandar: 125, con_presentacion_4d: 128 },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español latino"], subtitulos: ["Español"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Mayores de 12 años", id_clasificacion_pelicula: 3 },
      { pais: "Estados Unidos", clasificacion: "PG-13" }
    ],
    advertencia_4d: "Movimiento intenso de butacas en las escenas de escalada."
  },
  {
    id_pelicula: 3,
    titulo: "El último viaje",
    version: "2D",
    elenco: [
      { id_actor_director: 3, rol: "Director", nombre: "Valeria Lucía Moreno Gil" },
      { id_actor_director: 13, rol: "Actor", nombre: "Luciana Isabel Peña Acosta" },
      { id_actor_director: 23, rol: "Actor", nombre: "Paula Andrea Londoño Cañas" }
    ],
    duracion_por_version: { estandar: 98, extendida: 110 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés", "Español para personas sordas"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Mayores de 7 años", id_clasificacion_pelicula: 2 },
      { pais: "España", clasificacion: "No recomendada para menores de 7 años" }
    ]
  },
  {
    id_pelicula: 3,
    titulo: "El último viaje",
    version: "3D",
    elenco: [
      { id_actor_director: 3, rol: "Director", nombre: "Valeria Lucía Moreno Gil" },
      { id_actor_director: 13, rol: "Actor", nombre: "Luciana Isabel Peña Acosta" },
      { id_actor_director: 23, rol: "Actor", nombre: "Paula Andrea Londoño Cañas" }
    ],
    duracion_por_version: { estandar: 98 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Mayores de 7 años", id_clasificacion_pelicula: 2 },
      { pais: "España", clasificacion: "No recomendada para menores de 7 años" }
    ]
  },
  {
    id_pelicula: 3,
    titulo: "El último viaje",
    version: "4D",
    elenco: [
      { id_actor_director: 3, rol: "Director", nombre: "Valeria Lucía Moreno Gil" },
      { id_actor_director: 13, rol: "Actor", nombre: "Luciana Isabel Peña Acosta" },
      { id_actor_director: 23, rol: "Actor", nombre: "Paula Andrea Londoño Cañas" }
    ],
    duracion_por_version: { estandar: 98, con_presentacion_4d: 101 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Mayores de 7 años", id_clasificacion_pelicula: 2 },
      { pais: "España", clasificacion: "No recomendada para menores de 7 años" }
    ]
  },
  {
    id_pelicula: 4,
    titulo: "Planeta azul",
    version: "2D",
    elenco: [
      { id_actor_director: 4, rol: "Actor", nombre: "Samuel Herrera Castro" },
      { id_actor_director: 14, rol: "Actor", nombre: "Emiliano Navarrete Ríos" },
      { id_actor_director: 24, rol: "Director", nombre: "Joaquín Salinas Bravo" }
    ],
    duracion_por_version: { estandar: 105 },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español latino"], subtitulos: ["Español", "Español para personas sordas"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Todo público", id_clasificacion_pelicula: 1 },
      { pais: "Reino Unido", clasificacion: "U" }
    ]
  },
  {
    id_pelicula: 4,
    titulo: "Planeta azul",
    version: "3D",
    elenco: [
      { id_actor_director: 4, rol: "Actor", nombre: "Samuel Herrera Castro" },
      { id_actor_director: 14, rol: "Actor", nombre: "Emiliano Navarrete Ríos" },
      { id_actor_director: 24, rol: "Director", nombre: "Joaquín Salinas Bravo" }
    ],
    duracion_por_version: { estandar: 105 },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español latino"], subtitulos: ["Español"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Todo público", id_clasificacion_pelicula: 1 },
      { pais: "Reino Unido", clasificacion: "U" }
    ]
  },
  {
    id_pelicula: 4,
    titulo: "Planeta azul",
    version: "4D",
    elenco: [
      { id_actor_director: 4, rol: "Actor", nombre: "Samuel Herrera Castro" },
      { id_actor_director: 14, rol: "Actor", nombre: "Emiliano Navarrete Ríos" },
      { id_actor_director: 24, rol: "Director", nombre: "Joaquín Salinas Bravo" }
    ],
    duracion_por_version: { estandar: 105, con_presentacion_4d: 108 },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español latino"], subtitulos: ["Español"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Todo público", id_clasificacion_pelicula: 1 },
      { pais: "Reino Unido", clasificacion: "U" }
    ]
  },
  {
    id_pelicula: 5,
    titulo: "La casa del bosque",
    version: "2D",
    elenco: [
      { id_actor_director: 5, rol: "Actor", nombre: "Isabella María Rojas Pineda" },
      { id_actor_director: 15, rol: "Director", nombre: "Julieta Fernanda Campos Mejía" },
      { id_actor_director: 25, rol: "Actor", nombre: "Mía Valentina Cabrera Roldán" }
    ],
    duracion_por_version: { estandar: 115 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés", "Español para personas sordas"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Mayores de 15 años", id_clasificacion_pelicula: 4 },
      { pais: "México", clasificacion: "B15" }
    ],
    escena_postcreditos: true
  },
  {
    id_pelicula: 5,
    titulo: "La casa del bosque",
    version: "3D",
    elenco: [
      { id_actor_director: 5, rol: "Actor", nombre: "Isabella María Rojas Pineda" },
      { id_actor_director: 15, rol: "Director", nombre: "Julieta Fernanda Campos Mejía" },
      { id_actor_director: 25, rol: "Actor", nombre: "Mía Valentina Cabrera Roldán" }
    ],
    duracion_por_version: { estandar: 115 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Mayores de 15 años", id_clasificacion_pelicula: 4 },
      { pais: "México", clasificacion: "B15" }
    ]
  },
  {
    id_pelicula: 5,
    titulo: "La casa del bosque",
    version: "4D",
    elenco: [
      { id_actor_director: 5, rol: "Actor", nombre: "Isabella María Rojas Pineda" },
      { id_actor_director: 15, rol: "Director", nombre: "Julieta Fernanda Campos Mejía" },
      { id_actor_director: 25, rol: "Actor", nombre: "Mía Valentina Cabrera Roldán" }
    ],
    duracion_por_version: { estandar: 115, con_presentacion_4d: 118 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Mayores de 15 años", id_clasificacion_pelicula: 4 },
      { pais: "México", clasificacion: "B15" }
    ]
  },
  {
    id_pelicula: 6,
    titulo: "Código secreto",
    version: "2D",
    elenco: [
      { id_actor_director: 6, rol: "Director", nombre: "Daniel Navarro León" },
      { id_actor_director: 16, rol: "Actor", nombre: "Thiago Fuentes Romero" },
      { id_actor_director: 26, rol: "Actor", nombre: "Esteban Correa Mora" }
    ],
    duracion_por_version: { estandar: 130, extendida: 142 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés", "Español para personas sordas"] },
    clasificacion_por_pais: [{ pais: "Colombia", clasificacion: "Mayores de 12 años", id_clasificacion_pelicula: 3 }]
  },
  {
    id_pelicula: 6,
    titulo: "Código secreto",
    version: "3D",
    elenco: [
      { id_actor_director: 6, rol: "Director", nombre: "Daniel Navarro León" },
      { id_actor_director: 16, rol: "Actor", nombre: "Thiago Fuentes Romero" },
      { id_actor_director: 26, rol: "Actor", nombre: "Esteban Correa Mora" }
    ],
    duracion_por_version: { estandar: 130 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] },
    clasificacion_por_pais: [{ pais: "Colombia", clasificacion: "Mayores de 12 años", id_clasificacion_pelicula: 3 }],
    premios: ["Mejores efectos visuales, Premios Macondo 2025"],
    escena_postcreditos: true
  },
  {
    id_pelicula: 6,
    titulo: "Código secreto",
    version: "4D",
    elenco: [
      { id_actor_director: 6, rol: "Director", nombre: "Daniel Navarro León" },
      { id_actor_director: 16, rol: "Actor", nombre: "Thiago Fuentes Romero" },
      { id_actor_director: 26, rol: "Actor", nombre: "Esteban Correa Mora" }
    ],
    duracion_por_version: { estandar: 130, con_presentacion_4d: 133 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] },
    clasificacion_por_pais: [{ pais: "Colombia", clasificacion: "Mayores de 12 años", id_clasificacion_pelicula: 3 }]
  },
  {
    id_pelicula: 7,
    titulo: "Amigos para siempre",
    version: "2D",
    elenco: [
      { id_actor_director: 7, rol: "Actor", nombre: "Mariana Paola Silva Mendoza" },
      { id_actor_director: 17, rol: "Actor", nombre: "Antonella María Pardo Luna" },
      { id_actor_director: 27, rol: "Director", nombre: "Abril Lucía Serrano Paz" }
    ],
    duracion_por_version: { estandar: 95 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés", "Español para personas sordas"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Todo público", id_clasificacion_pelicula: 1 },
      { pais: "Argentina", clasificacion: "ATP" }
    ]
  },
  {
    id_pelicula: 7,
    titulo: "Amigos para siempre",
    version: "3D",
    elenco: [
      { id_actor_director: 7, rol: "Actor", nombre: "Mariana Paola Silva Mendoza" },
      { id_actor_director: 17, rol: "Actor", nombre: "Antonella María Pardo Luna" },
      { id_actor_director: 27, rol: "Director", nombre: "Abril Lucía Serrano Paz" }
    ],
    duracion_por_version: { estandar: 95 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Todo público", id_clasificacion_pelicula: 1 },
      { pais: "Argentina", clasificacion: "ATP" }
    ]
  },
  {
    id_pelicula: 7,
    titulo: "Amigos para siempre",
    version: "4D",
    elenco: [
      { id_actor_director: 7, rol: "Actor", nombre: "Mariana Paola Silva Mendoza" },
      { id_actor_director: 17, rol: "Actor", nombre: "Antonella María Pardo Luna" },
      { id_actor_director: 27, rol: "Director", nombre: "Abril Lucía Serrano Paz" }
    ],
    duracion_por_version: { estandar: 95, con_presentacion_4d: 98 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Todo público", id_clasificacion_pelicula: 1 },
      { pais: "Argentina", clasificacion: "ATP" }
    ]
  },
  {
    id_pelicula: 8,
    titulo: "La órbita perdida",
    version: "2D",
    elenco: [
      { id_actor_director: 8, rol: "Actor", nombre: "Sebastián Ortega Cruz" },
      { id_actor_director: 18, rol: "Director", nombre: "Gabriel Méndez Ibarra" },
      { id_actor_director: 28, rol: "Actor", nombre: "Maximiliano Patiño Arias" }
    ],
    duracion_por_version: { estandar: 122 },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español latino"], subtitulos: ["Español", "Español para personas sordas"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Mayores de 7 años", id_clasificacion_pelicula: 2 },
      { pais: "Canadá", clasificacion: "PG" }
    ]
  },
  {
    id_pelicula: 8,
    titulo: "La órbita perdida",
    version: "3D",
    elenco: [
      { id_actor_director: 8, rol: "Actor", nombre: "Sebastián Ortega Cruz" },
      { id_actor_director: 18, rol: "Director", nombre: "Gabriel Méndez Ibarra" },
      { id_actor_director: 28, rol: "Actor", nombre: "Maximiliano Patiño Arias" }
    ],
    duracion_por_version: { estandar: 122 },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español latino"], subtitulos: ["Español"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Mayores de 7 años", id_clasificacion_pelicula: 2 },
      { pais: "Canadá", clasificacion: "PG" }
    ],
    relacion_aspecto: "2.39:1"
  },
  {
    id_pelicula: 8,
    titulo: "La órbita perdida",
    version: "4D",
    elenco: [
      { id_actor_director: 8, rol: "Actor", nombre: "Sebastián Ortega Cruz" },
      { id_actor_director: 18, rol: "Director", nombre: "Gabriel Méndez Ibarra" },
      { id_actor_director: 28, rol: "Actor", nombre: "Maximiliano Patiño Arias" }
    ],
    duracion_por_version: { estandar: 122, con_presentacion_4d: 125 },
    idiomas_y_subtitulos: { audio: ["Inglés", "Español latino"], subtitulos: ["Español"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Mayores de 7 años", id_clasificacion_pelicula: 2 },
      { pais: "Canadá", clasificacion: "PG" }
    ]
  },
  {
    id_pelicula: 9,
    titulo: "Sombras de medianoche",
    version: "2D",
    elenco: [
      { id_actor_director: 9, rol: "Director", nombre: "Camila Andrea Vega Salazar" },
      { id_actor_director: 19, rol: "Actor", nombre: "Manuela Sofía Cortés Núñez" },
      { id_actor_director: 29, rol: "Actor", nombre: "Elisa María Bustos Quintero" }
    ],
    duracion_por_version: { estandar: 108, extendida: 120 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés", "Español para personas sordas"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Mayores de 18 años", id_clasificacion_pelicula: 5 },
      { pais: "Chile", clasificacion: "18" }
    ],
    advertencia_contenido: "Escenas de violencia y lenguaje fuerte."
  },
  {
    id_pelicula: 9,
    titulo: "Sombras de medianoche",
    version: "3D",
    elenco: [
      { id_actor_director: 9, rol: "Director", nombre: "Camila Andrea Vega Salazar" },
      { id_actor_director: 19, rol: "Actor", nombre: "Manuela Sofía Cortés Núñez" },
      { id_actor_director: 29, rol: "Actor", nombre: "Elisa María Bustos Quintero" }
    ],
    duracion_por_version: { estandar: 108 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Mayores de 18 años", id_clasificacion_pelicula: 5 },
      { pais: "Chile", clasificacion: "18" }
    ]
  },
  {
    id_pelicula: 9,
    titulo: "Sombras de medianoche",
    version: "4D",
    elenco: [
      { id_actor_director: 9, rol: "Director", nombre: "Camila Andrea Vega Salazar" },
      { id_actor_director: 19, rol: "Actor", nombre: "Manuela Sofía Cortés Núñez" },
      { id_actor_director: 29, rol: "Actor", nombre: "Elisa María Bustos Quintero" }
    ],
    duracion_por_version: { estandar: 108, con_presentacion_4d: 111 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] },
    clasificacion_por_pais: [
      { pais: "Colombia", clasificacion: "Mayores de 18 años", id_clasificacion_pelicula: 5 },
      { pais: "Chile", clasificacion: "18" }
    ]
  },
  {
    id_pelicula: 10,
    titulo: "Aventura en el tiempo",
    version: "2D",
    elenco: [
      { id_actor_director: 10, rol: "Actor", nombre: "Nicolás Molina Reyes" },
      { id_actor_director: 20, rol: "Actor", nombre: "Alejandro Reyes Montoya" },
      { id_actor_director: 30, rol: "Director", nombre: "Franco Beltrán Suárez" }
    ],
    duracion_por_version: { estandar: 118 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés", "Español para personas sordas"] },
    clasificacion_por_pais: [{ pais: "Colombia", clasificacion: "Mayores de 12 años", id_clasificacion_pelicula: 3 }]
  },
  {
    id_pelicula: 10,
    titulo: "Aventura en el tiempo",
    version: "3D",
    elenco: [
      { id_actor_director: 10, rol: "Actor", nombre: "Nicolás Molina Reyes" },
      { id_actor_director: 20, rol: "Actor", nombre: "Alejandro Reyes Montoya" },
      { id_actor_director: 30, rol: "Director", nombre: "Franco Beltrán Suárez" }
    ],
    duracion_por_version: { estandar: 118 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] },
    clasificacion_por_pais: [{ pais: "Colombia", clasificacion: "Mayores de 12 años", id_clasificacion_pelicula: 3 }]
  },
  {
    id_pelicula: 10,
    titulo: "Aventura en el tiempo",
    version: "4D",
    elenco: [
      { id_actor_director: 10, rol: "Actor", nombre: "Nicolás Molina Reyes" },
      { id_actor_director: 20, rol: "Actor", nombre: "Alejandro Reyes Montoya" },
      { id_actor_director: 30, rol: "Director", nombre: "Franco Beltrán Suárez" }
    ],
    duracion_por_version: { estandar: 118, con_presentacion_4d: 121 },
    idiomas_y_subtitulos: { audio: ["Español"], subtitulos: ["Inglés"] },
    clasificacion_por_pais: [{ pais: "Colombia", clasificacion: "Mayores de 12 años", id_clasificacion_pelicula: 3 }],
    advertencia_4d: "Uso de agua y niebla durante la proyección."
  }
]);

//Colección de requisitos de proyección
// Un documento por función (Funcion 1 a 30 en PostgreSQL), con la sala y la película de esa función.
// Funciones 1-20 en las salas 1-20 y funciones 21-30 en las salas 1-10.
// Salas 1-10 Digital, 11-16 3D y 17-20 4D.
db.requisitos_proyeccion.insertMany([
  {
    id_funcion: 1,
    id_sala: 1,
    id_pelicula: 1,
    fecha_funcion: new Date("2026-10-16T15:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Dolby Digital 5.1 (realce en efectos de sonido)",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 2,
    id_sala: 2,
    id_pelicula: 2,
    fecha_funcion: new Date("2026-10-16T18:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Dolby Atmos (optimizado para banda sonora musical)",
    detalles_tecnicos: { proyector: "Láser 4K", lentes_requeridos: false }
  },
  {
    id_funcion: 3,
    id_sala: 3,
    id_pelicula: 3,
    fecha_funcion: new Date("2026-10-16T21:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Surround 7.1",
    detalles_tecnicos: {
      proyector: "Digital 2K",
      control_luces_sala: "atenuado",
      subtitulos: { idioma: "Español", para_personas_sordas: false }
    }
  },
  {
    id_funcion: 4,
    id_sala: 4,
    id_pelicula: 4,
    fecha_funcion: new Date("2026-10-17T00:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Estéreo amplificado",
    detalles_tecnicos: { proyector: "Restaurado HD", formato_proyeccion: "1.85:1" }
  },
  {
    id_funcion: 5,
    id_sala: 5,
    id_pelicula: 5,
    fecha_funcion: new Date("2026-10-16T15:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Dolby Atmos (graves profundos para escenas de tensión)",
    detalles_tecnicos: { proyector: "Dual Láser 4K", aislamiento_acustico: "reforzado" }
  },
  {
    id_funcion: 6,
    id_sala: 6,
    id_pelicula: 6,
    fecha_funcion: new Date("2026-10-16T18:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Dolby Digital 5.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false, subtitulos: { idioma: "Español", para_personas_sordas: true } }
  },
  {
    id_funcion: 7,
    id_sala: 7,
    id_pelicula: 7,
    fecha_funcion: new Date("2026-10-16T21:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Dolby Digital 5.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 8,
    id_sala: 8,
    id_pelicula: 8,
    fecha_funcion: new Date("2026-10-17T00:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Surround 7.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 9,
    id_sala: 9,
    id_pelicula: 9,
    fecha_funcion: new Date("2026-10-16T15:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Dolby Digital 5.1",
    detalles_tecnicos: {
      proyector: "Digital 2K",
      lentes_requeridos: false,
      subtitulos: { idioma: "Español", para_personas_sordas: false }
    }
  },
  {
    id_funcion: 10,
    id_sala: 10,
    id_pelicula: 10,
    fecha_funcion: new Date("2026-10-16T18:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Dolby Digital 5.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 11,
    id_sala: 11,
    id_pelicula: 1,
    fecha_funcion: new Date("2026-10-17T21:00:00Z"),
    formato: "3D",
    requerimientos_audio: "Surround 7.1",
    detalles_tecnicos: {
      proyector: "Láser 4K con modulador 3D",
      lentes_requeridos: true,
      gafas_3d: { tipo: "Pasivas polarizadas", cantidad: 100 }
    }
  },
  {
    id_funcion: 12,
    id_sala: 12,
    id_pelicula: 2,
    fecha_funcion: new Date("2026-10-18T00:00:00Z"),
    formato: "3D",
    requerimientos_audio: "Dolby Atmos",
    detalles_tecnicos: {
      proyector: "Láser 4K con modulador 3D",
      lentes_requeridos: true,
      gafas_3d: { tipo: "Pasivas polarizadas", cantidad: 100 },
      subtitulos: { idioma: "Español", para_personas_sordas: true }
    }
  },
  {
    id_funcion: 13,
    id_sala: 13,
    id_pelicula: 3,
    fecha_funcion: new Date("2026-10-17T15:00:00Z"),
    formato: "3D",
    requerimientos_audio: "Surround 7.1",
    detalles_tecnicos: {
      proyector: "Láser 4K con modulador 3D",
      lentes_requeridos: true,
      gafas_3d: { tipo: "Pasivas polarizadas", cantidad: 100 }
    }
  },
  {
    id_funcion: 14,
    id_sala: 14,
    id_pelicula: 4,
    fecha_funcion: new Date("2026-10-17T18:00:00Z"),
    formato: "3D",
    requerimientos_audio: "Dolby Atmos",
    detalles_tecnicos: {
      proyector: "Láser 4K con modulador 3D",
      lentes_requeridos: true,
      gafas_3d: { tipo: "Pasivas polarizadas", cantidad: 100 }
    }
  },
  {
    id_funcion: 15,
    id_sala: 15,
    id_pelicula: 5,
    fecha_funcion: new Date("2026-10-17T21:00:00Z"),
    formato: "3D",
    requerimientos_audio: "Surround 7.1",
    detalles_tecnicos: {
      proyector: "Láser 4K con modulador 3D",
      lentes_requeridos: true,
      gafas_3d: { tipo: "Pasivas polarizadas", cantidad: 100 },
      subtitulos: { idioma: "Español", para_personas_sordas: false }
    }
  },
  {
    id_funcion: 16,
    id_sala: 16,
    id_pelicula: 6,
    fecha_funcion: new Date("2026-10-18T00:00:00Z"),
    formato: "3D",
    requerimientos_audio: "Dolby Atmos",
    detalles_tecnicos: {
      proyector: "Láser 4K con modulador 3D",
      lentes_requeridos: true,
      gafas_3d: { tipo: "Pasivas polarizadas", cantidad: 100 }
    }
  },
  {
    id_funcion: 17,
    id_sala: 17,
    id_pelicula: 7,
    fecha_funcion: new Date("2026-10-17T15:00:00Z"),
    formato: "4D",
    requerimientos_audio: "Dolby Atmos",
    detalles_tecnicos: {
      proyector: "Láser 4K",
      lentes_requeridos: false,
      efectos_4d: ["movimiento", "agua", "niebla"],
      restriccion_acceso: "No apta para menores de 1,10 m ni mujeres embarazadas"
    }
  },
  {
    id_funcion: 18,
    id_sala: 18,
    id_pelicula: 8,
    fecha_funcion: new Date("2026-10-17T18:00:00Z"),
    formato: "4D",
    requerimientos_audio: "Dolby Atmos",
    detalles_tecnicos: {
      proyector: "Láser 4K",
      lentes_requeridos: true,
      efectos_4d: ["movimiento", "vibracion", "luces", "aroma"],
      restriccion_acceso: "No apta para menores de 1,10 m ni mujeres embarazadas",
      subtitulos: { idioma: "Español", para_personas_sordas: true }
    }
  },
  {
    id_funcion: 19,
    id_sala: 19,
    id_pelicula: 9,
    fecha_funcion: new Date("2026-10-17T21:00:00Z"),
    formato: "4D",
    requerimientos_audio: "Dolby Atmos",
    detalles_tecnicos: {
      proyector: "Láser 4K",
      lentes_requeridos: false,
      efectos_4d: ["movimiento", "viento", "agua"],
      restriccion_acceso: "No apta para menores de 1,10 m ni mujeres embarazadas"
    }
  },
  {
    id_funcion: 20,
    id_sala: 20,
    id_pelicula: 10,
    fecha_funcion: new Date("2026-10-18T00:00:00Z"),
    formato: "4D",
    requerimientos_audio: "Dolby Atmos",
    detalles_tecnicos: {
      proyector: "Láser 4K",
      lentes_requeridos: true,
      efectos_4d: ["movimiento", "vibracion", "viento"],
      restriccion_acceso: "No apta para menores de 1,10 m ni mujeres embarazadas"
    }
  },
  {
    id_funcion: 21,
    id_sala: 1,
    id_pelicula: 1,
    fecha_funcion: new Date("2026-10-18T15:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Dolby Digital 5.1",
    detalles_tecnicos: {
      proyector: "Digital 2K",
      lentes_requeridos: false,
      subtitulos: { idioma: "Español", para_personas_sordas: false }
    }
  },
  {
    id_funcion: 22,
    id_sala: 2,
    id_pelicula: 2,
    fecha_funcion: new Date("2026-10-18T18:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Dolby Digital 5.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 23,
    id_sala: 3,
    id_pelicula: 3,
    fecha_funcion: new Date("2026-10-18T21:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Dolby Digital 5.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 24,
    id_sala: 4,
    id_pelicula: 4,
    fecha_funcion: new Date("2026-10-19T00:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Surround 7.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false, subtitulos: { idioma: "Español", para_personas_sordas: true } }
  },
  {
    id_funcion: 25,
    id_sala: 5,
    id_pelicula: 5,
    fecha_funcion: new Date("2026-10-18T15:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Dolby Digital 5.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 26,
    id_sala: 6,
    id_pelicula: 6,
    fecha_funcion: new Date("2026-10-18T18:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Dolby Digital 5.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 27,
    id_sala: 7,
    id_pelicula: 7,
    fecha_funcion: new Date("2026-10-18T21:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Dolby Digital 5.1",
    detalles_tecnicos: {
      proyector: "Digital 2K",
      lentes_requeridos: false,
      subtitulos: { idioma: "Español", para_personas_sordas: false }
    }
  },
  {
    id_funcion: 28,
    id_sala: 8,
    id_pelicula: 8,
    fecha_funcion: new Date("2026-10-19T00:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Surround 7.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 29,
    id_sala: 9,
    id_pelicula: 9,
    fecha_funcion: new Date("2026-10-18T15:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Dolby Digital 5.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false }
  },
  {
    id_funcion: 30,
    id_sala: 10,
    id_pelicula: 10,
    fecha_funcion: new Date("2026-10-18T18:00:00Z"),
    formato: "Digital 2D",
    requerimientos_audio: "Dolby Digital 5.1",
    detalles_tecnicos: { proyector: "Digital 2K", lentes_requeridos: false, subtitulos: { idioma: "Español", para_personas_sordas: true } }
  }
]);

//Colección de reseñas de películas
// La reseña k es del espectador k, que compró la venta k para la función k (PostgreSQL).
db.resenas_peliculas.insertMany([
  {
    id_pelicula: 1,
    id_espectador: 1,
    id_venta: 1,
    calificacion: 4,
    texto_libre: "Mezcla muy lograda de drama y humor. La ciudad se ve hermosa en pantalla grande.",
    fecha: new Date("2026-10-16T21:00:00Z"),
    respuesta_empresa: "¡Totalmente de acuerdo! Gracias por acompañarnos en esta función."
  },
  {
    id_pelicula: 2,
    id_espectador: 2,
    id_venta: 2,
    calificacion: 5,
    texto_libre: "Visualmente impresionante y con una historia que llega al corazón.",
    fecha: new Date("2026-10-17T01:00:00Z"),
    etiquetas: ["visual", "emotiva"]
  },
  {
    id_pelicula: 3,
    id_espectador: 3,
    id_venta: 3,
    calificacion: 4,
    texto_libre: "Un relato intenso y crudo sobre la familia y la memoria. Muy recomendada.",
    fecha: new Date("2026-10-17T05:00:00Z"),
    respuesta_empresa: "Gracias por tu opinión sobre este título."
  },
  {
    id_pelicula: 4,
    id_espectador: 4,
    id_venta: 4,
    calificacion: 5,
    texto_libre: "Una obra sobre la naturaleza y el planeta que todos deberían ver.",
    fecha: new Date("2026-10-17T09:00:00Z")
  },
  {
    id_pelicula: 5,
    id_espectador: 5,
    id_venta: 5,
    calificacion: 5,
    texto_libre: "El terror en su mejor expresión. Los sustos están muy bien logrados.",
    fecha: new Date("2026-10-17T01:00:00Z"),
    respuesta_empresa: "¡Gracias por visitarnos! Esperamos que hayas dormido bien después de la función.",
    etiquetas: ["terror"]
  },
  {
    id_pelicula: 6,
    id_espectador: 6,
    id_venta: 6,
    calificacion: 3,
    texto_libre: "La trama del código es interesante, pero el final se siente apresurado.",
    fecha: new Date("2026-10-17T05:00:00Z")
  },
  {
    id_pelicula: 7,
    id_espectador: 7,
    id_venta: 7,
    calificacion: 5,
    texto_libre: "Perfecta para ir en familia, mis hijos salieron felices.",
    fecha: new Date("2026-10-17T09:00:00Z"),
    respuesta_empresa: "¡Nos alegra mucho! Los esperamos de nuevo."
  },
  {
    id_pelicula: 8,
    id_espectador: 8,
    id_venta: 8,
    calificacion: 2,
    texto_libre: "El sonido estuvo demasiado alto en algunas escenas y molestaba.",
    fecha: new Date("2026-10-17T13:00:00Z")
  },
  {
    id_pelicula: 9,
    id_espectador: 9,
    id_venta: 9,
    calificacion: 4,
    texto_libre: "Atmósfera oscura muy bien construida. No es para todo el mundo.",
    fecha: new Date("2026-10-17T05:00:00Z")
  },
  {
    id_pelicula: 10,
    id_espectador: 10,
    id_venta: 10,
    calificacion: 5,
    texto_libre: "Viajes en el tiempo bien explicados y con mucho ritmo.",
    fecha: new Date("2026-10-17T09:00:00Z"),
    respuesta_empresa: "Gracias por tu calificación."
  },
  {
    id_pelicula: 1,
    id_espectador: 11,
    id_venta: 11,
    calificacion: 4,
    texto_libre: "En 3D se aprovechan muy bien las tomas aéreas de la ciudad.",
    fecha: new Date("2026-10-18T13:00:00Z"),
    etiquetas: ["3D"]
  },
  {
    id_pelicula: 2,
    id_espectador: 12,
    id_venta: 12,
    calificacion: 1,
    texto_libre: "Las gafas 3D estaban rayadas y la imagen se veía borrosa.",
    fecha: new Date("2026-10-18T17:00:00Z"),
    respuesta_empresa: "Lamentamos lo ocurrido. Ya revisamos el lote de gafas de la sala 12.",
    etiquetas: ["3D", "queja"]
  },
  {
    id_pelicula: 3,
    id_espectador: 13,
    id_venta: 13,
    calificacion: 3,
    texto_libre: "Buena historia, aunque el 3D no aporta tanto en esta película.",
    fecha: new Date("2026-10-18T09:00:00Z")
  },
  {
    id_pelicula: 4,
    id_espectador: 14,
    id_venta: 14,
    calificacion: 5,
    texto_libre: "Planeta azul en 3D es otra experiencia. Muy recomendada.",
    fecha: new Date("2026-10-18T13:00:00Z")
  },
  {
    id_pelicula: 5,
    id_espectador: 15,
    id_venta: 15,
    calificacion: 2,
    texto_libre: "Mucha gente usando el celular durante la función y nadie dijo nada.",
    fecha: new Date("2026-10-18T17:00:00Z")
  },
  {
    id_pelicula: 6,
    id_espectador: 16,
    id_venta: 16,
    calificacion: 4,
    texto_libre: "El 3D en las escenas de persecución quedó muy bien.",
    fecha: new Date("2026-10-18T21:00:00Z")
  },
  {
    id_pelicula: 7,
    id_espectador: 17,
    id_venta: 17,
    calificacion: 5,
    texto_libre: "La experiencia 4D con viento y movimiento fue muy divertida.",
    fecha: new Date("2026-10-18T13:00:00Z"),
    respuesta_empresa: "¡Gracias! Nos alegra que hayas disfrutado la sala 4D.",
    etiquetas: ["4D", "familia"]
  },
  {
    id_pelicula: 8,
    id_espectador: 18,
    id_venta: 18,
    calificacion: 3,
    texto_libre: "La butaca se movía demasiado para mi gusto, pero la película es buena.",
    fecha: new Date("2026-10-18T17:00:00Z")
  },
  {
    id_pelicula: 9,
    id_espectador: 19,
    id_venta: 19,
    calificacion: 4,
    texto_libre: "El 4D suma tensión a una película que ya es de miedo.",
    fecha: new Date("2026-10-18T21:00:00Z")
  },
  {
    id_pelicula: 10,
    id_espectador: 20,
    id_venta: 20,
    calificacion: 5,
    texto_libre: "Increíble en 4D. El agua en la escena del río fue un detalle genial.",
    fecha: new Date("2026-10-19T01:00:00Z"),
    etiquetas: ["4D"]
  },
  {
    id_pelicula: 1,
    id_espectador: 21,
    id_venta: 21,
    calificacion: 4,
    texto_libre: "Segunda vez que la veo y sigue gustándome igual.",
    fecha: new Date("2026-10-19T17:00:00Z")
  },
  {
    id_pelicula: 2,
    id_espectador: 22,
    id_venta: 22,
    calificacion: 2,
    texto_libre: "La función empezó veinte minutos tarde y no dieron explicación.",
    fecha: new Date("2026-10-19T21:00:00Z")
  },
  {
    id_pelicula: 3,
    id_espectador: 23,
    id_venta: 23,
    calificacion: 4,
    texto_libre: "Buen ritmo y buenas actuaciones. La recomiendo.",
    fecha: new Date("2026-10-20T01:00:00Z"),
    respuesta_empresa: "Gracias por tu reseña."
  },
  {
    id_pelicula: 4,
    id_espectador: 24,
    id_venta: 24,
    calificacion: 3,
    texto_libre: "Correcta, sin más. El documental se hace un poco largo.",
    fecha: new Date("2026-10-20T05:00:00Z")
  },
  {
    id_pelicula: 5,
    id_espectador: 25,
    id_venta: 25,
    calificacion: 1,
    texto_libre: "Proyección con cortes de imagen. Pedimos ayuda y tardaron mucho.",
    fecha: new Date("2026-10-19T21:00:00Z"),
    etiquetas: ["queja", "proyeccion"]
  },
  {
    id_pelicula: 6,
    id_espectador: 26,
    id_venta: 26,
    calificacion: 5,
    texto_libre: "Me encantó el giro final. La mejor película colombiana del año.",
    fecha: new Date("2026-10-20T01:00:00Z"),
    contiene_spoilers: true
  },
  {
    id_pelicula: 7,
    id_espectador: 27,
    id_venta: 27,
    calificacion: 4,
    texto_libre: "Tierna y divertida. Ideal para ver con amigos.",
    fecha: new Date("2026-10-20T05:00:00Z")
  },
  {
    id_pelicula: 8,
    id_espectador: 28,
    id_venta: 28,
    calificacion: 2,
    texto_libre: "La sala estaba muy fría durante toda la película.",
    fecha: new Date("2026-10-20T09:00:00Z"),
    respuesta_empresa: "Gracias por avisarnos, ya ajustamos la climatización de la sala 8."
  },
  {
    id_pelicula: 9,
    id_espectador: 29,
    id_venta: 29,
    calificacion: 5,
    texto_libre: "Sombras de medianoche me dejó pensando varios días. Excelente.",
    fecha: new Date("2026-10-20T01:00:00Z")
  },
  {
    id_pelicula: 10,
    id_espectador: 30,
    id_venta: 30,
    calificacion: 3,
    texto_libre: "Entretenida, aunque algunas escenas se alargan más de la cuenta.",
    fecha: new Date("2026-10-18T23:00:00Z")
  }
]);

//Colección de reportes de incidentes
// El reporte k ocurre en la función k y en su sala. id_staff va de 1 a 5.
// En algunas quejas se guarda el espectador y su venta.
db.reportes_incidentes.insertMany([
  {
    id_sala: 1,
    id_funcion: 1,
    id_staff: 1,
    tipo_incidente: "Falla técnica",
    detalles_especificos: {
      equipo: "Sistema de sonido",
      descripcion: "Alerta de volumen alto durante el clímax de la película.",
      minutos_fuera_servicio: 0,
      funcion_reprogramada: false
    },
    fecha_reporte: new Date("2026-10-16T15:30:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 2,
    id_funcion: 2,
    id_staff: 2,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Taquilla", descripcion: "Larga fila de espectadores buscando entradas para la función de estreno." },
    fecha_reporte: new Date("2026-10-16T18:50:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 3,
    id_funcion: 3,
    id_staff: 3,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: {
      zona: "Pasillo central",
      descripcion: "Espectador grabando fragmentos de la proyección con un celular.",
      autoridades_notificadas: false,
      accion_tomada: "Se pidió borrar el video"
    },
    fecha_reporte: new Date("2026-10-16T22:10:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 4,
    id_funcion: 4,
    id_staff: 4,
    tipo_incidente: "Falla técnica",
    detalles_especificos: {
      equipo: "Proyector",
      descripcion: "Retraso en la sincronización de subtítulos al inicio de la función.",
      minutos_fuera_servicio: 6,
      funcion_reprogramada: false
    },
    fecha_reporte: new Date("2026-10-17T01:30:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 5,
    id_funcion: 5,
    id_staff: 5,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Confitería", descripcion: "Falta de vasos coleccionables de la película." },
    fecha_reporte: new Date("2026-10-16T15:30:00Z"),
    estado: "en_proceso"
  },
  {
    id_sala: 6,
    id_funcion: 6,
    id_staff: 1,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: {
      zona: "Entrada principal",
      descripcion: "Discusión entre dos espectadores por puestos asignados.",
      autoridades_notificadas: false
    },
    fecha_reporte: new Date("2026-10-16T18:50:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 7,
    id_funcion: 7,
    id_staff: 2,
    tipo_incidente: "Falla técnica",
    detalles_especificos: {
      equipo: "Climatización",
      descripcion: "El aire acondicionado dejó de funcionar a mitad de la función.",
      minutos_fuera_servicio: 0,
      funcion_reprogramada: false
    },
    fecha_reporte: new Date("2026-10-16T22:10:00Z"),
    estado: "en_proceso"
  },
  {
    id_sala: 8,
    id_funcion: 8,
    id_staff: 3,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Sala", descripcion: "Sala fría durante toda la función.", compensacion: "Bono de confitería" },
    fecha_reporte: new Date("2026-10-17T01:30:00Z"),
    estado: "cerrado",
    id_espectador: 8,
    id_venta: 8
  },
  {
    id_sala: 9,
    id_funcion: 9,
    id_staff: 4,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: {
      zona: "Parqueadero",
      descripcion: "Vehículo con vidrio roto reportado al salir de la función.",
      autoridades_notificadas: true,
      numero_denuncia: "DEN-2026-10-0412"
    },
    fecha_reporte: new Date("2026-10-16T15:30:00Z"),
    estado: "en_proceso"
  },
  {
    id_sala: 10,
    id_funcion: 10,
    id_staff: 5,
    tipo_incidente: "Falla técnica",
    detalles_especificos: {
      equipo: "Iluminación",
      descripcion: "Las luces de la sala se encendieron diez minutos antes del final.",
      minutos_fuera_servicio: 0
    },
    fecha_reporte: new Date("2026-10-16T18:50:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 11,
    id_funcion: 11,
    id_staff: 1,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: {
      area: "Atención al cliente",
      descripcion: "El espectador pidió cambio de función y no le dieron respuesta clara."
    },
    fecha_reporte: new Date("2026-10-17T22:10:00Z"),
    estado: "abierto",
    id_espectador: 11
  },
  {
    id_sala: 12,
    id_funcion: 12,
    id_staff: 2,
    tipo_incidente: "Falla técnica",
    detalles_especificos: {
      equipo: "Proyector",
      descripcion: "Imagen 3D desalineada; el modulador perdió la calibración.",
      minutos_fuera_servicio: 15,
      funcion_reprogramada: false
    },
    fecha_reporte: new Date("2026-10-18T01:30:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 13,
    id_funcion: 13,
    id_staff: 3,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: { zona: "Sala 13", descripcion: "Objeto olvidado (morral) revisado por seguridad.", autoridades_notificadas: false },
    fecha_reporte: new Date("2026-10-17T15:30:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 14,
    id_funcion: 14,
    id_staff: 4,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Sala", descripcion: "Gafas 3D rayadas entregadas en la entrada.", compensacion: "Boleta de cortesía" },
    fecha_reporte: new Date("2026-10-17T18:50:00Z"),
    estado: "cerrado",
    id_espectador: 14,
    id_venta: 14
  },
  {
    id_sala: 15,
    id_funcion: 15,
    id_staff: 5,
    tipo_incidente: "Falla técnica",
    detalles_especificos: {
      equipo: "Pantalla",
      descripcion: "Mancha visible en la esquina inferior de la pantalla.",
      minutos_fuera_servicio: 0
    },
    fecha_reporte: new Date("2026-10-17T22:10:00Z"),
    estado: "abierto"
  },
  {
    id_sala: 16,
    id_funcion: 16,
    id_staff: 1,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: {
      zona: "Escaleras",
      descripcion: "Espectador resbaló en la escalera de salida; se le prestaron primeros auxilios.",
      autoridades_notificadas: false,
      personas_involucradas: 1
    },
    fecha_reporte: new Date("2026-10-18T01:30:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 17,
    id_funcion: 17,
    id_staff: 2,
    tipo_incidente: "Falla técnica",
    detalles_especificos: {
      equipo: "Butacas 4D",
      descripcion: "Tres butacas de la fila C no se movieron durante la función.",
      minutos_fuera_servicio: 0,
      butacas_afectadas: ["C04", "C05", "C06"]
    },
    fecha_reporte: new Date("2026-10-17T15:30:00Z"),
    estado: "en_proceso"
  },
  {
    id_sala: 18,
    id_funcion: 18,
    id_staff: 3,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Sala", descripcion: "El movimiento de las butacas 4D causó mareo a un espectador." },
    fecha_reporte: new Date("2026-10-17T18:50:00Z"),
    estado: "cerrado",
    id_espectador: 18
  },
  {
    id_sala: 19,
    id_funcion: 19,
    id_staff: 4,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: {
      zona: "Sala 19",
      descripcion: "Alarma de humo activada por la máquina de niebla 4D.",
      autoridades_notificadas: false,
      evacuacion: true
    },
    fecha_reporte: new Date("2026-10-17T22:10:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 20,
    id_funcion: 20,
    id_staff: 5,
    tipo_incidente: "Falla técnica",
    detalles_especificos: {
      equipo: "Butacas 4D",
      descripcion: "Fuga de agua en el sistema de efectos de la sala 20.",
      minutos_fuera_servicio: 45,
      funcion_reprogramada: true
    },
    fecha_reporte: new Date("2026-10-18T01:30:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 1,
    id_funcion: 21,
    id_staff: 1,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Baños", descripcion: "Baños del segundo piso sin papel durante la tarde." },
    fecha_reporte: new Date("2026-10-18T15:30:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 2,
    id_funcion: 22,
    id_staff: 2,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: {
      area: "Taquilla",
      descripcion: "La función empezó veinte minutos tarde sin explicación.",
      compensacion: "Boleta de cortesía"
    },
    fecha_reporte: new Date("2026-10-18T18:50:00Z"),
    estado: "cerrado",
    id_espectador: 22,
    id_venta: 22
  },
  {
    id_sala: 3,
    id_funcion: 23,
    id_staff: 3,
    tipo_incidente: "Falla técnica",
    detalles_especificos: {
      equipo: "Sistema de sonido",
      descripcion: "Canal izquierdo sin audio durante los primeros minutos.",
      minutos_fuera_servicio: 4
    },
    fecha_reporte: new Date("2026-10-18T22:10:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 4,
    id_funcion: 24,
    id_staff: 4,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: { zona: "Confitería", descripcion: "Intento de pago con billete falso.", autoridades_notificadas: true },
    fecha_reporte: new Date("2026-10-19T01:30:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 5,
    id_funcion: 25,
    id_staff: 5,
    tipo_incidente: "Falla técnica",
    detalles_especificos: {
      equipo: "Proyector",
      descripcion: "Cortes de imagen intermitentes; se cambió la lámpara.",
      minutos_fuera_servicio: 25,
      funcion_reprogramada: false
    },
    fecha_reporte: new Date("2026-10-18T15:30:00Z"),
    estado: "en_proceso"
  },
  {
    id_sala: 6,
    id_funcion: 26,
    id_staff: 1,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Atención al cliente", descripcion: "Demora en la atención cuando se reportó la falla del proyector." },
    fecha_reporte: new Date("2026-10-18T18:50:00Z"),
    estado: "abierto",
    id_espectador: 26,
    id_venta: 26
  },
  {
    id_sala: 7,
    id_funcion: 27,
    id_staff: 2,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: {
      zona: "Sala 7",
      descripcion: "Menor de edad sin acompañante en función para todo público; se ubicó a su familia.",
      autoridades_notificadas: false
    },
    fecha_reporte: new Date("2026-10-18T22:10:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 8,
    id_funcion: 28,
    id_staff: 3,
    tipo_incidente: "Falla técnica",
    detalles_especificos: { equipo: "Climatización", descripcion: "Temperatura de la sala por debajo de 17 °C.", minutos_fuera_servicio: 0 },
    fecha_reporte: new Date("2026-10-19T01:30:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 9,
    id_funcion: 29,
    id_staff: 4,
    tipo_incidente: "Incidente de seguridad",
    detalles_especificos: {
      zona: "Entrada principal",
      descripcion: "Persona intentó ingresar sin boleta durante la función de medianoche.",
      autoridades_notificadas: false
    },
    fecha_reporte: new Date("2026-10-18T15:30:00Z"),
    estado: "cerrado"
  },
  {
    id_sala: 10,
    id_funcion: 30,
    id_staff: 5,
    tipo_incidente: "Queja de servicio",
    detalles_especificos: { area: "Confitería", descripcion: "Cobro doble en la compra de combo con tarjeta." },
    fecha_reporte: new Date("2026-10-18T18:50:00Z"),
    estado: "en_proceso",
    id_espectador: 30,
    id_venta: 30
  }
]);

print("Documentos cargados:");
print("- fichas_tecnicas_peliculas: " + db.fichas_tecnicas_peliculas.countDocuments());
print("- requisitos_proyeccion: " + db.requisitos_proyeccion.countDocuments());
print("- resenas_peliculas: " + db.resenas_peliculas.countDocuments());
print("- reportes_incidentes: " + db.reportes_incidentes.countDocuments());
