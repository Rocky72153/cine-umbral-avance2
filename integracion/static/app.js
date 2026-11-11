"use strict";

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const state = { peliculas: [], funciones: [], catalogos: {}, salas: [] };
const node = (tag, text, cls) => {
  const element = document.createElement(tag);
  if (text !== undefined && text !== null) element.textContent = String(text);
  if (cls) element.className = cls;
  return element;
};
const fecha = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? String(value) :
    new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: /^\d{4}-\d{2}-\d{2}$/.test(value) ? "UTC" : "America/Bogota" }).format(parsed);
};
const money = (value) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(value));
function feedback(selector, message, error = false) {
  const el = $(selector); el.textContent = message; el.classList.toggle("error", error);
}
async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(path, { ...options, headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers } });
  } catch (_) { throw new Error("No hay conexión con la aplicación."); }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "No fue posible completar la operación.");
  return data;
}
const post = (path, data) => api(path, { method: "POST", body: JSON.stringify(data) });
function showView(id) {
  $$(".view").forEach(el => { el.hidden = el.id !== id; });
  $$(".nav-button").forEach(el => {
    const active = el.dataset.target === id;
    el.classList.toggle("active", active);
    if (active) el.setAttribute("aria-current", "page"); else el.removeAttribute("aria-current");
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (id === "gestion") loadIncidentes();
}
$$(".nav-button").forEach(button => button.addEventListener("click", () => showView(button.dataset.target)));
$("#explorar").addEventListener("click", () => $("#catalogo").scrollIntoView({ behavior: "smooth" }));

function renderPeliculas() {
  const term = $("#buscar").value.trim().toLocaleLowerCase("es");
  const matches = state.peliculas.filter(p => p.titulo.toLocaleLowerCase("es").includes(term));
  const list = $("#peliculas-lista"); list.replaceChildren();
  $("#peliculas-count").textContent = state.peliculas.length + " películas registradas";
  if (!matches.length) { feedback("#peliculas-estado", term ? "No encontramos películas con ese nombre." : "No hay películas registradas."); return; }
  feedback("#peliculas-estado", "");
  for (const p of matches) {
    const card = node("article", null, "movie-card");
    const art = node("div", null, "movie-art"); art.setAttribute("aria-hidden", "true");
    art.append(node("span", "CINE BOGOTÁ"), node("span", "Nº " + String(p.id_pelicula).padStart(2, "0")));
    const body = node("div", null, "movie-body");
    body.append(node("h3", p.titulo), node("p", [p.anio, p.duracion + " min", p.pais_origen].filter(Boolean).join("  ·  "), "movie-meta"));
    const button = node("button", "Ver película  ↗", "movie-action"); button.type = "button";
    button.addEventListener("click", () => showPelicula(p.id_pelicula));
    body.append(button); card.append(art, body); list.append(card);
  }
}
$("#buscar").addEventListener("input", renderPeliculas);
async function loadPeliculas() {
  feedback("#peliculas-estado", "Cargando películas...");
  try { const data = await api("/api/peliculas"); state.peliculas = data.peliculas; renderPeliculas(); }
  catch (err) { $("#peliculas-count").textContent = "Catálogo no disponible"; feedback("#peliculas-estado", err.message, true); }
}

const dialog = $("#detalle-dialog"), detail = $("#detalle-contenido");
$("#cerrar-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
function openDetail(message) {
  detail.replaceChildren(node("p", message, "detail-line"));
  if (!dialog.open) dialog.showModal();
}
function detailSection(title) {
  const section = node("section", null, "detail-section"); section.append(node("h3", title)); detail.append(section); return section;
}
function createSelect(source, placeholder) {
  const select = node("select"); select.required = true;
  select.append(new Option(placeholder, ""));
  for (const item of source) select.append(new Option(item.nombre, item.id));
  return select;
}
function labelled(label, control) { const el = node("label", label); el.append(control); return el; }
async function showPelicula(id) {
  openDetail("Cargando información de la película...");
  try {
    const data = await api("/api/peliculas/" + id);
    detail.replaceChildren(node("h2", data.pelicula.titulo, "dialog-title"),
      node("p", [data.pelicula.anio, data.pelicula.duracion + " min", data.pelicula.pais_origen].filter(Boolean).join("  ·  "), "detail-line"));
    const versions = detailSection("Versiones y ficha técnica");
    if (!data.fichas_tecnicas.length) versions.append(node("p", "Aún no hay fichas técnicas para esta película.", "detail-line"));
    for (const f of data.fichas_tecnicas) {
      const line = node("p", null, "detail-line");
      line.append(node("strong", f.version?.formato || "Versión"),
        document.createTextNode(" · " + (f.version?.duracion_minutos || "—") + " min · Audio: " + (f.idiomas_audio || []).join(", ") + " · Subtítulos: " + ((f.subtitulos || []).join(", ") || "Sin registrar")));
      versions.append(line);
    }
    const cast = data.fichas_tecnicas[0]?.elenco || [];
    if (cast.length) { const section = detailSection("Elenco"); section.append(node("p", cast.map(x => x.nombre + " (" + x.rol_en_pelicula + ")").join(" · "), "detail-line")); }
    const reviews = detailSection("Reseñas");
    if (!data.resenas.length) reviews.append(node("p", "Todavía no hay reseñas.", "detail-line"));
    for (const r of data.resenas) {
      const review = node("div", null, "review");
      review.append(node("span", "★".repeat(Math.min(5, Math.max(0, Number(r.calificacion) || 0))) + "  " + fecha(r.fecha), "stars"), node("p", r.texto));
      if (r.respuesta_empresa?.mensaje) review.append(node("p", "Respuesta del cine: " + r.respuesta_empresa.mensaje, "detail-line"));
      reviews.append(review);
    }
    const section = detailSection("Escribir una reseña"), form = node("form", null, "stack");
    const viewer = createSelect(state.catalogos.espectadores || [], "Selecciona un espectador");
    const rating = createSelect([1,2,3,4,5].map(x => ({ id: x, nombre: x + (x === 1 ? " estrella" : " estrellas") })), "Selecciona una calificación");
    const comment = node("textarea"); comment.required = true; comment.maxLength = 1000; comment.rows = 3;
    const status = node("p", "", "feedback"); status.setAttribute("role", "status");
    const submit = node("button", "Publicar reseña ↗", "button button-primary"); submit.type = "submit";
    form.append(labelled("Espectador", viewer), labelled("Calificación", rating), labelled("Comentario", comment), status, submit);
    form.addEventListener("submit", async event => {
      event.preventDefault(); submit.disabled = true; status.textContent = "Guardando...";
      try { await post("/api/peliculas/" + id + "/resenas", { id_espectador: viewer.value, calificacion: rating.value, texto: comment.value }); await showPelicula(id); }
      catch (err) { status.textContent = err.message; status.classList.add("error"); }
      finally { submit.disabled = false; }
    });
    section.append(form);
  } catch (err) { detail.replaceChildren(node("p", err.message, "feedback error")); }
}

function renderFunciones() {
  const list = $("#funciones-lista"); list.replaceChildren();
  if (!state.funciones.length) { feedback("#funciones-estado", "No hay funciones registradas."); return; }
  feedback("#funciones-estado", "");
  for (const f of state.funciones) {
    const row = node("article", null, "schedule-row");
    const movie = node("div"); movie.append(node("h3", f.titulo), node("p", "Función #" + f.id_funcion));
    const time = node("div"); time.append(node("strong", f.hora_inicio), node("p", "a " + f.hora_fin));
    const sala = node("div"); sala.append(node("strong", "Sala " + f.id_sala), node("p", f.formato));
    const button = node("button", "Ver requisitos ↗", "text-button"); button.type = "button";
    button.addEventListener("click", () => showRequisitos(f));
    row.append(node("span", fecha(f.fecha), "schedule-date"), movie, time, sala, button); list.append(row);
  }
}
async function showRequisitos(f) {
  openDetail("Cargando requisitos...");
  try {
    const data = await api("/api/funciones/" + f.id_funcion + "/requisitos");
    detail.replaceChildren(node("h2", f.titulo, "dialog-title"),
      node("p", fecha(f.fecha) + " · " + f.hora_inicio + " · Sala " + f.id_sala, "detail-line"));
    const section = detailSection("Requisitos de proyección"), r = data.requisitos;
    if (!r) { section.append(node("p", "No hay requisitos registrados para esta función.", "detail-line")); return; }
    section.append(node("p", [r.proyeccion?.formato, r.proyeccion?.resolucion, r.proyeccion?.audio].filter(Boolean).join(" · "), "detail-line"));
    for (const item of r.requerimientos || []) section.append(node("p", item.codigo + " · " + item.estado.replaceAll("_", " ") + (item.detalle ? " — " + item.detalle : ""), "detail-line"));
  } catch (err) { detail.replaceChildren(node("p", err.message, "feedback error")); }
}
async function loadFunciones() {
  feedback("#funciones-estado", "Cargando funciones...");
  try { state.funciones = (await api("/api/funciones")).funciones; renderFunciones(); fillSelects(); }
  catch (err) { feedback("#funciones-estado", err.message, true); }
}

function fillSelects() {
  $$("select[data-source]").forEach(select => {
    const previous = select.value, source = select.dataset.source;
    const options = source === "funciones" ? state.funciones.map(f => ({ id: f.id_funcion, nombre: "#" + f.id_funcion + " · " + f.titulo + " · " + fecha(f.fecha) + " " + f.hora_inicio })) :
      source === "peliculas" ? state.peliculas.map(p => ({ id: p.id_pelicula, nombre: p.titulo })) :
      source === "salas" ? state.salas.map(s => ({ id: s.id_sala, nombre: "Sala " + s.id_sala + " · " + s.estado })) : (state.catalogos[source] || []);
    while (select.options.length > 1) select.remove(1);
    options.forEach(item => select.append(new Option(item.nombre, item.id)));
    select.value = previous || "";
  });
}
async function loadCatalogos() {
  try { state.catalogos = await api("/api/catalogos"); state.salas = (await api("/api/salas")).salas; fillSelects(); }
  catch (err) { feedback("#venta-estado", err.message, true); }
}
function ticketRow() {
  const row = node("div", null, "ticket-row");
  const seat = node("input"); seat.required = true; seat.maxLength = 10; seat.placeholder = "Ej. A05"; seat.className = "asiento";
  const type = createSelect(state.catalogos.tipos_boleta || [], "Selecciona tipo"); type.className = "tipo";
  const price = node("input"); price.type = "number"; price.required = true; price.step = "0.01"; price.placeholder = "Ej. 18000"; price.className = "precio";
  const remove = node("button", "Quitar", "remove-ticket"); remove.type = "button";
  remove.addEventListener("click", () => { if ($$(".ticket-row").length > 1) row.remove(); });
  row.append(labelled("Asiento", seat), labelled("Tipo de boleta", type), labelled("Precio (COP)", price), remove);
  $("#boletas-lista").append(row);
}
$("#agregar-boleta").addEventListener("click", () => {
  if ($$(".ticket-row").length < 20) ticketRow(); else feedback("#venta-estado", "Puedes agregar hasta 20 boletas.", true);
});
$("#venta-form").addEventListener("submit", async event => {
  event.preventDefault(); const form = event.currentTarget, data = Object.fromEntries(new FormData(form));
  data.boletas = $$(".ticket-row", form).map(row => ({ asiento: $(".asiento", row).value, id_tipo_boleta: $(".tipo", row).value, precio: $(".precio", row).value }));
  const button = $('button[type="submit"]', form); button.disabled = true; feedback("#venta-estado", "Registrando venta...");
  try { const result = await post("/api/ventas", data); feedback("#venta-estado", "Venta registrada correctamente. Número: " + result.id_venta); form.reset(); $("#boletas-lista").replaceChildren(); ticketRow(); }
  catch (err) { feedback("#venta-estado", err.message, true); } finally { button.disabled = false; }
});
$("#reporte-form").addEventListener("submit", async event => {
  event.preventDefault(); const form = event.currentTarget, params = new URLSearchParams(new FormData(form));
  const body = $("#reporte-tabla tbody"); body.replaceChildren(); $("#reporte-tabla").hidden = true; feedback("#reporte-estado", "Consultando...");
  try {
    const rows = (await api("/api/reportes/ventas?" + params)).reporte;
    if (!rows.length) { feedback("#reporte-estado", "No hay funciones en ese rango."); return; }
    rows.forEach(r => { const tr = node("tr"); [r.id_funcion, r.titulo, fecha(r.fecha), r.hora_inicio, r.id_sala, r.capacidad, r.cantidad_ventas, r.cantidad_boletas, money(r.recaudo)].forEach(v => tr.append(node("td", v))); body.append(tr); });
    $("#reporte-tabla").hidden = false; feedback("#reporte-estado", rows.length + " funciones encontradas.");
  } catch (err) { feedback("#reporte-estado", err.message, true); }
});
$("#sala-form").addEventListener("submit", async event => {
  event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget));
  const button = $('button[type="submit"]', event.currentTarget); button.disabled = true;
  try { const result = await post("/api/salas/" + data.id_sala + "/estado", { id_estado_sala: data.id_estado_sala }); feedback("#sala-estado", result.mensaje); state.salas = (await api("/api/salas")).salas; fillSelects(); }
  catch (err) { feedback("#sala-estado", err.message, true); } finally { button.disabled = false; }
});
$("#incidente-form").addEventListener("submit", async event => {
  event.preventDefault(); const form = event.currentTarget;
  const button = $('button[type="submit"]', form); button.disabled = true;
  try { const result = await post("/api/incidentes", Object.fromEntries(new FormData(form))); feedback("#incidente-estado", result.mensaje); form.reset(); loadIncidentes(); }
  catch (err) { feedback("#incidente-estado", err.message, true); } finally { button.disabled = false; }
});
async function loadIncidentes() {
  feedback("#incidentes-estado", "Cargando incidentes...");
  try {
    const list = $("#incidentes-lista"), rows = (await api("/api/incidentes")).incidentes; list.replaceChildren();
    if (!rows.length) { feedback("#incidentes-estado", "No hay incidentes registrados."); return; }
    feedback("#incidentes-estado", "");
    rows.forEach(r => { const el = node("div", null, "incident"); el.append(node("strong", r.tipo + " · " + r.severidad), node("p", r.descripcion), node("small", "Función " + r.id_funcion + " · Sala " + r.id_sala + " · " + fecha(r.fecha))); list.append(el); });
  } catch (err) { feedback("#incidentes-estado", err.message, true); }
}
$("#recargar-incidentes").addEventListener("click", loadIncidentes);

function adminForm(id, endpoint, refresh) {
  $(id).addEventListener("submit", async event => {
    event.preventDefault();
    const form = event.currentTarget, data = Object.fromEntries(new FormData(form));
    const button = $('button[type="submit"], button:not([type])', form);
    const status = "#" + form.id + "-estado";
    button.disabled = true; feedback(status, "Guardando...");
    try {
      const result = await post(endpoint(data), data);
      form.reset(); feedback(status, result.mensaje);
      if (refresh) await refresh();
    } catch (err) { feedback(status, err.message, true); }
    finally { button.disabled = false; }
  });
}
adminForm("#funcion-form", () => "/api/funciones", loadFunciones);
adminForm("#capacidad-form", d => "/api/salas/" + d.id_sala + "/capacidad", loadCatalogos);
adminForm("#staff-form", () => "/api/staff", loadCatalogos);
adminForm("#contrato-form", () => "/api/contratos");
adminForm("#staff-estado-form", d => "/api/staff/" + d.id_staff + "/estado", loadCatalogos);
adminForm("#correo-form", d => "/api/espectadores/" + d.id_espectador + "/correo");
Promise.all([loadPeliculas(), loadFunciones(), loadCatalogos()]).then(() => { fillSelects(); ticketRow(); });
