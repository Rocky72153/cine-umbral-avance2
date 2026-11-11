# Cine Bogotá — Proyecto integrador

El proyecto reúne el núcleo PostgreSQL del avance 1, la capa documental MongoDB y una primera consulta que integra ambos motores. El informe único se entregará por separado.

Las correcciones y pendientes indicados por el profesor se encuentran en [CORRECCIONES_AVANCE1.md](./CORRECCIONES_AVANCE1.md).

## Estructura

```text
Cine Bogotá/
├── avance1-postgresql/               (modelo y scripts SQL)
├── avance2-mongodb/
│   ├── diagrama-arquitectura-poliglota/
│   └── scripts/                      (01, 02 y 03)
├── integracion/                      (API Python)
├── evidencias/
│   ├── postgresql/
│   └── mongodb/
├── README.md
└── REPARTO_AVANCE2.md
```

Las evidencias de ambos motores están reunidas en [`evidencias/`](./evidencias/). MongoDB incluye siete capturas reales y registros `.txt` auxiliares. PostgreSQL conserva sus PNG y tres representaciones SVG anteriores de procedimientos; estas últimas no se presentan como capturas de pantalla.

## Primera integración entre bases

`integracion/app.py` expone una API de lectura con Flask. La lista de películas proviene de PostgreSQL; el detalle busca la película por `Pelicula.id_pelicula` y reúne las fichas y reseñas de MongoDB que tienen ese mismo `id_pelicula`. No modifica ventas ni llama los procedimientos transaccionales del avance 1.

Con Python instalado, ambas bases encendidas y sus scripts de creación y datos ejecutados (para PostgreSQL, en una base vacía, ejecutar `01_creacion_tablas.sql` y `02_datos_prueba.sql`), desde la raíz del repositorio:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r integracion/requirements.txt
$env:POSTGRES_URL = 'postgresql://USUARIO:CLAVE@localhost:5432/cine_bogota'
$env:MONGODB_URI = 'mongodb://localhost:27017'
$env:MONGODB_DATABASE = 'cine_bogota_avance2'
python -m flask --app integracion.app run
```

Sustituye `USUARIO` y `CLAVE` por los de tu instalación sin guardarlos en el repositorio. Visita `http://127.0.0.1:5000/api/peliculas` para el catálogo y `http://127.0.0.1:5000/api/peliculas/1` para un detalle integrado. Si una base no está disponible, la API devuelve un error 503; una película inexistente en PostgreSQL devuelve 404. Es una base de integración de lectura, no una aplicación de ventas ni un despliegue público.

![Diagrama de arquitectura políglota](./avance2-mongodb/diagrama-arquitectura-poliglota/diagrama-arquitectura-poliglota.svg)

[Abrir el diagrama en PNG](./avance2-mongodb/diagrama-arquitectura-poliglota/diagrama-arquitectura-poliglota.png) · [Abrir el SVG editable](./avance2-mongodb/diagrama-arquitectura-poliglota/diagrama-arquitectura-poliglota.svg)

## Ejecución con Docker Desktop

Desde la raíz del repositorio, con Docker Desktop iniciado:

```powershell
docker run -d --name cine-umbral-mongodb -p 27017:27017 mongo:8.0
docker cp .\avance2-mongodb\scripts\01_creacion_colecciones.js cine-umbral-mongodb:/tmp/01_creacion_colecciones.js
docker cp .\avance2-mongodb\scripts\02_datos_prueba.js cine-umbral-mongodb:/tmp/02_datos_prueba.js
docker cp .\avance2-mongodb\scripts\03_consultas.js cine-umbral-mongodb:/tmp/03_consultas.js
docker exec cine-umbral-mongodb mongosh cine_bogota_avance2 --file /tmp/01_creacion_colecciones.js
docker exec cine-umbral-mongodb mongosh cine_bogota_avance2 --file /tmp/02_datos_prueba.js
docker exec cine-umbral-mongodb mongosh cine_bogota_avance2 --file /tmp/03_consultas.js
```

Al terminar, detén y elimina el contenedor temporal:

```powershell
docker rm -f cine-umbral-mongodb
```

Si ya tienes MongoDB y `mongosh` instalados localmente, también puedes correr cada archivo desde la raíz:

```powershell
mongosh "mongodb://localhost:27017/cine_bogota_avance2" --file .\avance2-mongodb\scripts\01_creacion_colecciones.js
mongosh "mongodb://localhost:27017/cine_bogota_avance2" --file .\avance2-mongodb\scripts\02_datos_prueba.js
mongosh "mongodb://localhost:27017/cine_bogota_avance2" --file .\avance2-mongodb\scripts\03_consultas.js
```

Los scripts pueden repetirse. La creación actualiza validadores e índices; la carga hace `replaceOne` con `upsert` usando los `_id` de la semilla. No ejecutan `dropDatabase`, `drop` ni `deleteMany`.

## Correspondencia con PostgreSQL

Los IDs documentados se cotejaron con `avance1-postgresql/scripts/01_creacion_tablas.sql` y `02_datos_prueba.sql`. PostgreSQL sigue siendo la fuente de verdad para películas, funciones, salas, espectadores, ventas y boletas. MongoDB conserva el ID relacional correspondiente como referencia; no se simulan claves foráneas entre motores.

| Colección MongoDB | IDs compartidos de PostgreSQL | Semilla |
| --- | --- | ---: |
| `fichas_tecnicas_peliculas` | `Pelicula.id_pelicula`, `Pelicula.id_clasificacion_pelicula`, `Actor_Director.id_actor_director` | 30 versiones: 3 por película para las 10 películas |
| `requisitos_proyeccion` | `Funcion.id_funcion`, `Funcion.id_pelicula`, `Funcion.id_sala` | 30: una por función |
| `resenas_peliculas` | `Pelicula.id_pelicula`, `Espectador.id_espectador` | 30 |
| `reportes_incidentes` | `Funcion.id_funcion`, `Sala.id_sala`; opcionales `Venta.id_venta`, `Espectador.id_espectador` y `Staff.id_staff` en `reportado_por` | 30 |

La integración final debe validar que estos IDs existan en PostgreSQL desde la aplicación que escriba los documentos. El `id_venta` de un incidente es opcional.

## Decisiones del modelo documental

- **Embebido:** cada ficha contiene el elenco, idiomas, subtítulos y clasificaciones por país. Son datos que suelen leerse junto con la ficha y pueden variar entre películas. Cada entrada de elenco mantiene `id_actor_director` para rastrear la persona maestra en PostgreSQL.
- **Referenciado:** reseñas e incidentes viven en colecciones independientes porque crecen con el tiempo, tienen autores/funciones identificables y estructuras variables. Los requisitos técnicos apuntan a `id_funcion`, `id_pelicula` e `id_sala`; así no se duplica el núcleo de programación de PostgreSQL.
- **Versiones:** una ficha representa una combinación película-variante. Esto conserva duración y especificaciones distintas sin alterar las diez películas relacionales del avance 1.
- **Límites de los datos conocidos:** la base relacional registra salas Digital, 3D y 4D. Las solicitudes de IMAX o Dolby Atmos en ejemplos quedan marcadas `por_validar`; no afirman que el cine ya tenga esos equipos.

El archivo SVG de `avance2-mongodb/diagrama-arquitectura-poliglota/` relaciona las entidades de PostgreSQL con las cuatro colecciones y muestra los campos de enlace compartidos.

## Alcance de alta disponibilidad

La ejecución de prueba documentada usa un contenedor MongoDB único, sin Replica Set. Comprueba creación de colecciones, validadores, datos y consultas; no demuestra replicación, elección de primario ni failover.

Como estrategia de despliegue, una aplicación podría usar PostgreSQL con réplicas de streaming para mantener servidores standby al día mediante WAL, y MongoDB en un Replica Set con elecciones automáticas. Esa estrategia no está configurada por estos scripts. Durante una elección de MongoDB las escrituras se detienen hasta que haya un nuevo primario. Las lecturas desde secundarios pueden continuar si la aplicación las configura, pero pueden devolver datos atrasados porque la replicación es asíncrona. Por eso, una lectura de reseñas solo debería enviarse a un secundario si la aplicación acepta esa demora; ventas y disponibilidad de asientos deben seguir el flujo transaccional de PostgreSQL.

El trade-off de CAP depende de la topología y de la operación: ante una partición, permitir lecturas desde una réplica puede mantener acceso a datos con consistencia eventual, mientras las escrituras esperan a que el Replica Set elija un primario. El sistema no debe describirse como simplemente “CP” o “AP” sin especificar ese comportamiento. La replicación mejora disponibilidad frente a fallas de nodos, pero no reemplaza los backups.

Referencias técnicas: [elecciones de Replica Set en MongoDB](https://www.mongodb.com/docs/manual/core/replica-set-elections/), [consistencia y lecturas desde secundarios en MongoDB](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/) y [replicación streaming de PostgreSQL](https://www.postgresql.org/docs/current/warm-standby.html).

## Participación del equipo

El grupo tiene cuatro integrantes. La asignación de revisión y commits se encuentra en [REPARTO_AVANCE2.md](./REPARTO_AVANCE2.md); cada integrante debe revisar o completar su frente desde su propia cuenta de GitHub. El informe PDF se trabajará aparte.
