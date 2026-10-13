# Contexto del proyecto · IoT para Principiantes

Documento para retomar el trabajo desde otra computadora o en una sesión nueva. Léelo antes de cambiar nada.

## Identidad

- **Nombre:** IoT para Principiantes
- **Carpeta local:** `Z:\Proyectos (F) PC\Material  IoT\plataforma-iot` (la carpeta padre `Material  IoT` contiene los documentos originales; **no** se suben al repositorio)
- **Repositorio:** https://github.com/servisolucionesaragon/IoT_para_principiantes
- **Sitio (Cloudflare Workers, plan gratuito):** https://iot-para-principiantes.servisolucionesti.workers.dev/
- **Idioma:** español en toda la interfaz y el contenido.

## Encargo original (resumen)

Plataforma web interactiva para personas que empiezan desde cero en IoT, Arduino, ESP32, sensores y simulación. Debe convertir el material en una guía práctica (concepto → conexión → código → prueba), con laboratorio USB para programar desde el navegador cuando sea viable.

## Decisiones tomadas (y por qué)

1. **Sitio estático, sin build ni framework** (HTML/CSS/JS). Motivo: no hay backend, el alcance cabe en archivos simples, y es lo que mejor se publica en Workers gratis.
2. **Contenido original.** Los libros del material tienen derechos reservados («uso personal… prohibida su copia, distribución»). La plataforma se publica en internet, así que se usan solo para elegir temas y citar fuentes. Ningún párrafo se copia.
3. **Material y fuentes reales:** se revisaron los 64 archivos (texto con PyMuPDF; páginas-imagen con OCR RapidOCR). Ver [INVENTARIO.md](INVENTARIO.md).
4. **Hallazgo importante:** el material trata sobre todo de **Arduino UNO con PictoBlox** y robótica infantil. **ESP32 aparece en una sola mención** y **Tinkercad en ninguna**. Por eso la lección de ESP32 se basa en documentación técnica pública y está marcada para verificar.
5. **Tinkercad:** según fuentes secundarias (no oficiales), no incluye ESP32. No se pudo confirmar en tinkercad.com. La lección 8 lo marca como pendiente de verificación.
6. **Laboratorio USB, versión 1:** Web Serial (conexión, monitor, editor, envío de texto). **Compilar y cargar quedan pendientes**: requieren un compilador y cargador en el navegador, que no se integró.
7. **Nombres e identidad:** el proyecto se llama «IoT para Principiantes» (indicación del usuario).
8. **Material Elegoo (2026-10-12):** el usuario añadió `Espanol Elegoo` (kit Smart Car con Arduino UNO). Se creó el Módulo 9 con 6 lecciones. Pines verificados contra la tabla de cableado y el código del kit. Código propio: no se copian los programas del kit. El kit usa lógica de sensores de línea distinta entre programas (lección 5 vs. lección 2); se documenta.
9. **Publicación:** repositorio y URL de Cloudflare indicados por el usuario. Sitio estático en Workers gratis (sin costo). Cualquier servicio de pago debe consultarse antes.

## Estado al cierre de esta sesión

| Parte | Estado |
|---|---|
| Lecciones (23) en 9 módulos (incluye 6 del kit Elegoo) | Escritas. Datos verificados con script (ids únicos, respuestas válidas) |
| Cuestionarios por lección | Incluidos (1–2 preguntas cada uno) |
| Proyectos (4) | 3 con código de ejemplo, 1 de diseño (estación ESP32, sin código) |
| Diagnóstico (11) y retos (5) | Incluidos |
| Buscador, progreso, modo oscuro, móvil | Implementados; **prueba completa en navegador pendiente** |
| Laboratorio USB (v1) | Implementado sin probar con hardware |
| Código de ejemplo en hardware (UNO, ESP32, coche Elegoo) | **No probado** |
| Documentación | README.md, docs/INVENTARIO.md, docs/CONTEXTO.md |

## Cómo continuar

```bash
cd "Z:\Proyectos (F) PC\Material  IoT\plataforma-iot"
python -m http.server 5741
```

Abre http://localhost:5741. Si el navegador de la vista previa no abre el puerto, usa el navegador del sistema.

Comprobaciones rápidas antes de publicar:

```bash
node --check js/contenido.js && node --check js/app.js && node --check js/laboratorio.js
```

## Estructura del código

- `js/contenido.js`: datos (LECCIONES, PROYECTOS, DIAGNOSTICO, RETOS, MODULOS) y diagramas SVG. Las lecciones son HTML escrito a mano. Cada `cod()` escapa el código.
- `js/app.js`: rutas por hash, render, cuestionarios, copiar código, progreso (`localStorage` con clave `iot-progreso-v1`), búsqueda, tema.
- `js/contenido-elegoo.js`: Módulo 9 (se carga después de contenido.js; agrega MODULOS y LECCIONES).
- `js/laboratorio.js`: Web Serial. Expone `window.montarLaboratorio`.
- Para añadir una lección: agregar un objeto a `LECCIONES` con `id`, `modulo`, `titulo`, `cuerpo`, `quiz`, `fuentes`. El menú y el buscador se generan solos.

## Pendientes (en orden sugerido)

1. Probar el sitio en el navegador (menú, cuestionarios, copiar, búsqueda, modo oscuro, móvil).
2. Probar los ejemplos en **Arduino UNO** real y luego en **ESP32** real. Anotar resultados en la lección correspondiente.
3. Verificar Tinkercad en tinkercad.com (placas y componentes disponibles). Actualizar la lección 8.
4. Laboratorio: decidir herramienta de compilación (p. ej., Arduino CLI en WebAssembly) y de carga para UNO/ESP32. Antes, documentar navegadores y sistemas probados.
5. Proyectos de nivel 3 y código del proyecto de diseño (estación ESP32).
6. Revisar citas a los libros con el texto OCR completo.

## Publicación

- **GitHub:** repositorio `servisolucionesaragon/IoT_para_principiantes`. Sube solo la carpeta `plataforma-iot` (nunca los PDF ni el instalador). Pendiente de confirmar que el push se completó (ver nota de la sesión).
- **Cloudflare:** Workers con activos estáticos, nombre `iot-para-principiantes`, cuenta de Servisolucionesti. Usar la CLI `cf` (no hay `wrangler.toml` en el proyecto; ver CLAUDE.md global). Plan gratuito.
- Después de cada cambio: actualizar la documentación (README y este archivo) y volver a publicar.

## Notas del entorno

- OCR instalado localmente: `rapidocr_onnxruntime` (pip). Solo para leer el material, no forma parte del sitio.
- Los archivos de trabajo temporales (textos extraídos, imágenes) están en el directorio de sesión y **no** están en este proyecto. Si se necesitan de nuevo, se regeneran con PyMuPDF y RapidOCR.
- El panel de vista previa del escritorio lanzó otro proyecto (LJV) en el puerto 5731. Para este sitio usa el comando de arriba.

## Preferencias del usuario (para trabajar con él)

- Responder y documentar en español.
- Quiere la documentación dentro de la carpeta del proyecto, para retomarla desde otra computadora.
- Antes de gastar o borrar algo en Cloudflare, consultar. Usar solo plan gratuito.
- Advertencias de seguridad: no exponer credenciales; no afirmar que algo funciona en hardware sin probarlo.

## Actualización 2026-10-12 (segunda parte)

- **Sensores y dispositivos:** 26 fichas (resistencias, protoboard, LED, pulsador, potenciómetro, LDR, buzzer, PIR, IR de obstáculos, inclinación, MPU-6050, MQ-2, MQ-135, LM35, DHT11, humedad de suelo, sonido, joystick, RFID RC522, GPS NEO-6M, relé, servo, motor DC, LCD I²C, HC-06, HC-SR04). Cada una con funcionamiento, conexión, código y precauciones.
- **Resistencias:** código de colores, LED, potencia, serie/paralelo, divisor y pull-up.
- **Protoboard:** qué es, cómo se unen los orificios, uso paso a paso, errores frecuentes (ficha y lección 5).
- **Diagramas de conexión gráficos:** Arduino UNO y ESP32 DevKit con los pines de cada práctica resaltados (`js/diagramas.js`). Pinout del ESP32 simplificado: confirma la numeración de tu placa.
- **Imágenes:** ilustraciones SVG **originales** (`js/imagenes.js`). No se usan fotos de los kits ni de los libros: publicarlas en un sitio público redistribuiría material con derechos de autor. Propuesta pendiente: si quieres fotos reales, hay que decidir con el docente qué material puede publicarse.
- **Biblioteca de proyectos:** 18 proyectos (niveles 1–4), filtro por sensor, imagen de diagrama en el proyecto RFID.
- **Proyecto RFID de la carpeta `Proyectos/Control de acceso RFID`** (`acceso-rfid-nube`): aportado por el docente. Se publicó la versión ESP32 **sin credenciales**: el original tenía la contraseña del WiFi, el host real de Firebase y guardaba el documento de identidad de estudiantes. Esos datos no deben publicarse. Se quitó también el campo `documento`. Pendiente: que el docente revise las reglas de su base de datos (si son públicas, cualquiera puede leer o escribir).
- **Material Elegoo:** Módulo 9 (6 lecciones del coche inteligente).
- **Publicación:** `publicar/publicar.mjs` (Worker `iot-para-principiantes`, plan gratuito). Ver README.
- **Pendientes nuevos:** probar los diagramas y el filtro en el navegador de escritorio; revisar que el navegador no conserve versiones antiguas (se añadió `?v=` a los recursos); decidir si se usan fotos reales.

### Publicación: cómo se hizo (2026-10-12)

- URL en vivo: https://iot-para-principiantes.servisolucionesti.workers.dev/ (verificada: HTTP 200 en index, scripts, estilos e imagen).
- `node publicar/publicar.mjs` **falla con código 127** en esta máquina: el `spawnSync` de Node no encuentra `cf`. Con el mismo comando desde la terminal, `cf deploy` funciona. Mientras no se corrija, publica así:
  ```
  cd publicar
  rm -rf sitio && mkdir sitio && cp -r ../index.html ../css ../js ../img sitio/
  cf deploy
  ```
- `publicar.mjs` ya incluye `img/` en la lista de archivos a publicar (antes faltaba y la imagen del proyecto RFID daba 404).
