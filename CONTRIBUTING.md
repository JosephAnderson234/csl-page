# Cómo contribuir

¡Gracias por querer mejorar la web del Club de Software Libre @ UTEC! No necesitas ser miembro ni tener experiencia con Astro: si encuentras un error, falta un evento o se te ocurre una mejora, eres bienvenido.

## Formas de ayudar

- **Reportar un problema:** abre un [issue](https://github.com/csl-club/csl-page/issues) contando qué viste, en qué página y, si puedes, con una captura.
- **Agregar o corregir un evento:** editas un archivo `.md`, no hace falta tocar código (ver [Eventos](#eventos)).
- **Publicar tu proyecto:** los proyectos de miembros no se agregan en este repo, sino en [awesome-utec](https://github.com/csl-club/awesome-utec) (ver [Proyectos](#proyectos)).
- **Mejorar el diseño o el código:** toma un issue abierto o propón el cambio en uno nuevo antes de empezar algo grande.

## Preparar el entorno

Necesitas [Node.js](https://nodejs.org) 22.12 o superior y [pnpm](https://pnpm.io).

```sh
git clone https://github.com/csl-club/csl-page.git
cd csl-page
pnpm install
pnpm dev          # http://localhost:4321
```

| Comando        | Qué hace                                  |
| -------------- | ----------------------------------------- |
| `pnpm dev`     | Servidor de desarrollo con recarga en vivo |
| `pnpm build`   | Genera el sitio estático en `dist/`        |
| `pnpm preview` | Sirve `dist/` para revisarlo antes de publicar |

Antes de abrir un PR, verifica que `pnpm build` termine sin errores.

## Estructura

```text
public/                 imágenes y archivos que se sirven tal cual
  images/events/        fotos de eventos
src/
  components/           secciones de la home, header y footer
  content/events/       un archivo .md por evento
  data/socials.ts       links a Discord, Instagram y GitHub
  layouts/Layout.astro  estructura común de todas las páginas
  lib/github.ts         lectura de proyectos y repos desde GitHub
  pages/                una ruta por archivo (/events, /projects, /gallery)
  styles/main.css       todos los estilos y variables de color
  content.config.ts     esquema de eventos, proyectos y repos
```

## Eventos

Cada evento es un archivo en `src/content/events/`, por ejemplo `git-github.md`. El nombre del archivo es su identificador en la URL (`/events#git-github`).

```md
---
title: Taller de Git y GitHub
date: 2026-05-20
cycle: "2026-1"
location: UTEC, aula A-501
attendees: 40                  # opcional
partners: [Otra organización]  # opcional
talks:                         # opcional
  - Introducción a Git
photos:                        # opcional, aparecen también en la galería
  - src: /images/events/git-ponente.jpg
    alt: Ponente explicando ramas en la pizarra
link: https://...              # opcional, publicación del evento
---
Una o dos líneas describiendo el evento.
```

Si la fecha (o `endDate`, si el evento dura varios días) aún no llega al generar el sitio, el evento se marca como próximo automáticamente.

### Fotos

- Guárdalas en `public/images/events/` como `.jpg` de 1200×900 px (4:3), con nombres en minúsculas y guiones: `nombre-evento-detalle.jpg`.
- Elimina los metadatos EXIF (ubicación, cámara) antes de subirlas.
- Escribe un `alt` que describa la foto: lo leen los lectores de pantalla.
- Usa solo fotos públicas del club. No subas listas de asistentes, capturas de reuniones con nombres visibles, datos de contacto ni fotos en las que alguien haya pedido no aparecer.

## Proyectos

La página `/projects` se arma sola al generar el sitio:

- **Proyectos de miembros:** se leen del `content.yml` de [awesome-utec](https://github.com/csl-club/awesome-utec). Para que tu proyecto aparezca, abre un PR allí; se publica aquí en el siguiente despliegue.
- **Repos del club:** se leen de la organización [csl-club](https://github.com/csl-club) en GitHub. Para ocultar uno, agrégalo a `HIDDEN_REPOS` en `src/lib/github.ts`.

Sin token, la API de GitHub permite 60 consultas por hora. Si el build falla por ese límite, crea un token personal sin permisos especiales y exporta `GITHUB_TOKEN` antes de `pnpm build`.

## Estilo

- Los colores, fuentes y tamaños están como variables en `:root` de `src/styles/main.css`; úsalas en lugar de valores sueltos.
- Las clases siguen el formato `bloque__elemento--variante` (por ejemplo `events__button`, `log__entry--upcoming`).
- El diseño se mide a 1920 px de ancho: los tamaños usan `vw` con `clamp()` para no romperse en pantallas chicas. Revisa tus cambios también en móvil.
- Los textos visibles de la web van en español.

## Commits y pull requests

1. Haz un fork y crea una rama desde `main`: `git checkout -b fix/fecha-flisol`.
2. Usa mensajes en el formato de [Conventional Commits](https://www.conventionalcommits.org/es/): `feat:` para algo nuevo, `fix:` para correcciones, `docs:`, `style:` o `chore:` para lo demás.
3. Abre el PR contra `main` explicando qué cambiaste y por qué. Si cambia algo visual, adjunta una captura.

Un PR pequeño y enfocado se revisa mucho más rápido que uno grande.

## Licencia

El código de esta web es software libre bajo la [GPL-3.0](LICENSE). Al contribuir, aceptas que tu aporte se publique bajo la misma licencia. Los textos del sitio se comparten bajo [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es).

¿Dudas? Escríbenos en [Discord](https://discord.gg/PU77KEXkzw) o a [csl@utec.edu.pe](mailto:csl@utec.edu.pe).
