# Manejo de errores de la API · Cine Bogotá

Los 11 endpoints bajo `/api/` devuelven errores en JSON. Cada error incluye `status`, un `code` estable y un `message` en español. Cuando se detectan datos inválidos en campos concretos, la respuesta también puede incluir `errors`.

```json
{
  "status": "error",
  "code": "datos_invalidos",
  "message": "id_pelicula debe ser un entero entre 1 y 2147483647.",
  "errors": {
    "id_pelicula": "id_pelicula debe ser un entero entre 1 y 2147483647."
  }
}
```

| HTTP | Cuándo se devuelve |
| --- | --- |
| 400 | JSON dañado, cuerpo que no es un objeto o datos inválidos. |
| 401 | Usuario o contraseña incorrectos en el acceso de personal. |
| 403 | Django rechazó el acceso antes de ejecutar el endpoint. |
| 404 | Ruta inexistente o entidad requerida que no se encuentra. |
| 405 | Método incorrecto. La respuesta incluye la cabecera `Allow`. |
| 409 | Registro duplicado, asiento ya vendido o varias funciones para la misma película, fecha y hora. |
| 413 | El cuerpo supera el tamaño permitido por Django. |
| 415 | El cuerpo de una solicitud de escritura no usa `application/json`. |
| 500 | Error interno. El cliente recibe un mensaje general. |
| 503 | No se pudo completar la operación por una falla de conexión con PostgreSQL o MongoDB. El código identifica el motor. |

Una película que existe pero aún no tiene reseñas devuelve 200 con una lista vacía. Si el espectador existe y aún no tiene compras, la consulta de boletas también devuelve 200 con una lista vacía. Si MongoDB falla al consultar los registros de compras, la API informa el error.

PostgreSQL se consulta con SQL nativo parametrizado y la venta sigue usando `CALL sp_registrar_venta`. MongoDB se consulta con PyMongo. Los errores internos no devuelven consultas, credenciales ni excepciones originales. Un error durante una venta entre los dos motores no certifica por sí solo el estado de ambos registros.

Si no se puede confirmar una compra después de intentar escribir en MongoDB, la API devuelve `venta_estado_no_confirmado` y pide verificar el estado antes de volver a enviarla. Ese código puede acompañar un 503 por una falla de conexión o un 500 por otro fallo durante la operación.

## Casos para mostrar en la sustentación

Con Django iniciado en `http://127.0.0.1:8000`, puedes usar el navegador o Postman. Para los cuerpos JSON de abajo, selecciona la cabecera `Content-Type: application/json`.

| Solicitud | Resultado esperado |
| --- | --- |
| `GET /api/peliculas/abc/resenas/` | 400, `datos_invalidos`. |
| `GET /api/funciones/2147483647/requisitos/` con ese ID ausente de la base de demo | 404, `no_encontrado`. |
| `GET /api/ventas/` | 405, `metodo_no_permitido`, cabecera `Allow: POST`. |
| `POST /api/ventas/` con cuerpo `{` | 400, `json_invalido`. |
| `POST /api/ventas/` con cuerpo `{}` | 400, `datos_venta_invalidos`, con errores por campo. |
| `POST /api/ventas/` con una compra válida salvo por un asiento ya vendido para esa función | 409, `venta_conflicto`. |

Para repetir las comprobaciones, desde la carpeta del backend ejecuta `python verificar_api.py`; el programa no registra ventas ni crea usuarios. Usa `--solo-errores` para comprobar solicitudes inválidas sin consultar las bases. Para el informe, toma capturas de las respuestas reales y guárdalas en la carpeta general de evidencias.

## Preparación local de la demo

1. Inicializa PostgreSQL con los scripts 01 a 04 del avance 1, y MongoDB con los scripts 01 y 02 del avance 2 en `cine_bogota_avance2`. Usa bases locales de prueba.
2. Ejecuta [ajustes-postgresql-demo.sql](./script-integracion/ajustes-postgresql-demo.sql) sobre el PostgreSQL de prueba. Agrega las columnas de acceso que usa Django y deja una función futura disponible.
3. Desde `entrega-final/script-integracion/cineplus-backend/`, instala las dependencias con `python -m pip install -r requirements.txt`. En PowerShell define `$env:CINE_PG_PASSWORD` con la contraseña de la base local. El perfil local usa PostgreSQL en el puerto 55482 y MongoDB en el 27182; se pueden cambiar con `CINE_PG_PORT` y `CINE_MONGO_PORT`.
4. Arranca Django con `python manage.py runserver 127.0.0.1:8000 --settings=cineplus.settings_demo`.
5. En otra terminal, con Node 24.15.0 o [una versión compatible con Angular 22](https://angular.dev/reference/versions), ejecuta `npm ci` y `npm start` dentro de `entrega-final/modulo-api/`. Abre `http://localhost:4200`. Usa el servidor de desarrollo para la sustentación: el límite actual de tamaño de `cinema-main.css` impide generar la compilación de producción.
