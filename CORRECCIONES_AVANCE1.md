# Correcciones del avance 1

Seguimiento de la retroalimentación del profesor para el informe único de Cine Bogotá. Una corrección se marca completa solo cuando el cambio y su evidencia verificable existan.

| Corrección solicitada | Estado |
| --- | --- |
| Índices para `Venta(id_funcion)`, `Boleta(id_venta)` y `Funcion(id_sala, fecha)` | Implementados en `01_creacion_tablas.sql` y comprobados en una base PostgreSQL aislada. |
| Añadir Tipo_Boleta al ER y su relación 1:M con Boleta | Pendiente en el diagrama conceptual. |
| Corregir Espectador–Venta a 1:M e incluir `Venta.monto_total` y `Actor_Director.correo` en ambos modelos | Pendiente en los diagramas ER y relacional. |
| Capturar los siete triggers con ejecuciones válidas e inválidas y el código que realmente se entrega | Pendiente. Las imágenes actuales muestran su creación y no demuestran por sí solas su comportamiento. |
| Capturar los tres procedimientos con llamadas completas, salidas reales y un caso inválido | Pendiente. Los SVG previos son representaciones y no sustituyen capturas de ejecución. |
| Capturar la carga del script 02 y conteos; repetir las consultas 1 y 2 sobre la base generada por los scripts | Pendiente de capturas sobre una base limpia. |
| Corregir el enfoque de programación | Pendiente de acordar el tipo de cartelera; POO es un paradigma de software. |
| Informe único con figuras/tablas numeradas, títulos, referencias en el texto y diagramas legibles; corregir el nombre `validarCorreoEspectador` | Pendiente en el informe que se entregará aparte. |

El informe único deberá integrar lo entregado anteriormente, las correcciones y el nuevo avance. El reparto de tareas está en [`REPARTO_AVANCE2.md`](./REPARTO_AVANCE2.md).
