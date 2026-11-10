# Distribución del avance 2

**Equipo:** 4 integrantes. Se conservan los nombres y usuarios que ya aparecen en el repositorio.
**Estado general:** la base documental, scripts, diagrama y evidencias de ejecución ya están en `main`. Los tres aportes de revisión que siguen pendientes deben quedar registrados desde las cuentas de GitHub de sus responsables.

| Integrante y usuario de GitHub | Asignación | Entregable verificable | Estado |
| --- | --- | --- | --- |
| Amelia Camila Merchan Albarracin (`RAC0ONN`) | Revisión de compatibilidad PostgreSQL–MongoDB | Cotejar los IDs y campos del diagrama y la tabla de correspondencia con los scripts SQL del avance 1; confirmar referencias de películas, funciones, salas, espectadores, ventas y elenco. Corregir las discrepancias encontradas en el diagrama o README y registrar su revisión con un commit propio. | Pendiente de commit propio |
| Jenny Alejandra Gómez López (`AlejandraGomezL`) | Revisión funcional de consultas MongoDB | Revisar las seis consultas y tres agregaciones de `avance2-mongodb/scripts/03_consultas.js` contra los datos semilla; comprobar filtros, agrupaciones y resultados, y mejorar una consulta o agregar una explicación breve de su propósito. Registrar el cambio con un commit propio. | Pendiente de commit propio |
| Camila Castro Alfonso (`milacastroa`) | Auditoría de semillas y validadores | Ejecutar independientemente los scripts en MongoDB; verificar 30 documentos por colección, rechazo de documentos inválidos y repetición idempotente de la carga. Si encuentra defectos, corregir los scripts; registrar los criterios y resultados de su revisión en `avance2-mongodb/evidencias/revision_independiente.md` con un commit propio. Las capturas reales de ejecución ya están incorporadas; no hace falta duplicarlas. | Pendiente de commit propio |
| Juan Sebastian Morales Forero (`Rocky72153`) | Diseño técnico, implementación, integración, ejecución y documentación | Aporte completado: preparó las cuatro colecciones con validadores, las semillas de 30 documentos por colección, seis consultas con tres agregaciones, la correspondencia de IDs con PostgreSQL, el diagrama monocromo, las instrucciones de ejecución y la documentación de embebido/referenciado y alta disponibilidad. Ejecutó los scripts con Docker y agregó capturas reales de creación, carga, consultas, conteos, validadores e idempotencia. No tiene tareas pendientes en este reparto. Aporte consolidado en `897e4ca` y `b88e4f6`. | Completado |

## Registro de aportes

1. Cada integrante debe trabajar desde su propia cuenta de GitHub y registrar al menos un cambio sustancial relacionado con su asignación.
2. Usen mensajes de commit descriptivos, por ejemplo: `docs(avance2): documentar correspondencia de IDs` o `fix(avance2): ajustar validación de requisitos`.
3. Integren los cambios en `main` mediante el flujo que use el equipo. Si trabajan en ramas, abran un pull request para revisión.
4. Actualicen el estado de una asignación a completado solo cuando el aporte propio esté visible en GitHub.

El grupo tiene cuatro integrantes; no aplica el requisito adicional exclusivo para grupos de cinco. El informe PDF y la justificación teórica ACID/BASE/CAP se entregan por separado y quedan fuera de esta carpeta.
