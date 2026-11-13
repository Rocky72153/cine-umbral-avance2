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
