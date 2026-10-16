# IoT para principiantes

Plataforma web educativa, en español, para aprender **electrónica, Arduino, ESP32, sensores, IoT y simulación desde cero**. Cada lección combina concepto, esquema de conexión, código para copiar, prueba y cuestionario con retroalimentación.

- **Sitio publicado:** https://iot-para-principiantes.servisolucionesti.workers.dev/
- **Repositorio:** https://github.com/servisolucionesaragon/IoT_para_principiantes

> Contexto completo del proyecto (decisiones, historial y pendientes): [docs/CONTEXTO.md](docs/CONTEXTO.md).

---

## 1. Qué incluye

| Sección | Contenido |
|---|---|
| **Módulos 1 a 9** | 30 lecciones: IoT, electricidad, señales analógicas y digitales, seguridad, Arduino, ESP32, sensores y actuadores, montaje, depuración, datos IoT, simulación con Tinkercad y el coche inteligente Elegoo |
| **Sensores y dispositivos** | 49 fichas con funcionamiento, conexión, código y precauciones. Incluye resistencias (código de colores, ejemplos resueltos y práctica interactiva) y protoboard |
| **Biblioteca de proyectos** | 18 proyectos en cuatro niveles, con filtro por sensor. Incluye el control de acceso RFID con Firebase |
| **Solución de problemas** | 11 problemas frecuentes con causas, comprobaciones y solución |
| **Retos** | 5 retos con pistas progresivas |
| **Recursos** | Resumen de los documentos originales y su uso |
| **Herramientas** | Laboratorio USB, configurador RFID, buscador y progreso |
| **Descargas** | 41 archivos complementarios (PDF, código y ejemplos) de Mundo Arduino, Robótica e IA, el kit Elegoo y los 50 retos, publicados con autorización del docente. Dos PDF de más de 25 MB están pendientes |

### Módulos

| Módulo | Tema | Lecciones |
|---|---|---|
| 1 | Electrónica e IoT (incluye señales analógicas y digitales) | 4 |
| 2 | Arduino desde cero | 4 |
| 3 | ESP32 desde cero | 2 |
| 4 | Sensores y actuadores | 4 |
| 5 | Conexiones y montaje | 1 |
| 6 | Depurar y programar mejor | 1 |
| 7 | IoT: de la lectura a la nube | 1 |
| 8 | Simulación con Tinkercad (tutorial y 6 ejemplos) | 7 |
| 9 | Coche inteligente (kit Elegoo) | 6 |

---

## 2. Cómo se usa

1. Entra al sitio y empieza por el **Módulo 1**, o usa **Continuar donde quedaste**, que recuerda la última lección visitada.
2. En cada lección: lee el concepto, mira el diagrama, copia el código con **Copiar código** y responde el cuestionario.
3. Marca la lección como **completada**. El progreso se guarda en tu navegador.
4. Usa el **buscador** de la cabecera para encontrar un sensor, un error o un proyecto.
5. Pulsa cualquier imagen para verla **a pantalla completa**. Se cierra con un clic o con Esc.

El progreso y la última lección se guardan solo en el navegador. Nada se envía a un servidor.

---

## 3. Herramientas

### 3.1 Laboratorio USB
Conecta una placa por USB desde Chrome o Edge de escritorio (con `https://` o `localhost`). Permite abrir el puerto, leer y enviar texto por el monitor serie, y editar código con ejemplos. **Compilar y cargar el programa todavía no están implementados**: carga los programas con el Arduino IDE.

### 3.2 Configurador del proyecto RFID
En la ficha **Control de acceso escolar con RFID** hay un formulario que genera:
- el código del **ESP32** o del **Arduino UNO R4 WiFi** con tu red WiFi, tu clave y tu URL de Firebase;
- la página `index.html` configurada con tu URL.

Todo se genera en tu navegador. Los datos no se envían ni se guardan en la plataforma. El archivo descargado sí contiene tu clave WiFi: no lo subas a internet.

### 3.3 Visor de imágenes
Al hacer clic en una imagen se abre a pantalla completa. Se cierra con un clic o con la tecla Esc.

---

## 4. Tecnología

- **Sitio estático:** HTML, CSS y JavaScript. No hay servidor propio ni base de datos.
- **Sistema de diseño:** todo el estilo está en `css/estilos.css`, organizado en tokens (colores, radios, sombras, transiciones), base, componentes, vistas y breakpoints. Los colores son variables: el modo claro y el oscuro siguen al sistema o al botón **Modo**. Tailwind (CDN) queda solo para utilidades sueltas.
- **Interacción:** estados hover, focus (anillo visible) y active en botones, tarjetas, menú y campos; animaciones suaves que se desactivan si el sistema pide movimiento reducido.
- **Accesibilidad:** enlace «Ir al contenido», etiquetas en botones con icono, contraste AA en textos secundarios, opción de contraste alto y navegación completa con teclado.
- **Responsive:** escritorio con menú fijo; tableta con columnas más estrechas; móvil con menú deslizable y cabecera compacta.
- **Tipografía:** Lexend, desde Google Fonts.
- **Publicación:** Cloudflare Workers con archivos estáticos (plan gratuito).
- **Sin compilación:** los archivos se editan y se publican tal cual.

---

## 5. Estructura de archivos

```
plataforma-iot/
├── index.html                  Página base: cabecera, menú, buscador y scripts
├── README.md                   Esta documentación
├── css/
│   └── estilos.css             Estilos propios: tipografía, diseño y visor de imágenes
├── js/
│   ├── app.js                  Enrutado (#/…), lecciones, progreso, búsqueda y visor
│   ├── contenido.js            Lecciones base, diagnóstico, retos y módulos 1 a 7
│   ├── contenido-elegoo.js     Módulo 9: coche con kit Elegoo
│   ├── senales.js              Módulo 1: señales analógicas y digitales
│   ├── tinkercad.js            Módulo 8: tutorial de Tinkercad y ejemplos
│   ├── componentes.js          Fichas de sensores y dispositivos (primera parte)
│   ├── componentes-nuevos.js   Fichas nuevas y categorías adicionales
│   ├── resistencias-practica.js Práctica interactiva del código de colores
│   ├── proyectos-extra.js      Biblioteca de proyectos (18)
│   ├── diagramas.js            Diagramas SVG de Arduino UNO y ESP32, y protoboard
│   ├── diagramas-rfid.js       Diagrama de Arduino UNO para el proyecto RFID
│   ├── imagenes.js             Ilustraciones SVG originales
│   ├── imagenes-reales.js      Fotos reales con autor, licencia y fuente
│   ├── videos.js               Videos de YouTube insertados en las lecciones
│   ├── descargas.js            Página de descargas, organizada por categorías en tarjetas
│   ├── descargas-lista.js      Lista de archivos de descargas (generada)
│   ├── configurador-rfid.js    Formulario que genera el código del proyecto RFID
│   ├── plantillas-rfid.js      Plantillas del configurador, incluidas en el archivo
│   └── laboratorio.js          Laboratorio USB (Web Serial)
├── img/
│   ├── logo.svg, logo-mark.svg, favicon.svg, favicon-32.png, icon-192.png, apple-touch-icon.png
│   ├── componentes/            Fotos y gráficos de componentes
│   └── proyectos/              Diagrama de conexión del proyecto RFID
├── plantillas/rfid/            Plantillas del proyecto RFID (sin credenciales)
├── proyectos/control-acceso-rfid/  Código ESP32 y Arduino R4, página web y documentación del proyecto RFID
├── descargas/                  Material complementario para descargar (PDF y código)
├── .assetsignore               Lista de lo que NO se publica en el sitio (.git, documentación, herramientas)
├── publicar/                   Herramientas de publicación (respaldo; no se publica)
└── docs/
    ├── CONTEXTO.md             Contexto, decisiones, historial y pendientes
    ├── INVENTARIO.md           Documentos originales y su uso
    └── CREDITOS_IMAGENES.md    Autor, licencia y fuente de cada foto
```

---

## 6. Cómo agregar contenido

- **Lección:** agrega un objeto con `id`, `modulo`, `titulo`, `cuerpo` (HTML), `quiz` y `fuentes`, en el archivo de su módulo. El menú, el buscador y la navegación anterior y siguiente se generan solos.
- **Ficha de componente:** agrega un objeto a `COMPONENTES` con `id`, `categoria`, `nombre`, `funciona`, `conexion`, `codigo` y `precauciones`. Para mostrar una foto, regístrala en `imagenes-reales.js` con su autor y licencia.
- **Proyecto:** agrega un objeto a `PROYECTOS` con `id`, `nivel`, `sensores`, `componentes`, `conexiones`, `codigo`, `pruebas`, `problemas` y `mejoras`.
- **Cambios visibles:** sube el número de versión de los archivos en `index.html` (`?v=...`) para que el navegador no use una copia guardada.

Comprobación de sintaxis antes de subir un cambio:

```bash
node --check js/app.js
```

---

## 7. Publicación

Cloudflare está conectado a este repositorio: **cada `push` a la rama `main` se publica solo**. Flujo recomendado:

```bash
git add -A
```

```bash
git commit -m "descripción del cambio"
```

```bash
git push
```

Espera un minuto y verifica el cambio en el sitio.

Como respaldo, `cf deploy` desde la carpeta `publicar` (procedimiento en `docs/CONTEXTO.md`). El script `publicar/publicar.mjs` falla con código 127 en esta máquina; no hace falta mientras funcione el despliegue por Git.

---

## 8. Imágenes y derechos

- **Ilustraciones SVG:** dibujos propios.
- **Fotos reales (48):** 43 tienen su licencia pendiente de confirmar. Provienen de tiendas, de Google o de fabricantes, y se usan con la autorización del docente. Cada una muestra su autor y fuente al pie. Lista completa en [docs/CREDITOS_IMAGENES.md](docs/CREDITOS_IMAGENES.md).
- **Libros y kits del material:** no se publica su texto ni sus imágenes. Se usaron como fuente para elegir temas y verificar secuencias.

Si una foto no puede publicarse, se retira: el componente vuelve a mostrar su ilustración.

**Videos:** seis videos de YouTube se muestran dentro de sus lecciones con el reproductor oficial (no se alojan en el sitio). Los audios y el audiolibro del material no se incluyen porque son de terceros y no son parte del curso.

**Descargas:** el docente confirmó que tiene derecho a redistribuir los libros y el material del kit y de los retos. Se publican Mundo Arduino, Robótica e IA (salvo dos PDF de más de 25 MB), el kit Elegoo y los 50 retos.

---

## 9. Privacidad y seguridad

- La plataforma no pide datos personales ni guarda registros de quien la usa; solo el progreso local en el navegador.
- El proyecto RFID se publica **sin credenciales**: WiFi y Firebase llevan marcadores. El configurador genera el código en el navegador.
- No se incluyen datos de estudiantes. Las reglas de Firebase del ejemplo son abiertas: deben protegerse antes de usar datos reales.

---

## 10. Estado de verificación

| Elemento | Estado |
|---|---|
| Sintaxis de todos los scripts | Comprobada con `node --check` |
| Datos (ids únicos, respuestas válidas, módulos con contenido) | Comprobados con script |
| Rutas, menú, lecciones, fichas y proyectos en el navegador | Comprobados sin errores de consola |
| Diseño y tipografía | Comprobados en escritorio (navegador de vista previa) |
| Diseño en teléfono | **Pendiente** |
| Configurador RFID abierto desde carpeta local (`file://`) | **Pendiente** |
| Código de Arduino y ESP32 en hardware real | **No probado** |
| Laboratorio USB con una placa conectada | **No probado** |
| Ejemplos de Tinkercad dentro de Tinkercad | **No probados** |
| Compatibilidad de Tinkercad con ESP32 | **No confirmada** en tinkercad.com |

---

## 11. Pendientes

1. Confirmar la licencia de las 43 fotos de tiendas y fuentes externas.
2. Probar el código RFID y los ejemplos de Arduino y ESP32 en placas reales.
3. Proteger la base de Firebase del proyecto RFID antes de usar datos reales de estudiantes.
4. Cambiar la clave WiFi que aparece en los archivos locales del proyecto RFID.
5. Revisar el diseño en teléfono y el menú lateral en pantallas pequeñas.
6. Implementar compilar y cargar en el laboratorio USB (requiere una herramienta en WebAssembly).
7. Confirmar en tinkercad.com las placas y componentes disponibles, y ajustar el módulo 8.
8. Agregar los proyectos de nivel 3 que faltan y el código de la estación ESP32.

---

## 12. Documentación relacionada

- [docs/CONTEXTO.md](docs/CONTEXTO.md): contexto, decisiones, historial y estado.
- [docs/INVENTARIO.md](docs/INVENTARIO.md): los documentos originales y el uso que se les dio.
- [docs/CREDITOS_IMAGENES.md](docs/CREDITOS_IMAGENES.md): autor, licencia y fuente de cada foto.
- [proyectos/control-acceso-rfid/README.md](proyectos/control-acceso-rfid/README.md): documentación del proyecto RFID (conexiones, Firebase y puesta en marcha).
