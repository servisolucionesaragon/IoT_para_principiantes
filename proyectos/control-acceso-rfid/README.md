# Control de acceso escolar con RFID

Sistema de control de acceso para un colegio. Cada estudiante tiene una tarjeta RFID. Al pasarla por el lector, el sistema registra **entrada** o **salida** con fecha y hora, guarda el registro en Firebase y lo muestra en una página web. La página se actualiza en tiempo real y permite exportar los registros a Excel (CSV).

---

## 1. Componentes

| Componente | Función |
|---|---|
| **Lector RFID RC522** (13.56 MHz) | Lee el UID de las tarjetas y llaveros RFID |
| **Tarjetas o llaveros RFID** | Identifican a cada estudiante |
| **Buzzer de 3 pines** | Emite pitidos para indicar el resultado de cada lectura |
| **Placa controladora** | Una de estas dos, según el proyecto: Arduino UNO R4 WiFi, o ESP32 DevKit |
| **Firebase Realtime Database** | Base de datos en la nube, gratuita, que guarda estudiantes, pendientes y registros |
| **Página web (`index.html`)** | Interfaz para ver registros, asignar tarjetas y exportar datos |

### Tipo de sensor
El RC522 usa comunicación **SPI** y funciona con la frecuencia de **13.56 MHz**, el estándar de tarjetas Mifare. Lee el **UID** (identificador único) de cada tarjeta. Solo se usa el UID; el sistema no guarda datos dentro de la tarjeta.

### Placas soportadas

| Placa | Carpeta / archivo | WiFi |
|---|---|---|
| Arduino UNO R4 WiFi | `Arduino R4/Arduino R4.ino` | WiFiS3 (incluido en la placa) |
| ESP32 DevKit V1 (30 pines) | `Esp32/esp32.ino` | WiFi.h (incluido en el paquete ESP32) |

Ambos códigos hacen lo mismo y usan la misma base de datos. Solo cambian los pines y la librería de WiFi.

---

## 2. Esquema de conexión

### 2.1 Arduino UNO R4 WiFi

**RC522 → Arduino**

| RC522 | Arduino UNO R4 |
|---|---|
| SDA (SS) | D10 |
| SCK | D13 |
| MOSI | D11 |
| MISO | D12 |
| RST | D9 |
| GND | GND |
| 3.3V | **3.3V** |
| IRQ | sin conectar |

**Buzzer de 3 pines → Arduino**

| Buzzer | Arduino |
|---|---|
| S (señal) | D6 |
| VCC | 5V |
| GND | GND |

### 2.2 ESP32 DevKit V1 (30 pines)

**RC522 → ESP32**

| RC522 | ESP32 |
|---|---|
| SDA (SS) | GPIO 5 |
| SCK | GPIO 18 |
| MOSI | GPIO 23 |
| MISO | GPIO 19 |
| RST | GPIO 22 |
| GND | GND |
| 3.3V | 3V3 |
| IRQ | sin conectar |

**Buzzer de 3 pines → ESP32**

| Buzzer | ESP32 |
|---|---|
| S (señal) | GPIO 4 |
| VCC | 3V3 (o VIN si suena muy bajo) |
| GND | GND |

### 2.3 Esquema general (ESP32)

```
   RC522                          ESP32 DevKit
┌──────────┐                   ┌──────────────┐
│ SDA ─────┼───────────────────┼── GPIO 5     │
│ SCK ─────┼───────────────────┼── GPIO 18    │
│ MOSI ────┼───────────────────┼── GPIO 23    │
│ MISO ────┼───────────────────┼── GPIO 19    │
│ RST ─────┼───────────────────┼── GPIO 22    │
│ GND ─────┼───────────────────┼── GND        │
│ 3.3V ────┼───────────────────┼── 3V3        │
└──────────┘                   │              │
                               │              │
   BUZZER (3 pines)            │              │
┌──────────┐                   │              │
│ S ───────┼───────────────────┼── GPIO 4     │
│ VCC ─────┼───────────────────┼── 3V3        │
│ GND ─────┼───────────────────┼── GND        │
└──────────┘                   └──────────────┘
```

> ⚠️ **El RC522 va SOLO a 3.3V.** Con 5V se puede dañar. En el Arduino, el buzzer va a 5V. En el ESP32, va a 3V3.

---

## 3. Cableado paso a paso

1. **Apaga la placa** y desconecta el USB antes de cablear.
2. **Conecta el RC522** según la tabla de la placa que uses. Usa cables dupont hembra-macho o una protoboard.
3. **Verifica el voltaje.** El pin 3.3V del RC522 debe ir al 3.3V de la placa, nunca al 5V.
4. **Conecta el buzzer** a la señal, alimentación y GND.
5. **Revisa cruzados.** Los errores más comunes son:
   - MOSI y MISO invertidos.
   - SDA conectado a un pin distinto del que dice el código.
   - RST sin conectar, o conectado al pin equivocado.
6. **Conecta el USB** y sube el código (sección 5).

### Cómo sabes que el cableado está bien

| Señal en el Monitor Serie | Significado |
|---|---|
| `WiFi OK. IP: 192.168.x.x` | El WiFi conectó correctamente |
| `Listo. Acerca una tarjeta...` | El RC522 arrancó |
| `Tarjeta: XXXXXXXX` | El lector detectó una tarjeta |
| `Tarjeta nueva, pendiente de asignar` | La tarjeta se envió a Firebase |

---

## 4. Conexión a Firebase

### 4.1 Crear la base de datos

1. Entra a [console.firebase.google.com](https://console.firebase.google.com) con tu cuenta de Google.
2. Pulsa **Crear proyecto** y ponle un nombre, por ejemplo `control-acceso`.
3. Ve a **Compilación → Realtime Database → Crear base de datos**.
4. Elige la ubicación y pulsa **Iniciar en modo de prueba**.
5. Copia la URL de la base de datos. Tiene esta forma:
   `https://TU-PROYECTO-default-rtdb.firebaseio.com`

### 4.2 Reglas de seguridad

En la pestaña **Reglas**, pega esto y pulsa **Publicar**:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

> ⚠️ Estas reglas son **abiertas**: cualquiera que conozca la URL puede leer y escribir la base. Sirven para pruebas. Antes de usar datos reales de estudiantes, hay que agregar autenticación.

### 4.3 Dónde se configura la URL

Hay que usar dos formatos distintos según el archivo:

| Archivo | Variable | Formato |
|---|---|---|
| `Arduino R4.ino` / `esp32.ino` | `FB_HOST` | Solo el host, **sin** `https://` ni `/` final |
| `index.html` | `DB_URL` | URL completa, **con** `https://` y sin `/` final |

Ejemplo:
```cpp
// En el Arduino o ESP32
const char* FB_HOST = "TU-PROYECTO-default-rtdb.firebaseio.com";
```
```js
// En index.html
const DB_URL = "https://TU-PROYECTO-default-rtdb.firebaseio.com";
```

### 4.4 Estructura de datos

Firebase crea estas carpetas solo, cuando el sistema escribe en ellas:

```
estudiantes/
  A1B2C3D4/          ← UID de la tarjeta
    nombre: "Ana Pérez"
    documento: "1023456789"
pendientes/
  E5F6A7B8/          ← tarjetas leídas aún sin asignar
    ts: 1760000000000
abierto/
  A1B2C3D4: true     ← true = el estudiante está dentro
registros/
  -Nabc123/          ← cada pase (generado por Firebase)
    uid, nombre, documento
    tipo: "entrada" | "salida"
    ts: 1760000000000   ← fecha y hora (servidor de Firebase)
```

| Carpeta | Quién escribe | Qué guarda |
|---|---|---|
| `estudiantes` | La web (al asignar) | Datos de cada tarjeta asignada |
| `pendientes` | El lector (tarjeta nueva) | UIDs que faltan por asignar |
| `abierto` | El lector | Si la persona está dentro o fuera |
| `registros` | El lector | Historial de entradas y salidas |

La fecha y la hora las pone el servidor de Firebase con `{".sv":"timestamp"}`. Por eso el ESP32 y el Arduino no necesitan reloj ni NTP.

---

## 5. Código y puesta en marcha

### 5.1 Librerías necesarias

| Placa | Librerías |
|---|---|
| Arduino UNO R4 WiFi | **MFRC522** (de GithubCommunity). WiFiS3 viene con el paquete de la placa. |
| ESP32 | **MFRC522**. Instala también el paquete **esp32 by Espressif Systems**. |

Para instalar: en el Arduino IDE ve a **Herramientas → Administrar bibliotecas** o al **Gestor de placas**.

### 5.2 Configurar el código

Edita estas líneas antes de subir el código:

```cpp
const char* WIFI_SSID = "NOMBRE_DE_TU_WIFI";
const char* WIFI_PASS = "CLAVE_DE_TU_WIFI";
const char* FB_HOST   = "TU-PROYECTO-default-rtdb.firebaseio.com";
```

- La red WiFi debe ser de **2.4 GHz**. La placa no se conecta a 5 GHz.
- El buzzer tiene la opción `ACTIVO_BAJO`. Si tu buzzer suena todo el tiempo, cámbiala a `true`. Si no suena nunca, déjala en `false`.

### 5.3 Subir el código

**Arduino UNO R4 WiFi**
1. Selecciona la placa **Arduino UNO R4 WiFi** y su puerto.
2. Sube `Arduino R4/Arduino R4.ino`.

**ESP32**
1. Selecciona **ESP32 Dev Module** y su puerto.
2. Sube `Esp32/esp32.ino`.
3. Si la subida se queda en "Connecting...", mantén presionado el botón **BOOT** hasta que empiece.

Después abre el **Monitor Serie a 115200 baudios**.

### 5.4 Qué hace el código

1. Conecta al WiFi y espera una IP válida.
2. Espera una tarjeta. Al leer el UID, consulta Firebase:
   - **Si el UID está en `estudiantes`:** es un registro normal. Si estaba fuera, registra **entrada**. Si estaba dentro, registra **salida**. Actualiza `abierto`.
   - **Si no está en `estudiantes`:** se guarda en `pendientes` para asignarlo desde la web.
   - **Si hay error de red:** avisa con tres pitidos.
3. Espera 2 segundos antes de leer otra tarjeta.

### 5.5 Pitidos del buzzer

| Pitidos | Significado |
|---|---|
| 1 corto | Entrada |
| 2 cortos | Salida |
| 2 largos | Tarjeta nueva, pendiente de asignar |
| 3 medios | Error de conexión con Firebase |

---

## 6. Página web (`index.html`)

### 6.1 Cómo abrirla

1. Edita la variable `DB_URL` con tu URL de Firebase.
2. Haz doble clic en `index.html`. Se abre en cualquier navegador.

No necesita servidor ni instalación.

### 6.2 Qué muestra

| Sección | Contenido |
|---|---|
| **Cabecera** | Indicador de conexión (● En vivo / ○ Reconectando) y contador **Dentro ahora** |
| **Tarjetas nuevas por asignar** | UID, campo para nombre y documento, botones **Asignar** y **Descartar** |
| **Registrar acceso manual** | Elige un estudiante y registra **entrada** o **salida** a mano (visitas, olvidos de tarjeta) |
| **Registros** | Tabla con fecha, hora, nombre, documento y tipo. Se puede filtrar por texto, fecha y tipo |
| **Estudiantes registrados** | Lista de estudiantes con botón **Eliminar** |

### 6.3 Funciones

- **Tiempo real:** la página mantiene una conexión abierta con Firebase. Los pases aparecen al instante, sin recargar.
- **Asignar tarjeta:** escribe nombre y documento de una tarjeta pendiente y pulsa **Asignar**. La tarjeta pasa a estudiantes.
- **Registrar acceso manual:** elige al estudiante y pulsa **Registrar entrada** o **Registrar salida**. La página no deja registrar una entrada si la persona ya figura dentro, ni una salida si figura fuera. El registro se guarda con `manual: true`.
- **Filtrar:** busca por nombre o documento, filtra por fecha y por tipo (entrada o salida).
- **Exportar a Excel:** pulsa **Exportar a Excel (CSV)**. El archivo usa `;` como separador y UTF-8 con BOM, así Excel lo abre con las columnas separadas y con tildes correctas.
- **Eliminar estudiante:** borra el estudiante y su estado en `abierto`. No borra su historial en `registros`.

### 6.4 Indicador de conexión

| Indicador | Significado | Qué hacer |
|---|---|---|
| ● En vivo | Conectado | Nada |
| ○ Reconectando... | Se perdió la conexión | Esperar; se reconecta solo |
| ○ Sin permiso | Firebase rechaza la lectura | Revisar las reglas (sección 4.2) |

---

## 7. Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| `IP: 0.0.0.0` | El router no ha asignado IP | Usa 2.4 GHz y presiona RESET |
| No lee tarjetas | Cableado o pines | Revisa SDA, SCK, MOSI, MISO y RST. Alimentación 3.3V |
| "Error de conexión con Firebase" | `FB_HOST` mal escrito | Sin `https://` y sin `/` al final |
| La web no muestra datos | Reglas o `DB_URL` | Publica las reglas y revisa la URL |
| Página en blanco o error en rojo | Firebase rechaza la petición | Ve a la consola del navegador (F12) |
| Buzzer suena sin parar | Activo al revés | Cambia `ACTIVO_BAJO` |
| Buzzer no suena | Pin o alimentación | Revisa D6 (Arduino) o GPIO 4 (ESP32) y VCC |
| Excel muestra todo en una columna | Separador | Usa Datos → Desde texto/CSV y elige `;` |

Para ver los datos crudos de la base, abre en el navegador:
`https://TU-PROYECTO-default-rtdb.firebaseio.com/registros.json`

---

## 8. Seguridad

- **Las reglas son abiertas.** Cualquiera con la URL puede leer y escribir la base de datos. Usar solo para pruebas o proyectos sin datos sensibles.
- **La clave WiFi está escrita en el código.** No subas el archivo a internet con la clave real.
- **El ESP32 no valida el certificado de Firebase** (`client.setInsecure()`). Es suficiente para un proyecto escolar, pero no para producción.
- **Los datos de estudiantes son personales.** Revisa las normas de protección de datos de tu institución antes de usarlos con datos reales.

---

## 9. Mejoras posibles

- Autenticación en Firebase y reglas que solo permitan escribir a la placa y leer a usuarios autorizados.
- Integración con Google Sheets mediante Apps Script.
- Notificaciones por correo o WhatsApp a los acudientes al registrar una entrada o salida.
- Reporte diario de asistencia.
- Aplicación móvil.

---

## 10. Estructura de archivos

```
Control de acceso RFID/
├── README.md                   ← esta documentación
├── index.html                  ← página web (ver, asignar y registrar accesos)
├── Arduino R4/
│   ├── Arduino R4.ino          ← código para Arduino UNO R4 WiFi
│   ├── arduino R4.png          ← imagen de referencia
│   └── .DS_Store               ← archivo del sistema (ignorar)
└── Esp32/
    ├── esp32.ino               ← código para ESP32 DevKit
    ├── esp32.png               ← imagen de referencia
    └── esp32_pines_reales.png  ← diagrama de conexión del ESP32
```

Antes de publicar el proyecto, el archivo `.ino` con la clave WiFi y la URL de Firebase no debe subirse con datos reales (ver sección 8).

## Créditos

Proyecto escolar de control de acceso con RFID, Firebase y web. Desarrollado con apoyo de Claude (Anthropic).
