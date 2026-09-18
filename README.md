# Loyalty Tattoo Cali — Sitio web

Sitio web estático (HTML + CSS + JS, sin build) para **Loyalty Tattoo Cali**: estudio de
tatuaje y remoción láser. Bilingüe **ES/EN**, con **modo claro/oscuro**, video de fondo en
el header con **botón de sonido**, sección de **procedimiento** (remoción y tatuaje),
**resultados filtrables**, **PQRS** en video y **contacto con mini-mapa**.

---

## 🚀 Cómo publicarlo en Vercel

Es un sitio 100% estático, no necesita configuración ni compilación.

**Opción A — con GitHub (recomendada):**
1. Sube esta carpeta a un repositorio de GitHub (`git init`, `git add .`, `git commit`, `git push`).
2. En Vercel: **Add New → Project → Import** el repo.
3. Framework Preset: **Other** (Otro). Deja Build Command y Output vacíos.
4. **Deploy**. Listo.

**Opción B — arrastrar y soltar:** entra a vercel.com, y arrastra la carpeta del proyecto
a la sección de deploy.

---

## ✅ Estado: listo para publicar

- ✔️ **Número de WhatsApp** ya configurado: `573012244719` (en `assets/js/config.js`).
- ✔️ **Logo real** de Loyalty incluido (`assets/img/brand/logo.png`) — se usa en el header
  y como favicon.
- ✔️ **Imágenes reales** ya descargadas del Instagram y puestas en su lugar (resultados,
  procedimiento y miniaturas de los videos de PQRS).

No tienes que tocar nada para publicar. Solo sube a GitHub y conecta a Vercel.

### Si quieres cambiar alguna imagen más adelante
Reemplaza el archivo **conservando el mismo nombre**. Recomendado: fotos verticales `.jpg`.

**`assets/img/resultados/`** (galería filtrable)
| Archivo | Contenido | Post de Instagram |
|---|---|---|
| `borrado-1.jpg` | Remoción (antes/después) | https://www.instagram.com/p/DOoMmROjr0N/ |
| `borrado-2.jpg` | Remoción (antes/después) | https://www.instagram.com/p/DOd8ca6Dkyl/ |
| `borrado-3.jpg` | Remoción (antes/después) | https://www.instagram.com/p/DUtBJrmDi2o/ |
| `borrado-4.jpg` | Sesión de láser | (del perfil) |
| `tatuaje-1.jpg` | Tatuaje (tigre) | https://www.instagram.com/p/CylTctsAK5K/ |
| `tatuaje-2.jpg` | Tatuaje (tigre) | https://www.instagram.com/p/CnjpgatOgIb/ |

**`assets/img/procedimiento/proceso.jpg`** — https://www.instagram.com/p/DQHXV5YDlCL/

**`assets/img/pqrs/`** (miniaturas que abren los videos)
| Archivo | Abre el video |
|---|---|
| `video-1.jpg` | https://www.instagram.com/p/DP6fTqYjkFX/ |
| `video-2.jpg` | https://www.instagram.com/p/DQo9WxMDlf7/ |

> Las imágenes se capturaron del Instagram y se reescalaron/mejoraron. Si tienes las
> originales en Full HD, puedes reemplazarlas para máxima nitidez.

---

## 🎬 El video del header
Está en `assets/video/` ya optimizado:
- `header.webm` y `header.mp4` (reescalados y con el audio a volumen suave).
- `poster.jpg` (imagen mientras carga).

El video arranca **en silencio** (obligatorio en todos los navegadores) y con el botón de
**bocina** la persona activa la música. La música **solo suena mientras se ve el header**:
al bajar, se silencia sola.

Para cambiar el video, reemplaza esos archivos con el mismo nombre.

---

## ✏️ Cambiar textos e idiomas
Todos los textos están en **`assets/js/i18n.js`** (bloque `es` y bloque `en`).
Otros datos (dirección, enlaces, mensajes de WhatsApp) están en **`assets/js/config.js`**.

---

## 📁 Estructura
```
index.html
assets/
  css/styles.css
  js/config.js      ← número, dirección, enlaces
  js/i18n.js        ← textos ES / EN
  js/main.js        ← lógica
  video/            ← header.mp4, header.webm, poster.jpg
  img/
    brand/          ← logo.png (opcional)
    resultados/     ← borrado-*.jpg, tatuaje-*.jpg
    procedimiento/  ← proceso.jpg
    pqrs/           ← video-1.jpg, video-2.jpg
```
