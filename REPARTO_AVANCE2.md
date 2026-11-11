# Distribución del avance 2

**Equipo:** 4 integrantes. Se conservan los nombres y usuarios que ya aparecen en el repositorio.
**Estado general:** el proyecto reúne PostgreSQL y MongoDB, una API inicial de lectura y las evidencias existentes en una sola carpeta. Las correcciones del profesor se siguen en `CORRECCIONES_AVANCE1.md`. Los aportes pendientes deben registrarse desde las cuentas de GitHub de sus responsables.

| Integrante y usuario de GitHub | Asignación | Entregable verificable | Estado |
| --- | --- | --- | --- |
| Amelia Camila Merchan Albarracin (`RAC0ONN`) | Modelos y diagrama de arquitectura | Corregir el ER y el relacional según `CORRECCIONES_AVANCE1.md`: entidad Tipo_Boleta, cardinalidad Espectador–Venta y campos faltantes. Revisar los IDs entre motores y adaptar el diagrama monocromo al ejemplo del profesor, usando las entidades reales. Registrar los cambios con un commit propio. | Pendiente de commit propio |
| Jenny Alejandra Gómez López (`AlejandraGomezL`) | Consultas e informe integrado | Revisar las seis consultas y sus agregaciones. Preparar el contenido del informe único con los avances, las correcciones y lo nuevo; numerar y citar figuras y tablas, corregir el nombre del trigger y acordar con el grupo el enfoque de cartelera. El PDF se elaborará aparte. Registrar su aporte al repositorio con un commit propio. | Pendiente de commit propio |
| Camila Castro Alfonso (`milacastroa`) | Evidencias reales y validación | Reproducir en una base PostgreSQL limpia los siete triggers con casos válidos e inválidos, los tres procedimientos con sus llamadas y salidas completas, la carga de datos y los conteos/consultas. Guardar capturas auténticas en `evidencias/postgresql/` y revisar semillas y validadores MongoDB. Registrar su aporte con un commit propio. | Pendiente de commit propio |
| Juan Sebastian Morales Forero (`Rocky72153`) | Diseño, implementación e integración | Aporte completado: capa documental, semillas, consultas, diagrama inicial, capturas MongoDB, organización de evidencias, índices solicitados y primera consulta de lectura entre PostgreSQL y MongoDB. No tiene tareas pendientes en este reparto. Los commits previos del avance 2 se consolidaron en `897e4ca` y `b88e4f6`. | Completado |

## Registro de aportes

1. Cada integrante debe trabajar desde su propia cuenta de GitHub y registrar al menos un cambio sustancial relacionado con su asignación.
2. Usen mensajes de commit descriptivos, por ejemplo: `docs(avance2): documentar correspondencia de IDs` o `fix(avance2): ajustar validación de requisitos`.
3. Integren los cambios en `main` mediante el flujo que use el equipo. Si trabajan en ramas, abran un pull request para revisión.
4. Actualicen el estado de una asignación a completado solo cuando el aporte propio esté visible en GitHub.

El grupo tiene cuatro integrantes; no aplica el requisito adicional exclusivo para grupos de cinco. El informe único deberá reunir lo anterior, las correcciones y lo nuevo, incluida la justificación ACID/BASE/CAP; se entregará por separado.
