/* Biblioteca de proyectos ampliada (niveles 1 a 4).
   Cada proyecto indica los sensores/dispositivos que usa (campo «sensores») para filtrar.
   Los códigos son originales y están pensados para Arduino UNO (5 V).
   Se cargan después de contenido.js (agregan a PROYECTOS). */

const SENSORES_PROYECTOS = {
  'semaforo': ['LED', 'Resistencia'],
  'termometro': ['DHT11', 'LED', 'Resistencia'],
  'distancia': ['Ultrasonido HC-SR04', 'LED', 'Resistencia'],
  'estacion-iot': ['DHT11', 'Resistencia']
};

PROYECTOS.forEach(p => { p.sensores = SENSORES_PROYECTOS[p.id] || []; });

PROYECTOS.push(
  {
    id: 'termometro-lm35', nivel: 1, dificultad: 'Principiante', tiempo: 'unos 20 min',
    titulo: 'Termómetro con sensor LM35', problema: 'Medir la temperatura de un lugar sin usar un módulo digital.',
    objetivo: 'Convertir una lectura analógica en una magnitud física con una fórmula.',
    placa: 'Arduino UNO', sensores: ['LM35'],
    componentes: ['Sensor LM35', 'Protoboard y cables', 'Opcional: un capacitor de 100 nF entre +Vs y GND'],
    conexiones: [['LM35 +Vs (izquierda)', '5 V'], ['LM35 Vout (central)', 'A0'], ['LM35 GND (derecha)', 'GND']],
    codigo: `const int LM35 = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  float voltaje = analogRead(LM35) * 5.0 / 1023.0;
  float tempC = voltaje * 100.0;   // 10 mV por grado Celsius
  Serial.print("Temperatura: ");
  Serial.print(tempC, 1);
  Serial.println(" C");
  delay(1000);
}`,
    pruebas: ['A temperatura ambiente marca un valor razonable (unos 20–30 °C).', 'Al tocar el sensor con los dedos, el valor sube de forma gradual.'],
    problemas: ['Valores de 0 o muy altos → revisa la pata central y el GND.', 'Lecturas saltonas → promedia varias muestras.'],
    mejoras: ['Promediar 10 lecturas antes de imprimir.', 'Encender un LED si supera 30 °C.'],
    fuentes: 'Ficha del LM35 (Componentes); diseño original.'
  },
  {
    id: 'luz-nocturna', nivel: 1, dificultad: 'Principiante', tiempo: 'unos 30 min',
    titulo: 'Luz nocturna automática', problema: 'Que una luz se encienda sola cuando oscurece.',
    objetivo: 'Usar un divisor de tensión con una LDR para tomar decisiones.',
    placa: 'Arduino UNO', sensores: ['LDR', 'LED', 'Resistencia'],
    componentes: ['Fotorresistencia LDR', 'Resistencia de 10 kΩ', 'LED con resistencia de 220 Ω', 'Cables y protoboard'],
    conexiones: [['LDR (una pata)', '5 V'], ['LDR y resistencia de 10 kΩ (punto medio)', 'A0'], ['Resistencia de 10 kΩ (otra pata)', 'GND'], ['LED (ánodo + resistencia)', 'D8'], ['LED (cátodo)', 'GND']],
    codigo: `const int PIN_LDR = A0;
const int PIN_LED = 8;
const int UMBRAL = 500;   // ajústalo con tu montaje

void setup() {
  pinMode(PIN_LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int luz = analogRead(PIN_LDR);
  Serial.println(luz);
  digitalWrite(PIN_LED, luz < UMBRAL ? HIGH : LOW);   // oscuro: enciende
  delay(200);
}`,
    pruebas: ['Con luz normal, el LED está apagado.', 'Tapando la LDR, el LED se enciende.'],
    problemas: ['Siempre encendido → el umbral es demasiado alto; mira el monitor y ajústalo.', 'Siempre apagado → revisa que la LDR esté entre 5 V y A0.'],
    mejoras: ['Añadir histéresis (dos umbrales) para que no parpadee al atardecer.', 'Cambiar el LED por un relé de baja tensión.'],
    fuentes: 'Ficha de la LDR (Componentes); diseño original.'
  },
  {
    id: 'alarma-pir', nivel: 2, dificultad: 'Básico-intermedio', tiempo: 'unos 40 min',
    titulo: 'Alarma de movimiento con PIR y buzzer', problema: 'Avisar cuando alguien entra en una habitación.',
    objetivo: 'Leer un sensor digital y generar una alerta sonora y visual.',
    placa: 'Arduino UNO', sensores: ['PIR (movimiento)', 'Buzzer', 'LED', 'Resistencia'],
    componentes: ['Sensor PIR HC-SR501', 'Buzzer pasivo', 'LED con resistencia de 220 Ω', 'Cables y protoboard'],
    conexiones: [['PIR VCC', '5 V'], ['PIR OUT', 'D2'], ['PIR GND', 'GND'], ['Buzzer +', 'D8'], ['Buzzer −', 'GND'], ['LED (ánodo + resistencia)', 'D13']],
    codigo: `const int PIR = 2;
const int BUZZER = 8;
const int LED = 13;

void setup() {
  pinMode(PIR, INPUT);
  pinMode(BUZZER, OUTPUT);
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(PIR) == HIGH) {
    digitalWrite(LED, HIGH);
    tone(BUZZER, 1000, 300);
    Serial.println("Movimiento detectado");
    delay(300);
  } else {
    digitalWrite(LED, LOW);
  }
}`,
    pruebas: ['Tras el minuto de calentamiento, al pasar la mano delante el LED se enciende y suena el buzzer.', 'Sin movimiento, el LED queda apagado.'],
    problemas: ['Dispara sin nadie → espera el calentamiento y baja la sensibilidad.', 'No dispara → revisa el pin OUT y la alimentación de 5 V.'],
    mejoras: ['Limitar los avisos a uno cada 10 segundos con millis().', 'Enviar un mensaje por serie con la hora.'],
    fuentes: 'Fichas del PIR y del buzzer (Componentes); diseño original.'
  },
  {
    id: 'detector-gas', nivel: 2, dificultad: 'Básico-intermedio', tiempo: 'unos 45 min',
    titulo: 'Detector de gas con alarma (prototipo)', problema: 'Mostrar cómo una alarma reacciona a un aumento de gas o humo.',
    objetivo: 'Calibrar un umbral con el valor de aire limpio y activar una alarma.',
    placa: 'Arduino UNO', sensores: ['MQ-2 (gas y humo)', 'Buzzer', 'LED', 'Resistencia'],
    componentes: ['Sensor MQ-2', 'Buzzer', 'LED con resistencia de 220 Ω', 'Cables y protoboard'],
    conexiones: [['MQ-2 VCC', '5 V'], ['MQ-2 GND', 'GND'], ['MQ-2 AO', 'A0'], ['Buzzer +', 'D8'], ['Buzzer −', 'GND'], ['LED (ánodo + resistencia)', 'D13']],
    codigo: `const int GAS = A0;
const int BUZZER = 8;
const int LED = 13;
const int UMBRAL = 350;   // calíbralo: lee el valor en aire limpio y suma un margen

void setup() {
  pinMode(BUZZER, OUTPUT);
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int valor = analogRead(GAS);
  Serial.println(valor);
  if (valor > UMBRAL) {
    digitalWrite(LED, HIGH);
    tone(BUZZER, 2000, 200);
  } else {
    digitalWrite(LED, LOW);
    noTone(BUZZER);
  }
  delay(300);
}`,
    pruebas: ['En aire limpio, el valor queda por debajo del umbral.', 'Acercando humo (con cuidado y ventilación) el valor sube y suena la alarma.'],
    problemas: ['Alarma constante → el sensor no ha terminado de calentarse o el umbral es bajo.', 'No reacciona → revisa VCC del calentador y la lectura en el monitor.'],
    mejoras: ['Registrar la lectura máxima de cada minuto.', 'Usar el pin digital DO del módulo con su potenciómetro.'],
    fuentes: 'Ficha del MQ-2 (Componentes); diseño original. No es un detector de seguridad certificado.'
  },
  {
    id: 'riego-automatico', nivel: 2, dificultad: 'Básico-intermedio', tiempo: 'unos 1 h',
    titulo: 'Riego automático con sensor de humedad', problema: 'Regar una planta solo cuando la tierra está seca.',
    objetivo: 'Calibrar un sensor analógico y controlar una carga con un relé.',
    placa: 'Arduino UNO', sensores: ['Humedad de suelo', 'Relé'],
    componentes: ['Sensor de humedad de suelo capacitivo', 'Módulo relé de 5 V', 'Mini bomba de agua de 5 V (fuente externa)', 'Recipiente con agua'],
    conexiones: [['Sensor VCC', '5 V'], ['Sensor AOUT', 'A0'], ['Sensor GND', 'GND'], ['Relé IN', 'D7'], ['Relé VCC / GND', '5 V / GND'], ['Bomba', 'Contacto del relé con su fuente externa (no del Arduino)']],
    codigo: `const int HUMEDAD = A0;
const int RELE = 7;
const int UMBRAL_SECO = 600;   // calibrado: valor en aire (seco) menos un margen

void setup() {
  pinMode(RELE, OUTPUT);
  digitalWrite(RELE, HIGH);     // relé apagado (activo en LOW)
  Serial.begin(9600);
}

void loop() {
  int valor = analogRead(HUMEDAD);
  Serial.println(valor);
  bool seco = valor > UMBRAL_SECO;   // en este tipo de sensor, más valor = más seco
  digitalWrite(RELE, seco ? LOW : HIGH);
  delay(1000);
}`,
    pruebas: ['Con tierra húmeda, la bomba queda apagada.', 'Con tierra seca, el relé hace clic y la bomba se enciende.'],
    problemas: ['La bomba no se apaga → el sensor no está en la tierra o el umbral es demasiado alto.', 'El relé no cambia → confirma si tu módulo es activo en HIGH o en LOW.'],
    mejoras: ['Limitar el riego a 10 segundos y esperar 10 minutos.', 'Enviar el valor a un panel (Módulo 7).'],
    fuentes: 'Fichas del sensor de humedad y del relé (Componentes); diseño original. La bomba usa fuente externa.'
  },
  {
    id: 'alarma-sonido', nivel: 2, dificultad: 'Básico-intermedio', tiempo: 'unos 40 min',
    titulo: 'Alarma por sonido fuerte', problema: 'Detectar un aplauso o un golpe en el aula.',
    objetivo: 'Medir la amplitud de una señal analógica en una ventana de tiempo.',
    placa: 'Arduino UNO', sensores: ['Sensor de sonido', 'LED', 'Resistencia'],
    componentes: ['Módulo de sonido (micrófono) KY-037 o similar', 'LED con resistencia de 220 Ω', 'Cables y protoboard'],
    conexiones: [['Sensor VCC', '5 V'], ['Sensor GND', 'GND'], ['Sensor AO', 'A0'], ['LED (ánodo + resistencia)', 'D13']],
    codigo: `const int MIC = A0;
const int LED = 13;
const int UMBRAL = 60;   // amplitud mínima para considerar ruido fuerte

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int pico = 0;
  unsigned long inicio = millis();
  while (millis() - inicio < 50) {          // mira 50 ms
    int amplitud = abs(analogRead(MIC) - 512);
    if (amplitud > pico) pico = amplitud;
  }
  Serial.println(pico);
  digitalWrite(LED, pico > UMBRAL ? HIGH : LOW);
}`,
    pruebas: ['En silencio, el valor se queda bajo.', 'Un aplauso cerca enciende el LED un momento.'],
    problemas: ['Siempre encendido → sube el umbral o ajusta el potenciómetro del módulo.', 'No reacciona → revisa que el módulo tenga 5 V.'],
    mejoras: ['Contar los aplausos y encender el LED al tercero.', 'Añadir un buzzer.'],
    fuentes: 'Ficha del sensor de sonido (Componentes); diseño original.'
  },
  {
    id: 'joystick-control', nivel: 2, dificultad: 'Básico-intermedio', tiempo: 'unos 30 min',
    titulo: 'Joystick con indicadores', problema: 'Controlar un proyecto con una palanca, como un mando de juego.',
    objetivo: 'Leer dos ejes analógicos y un pulsador, y convertirlos en acciones.',
    placa: 'Arduino UNO', sensores: ['Joystick', 'LED', 'Resistencia'],
    componentes: ['Joystick analógico KY-023 o similar', 'Dos LED con resistencias de 220 Ω', 'Cables y protoboard'],
    conexiones: [['Joystick VCC', '5 V'], ['Joystick GND', 'GND'], ['VRx', 'A0'], ['VRy', 'A1'], ['SW', 'D2'], ['LED 1 (ánodo + resistencia)', 'D9'], ['LED 2 (ánodo + resistencia)', 'D10']],
    codigo: `const int JX = A0, JY = A1, JSW = 2;
const int LED_X = 9, LED_Y = 10;

void setup() {
  pinMode(JSW, INPUT_PULLUP);
  pinMode(LED_X, OUTPUT);
  pinMode(LED_Y, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int x = analogRead(JX);
  int y = analogRead(JY);
  bool pulsado = digitalRead(JSW) == LOW;

  digitalWrite(LED_X, x > 800 || x < 200 ? HIGH : LOW);   // palanca a un lado en X
  digitalWrite(LED_Y, y > 800 || y < 200 ? HIGH : LOW);   // palanca a un lado en Y

  Serial.print("X="); Serial.print(x);
  Serial.print(" Y="); Serial.print(y);
  Serial.print(" boton="); Serial.println(pulsado);
  delay(150);
}`,
    pruebas: ['Con la palanca en el centro, ningún LED enciende.', 'Al empujar a un lado, el LED del eje correspondiente se enciende.'],
    problemas: ['LED siempre encendido → ajusta los umbrales (200 y 800) a tu módulo.', 'Lecturas que no coinciden con el movimiento → revisa VRx y VRy.'],
    mejoras: ['Mover un servo con el eje X.', 'Usar el botón para alternar el modo.'],
    fuentes: 'Ficha del joystick (Componentes); diseño original.'
  },
  {
    id: 'semaforo-peatonal', nivel: 2, dificultad: 'Básico-intermedio', tiempo: 'unos 45 min',
    titulo: 'Semáforo peatonal con pulsador y buzzer', problema: 'Permitir que un peatón pida cruzar y avisar con sonido.',
    objetivo: 'Combinar un pulsador con un ciclo de semáforo y guardar una petición.',
    placa: 'Arduino UNO', sensores: ['Pulsador', 'Buzzer', 'LED', 'Resistencia'],
    componentes: ['3 LED (rojo, amarillo, verde) con resistencias de 220 Ω', 'Pulsador', 'Buzzer pasivo', 'Cables y protoboard'],
    conexiones: [['LED rojo', 'D8'], ['LED amarillo', 'D9'], ['LED verde', 'D10'], ['Pulsador', 'D2 y GND (con INPUT_PULLUP)'], ['Buzzer +', 'D12'], ['Buzzer −', 'GND']],
    codigo: `const int ROJO = 8, AMARILLO = 9, VERDE = 10;
const int BOTON = 2, BUZZER = 12;
bool peatonPide = false;

void apagarLeds() {
  digitalWrite(ROJO, LOW);
  digitalWrite(AMARILLO, LOW);
  digitalWrite(VERDE, LOW);
}

void setup() {
  pinMode(ROJO, OUTPUT);
  pinMode(AMARILLO, OUTPUT);
  pinMode(VERDE, OUTPUT);
  pinMode(BOTON, INPUT_PULLUP);
  pinMode(BUZZER, OUTPUT);
}

void loop() {
  if (digitalRead(BOTON) == LOW) peatonPide = true;   // guarda la petición

  apagarLeds(); digitalWrite(VERDE, HIGH); delay(4000);
  apagarLeds(); digitalWrite(AMARILLO, HIGH); delay(1500);
  apagarLeds(); digitalWrite(ROJO, HIGH);

  if (peatonPide) {
    for (int i = 0; i < 5; i++) {           // 5 avisos de 800 ms (4 s en total)
      tone(BUZZER, 1500, 200);
      delay(600);
    }
    peatonPide = false;
  } else {
    delay(4000);
  }
}`,
    pruebas: ['Sin pulsar, el ciclo es verde, amarillo y rojo sin sonidos.', 'Pulsando durante el verde, en la fase roja suenan cinco avisos.'],
    problemas: ['No recuerda la petición → revisa que el pulsador esté en D2 y GND.', 'El buzzer no suena → confirma si es pasivo (usa tone) o activo.'],
    mejoras: ['Usar millis() para que la petición se atienda sin bloquear el ciclo.', 'Añadir un LED que indique que la petición está registrada.'],
    fuentes: 'Fichas del pulsador, LED y buzzer (Componentes); el semáforo base está en el Proyecto 1. Diseño original.'
  },
  {
    id: 'inclinacion-mpu', nivel: 3, dificultad: 'Intermedio', tiempo: 'unos 1 h',
    titulo: 'Nivel digital con acelerómetro MPU-6050', problema: 'Saber si una superficie o una caja está nivelada o inclinada.',
    objetivo: 'Leer un sensor por I²C, convertir datos en unidades y usar un umbral.',
    placa: 'Arduino UNO', sensores: ['Acelerómetro MPU-6050', 'LED', 'Resistencia'],
    componentes: ['Módulo MPU-6050', 'LED con resistencia de 220 Ω', 'Cables y protoboard'],
    conexiones: [['MPU VCC', '5 V o 3,3 V según el módulo'], ['MPU GND', 'GND'], ['MPU SDA', 'A4'], ['MPU SCL', 'A5'], ['LED (ánodo + resistencia)', 'D13']],
    codigo: `#include <Wire.h>
const int MPU = 0x68;
const int LED = 13;

int16_t leer16() {
  uint8_t alto = Wire.read();
  uint8_t bajo = Wire.read();
  return (int16_t)((alto << 8) | bajo);
}

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
  Wire.begin();
  Wire.beginTransmission(MPU);
  Wire.write(0x6B); Wire.write(0);   // salir del modo reposo
  Wire.endTransmission(true);
}

void loop() {
  Wire.beginTransmission(MPU);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU, 6, true);
  float ax = leer16() / 16384.0;
  float ay = leer16() / 16384.0;
  float az = leer16() / 16384.0;

  // Con el sensor plano, el eje Z marca cerca de 1 g.
  bool nivelado = abs(ax) < 0.1 && abs(ay) < 0.1;
  digitalWrite(LED, nivelado ? HIGH : LOW);

  Serial.print("X="); Serial.print(ax, 2);
  Serial.print(" Y="); Serial.print(ay, 2);
  Serial.print(" Z="); Serial.println(az, 2);
  delay(200);
}`,
    pruebas: ['Con la placa plana, el LED está encendido y Z ronda 1 g.', 'Al inclinarla, X o Y se alejan de 0 y el LED se apaga.'],
    problemas: ['Lecturas nulas o fijas → revisa SDA/SCL (A4/A5) y la dirección 0x68 (si AD0 está en HIGH, es 0x69).', 'Valores muy distintos a los esperados → confirma la escala de ±2 g.'],
    mejoras: ['Calcular el ángulo con atan2.', 'Activar un buzzer si la caja se vuelca.'],
    fuentes: 'Ficha del MPU-6050 (Componentes); diseño original.'
  },
  {
    id: 'acceso-rfid', nivel: 3, dificultad: 'Intermedio', tiempo: 'unos 1 h 30 min',
    titulo: 'Control de acceso con tarjeta RFID', problema: 'Abrir un acceso solo con una tarjeta autorizada.',
    objetivo: 'Leer un UID, compararlo con una lista y mostrar el resultado.',
    placa: 'Arduino UNO', sensores: ['Lector RFID RC522', 'LED', 'Resistencia'],
    componentes: ['Lector RFID RC522 con dos tarjetas o llaveros', 'LED verde y LED rojo con resistencias de 220 Ω', 'Cables y protoboard'],
    conexiones: [['RC522 VCC', '3,3 V (¡no 5 V!)'], ['RC522 GND', 'GND'], ['RC522 RST', 'D9'], ['RC522 SDA (SS)', 'D10'], ['RC522 MOSI', 'D11'], ['RC522 MISO', 'D12'], ['RC522 SCK', 'D13'], ['LED verde', 'D7'], ['LED rojo', 'D6']],
    codigo: `#include <SPI.h>
#include <MFRC522.h>

MFRC522 rfid(10, 9);                  // SS = D10, RST = D9
const int LED_VERDE = 7, LED_ROJO = 6;

// Reemplaza por el UID de tu tarjeta autorizada (léelo con el ejemplo de RFID)
const byte UID_AUTORIZADO[4] = {0xDE, 0xAD, 0xBE, 0xEF};

bool esAutorizado() {
  if (rfid.uid.size != 4) return false;
  for (byte i = 0; i < 4; i++) {
    if (rfid.uid.uidByte[i] != UID_AUTORIZADO[i]) return false;
  }
  return true;
}

void setup() {
  pinMode(LED_VERDE, OUTPUT);
  pinMode(LED_ROJO, OUTPUT);
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("Acerca tu tarjeta");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  if (esAutorizado()) {
    Serial.println("Acceso permitido");
    digitalWrite(LED_VERDE, HIGH);
    delay(2000);
    digitalWrite(LED_VERDE, LOW);
  } else {
    Serial.println("Acceso denegado");
    digitalWrite(LED_ROJO, HIGH);
    delay(2000);
    digitalWrite(LED_ROJO, LOW);
  }
  rfid.PICC_HaltA();
}`,
    pruebas: ['La tarjeta autorizada enciende el LED verde.', 'Otra tarjeta enciende el LED rojo.'],
    problemas: ['No lee nada → el RC522 solo acepta 3,3 V; revisa RST, SDA y SCK.', 'Siempre deniega → copia el UID exacto con el ejemplo de lectura (sin espacios).'],
    mejoras: ['Guardar varios UID en un arreglo.', 'Registrar cada intento con la hora (Módulo 7).'],
    fuentes: 'Ficha del RC522 (Componentes); diseño original. El UID puede copiarse: esto es una práctica, no un sistema de seguridad.'
  },
  {
    id: 'estacion-lcd', nivel: 3, dificultad: 'Intermedio', tiempo: 'unos 1 h',
    titulo: 'Estación meteorológica con pantalla LCD', problema: 'Ver temperatura, humedad y luz en un mismo lugar sin computadora.',
    objetivo: 'Combinar tres sensores y una pantalla I²C en un mismo programa.',
    placa: 'Arduino UNO', sensores: ['DHT11', 'LDR', 'LCD I²C', 'Resistencia'],
    componentes: ['Sensor DHT11', 'Fotorresistencia LDR con resistencia de 10 kΩ', 'Pantalla LCD 16×2 con módulo I²C', 'Cables y protoboard'],
    conexiones: [['DHT11 DATA', 'D7'], ['DHT11 VCC / GND', '5 V / GND'], ['LDR y resistencia de 10 kΩ', 'A0 (divisor)'], ['LCD SDA', 'A4'], ['LCD SCL', 'A5'], ['LCD VCC / GND', '5 V / GND']],
    codigo: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);
DHT dht(7, DHT11);
const int LDR = A0;

void setup() {
  lcd.init();              // en librerías antiguas: lcd.begin(16, 2)
  lcd.backlight();
  dht.begin();
}

void loop() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  int luz = analogRead(LDR);

  lcd.clear();
  if (isnan(t) || isnan(h)) {
    lcd.setCursor(0, 0);
    lcd.print("Error DHT11");
    delay(2000);
    return;
  }
  lcd.setCursor(0, 0);
  lcd.print("T:"); lcd.print(t, 1); lcd.print("C H:"); lcd.print(h, 0); lcd.print("%");
  lcd.setCursor(0, 1);
  lcd.print("Luz: "); lcd.print(luz);
  delay(2000);
}`,
    pruebas: ['La primera línea muestra temperatura y humedad.', 'Al tapar la LDR, el valor de luz baja.'],
    problemas: ['Pantalla en blanco → ajusta el contraste y revisa la dirección I²C (0x27 o 0x3F).', 'Parpadeo → es normal con clear(); para evitarlo, escribe solo los valores.'],
    mejoras: ['Mostrar el valor máximo y mínimo del día.', 'Cambiar de pantalla con un pulsador.'],
    fuentes: 'Fichas del DHT11, LDR y LCD I²C (Componentes); diseño original.'
  },
  {
    id: 'gps-ubicacion', nivel: 3, dificultad: 'Intermedio', tiempo: 'unos 1 h',
    titulo: 'Ubicación con GPS y aviso de señal', problema: 'Saber dónde está un objeto y si el GPS ya tiene señal.',
    objetivo: 'Decodificar frases NMEA con una librería y usar el estado de la señal.',
    placa: 'Arduino UNO', sensores: ['GPS NEO-6M', 'LED', 'Resistencia'],
    componentes: ['Módulo GPS NEO-6M con antena', 'LED con resistencia de 220 Ω', 'Cables y protoboard'],
    conexiones: [['GPS VCC / GND', '5 V / GND (verifica el módulo)'], ['GPS TX', 'D4'], ['GPS RX', 'D3'], ['LED (ánodo + resistencia)', 'D13']],
    codigo: `#include <SoftwareSerial.h>
#include <TinyGPSPlus.h>

SoftwareSerial gps(4, 3);   // RX = D4, TX = D3
TinyGPSPlus tinyGps;
const int LED = 13;

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
  gps.begin(9600);
}

void loop() {
  while (gps.available()) tinyGps.encode(gps.read());

  // El LED se enciende cuando hay una posición válida
  digitalWrite(LED, tinyGps.location.isValid() ? HIGH : LOW);

  if (tinyGps.location.isUpdated()) {
    Serial.print("Lat: "); Serial.print(tinyGps.location.lat(), 6);
    Serial.print("  Lon: "); Serial.print(tinyGps.location.lng(), 6);
    Serial.print("  Satelites: "); Serial.println(tinyGps.satellites.value());
  }
}`,
    pruebas: ['Al aire libre, el LED enciende tras unos minutos.', 'El monitor muestra latitud y longitud que coinciden con tu zona.'],
    problemas: ['Sin datos → el GPS necesita cielo despejado y tiempo; ponlo cerca de una ventana.', 'LED nunca enciende → revisa TX/RX cruzados y la librería TinyGPSPlus.'],
    mejoras: ['Calcular la distancia a un punto fijo.', 'Enviar las coordenadas por Bluetooth HC-06.'],
    fuentes: 'Ficha del GPS NEO-6M (Componentes); diseño original. Librería TinyGPSPlus.'
  },
  {
    id: 'seguridad-iot', nivel: 4, dificultad: 'Integrador IoT', tiempo: 'varias sesiones',
    titulo: 'Sistema de seguridad conectado (diseño)', problema: 'Recibir en el celular un aviso cuando se detecta movimiento o una puerta abierta.',
    objetivo: 'Integrar sensores, Wi-Fi y comunicación MQTT. Proyecto de diseño: no está probado en hardware en esta plataforma.',
    placa: 'ESP32 DevKit', sensores: ['PIR (movimiento)', 'Sensor magnético de puerta', 'Buzzer', 'Relé'],
    componentes: ['ESP32 DevKit', 'Sensor PIR (confirma que sea de 3,3 V o usa un divisor en su salida)', 'Sensor magnético de puerta (reed switch)', 'Buzzer', 'Módulo relé de baja tensión (opcional)'],
    conexiones: [['PIR OUT', 'GPIO 27 (con divisor si el módulo entrega 5 V)'], ['Reed switch', 'GPIO 26 con INPUT_PULLUP y GND'], ['Buzzer', 'GPIO 25 con transistor'], ['Todos los GND', 'Unidos']],
    codigo: null,
    pruebas: ['Un movimiento genera un mensaje en el broker MQTT.', 'Abrir la puerta genera un segundo mensaje.'],
    problemas: ['No conecta al broker → revisa la dirección, el puerto y las credenciales locales (no las publiques).', 'Falsos avisos → añade un tiempo de espera tras cada evento.'],
    mejoras: ['Enviar fotos con una cámara compatible.', 'Activar el buzzer desde el celular.'],
    fuentes: 'Módulos 3, 4 y 7; diseño original. Verifica compatibilidad y límites de los servicios gratuitos antes de usarlos.'
  }
);

/* Proyecto aportado por el docente: control de acceso escolar con RFID (ESP32 + Firebase).
   El código original contenía credenciales de red y del servicio: aquí van marcadores. */
PROYECTOS.push({
  id: 'acceso-rfid-nube', nivel: 4, dificultad: 'Integrador IoT', tiempo: 'varias sesiones',
  titulo: 'Control de acceso escolar con RFID y registro en la nube', problema: 'Registrar entradas y salidas con una tarjeta, guardar el historial y avisar con un sonido.',
  objetivo: 'Integrar un lector RFID, un buzzer, Wi-Fi y una base de datos en la nube (Firebase Realtime Database) desde un ESP32.',
  placa: 'ESP32 DevKit (versión de referencia) · también hay versión para Arduino R4 WiFi', sensores: ['Lector RFID RC522', 'Buzzer', 'ESP32'],
  imagen: { src: 'img/proyectos/rfid-esp32-pines.png', alt: 'Diagrama del ESP32 DevKit con RC522 y buzzer: pines GPIO23, GPIO22, GPIO19, GPIO18, GPIO5, GPIO4, 3V3 y GND' },
  componentes: ['ESP32 DevKit', 'Lector RFID RC522 (alimentado a 3,3 V)', 'Buzzer', 'Tarjetas o llaveros RFID', 'Cuenta de Firebase Realtime Database (plan gratuito)'],
  conexiones: [
    ['RC522 SDA', 'GPIO5'], ['RC522 SCK', 'GPIO18'], ['RC522 MOSI', 'GPIO23'], ['RC522 MISO', 'GPIO19'],
    ['RC522 RST', 'GPIO22'], ['RC522 3.3V', '3V3 (¡no 5 V!)'], ['RC522 GND', 'GND'],
    ['Buzzer S (señal)', 'GPIO4'], ['Buzzer VCC', '3V3 (o VIN si suena muy bajo)'], ['Buzzer GND', 'GND']
  ],
  codigo: String.raw`#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>

// ====== CONFIGURACION (reemplaza los marcadores; NO subas tus claves a GitHub) ======
const char* WIFI_SSID = "TU_RED_WIFI";
const char* WIFI_PASS = "TU_CLAVE_WIFI";
const char* FB_HOST   = "TU_PROYECTO.firebaseio.com";  // sin https://
const char* FB_AUTH   = "";   // token opcional si tus reglas exigen autenticacion
// ===================================================================================

#define PIN_SCK   18
#define PIN_MISO  19
#define PIN_MOSI  23
#define SS_PIN    5     // SDA del RC522
#define RST_PIN   22
#define BUZZER    4
#define ACTIVO_BAJO false  // false = suena con HIGH. Pon true si suena con LOW

MFRC522 rfid(SS_PIN, RST_PIN);
WiFiClientSecure client;

void beep(int veces, int dur) {
  for (int i = 0; i < veces; i++) {
    digitalWrite(BUZZER, ACTIVO_BAJO ? LOW : HIGH);  delay(dur);
    digitalWrite(BUZZER, ACTIVO_BAJO ? HIGH : LOW);  delay(dur);
  }
}

// Peticion HTTPS a Firebase. Devuelve el cuerpo de la respuesta o "ERROR".
String fbRequest(const char* metodo, String ruta, String cuerpo = "") {
  String url = "/" + ruta + ".json";
  if (strlen(FB_AUTH) > 0) url += "?auth=" + String(FB_AUTH);

  if (!client.connect(FB_HOST, 443)) return "ERROR";
  client.print(String(metodo) + " " + url + " HTTP/1.0\r\n");
  client.print(String("Host: ") + FB_HOST + "\r\n");
  client.print("Content-Type: application/json\r\n");
  client.print("Content-Length: " + String(cuerpo.length()) + "\r\n");
  client.print("Connection: close\r\n\r\n");
  client.print(cuerpo);

  unsigned long t = millis();
  String resp = "";
  while (millis() - t < 8000 && (client.connected() || client.available())) {
    while (client.available()) resp += (char)client.read();
    delay(1);
  }
  client.stop();

  int i = resp.indexOf("\r\n\r\n");
  if (i < 0) return "ERROR";
  String cuerpoResp = resp.substring(i + 4);
  cuerpoResp.trim();
  return cuerpoResp;
}

// Quita las comillas de un valor JSON de tipo texto
String limpiar(String s) {
  s.replace("\"", "");
  s.trim();
  return s;
}

String leerUID() {
  String uid = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) uid += "0";
    uid += String(rfid.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();
  return uid;
}

void conectarWiFi() {
  Serial.print("Conectando a WiFi");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nWiFi OK. IP: " + WiFi.localIP().toString());
}

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER, OUTPUT);
  digitalWrite(BUZZER, ACTIVO_BAJO ? HIGH : LOW);   // arranca en silencio
  SPI.begin(PIN_SCK, PIN_MISO, PIN_MOSI, SS_PIN);
  rfid.PCD_Init();
  client.setInsecure();   // no valida el certificado: mejora esto antes de usarlo en serio
  conectarWiFi();
  Serial.println("Listo. Acerca una tarjeta...");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) conectarWiFi();
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  String uid = leerUID();
  Serial.println("Tarjeta: " + uid);
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();

  String nombre = limpiar(fbRequest("GET", "estudiantes/" + uid + "/nombre"));

  if (nombre == "ERROR") {
    Serial.println("Error de conexion con Firebase");
    beep(3, 300);
  } else if (nombre == "null" || nombre == "") {
    // Tarjeta desconocida: queda pendiente para asignarla desde la web
    fbRequest("PUT", "pendientes/" + uid, "{\"ts\":{\".sv\":\"timestamp\"}}");
    Serial.println("Tarjeta nueva, pendiente de asignar");
    beep(2, 400);
  } else {
    String estado = fbRequest("GET", "abierto/" + uid);
    bool estabaDentro = (estado == "true");
    String tipo = estabaDentro ? "salida" : "entrada";

    String reg = "{\"uid\":\"" + uid + "\",\"nombre\":\"" + nombre +
                 "\",\"tipo\":\"" + tipo + "\",\"ts\":{\".sv\":\"timestamp\"}}";
    fbRequest("POST", "registros", reg);
    fbRequest("PUT", "abierto/" + uid, estabaDentro ? "false" : "true");

    Serial.println(nombre + " -> " + tipo);
    beep(estabaDentro ? 2 : 1, 120);
  }
  delay(2000);   // evita lecturas repetidas
}`,
  pruebas: ['Una tarjeta registrada muestra el nombre y alterna entrada/salida en el monitor serie.', 'Una tarjeta nueva aparece como pendiente en la base de datos y suenan dos avisos.', 'Sin Wi-Fi, el ESP32 reintenta la conexión y no se bloquea.'],
  problemas: ['El RC522 no responde → va a 3,3 V; con 5 V se daña.', 'Error de Firebase → revisa el host, las reglas de la base de datos y la conexión a internet.', 'La tarjeta se lee dos veces → espera 2 s (ya incluido) y evita acercarla de forma continua.'],
  mejoras: ['Usar un identificador de estudiante en lugar de datos personales en la base.', 'Activar autenticación y reglas de lectura y escritura restringidas en Firebase.', 'Validar el certificado TLS en lugar de setInsecure().', 'Versión para Arduino R4 WiFi: mismo cableado SPI del R4 (SS = D10, RST = D9, buzzer = D6) y biblioteca WiFiS3.'],
  fuentes: 'Proyecto aportado por el docente (carpeta «Control de acceso RFID»). Credenciales y datos de estudiantes retirados de la versión pública. Pinout: diagrama del propio proyecto.'
});

PROYECTOS.forEach(p => { if (!p.sensores) p.sensores = []; });
