# Mis XV Años — Tarjeta de invitación digital

Sitio de una sola página para invitar a tus XV, con música de fondo,
galería de fotos, itinerario, ubicación con mapa y confirmación de
asistencia por WhatsApp.

## 🔒 Panel privado para vos (generar links por familia)

Este sitio incluye un panel oculto, solo para vos como organizador, para generar
un link personalizado por cada familia (con su nombre y su cupo de invitados)
y mandárselo directo por WhatsApp con un solo botón.

**Cómo entrar al panel** (dos formas, ambas piden una clave primero):
- Scrolleando hasta el final de la página vas a ver un puntito casi invisible
  (`•`) debajo del footer — tocalo.
- O yendo directo a `tu-link-publicado.vercel.app?panel=organizador` (conviene
  guardarlo en favoritos una vez que esté publicado).

**Clave por defecto:** `milagros15`
Podés cambiarla en `js/script.js`, buscando la línea:
```js
const HOST_PASSCODE = "milagros15";
```

**Cómo se usa:** completás el nombre de la familia y la cantidad de personas,
tocás "Siguiente", y te aparece un botón de "Compartir" que abre WhatsApp con
el mensaje y el link ya armados — vos elegís a quién mandárselo desde ahí.
Ese link, cuando la familia lo abre, les muestra un saludo con su nombre y
cupo, y les precarga esos datos en el formulario de confirmación.

Esta función de personalizar por link **solo funciona una vez que el sitio
esté publicado** (con una URL real de Vercel) — no funciona si simplemente
mandás el archivo `index.html` suelto.

## 📁 Estructura

```
quince-site/
├── index.html          → contenido y textos
├── css/style.css        → colores, tipografías y estilos
├── js/script.js         → configuración (WhatsApp, dirección) y funcionalidad
├── assets/images/       → fotos (hero + galería)
└── assets/audio/        → música de fondo
```

## ✏️ Qué tenés que editar

### 1. Textos (`index.html`)
Buscá y reemplazá todo lo que está entre corchetes `[ ]`:
- `[Nombre]` → nombre de la festejada (aparece varias veces)
- `[15 de diciembre, 2026]` → fecha del evento
- `[Nombre del Salón]`, `[Calle y número, Ciudad, Provincia]`
- `[Nombre y Apellido]`, `[0000000000000000000000]`, `[ALIAS.DE.EJEMPLO]` → datos bancarios para regalos
- Los horarios y textos del **Itinerario** (sección `<!-- ITINERARIO -->`)

### 2. Configuración (`js/script.js`)
Arriba del todo hay un bloque `CONFIG`:
```js
const CONFIG = {
  whatsappNumber: "5491100000000", // tu número, sin + ni espacios
  mapsUrl: "https://www.google.com/maps?q=LAT,LNG&z=17&hl=es", // link de Google Maps a tu salón
};
```
Para conseguir tu `mapsUrl`: buscá el lugar en Google Maps, compartí la ubicación y copiá el link
(o simplemente click derecho sobre el punto exacto → copiar coordenadas y armá el link con ese formato).

### 3. Fotos (`assets/images/`)
Los archivos `.svg` son placeholders. Reemplazalos por tus fotos reales
**manteniendo el mismo nombre de archivo** (o cambiando la ruta en el HTML):
- `hero.svg` → foto principal de portada (ideal formato vertical, ej. 1000×1500px)
- `gallery-1.svg` a `gallery-6.svg` → fotos de la galería (podés agregar más copiando
  el patrón `<img src="assets/images/gallery-7.jpg" ...>` en `index.html`)

Recomendación: usá `.jpg` optimizados (menos de ~500kb cada uno) para que cargue rápido.

### 4. Música (`assets/audio/`)
Agregá tu archivo de música como:
```
assets/audio/music.mp3
```
Por derechos de autor, subí solo música que tengas permiso de usar (por ejemplo,
pistas libres de royalties). La música arranca silenciada por defecto hasta el
primer clic del usuario (así lo exigen los navegadores) y se puede silenciar con
el botón flotante ♪ de abajo a la derecha.

## 🚀 Subir a GitHub

```bash
cd quince-site
git init
git add .
git commit -m "Invitación XV años"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

## ▲ Publicar en Vercel

1. Entrá a [vercel.com](https://vercel.com) e iniciá sesión con tu cuenta de GitHub.
2. **Add New → Project** y seleccioná el repositorio que acabás de subir.
3. Es un sitio estático: no hace falta configurar **Build Command** ni
   **Output Directory** (dejalos vacíos/por defecto). Framework: **Other**.
4. Click en **Deploy**. En menos de un minuto tenés tu link `tu-proyecto.vercel.app`.

Cada vez que hagas `git push` a `main`, Vercel vuelve a desplegar automáticamente.

## 🎨 Cambiar colores

Todos los colores están centralizados arriba de `css/style.css`, en `:root`:
```css
--cream, --wine, --gold, --text-muted...
```
Cambiando esos valores cambia toda la paleta del sitio.
