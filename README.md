# Cine Bogotá — Proyecto integrador

El proyecto reúne el núcleo PostgreSQL, la capa documental MongoDB y el módulo de entrega final: un backend Django y un frontend Angular. El informe único se entregará por separado.

Las correcciones y pendientes indicados por el profesor se encuentran en [CORRECCIONES_AVANCE1.md](./CORRECCIONES_AVANCE1.md).

## Estructura

```text
Cine Bogotá/
├── avance1-postgresql/               (modelo y scripts SQL)
├── avance2-mongodb/
│   ├── diagrama-arquitectura-poliglota/
│   └── scripts/                      (01, 02 y 03)
├── entrega-final/
│   ├── script-integracion/           (backend Django)
│   ├── modulo-api/                   (frontend Angular)
│   └── portafolio-individual/
├── evidencias/
│   ├── postgresql/
│   └── mongodb/
└── README.md
```

Las evidencias de ambos motores están reunidas en [`evidencias/`](./evidencias/). MongoDB incluye siete capturas reales y registros `.txt` auxiliares. PostgreSQL conserva sus PNG y tres representaciones SVG anteriores de procedimientos; estas últimas no se presentan como capturas de pantalla.

![Diagrama de arquitectura políglota](./avance2-mongodb/diagrama-arquitectura-poliglota/diagrama-arquitectura-poliglota.svg?v=6733e95)

[Abrir el diagrama en PNG](./avance2-mongodb/diagrama-arquitectura-poliglota/diagrama-arquitectura-poliglota.png) · [Abrir el SVG editable](./avance2-mongodb/diagrama-arquitectura-poliglota/diagrama-arquitectura-poliglota.svg)
