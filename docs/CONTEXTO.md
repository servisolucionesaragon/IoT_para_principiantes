# Contexto del proyecto · IoT para principiantes

Documento para retomar el trabajo desde otra computadora o en una sesión nueva. Léelo antes de cambiar nada. Se actualizó el 2026-10-13.

## 1. Identidad

- **Nombre:** IoT para principiantes (indicado por el usuario).
- **Carpeta local:** `Z:\Proyectos (F) PC\Material  IoT\plataforma-iot`. La carpeta padre `Material  IoT` contiene los documentos originales y **no** se publica.
- **Repositorio:** https://github.com/servisolucionesaragon/IoT_para_principiantes (rama `main`).
- **Sitio:** https://iot-para-principiantes.servisolucionesti.workers.dev/ (Cloudflare Workers, plan gratuito, cuenta Servisolucionesti).
- **Idioma:** español en toda la interfaz y el contenido.
- **Documentación de referencia:** [README.md](../README.md) (guía del sitio) y [proyectos/control-acceso-rfid/README.md](../proyectos/control-acceso-rfid/README.md) (proyecto RFID).

## 2. Encargo original

Plataforma web interactiva para personas que empiezan desde cero en IoT, Arduino, ESP32, sensores y simulación. Convierte el material en una guía práctica (concepto → conexión → código → prueba), con un laboratorio USB para programar desde el navegador cuando sea viable, y tutorial de simulación con Tinkercad.

## 3. Decisiones tomadas (y por qué)

1. **Sitio estático sin compilación** (HTML, CSS y JavaScript). No hay backend y así se publica gratis en Workers.
2. **Contenido original.** Los libros del material tienen derechos reservados. Se usaron para elegir temas y verificar secuencias; no se copió su texto ni se publican sus PDF.
3. **Material revisado:** 64 archivos de `Material  IoT` (texto con PyMuPDF; páginas-imagen con OCR RapidOCR). Ver [docs/INVENTARIO.md](INVENTARIO.md).
4. **ESP32 y Tinkercad casi no aparecen en el material.** Las lecciones de ESP32 se basan en documentación pública y se marcan para verificar. Tinkercad: según fuentes secundarias no admite ESP32; no confirmado en tinkercad.com.
5. **Laboratorio USB (v1):** Web Serial (conexión, monitor, editor). Compilar y cargar quedan pendientes.
6. **Kit Elegoo (`Espanol Elegoo`):** módulo 9 con seis lecciones. Pines contrastados con la tabla de cableado y el código del kit. Código propio: no se copian los programas del kit. El kit usa lógica distinta en los sensores de línea entre sus lecciones 2 y 5; se documenta.
7. **Proyecto RFID (`Proyectos/Control de acceso RFID`):** aportado por el docente. La versión pública **no tiene credenciales**: WiFi y Firebase llevan marcadores. Se quitó el campo `documento` (dato personal de estudiantes). El configurador genera el código en el navegador.
8. **Fotos reales:** se usan con la autorización del docente. Son de tiendas, de Google, de fabricantes y de Wikimedia (con licencias libres). 43 de 48 tienen la licencia **pendiente de confirmar**. Créditos en [CREDITOS_IMAGENES.md](CREDITOS_IMAGENES.md). Las ilustraciones SVG propias cubren los componentes sin foto.
9. **Descargas (2026-10-13):** el docente confirmó que puede redistribuir los libros y el material (Mundo Arduino, Robótica e IA, kit Elegoo y 50 retos). Se publicaron 41 archivos en `descargas/` y la página `#/descargas`. Cloudflare no sirve archivos de más de 25 MB: quedan pendientes el «Tomo 3» (61 MB) y «Inteligencia Artificial Educativa – Aprende IA Jugando» (31 MB). Decisión pendiente: dividirlos en partes o alojarlos fuera (R2 tiene plan gratuito; consultar antes).
10. **Señales:** se agregó una lección de señales analógicas y digitales en el módulo 1 (gráficas SVG generadas en el navegador, muestreo, resolución del ADC y PWM).
11. **Diseño:** tipografía Lexend (legibilidad), Tailwind por CDN, logo y favicon propios, texto a todo el ancho, visor de imágenes a pantalla completa y «Continuar donde quedaste».
12. **Publicación:** Cloudflare está conectado a GitHub. Cada `push` a `main` se publica solo (ver sección 7).

## 4. Estado actual

| Parte | Estado |
|---|---|
| Lecciones | 30 en 9 módulos (módulo 8: tutorial de Tinkercad y 6 ejemplos; módulo 9: coche Elegoo) |
| Sensores y dispositivos | 49 fichas, 48 con foto real (una sección para resistencias), con práctica interactiva y ejemplos resueltos de resistencias |
| Proyectos | 18 proyectos en niveles 1 a 4, con filtro por sensor. El RFID incluye diagramas, configurador, sección de web y de buzzer |
| Diagnóstico y retos | 11 problemas y 5 retos |
| Herramientas | Laboratorio USB (sin compilar ni cargar), configurador RFID, buscador, visor de imágenes, progreso local |
| Publicación | Automática por Git (verificada); respaldo con `cf deploy` |
| Verificado | Sintaxis, datos, rutas y consola en el navegador de vista previa |
| **No verificado** | Diseño en teléfono; configurador abierto desde `file://`; código en hardware real; laboratorio USB con placa; ejemplos de Tinkercad dentro de Tinkercad; compatibilidad de Tinkercad con ESP32 |

## 5. Cómo continuar

Probar el sitio en local:

```bash
cd "Z:\Proyectos (F) PC\Material  IoT\plataforma-iot"
```

```bash
python -m http.server 5741
```

Abre http://localhost:5741. Si el navegador de la vista previa no abre ese puerto, usa el navegador del sistema.

Comprobación de sintaxis antes de subir cambios:

```bash
node --check js/app.js
```

## 6. Estructura del código

- `js/app.js`: rutas por hash, render, cuestionarios, copiar código, progreso (`iot-progreso-v1`), última lección (`iot-ultima`), búsqueda, tema, visor de imágenes y configurador.
- `js/contenido.js`: lecciones base (módulos 1 a 7), diagnóstico, retos, módulos y utilidades (`esc`, `cod`, `caja`, `tabla`, `figura`).
- `js/contenido-elegoo.js`: módulo 9. `js/tinkercad.js`: módulo 8 (reemplaza `m8-tinkercad` e inserta los ejemplos). `js/senales.js`: lección «Señales analógicas y digitales» (módulo 1, insertada después de «Electricidad básica»).
- `js/componentes.js` y `js/componentes-nuevos.js`: fichas de sensores, categorías y ficha de resistencias. `js/resistencias-practica.js`: práctica interactiva.
- `js/proyectos-extra.js`: 18 proyectos. El RFID agrega `accion`, `diagramas`, `web` y `configuracion`.
- `js/diagramas.js` y `js/diagramas-rfid.js`: diagramas SVG. `js/imagenes.js`: ilustraciones. `js/imagenes-reales.js`: fotos con autor y licencia.
- `js/configurador-rfid.js` y `js/plantillas-rfid.js`: configurador del proyecto RFID (plantillas incluidas en el archivo para funcionar también desde `file://`).
- `js/laboratorio.js`: laboratorio USB (Web Serial).
- `plantillas/rfid/`: plantillas públicas (sin credenciales) que usa el configurador en el sitio.
- `proyectos/control-acceso-rfid/`: código ESP32 y Arduino R4, página web y README del proyecto RFID (copia pública con marcadores).

Para agregar una lección: objeto en `LECCIONES` con `id`, `modulo`, `titulo`, `cuerpo`, `quiz` y `fuentes`. Para una foto: registrarla en `js/imagenes-reales.js` con autor, licencia y fuente.

**Cambios visibles en el navegador:** subir el número de versión (`?v=...`) de los scripts y el CSS en `index.html`. Sin eso el navegador puede seguir usando la versión anterior.

## 7. Publicación

**Flujo normal (automático):**

```bash
git add -A
```

```bash
git commit -m "descripción del cambio"
```

```bash
git push
```

Cloudflare publica el cambio en un minuto aproximadamente. Verificado: los builds de los últimos commits terminaron con éxito y el sitio en vivo tiene el último cambio.

**Respaldo (`cf deploy`):** `node publicar/publicar.mjs` falla con código 127 en esta máquina (el proceso de Node no encuentra `cf`). Procedimiento que sí funciona, desde la carpeta `publicar`:

```bash
rm -rf sitio && mkdir sitio && cp -r ../index.html ../css ../js ../img ../plantillas sitio/
```

```bash
cf deploy
```

**Verificación de seguridad:** las carpetas internas (`README.md`, `publicar/`, `proyectos/`, `docs/`) responden 404 en el sitio. `plantillas/rfid/` se publica a propósito, porque el configurador la necesita, y ya no contiene credenciales.

## 8. Pendientes

1. **Derechos:** confirmar la licencia de las 43 fotos pendientes. Si alguna no puede publicarse, retirarla (vuelve la ilustración).
2. **Hardware:** probar en placas reales el código del proyecto RFID, los ejemplos de Arduino y ESP32, y el coche Elegoo.
3. **Seguridad RFID:** cambiar la clave WiFi que está escrita en los archivos locales del proyecto RFID del docente (no se incluye aquí). Revisar las reglas de Firebase (hoy abiertas) antes de usar datos reales.
4. **Diseño:** revisar en teléfono el menú lateral, el visor de imágenes y la cabecera.
5. **Configurador:** probar el archivo `index.html` abierto desde la carpeta local (`file://`).
6. **Laboratorio USB:** implementar validar, compilar y cargar (requiere una herramienta en WebAssembly).
7. **Tinkercad:** confirmar en tinkercad.com las placas y componentes, y probar los seis ejemplos dentro de la herramienta. Ajustar nombres de botones si cambian.
8. **Descargas pendientes:** dos PDF de más de 25 MB (ver decisión en la sección 3). Contenido: proyectos de nivel 3 que faltan y código de la estación ESP32; revisar las citas a los libros con el OCR completo; diagrama del ESP32 con la numeración de la placa real.
9. **Publicación:** revisar por qué `publicar.mjs` no encuentra `cf` (opcional, ya no es necesario con el despliegue por Git).

## 9. Preferencias del usuario

- Todo en español: interfaz, documentación y respuestas.
- La documentación se guarda dentro de la carpeta del proyecto, para retomar desde otra computadora.
- Antes de gastar o borrar algo en Cloudflare, consultar. Usar solo el plan gratuito.
- No exponer credenciales ni datos personales en los archivos publicados.
- No afirmar que algo funciona en hardware sin probarlo.
- El usuario envía imágenes una a una y pide reemplazos; las guarda con la ruta de la sesión o pasa enlaces de tiendas. Cuando no hay archivo ni ruta, se pide que lo guarde en `img/componentes`.

## 10. Notas del entorno

- Los archivos temporales de trabajo (textos extraídos del material, imágenes de la sesión, OCR) están fuera del proyecto. Si hacen falta, se regeneran con PyMuPDF y RapidOCR (`rapidocr_onnxruntime`).
- El navegador de vista previa a veces lanza otro proyecto (LJV) en el puerto 5731. Para este sitio usa el puerto 5741 indicado arriba.
- El navegador de vista previa no puede abrir archivos locales (`file://`) ni algunos sitios que bloquean consultas automáticas (MercadoLibre y Servotronik devolvieron páginas de verificación).
