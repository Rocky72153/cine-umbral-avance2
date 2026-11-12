# Cine Bogotá — Proyecto integrador

El proyecto reúne el núcleo PostgreSQL, la capa documental MongoDB y una aplicación web local para consultar y operar las funciones principales del cine. El informe único se entregará por separado.

Las correcciones y pendientes indicados por el profesor se encuentran en [CORRECCIONES_AVANCE1.md](./CORRECCIONES_AVANCE1.md).

## Estructura

```text
Cine Bogotá/
├── avance1-postgresql/               (modelo y scripts SQL)
├── avance2-mongodb/
│   ├── diagrama-arquitectura-poliglota/
│   └── scripts/                      (01, 02 y 03)
├── integracion/                      (aplicación web, API y configuración local)
├── evidencias/
│   ├── postgresql/
│   └── mongodb/
├── README.md
└── REPARTO_AVANCE2.md
```

Las evidencias de ambos motores están reunidas en [`evidencias/`](./evidencias/). MongoDB incluye siete capturas reales y registros `.txt` auxiliares. PostgreSQL conserva sus PNG y tres representaciones SVG anteriores de procedimientos; estas últimas no se presentan como capturas de pantalla.

## Aplicación web local

La aplicación permite explorar películas, fichas técnicas, reseñas y funciones; registrar reseñas e incidentes; registrar ventas, consultar el reporte de recaudo y actualizar el estado de una sala. También permite registrar funciones, personal y contratos, y actualizar la capacidad de salas, el estado del personal y el correo de espectadores. Estas operaciones permiten observar las reglas de los triggers. Las tres operaciones de venta, reporte y estado de sala utilizan los procedimientos del avance 1. Las reseñas y los incidentes se guardan en MongoDB después de comprobar sus referencias en PostgreSQL.

En Windows, con Docker Desktop abierto y Python instalado, puedes ejecutar `integracion/iniciar.bat` y abrir la dirección que aparece en la ventana. Mantén esa ventana abierta mientras uses la aplicación.

También puedes iniciarla manualmente desde la raíz del repositorio:

```powershell
docker compose -f integracion/compose.yml up -d --wait
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r integracion/requirements.txt
$env:POSTGRES_URL = 'postgresql://cine:cine_demo_local@127.0.0.1:55432/cine_bogota'
$env:MONGODB_URI = 'mongodb://127.0.0.1:57017'
$env:MONGODB_DATABASE = 'cine_bogota_avance2'
.\.venv\Scripts\python.exe -m flask --app integracion.app run
```

Abre `http://127.0.0.1:5000/`. La primera ejecución crea bases de demostración y carga los scripts en orden; los volúmenes conservan ventas, reseñas e incidentes entre reinicios. Para detener los servicios, ejecuta `docker compose -f integracion/compose.yml down`; ese comando conserva sus datos. También puedes conectar bases existentes preparadas mediante las variables de conexión.

MongoDB inicializa los scripts en `cine_bogota_avance2` solamente cuando el volumen es nuevo. Si ya usabas el proyecto y tus documentos quedaron en la base `test`, el cambio de configuración no los mueve ni vuelve a ejecutar los scripts. Para comprobar las colecciones de esa base con los servicios en marcha:

```powershell
docker compose -f integracion/compose.yml exec mongodb mongosh test --quiet --eval "printjson(db.getCollectionNames())"
```

Si confirmas que los datos que quieres usar están en `test`, puedes iniciar la aplicación apuntando a esa base, sin copiar ni borrar datos:

```powershell
$env:MONGODB_DATABASE = 'test'
.\integracion\iniciar.bat
```

La selección no combina ni traslada datos entre bases. En una nueva ventana de PowerShell, o al eliminar esa variable de la sesión, se usa nuevamente `cine_bogota_avance2`.

La contraseña indicada corresponde únicamente a los datos locales de demostración. La interfaz no tiene inicio de sesión y está pensada para ejecutarse en el equipo; antes de publicarla o conectarla a datos reales se necesitan autenticación, control de permisos y configuración segura.

Para ejecutar las comprobaciones de rutas y validaciones con conexiones simuladas: `.\.venv\Scripts\python.exe -m unittest discover -s integracion/tests -v`.

![Diagrama de arquitectura políglota](./avance2-mongodb/diagrama-arquitectura-poliglota/diagrama-arquitectura-poliglota.svg?v=6733e95)

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

Los scripts actuales están preparados para una base nueva: el primero crea las colecciones y agrega cinco documentos en cada una, y el segundo agrega 25 más. No los ejecutes de nuevo sobre una base con datos, porque pueden producir errores o insertar duplicados.

## Correspondencia con PostgreSQL

Los IDs documentados se cotejaron con `avance1-postgresql/scripts/01_creacion_tablas.sql` y `02_datos_prueba.sql`. PostgreSQL sigue siendo la fuente de verdad para películas, funciones, salas, espectadores, ventas y boletas. MongoDB conserva el ID relacional correspondiente como referencia; no se simulan claves foráneas entre motores.

| Colección MongoDB | IDs compartidos de PostgreSQL | Semilla |
| --- | --- | ---: |
| `fichas_tecnicas_peliculas` | `Pelicula.id_pelicula`, `Pelicula.id_clasificacion_pelicula`, `Actor_Director.id_actor_director` | 30 versiones: 3 por película para las 10 películas |
| `requisitos_proyeccion` | `Funcion.id_funcion`, `Funcion.id_pelicula`, `Funcion.id_sala` | 30: una por función |
| `resenas_peliculas` | `Pelicula.id_pelicula`, `Espectador.id_espectador` | 30 |
| `reportes_incidentes` | `Funcion.id_funcion`, `Sala.id_sala`; opcionales `Venta.id_venta`, `Espectador.id_espectador` y `Staff.id_staff` en `reportado_por` | 30 |

La integración final debe validar que estos IDs existan en PostgreSQL desde la aplicación que escriba los documentos. El `id_venta` de un incidente es opcional.

## Participación del equipo

El grupo tiene cuatro integrantes. La asignación de revisión y commits se encuentra en [REPARTO_AVANCE2.md](./REPARTO_AVANCE2.md); cada integrante debe revisar o completar su frente desde su propia cuenta de GitHub. El informe PDF se trabajará aparte.
