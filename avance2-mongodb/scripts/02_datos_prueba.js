// Semillas sintéticas compatibles con los IDs de avance1-postgresql/scripts/02_datos_prueba.sql.
// Usa replace/upsert por _id: es repetible y no elimina registros ajenos a esta semilla.
const cineDB = db.getSiblingDB("cine_bogota_avance2");

const peliculas = [
  { id: 1, titulo: "La ciudad de los sueños", duracion: 110, anio: 2022, pais: "Colombia", clasificacion: 1 },
  { id: 2, titulo: "Misión en la montaña", duracion: 125, anio: 2021, pais: "Estados Unidos", clasificacion: 3 },
  { id: 3, titulo: "El último viaje", duracion: 98, anio: 2020, pais: "España", clasificacion: 2 },
  { id: 4, titulo: "Planeta azul", duracion: 105, anio: 2024, pais: "Reino Unido", clasificacion: 1 },
  { id: 5, titulo: "La casa del bosque", duracion: 115, anio: 2023, pais: "México", clasificacion: 4 },
  { id: 6, titulo: "Código secreto", duracion: 130, anio: 2025, pais: "Colombia", clasificacion: 3 },
  { id: 7, titulo: "Amigos para siempre", duracion: 95, anio: 2019, pais: "Argentina", clasificacion: 1 },
  { id: 8, titulo: "La órbita perdida", duracion: 122, anio: 2026, pais: "Canadá", clasificacion: 2 },
  { id: 9, titulo: "Sombras de medianoche", duracion: 108, anio: 2022, pais: "Chile", clasificacion: 5 },
  { id: 10, titulo: "Aventura en el tiempo", duracion: 118, anio: 2024, pais: "Colombia", clasificacion: 3 }
];

const clasificaciones = {
  1: "Todo público",
  2: "Mayores de 7 años",
  3: "Mayores de 12 años",
  4: "Mayores de 15 años",
  5: "Mayores de 18 años"
};

const codigosPais = {
  "Colombia": "CO",
  "Estados Unidos": "US",
  "España": "ES",
  "Reino Unido": "GB",
  "México": "MX",
  "Argentina": "AR",
  "Canadá": "CA",
  "Chile": "CL"
};

const personas = {
  1: ["Sofía Isabel Ramírez Vargas", "actuacion"],
  2: ["Mateo Cárdenas Ruiz", "actuacion"],
  3: ["Valeria Lucía Moreno Gil", "direccion"],
  4: ["Samuel Herrera Castro", "actuacion"],
  5: ["Isabella María Rojas Pineda", "actuacion"],
  6: ["Daniel Navarro León", "direccion"],
  7: ["Mariana Paola Silva Mendoza", "actuacion"],
  8: ["Sebastián Ortega Cruz", "actuacion"],
  9: ["Camila Andrea Vega Salazar", "direccion"],
  10: ["Nicolás Molina Reyes", "actuacion"],
  11: ["Gabriela Elena Castillo Lara", "actuacion"],
  12: ["Tomás Aguilar Soto", "direccion"],
  13: ["Luciana Isabel Peña Acosta", "actuacion"],
  14: ["Emiliano Navarrete Ríos", "actuacion"],
  15: ["Julieta Fernanda Campos Mejía", "direccion"],
  16: ["Thiago Fuentes Romero", "actuacion"],
  17: ["Antonella María Pardo Luna", "actuacion"],
  18: ["Gabriel Méndez Ibarra", "direccion"],
  19: ["Manuela Sofía Cortés Núñez", "actuacion"],
  20: ["Alejandro Reyes Montoya", "actuacion"],
  21: ["Renata Isabel Duarte Vidal", "direccion"],
  22: ["Benjamín Ocampo Prieto", "actuacion"],
  23: ["Paula Andrea Londoño Cañas", "actuacion"],
  24: ["Joaquín Salinas Bravo", "direccion"],
  25: ["Mía Valentina Cabrera Roldán", "actuacion"],
  26: ["Esteban Correa Mora", "actuacion"],
  27: ["Abril Lucía Serrano Paz", "direccion"],
  28: ["Maximiliano Patiño Arias", "actuacion"],
  29: ["Elisa María Bustos Quintero", "actuacion"],
  30: ["Franco Beltrán Suárez", "direccion"]
};

const variantes = [
  { codigo: "2D", formato: "2D Digital", extraMinutos: 0 },
  { codigo: "3D", formato: "3D", extraMinutos: 0 },
  { codigo: "4D", formato: "4D", extraMinutos: 2 }
];

const fichas = [];
for (const pelicula of peliculas) {
  const idsElenco = [pelicula.id, pelicula.id + 10, pelicula.id + 20];
  for (const variante of variantes) {
    const paisOrigen = codigosPais[pelicula.pais];
    const clasificacionesPorPais = [{
      pais: "CO",
      sistema: "Catálogo Cine Bogotá (avance1)",
      etiqueta: clasificaciones[pelicula.clasificacion],
      id_clasificacion_pelicula: pelicula.clasificacion
    }];
    if (paisOrigen !== "CO") {
      clasificacionesPorPais.push({
        pais: paisOrigen,
        sistema: `Sistema local de ${pelicula.pais}`,
        etiqueta: "Pendiente de homologación (dato de prueba)"
      });
    }

    fichas.push({
      _id: `FT-P${String(pelicula.id).padStart(2, "0")}-V${variante.codigo}`,
      id_pelicula: pelicula.id,
      titulo: pelicula.titulo,
      id_clasificacion_pelicula: pelicula.clasificacion,
      pais_origen: pelicula.pais,
      version: {
        codigo: variante.codigo,
        formato: variante.formato,
        duracion_minutos: pelicula.duracion + variante.extraMinutos
      },
      elenco: idsElenco.map((idActor) => ({
        id_actor_director: idActor,
        nombre: personas[idActor][0],
        rol_en_pelicula: personas[idActor][1]
      })),
      idiomas_audio: ["es-CO", "en-US"],
      subtitulos: pelicula.id % 2 === 0 ? ["es-CO", "en-US"] : ["es-CO"],
      clasificaciones_por_pais: clasificacionesPorPais,
      actualizado_en: new Date("2026-11-09T12:00:00Z")
    });
  }
}

const horasPorFuncion = [10, 13, 16, 19];
const requisitosPorFuncion = [];
for (let idFuncion = 1; idFuncion <= 30; idFuncion++) {
  const idPelicula = ((idFuncion - 1) % 10) + 1;
  const idSala = idFuncion <= 20 ? idFuncion : idFuncion - 20;
  const formato = idSala <= 10 ? "2D Digital" : (idSala <= 16 ? "3D" : "4D");
  const hora = horasPorFuncion[(idFuncion - 1) % 4];
  const fecha = new Date(Date.UTC(2026, 9, 16 + Math.floor((idFuncion - 1) / 10), hora));
  const requerimientos = [{
    codigo: formato === "2D Digital" ? "PROYECCION_DIGITAL" : `PROYECCION_${formato}`,
    estado: "registrado",
    detalle: `Formato de sala ${idSala} declarado en avance1-postgresql.`,
    obligatorio: true
  }];

  if (idFuncion % 3 === 0) {
    requerimientos.push({ codigo: "SUBTITULADO_ES_CO", estado: "registrado", detalle: "Pista de subtítulos en español de Colombia.", obligatorio: false });
  }
  if (idFuncion === 29) {
    requerimientos.push({ codigo: "DOLBY_ATMOS", estado: "por_validar", detalle: "Perfil de ejemplo; avance1 no registra equipos de audio por sala.", obligatorio: false });
  }
  if (idFuncion === 30) {
    requerimientos.push({ codigo: "IMAX", estado: "por_validar", detalle: "Perfil de ejemplo; avance1 no registra salas IMAX.", obligatorio: false });
  }

  requisitosPorFuncion.push({
    _id: `RP-F${String(idFuncion).padStart(3, "0")}`,
    id_funcion: idFuncion,
    id_pelicula: idPelicula,
    id_sala: idSala,
    fecha_funcion: fecha,
    proyeccion: {
      formato: formato,
      resolucion: formato === "4D" ? "4K" : "2K",
      relacion_aspecto: "2.39:1",
      audio: "Estéreo"
    },
    requerimientos: requerimientos,
    estado_validacion: idFuncion >= 29 ? "pendiente_revision" : "registrado",
    observado_en: new Date("2026-11-09T12:00:00Z")
  });
}

const comentarios = [
  "La historia estuvo muy bien construida.",
  "El sonido y la imagen se sintieron claros.",
  "Me gustó la experiencia de la función.",
  "Buena película para compartir en familia.",
  "La duración fue adecuada para el relato.",
  "Volvería a ver esta película en el cine."
];
const resenas = [];
for (let i = 1; i <= 30; i++) {
  const idPelicula = ((i - 1) % 10) + 1;
  const idEspectador = i;
  const fecha = new Date(Date.UTC(2026, 9, 18 + Math.floor((i - 1) / 10), 14 + (i % 7)));
  resenas.push({
    _id: `RE-${String(i).padStart(4, "0")}`,
    id_pelicula: idPelicula,
    id_espectador: idEspectador,
    calificacion: ((i * 7) % 5) + 1,
    texto: comentarios[(i - 1) % comentarios.length],
    fecha: fecha,
    respuesta_empresa: i % 3 === 0 ? {
      mensaje: "Gracias por compartir tu opinión. La tendremos en cuenta para seguir mejorando.",
      fecha: new Date(fecha.getTime() + 24 * 60 * 60 * 1000)
    } : null
  });
}

const detallesIncidentes = (id, tipo, idSala) => {
  if (tipo === "tecnico") {
    return { equipo: id % 2 === 0 ? "proyector" : "audio", codigo_falla: `TEC-${String(id).padStart(3, "0")}`, ubicacion: `sala-${idSala}` };
  }
  if (tipo === "servicio") {
    return { canal: id % 2 === 0 ? "taquilla" : "confiteria", categoria: "atencion", solicitud: "seguimiento" };
  }
  return { zona: `acceso-sala-${idSala}`, protocolo: `SEG-${String(id).padStart(3, "0")}`, requiere_revision: id % 2 === 0 };
};

const incidentes = [];
const tiposIncidente = ["tecnico", "servicio", "seguridad"];
const severidades = ["baja", "media", "alta", "critica"];
const estados = ["abierto", "en_revision", "cerrado"];
for (let i = 1; i <= 30; i++) {
  const tipo = tiposIncidente[(i - 1) % tiposIncidente.length];
  const idSala = i <= 20 ? i : i - 20;
  const fecha = new Date(Date.UTC(2026, 9, 16 + Math.floor((i - 1) / 10), 20, i % 60));
  incidentes.push({
    _id: `IN-${String(i).padStart(4, "0")}`,
    tipo: tipo,
    id_funcion: i,
    id_sala: idSala,
    id_venta: i % 5 === 0 ? i : null,
    id_espectador: tipo === "servicio" ? i : null,
    fecha: fecha,
    severidad: severidades[(i - 1) % severidades.length],
    estado: estados[(i - 1) % estados.length],
    descripcion: tipo === "tecnico" ? "Registro sintético de revisión técnica." : (tipo === "servicio" ? "Registro sintético de solicitud de servicio." : "Registro sintético para revisión de seguridad."),
    detalles: detallesIncidentes(i, tipo, idSala),
    reportado_por: { tipo: "staff", id_staff: ((i - 1) % 5) + 1 },
    actualizado_en: fecha
  });
}

const conjuntos = [
  ["fichas_tecnicas_peliculas", fichas],
  ["requisitos_proyeccion", requisitosPorFuncion],
  ["resenas_peliculas", resenas],
  ["reportes_incidentes", incidentes]
];

for (const [nombre, documentos] of conjuntos) {
  if (documentos.length < 30) {
    throw new Error(`${nombre} tiene menos de 30 documentos en la semilla: ${documentos.length}`);
  }
  const operaciones = documentos.map((documento) => ({
    replaceOne: {
      filter: { _id: documento._id },
      replacement: documento,
      upsert: true
    }
  }));
  const resultado = cineDB.getCollection(nombre).bulkWrite(operaciones, { ordered: true });
  const idsSemilla = documentos.map((documento) => documento._id);
  const verificados = cineDB.getCollection(nombre).countDocuments({ _id: { $in: idsSemilla } });
  if (verificados !== documentos.length) {
    throw new Error(`Verificación fallida para ${nombre}: ${verificados}/${documentos.length}`);
  }
  print(`${nombre}: ${verificados} documentos de semilla verificados; nuevos=${resultado.upsertedCount}, actualizados=${resultado.modifiedCount}.`);
}

print("Carga idempotente terminada. Los documentos ajenos a esta semilla no se borraron.");
