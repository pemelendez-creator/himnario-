# Configurar Firebase — Himnario IPB

Firebase es el servicio de Google que va a guardar las canciones y sincronizar
el servicio en vivo. **Es gratis** para este uso: el plan libre permite mucho
más de lo que una iglesia consume.

Necesitas una cuenta de Google (la misma del correo sirve). Son unos 10 minutos,
**una sola vez**.

---

## 1. Crear el proyecto

1. Entra a <https://console.firebase.google.com>
2. **Crear un proyecto** (o *Add project*)
3. Nombre: `himnario-ipb` → **Continuar**
4. Google Analytics: **desactívalo** (no hace falta) → **Crear proyecto**
5. Espera ~30 segundos → **Continuar**

---

## 2. Crear la base de datos

1. Menú izquierdo → **Compilación** → **Realtime Database**

   > Ojo: **Realtime Database**, no *Firestore*. Son cosas distintas.

2. **Crear base de datos**
3. Ubicación: la que te ofrezca (por ejemplo *us-central1*) → **Siguiente**
4. Elige **Comenzar en modo bloqueado** → **Habilitar**

Arriba verás una dirección así — la vas a necesitar:

```
https://himnario-ipb-default-rtdb.firebaseio.com
```

---

## 3. Activar el acceso

1. Menú izquierdo → **Compilación** → **Authentication** → **Comenzar**
2. Pestaña **Sign-in method**
3. Habilita **Anónimo** → *Habilitar* → **Guardar**

   > Esto permite que los coristas lean las canciones sin crear cuenta.

4. Habilita también **Correo electrónico/contraseña** → *Habilitar* → **Guardar**

   > Esta es tu cuenta de director, la única que puede editar canciones.

---

## 4. Crear tu usuario de director

1. En **Authentication** → pestaña **Users** → **Agregar usuario**
2. Pon tu correo y una contraseña (mínimo 6 caracteres). **Anótala.**
3. **Agregar usuario**
4. En la lista aparece tu usuario con un **UID** (texto largo tipo
   `a7Kd93JfLpQ...`). Cópialo con el botón de copiar.

---

## 5. Poner las reglas de seguridad

1. Menú izquierdo → **Realtime Database** → pestaña **Reglas**
2. Borra todo lo que haya y pega esto:

```json
{
  "rules": {
    "biblioteca": {
      ".read": "auth != null",
      ".write": "auth != null && auth.uid === 'PEGA_AQUI_TU_UID'"
    },
    "salas": {
      "$codigo": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === 'PEGA_AQUI_TU_UID'",
        "miembros": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        }
      }
    }
  }
}
```

3. Reemplaza **las dos veces** que dice `PEGA_AQUI_TU_UID` por el UID del paso 4
   (deja las comillas simples)
4. **Publicar**

Con esto: los coristas solo leen, y únicamente tú puedes cambiar las canciones y
la lista del servicio.

---

## 6. Copiar la configuración

1. Rueda dentada arriba a la izquierda → **Configuración del proyecto**
2. Baja hasta **Tus apps** → icono **`</>`** (Web)
3. Apodo: `himnario` → **Registrar app** (no marques Hosting)
4. Te muestra un bloque como este:

```js
const firebaseConfig = {
  apiKey: "AIza....",
  authDomain: "himnario-ipb.firebaseapp.com",
  databaseURL: "https://himnario-ipb-default-rtdb.firebaseio.com",
  projectId: "himnario-ipb",
  storageBucket: "himnario-ipb.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123"
};
```

**Cópialo completo.** Si no aparece la línea `databaseURL`, agrégala tú con la
dirección del paso 2.

---

## 7. Conectar la app

1. Abre el Himnario → pestaña **Sala** → **Configurar Firebase**
2. Pega el bloque completo → **Guardar**
3. Presiona **Probar conexión**. Debe decir *Conectado correctamente*.
4. Botón **Entrar como director** → tu correo y contraseña del paso 4
5. **Publicar biblioteca** → sube tus 63 canciones a Firebase

Desde ese momento, cualquier celular que abra el link recibe las canciones solo.

---

## ¿Es seguro dejar el `apiKey` dentro de la app?

Sí. En Firebase esa clave **no es una contraseña**: solo identifica el proyecto,
y va visible en todas las apps web que usan Firebase. Lo que protege tus datos
son las **reglas** del paso 5. Por eso importa no dejarlas abiertas.

---

## Si algo falla

- **"Permission denied"** al publicar → no iniciaste sesión como director, o el
  UID de las reglas no coincide con el de tu usuario.
- **"Conexión fallida"** → revisa que `databaseURL` esté en la configuración y
  que apunte a la dirección del paso 2.
- Todo lo demás sigue funcionando sin Firebase: las canciones quedan guardadas
  en cada dispositivo igual que hoy.
