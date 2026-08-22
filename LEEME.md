# Himnario IPB — instalar en el celular

Esta carpeta contiene la app lista para publicar. Una vez publicada, cualquier
celular la instala desde el navegador y funciona **sin señal**.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa (63 canciones, PDF, sala en vivo) |
| `manifest.webmanifest` | Nombre, ícono y colores de la app instalada |
| `sw.js` | Guarda la app en el celular para abrir sin internet |
| `CONFIGURAR-FIREBASE.md` | Guía para crear el proyecto de Firebase (una sola vez) |
| `icon-*.png`, `apple-touch-icon.png`, `favicon.png` | Íconos |

Todos deben quedar en la **misma carpeta**. No renombres `index.html`.

---

## Publicar en GitHub Pages (gratis y permanente)

**1. Crear la cuenta** — entra a <https://github.com> → *Sign up*. Pide correo,
contraseña y un nombre de usuario. Anota el usuario, lo vas a necesitar.

**2. Crear el repositorio** — ya dentro, botón **+** arriba a la derecha →
*New repository*.

- *Repository name*: `himnario`
- Marca **Public**
- Botón **Create repository**

**3. Subir los archivos** — en la página del repositorio nuevo, haz clic en
*uploading an existing file* (link azul en el centro).

Arrastra **todos** los archivos de esta carpeta a la vez. Espera a que terminen
de subir y presiona **Commit changes** (botón verde abajo).

**4. Activar Pages** — pestaña **Settings** (arriba) → **Pages** (menú
izquierdo).

- En *Source*, elige **Deploy from a branch**
- *Branch*: **main**, carpeta **/ (root)**
- **Save**

**5. Esperar 1–2 minutos.** Recarga esa misma página de Pages y aparecerá tu
dirección:

```
https://TU-USUARIO.github.io/himnario/
```

Esa es la dirección que compartes por WhatsApp al grupo de coristas.

---

## Instalar en el celular

**Android (Chrome)** — abrir el link → aparece abajo *"Instalar aplicación"*.
Si no aparece: menú **⋮** → *Instalar aplicación* / *Agregar a pantalla de
inicio*. También hay un botón **Instalar en este dispositivo** dentro de la
pestaña *Sala*.

**iPhone (Safari)** — abrir el link → botón **Compartir** (cuadrito con flecha)
→ *Agregar a inicio* → *Agregar*.

> En iPhone la instalación **solo funciona desde Safari**, no desde Chrome.

Queda el ícono de la iglesia en la pantalla de inicio y abre a pantalla
completa, sin barra de navegador.

---

## Actualizar canciones

**Con Firebase configurado no tienes que subir nada.** Editas o agregas la
canción en la app, presionas **Publicar biblioteca**, y todos los dispositivos
la reciben al abrir con internet. Eso es todo.

## Actualizar la app (solo si cambia el programa)

Esto aplica únicamente si cambia el código de la app, no las canciones.

1. Reemplaza `index.html` en el repositorio (*Add file* → *Upload files*)
2. Abre `sw.js` en GitHub, botón del lápiz, y **sube el número** de esta línea:

   ```js
   const CACHE_VERSION = 'himnario-v13';
   ```

   Cámbialo a `'himnario-v14'`, luego `v15`, y así. **Este paso es
   obligatorio**: sin él los celulares seguirán abriendo la versión guardada.

3. *Commit changes*. Los celulares se actualizan solos la próxima vez que
   abran con internet.

---

## Sala en vivo y canciones compartidas

Esta versión usa **Firebase** en lugar de la conexión directa entre equipos que
fallaba. Ahora cada dispositivo habla con Google por HTTPS, así que la sala
funciona en cualquier red: WiFi, datos móviles, o entre ciudades distintas.

Antes de usarla hay que crear el proyecto de Firebase **una sola vez**. Está
todo en **CONFIGURAR-FIREBASE.md**.

Con Firebase configurado:

- Agregas o editas una canción y presionas **Publicar biblioteca** → aparece en
  todos los dispositivos la próxima vez que abran con internet.
- Solo tú (el director) puedes editar. Los coristas ven y usan, no modifican.
- La app sigue funcionando **sin señal** para ver canciones, la lista del
  servicio y exportar el PDF.
