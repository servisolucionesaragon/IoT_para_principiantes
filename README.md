# IoT para Principiantes

Plataforma web educativa, en español, para aprender **electrónica, Arduino, ESP32, sensores e IoT desde cero**.
Cada lección combina concepto, conexión, código para copiar, prueba y cuestionario con retroalimentación.

**Sitio publicado (Cloudflare Workers, plan gratuito):** https://iot-para-principiantes.servisolucionesti.workers.dev/

> Documentación de contexto para retomar el trabajo desde otra computadora: [docs/CONTEXTO.md](docs/CONTEXTO.md).

## Qué incluye

| Sección | Contenido |
|---|---|
| Módulos 1–8 | 17 lecciones: IoT, electricidad básica, seguridad, Arduino, ESP32, sensores (potenciómetro/LDR, DHT11, HC-SR04, servo SG90), montaje en protoboard, depuración con `millis()`, datos IoT (HTTP/MQTT) y Tinkercad |
| Módulo 9 | 6 lecciones del coche inteligente con Arduino UNO (kit Elegoo): ensamblaje y pines, movimiento, Bluetooth HC-06, infrarrojos, evitar obstáculos y seguir línea |
| Proyectos | 4 proyectos con materiales, conexiones, código, pruebas, problemas frecuentes y mejoras (3 con código de ejemplo y 1 de diseño; ningún código está probado en hardware) |
| Solución de problemas | 11 problemas frecuentes con causas, comprobaciones y solución |
| Retos | 5 retos con pistas progresivas |
| Recursos | Resumen de los documentos originales y su uso ([docs/INVENTARIO.md](docs/INVENTARIO.md)) |
| Laboratorio USB | Conexión por Web Serial, monitor serie, editor con ejemplos y copiar código. **Compilar y cargar no están implementados aún** |
| Utilidades | Buscador, progreso guardado en el navegador, modo claro/oscuro, menú adaptable a móvil |

## Ver en local

No requiere instalación ni compilación (HTML, CSS y JavaScript sin dependencias).

```bash
cd plataforma-iot
python -m http.server 5741
```

Abre http://localhost:5741 en el navegador.

## Estructura

```
plataforma-iot/
├── index.html          Página base (cabecera, menú, buscador)
├── css/estilos.css     Estilos; modo claro/oscuro con variables CSS
├── js/contenido.js     Lecciones, proyectos, diagnóstico, retos y diagramas SVG
├── js/app.js           Enrutado (#/…), cuestionarios, copiar código, progreso, búsqueda
├── js/contenido-elegoo.js Módulo 9 (kit Elegoo Smart Car)
├── js/laboratorio.js   Laboratorio USB (Web Serial)
├── docs/CONTEXTO.md    Decisiones, estado y pendientes (para retomar el trabajo)
├── docs/INVENTARIO.md  Índice de los 64 documentos originales y su uso
└── .claude/launch.json Configuración del servidor de vista previa
```

Rutas internas: `#/inicio`, `#/leccion/<id>`, `#/modulo/<id>`, `#/proyectos`, `#/proyecto/<id>`, `#/diagnostico`, `#/retos`, `#/recursos`, `#/laboratorio`.

## Estado de verificación

Lo que se comprobó y lo que **no**:

| Elemento | Estado |
|---|---|
| Sintaxis de los scripts | Comprobada (`node --check`) |
| Consistencia de datos (ids únicos, respuestas válidas, módulos con contenido) | Comprobada con un script |
| Archivos servidos correctamente | Comprobado (HTTP 200) |
| Comportamiento en el navegador (menú, cuestionarios, copiar, búsqueda) | Pendiente de prueba completa en el navegador de vista previa |
| Ejemplos de código en **hardware real** | **No probados** |
| Laboratorio USB con una placa conectada | **No probado** (requiere hardware) |
| Compatibilidad de Tinkercad con ESP32 | **No verificado** en tinkercad.com. Fuentes secundarias indican que no lo incluye; confírmalo |

Los fragmentos marcados como ilustrativos (por ejemplo, el envío HTTP del Módulo 7) no son ejecutables tal cual.

## Laboratorio USB: alcance actual

- **Funciona (en diseño):** solicitar permiso al usuario, abrir el puerto, leer y enviar texto, desconexión segura, editor con ejemplos.
- **Pendiente:** validar, compilar y cargar el programa a la placa. Requiere un compilador (por ejemplo, Arduino CLI compilado a WebAssembly) y un cargador compatible con Arduino UNO y ESP32. Mientras tanto, carga los programas con el Arduino IDE.
- Compatibilidad: Chrome o Edge de escritorio, con `https://` o `localhost`. Firefox y Safari no soportan Web Serial.
- El navegador no informa el modelo de la placa. Solo se muestra una pista a partir del identificador USB (por ejemplo, 0x1A86 = CH340), que no es una identificación definitiva.

## Contenido y derechos

- Las explicaciones son **originales**. Los documentos del material (libros con derechos reservados) se usaron para elegir temas, verificar secuencias y citar la fuente. No se copió su texto.
- No se publican los PDF ni el instalador de PictoBlox.
- Este repositorio no contiene credenciales. Las plantillas de Wi-Fi usan marcadores (`NOMBRE_DE_TU_RED`); no añadas claves reales al código compartido.

## Pendiente

1. Probar los ejemplos de código en hardware real (Arduino UNO y ESP32) y registrar el resultado.
2. Completar el laboratorio: validar, compilar y cargar (decidir la herramienta de compilación).
3. Verificar la compatibilidad de Tinkercad (placas y componentes) en tinkercad.com y actualizar la lección 8.
4. Añadir los proyectos de nivel 3 y el código del proyecto de diseño (estación ESP32).
5. Revisar la cita del libro 5 de «Mundo Arduino» (OCR completo; el pulsador aparece ahí).
6. Probar el coche Elegoo en hardware: sentidos de los motores, lectura de los sensores de línea (HIGH/LOW), códigos del control IR y calibración del servo.

## Publicación

- GitHub: https://github.com/servisolucionesaragon/IoT_para_principiantes
- Cloudflare Workers (sitio estático, plan gratuito): https://iot-para-principiantes.servisolucionesti.workers.dev/

Para actualizar el sitio después de un cambio, ver la sección de publicación en [docs/CONTEXTO.md](docs/CONTEXTO.md).
