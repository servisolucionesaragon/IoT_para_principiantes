/* Sección «Sensores y dispositivos»: funcionamiento, conexión y precauciones.
   Texto original. Los pines siguen la convención de Arduino UNO (5 V).
   En los módulos que traen una placa de adaptación, confirma la tensión y los pines en su etiqueta.
   Se carga después de contenido.js (usa esc, cod, caja, tabla). */

const CATEGORIAS_COMPONENTES = [
  'Componentes básicos',
  'Sensores ambientales',
  'Movimiento y posición',
  'Luz y sonido',
  'Identificación y localización',
  'Pantallas y señales',
  'Actuadores'
];

const COMPONENTES = [
  {
    id: 'resistencias', categoria: 'Componentes básicos', nombre: 'Resistencias', especial: 'resistencias',
    resumen: 'Limitan la corriente, fijan niveles de voltaje y protegen los componentes.'
  },
  {
    id: 'led', categoria: 'Componentes básicos', nombre: 'LED', voltaje: '≈2 V de caída (rojo) · 10–20 mA',
    resumen: 'Diodo que emite luz al pasar corriente en un solo sentido.',
    funciona: '<p>Un LED solo conduce en un sentido: del <strong>ánodo (+)</strong>, la pata más larga, al <strong>cátodo (−)</strong>. Al conducir emite luz. Consume poca corriente, pero no debe conectarse directo a una salida: <strong>siempre con resistencia en serie</strong> (ver la ficha de resistencias).</p>',
    conexion: [['Ánodo (+) pata larga', 'Resistencia de 220 Ω → pin digital'], ['Cátodo (−) pata corta', 'GND']],
    codigo: 'const int LED = 13;\nvoid setup() { pinMode(LED, OUTPUT); }\nvoid loop() {\n  digitalWrite(LED, HIGH); delay(500);\n  digitalWrite(LED, LOW);  delay(500);\n}',
    precauciones: ['Si no enciende, revisa el sentido antes de cambiar el código.', 'Sin resistencia puede quemarse en segundos.']
  },
  {
    id: 'pulsador', categoria: 'Componentes básicos', nombre: 'Pulsador (botón)', voltaje: 'Contacto mecánico, sin alimentación propia',
    resumen: 'Cierra o abre un circuito mientras se presiona.',
    funciona: '<p>Son dos contactos que se tocan al presionar. Como el pin queda “flotando” cuando el botón está suelto, se usa <code>INPUT_PULLUP</code>: el pin queda en HIGH en reposo y en LOW al pulsar.</p>',
    conexion: [['Una pata', 'Pin digital (p. ej., D2)'], ['Pata opuesta (diagonal)', 'GND']],
    codigo: 'const int BOTON = 2;\nvoid setup() { pinMode(BOTON, INPUT_PULLUP); Serial.begin(9600); }\nvoid loop() {\n  if (digitalRead(BOTON) == LOW) Serial.println("Pulsado");\n  delay(100);\n}',
    precauciones: ['Los contactos rebotan: pueden contar varias pulsaciones. Espera unos milisegundos tras detectar.']
  },
  {
    id: 'potenciometro', categoria: 'Componentes básicos', nombre: 'Potenciómetro', voltaje: '5 V (UNO) o 3,3 V (ESP32)',
    resumen: 'Resistencia variable: entrega un voltaje ajustable con una perilla.',
    funciona: '<p>Tiene una pista resistiva y un cursor móvil. Entre las patas extremas hay la alimentación y el cursor central entrega un voltaje entre 0 V y la alimentación. Es un <strong>divisor de tensión</strong> ajustable.</p>',
    conexion: [['Pata extrema 1', '5 V'], ['Pata extrema 2', 'GND'], ['Pata central (cursor)', 'A0']],
    codigo: 'const int POT = A0;\nvoid setup() { Serial.begin(9600); }\nvoid loop() {\n  Serial.println(analogRead(POT));  // 0 a 1023\n  delay(200);\n}',
    precauciones: ['Si cambias de 5 V a 3,3 V, el valor máximo también cambia.']
  },
  {
    id: 'ldr', categoria: 'Luz y sonido', nombre: 'Fotorresistencia (LDR)', voltaje: '5 V con divisor de 10 kΩ',
    resumen: 'Resistencia que baja cuando hay más luz.',
    funciona: '<p>Su resistencia depende de la luz que recibe: con mucha luz, baja; a oscuras, sube. Para leerla con un pin analógico se arma un <strong>divisor de tensión</strong> con una resistencia fija de 10 kΩ.</p>',
    conexion: [['LDR (una pata)', '5 V'], ['LDR (otra pata) y resistencia de 10 kΩ', 'Punto medio → A0'], ['Resistencia de 10 kΩ (otra pata)', 'GND']],
    codigo: 'const int LDR = A0;\nvoid setup() { Serial.begin(9600); }\nvoid loop() {\n  Serial.println(analogRead(LDR));\n  delay(500);\n}',
    precauciones: ['Con esta disposición, más luz da un valor más alto. Compruébalo tapando el sensor.']
  },
  {
    id: 'buzzer', categoria: 'Luz y sonido', nombre: 'Buzzer (zumbador)', voltaje: '3–5 V · pasivo o activo',
    resumen: 'Emite sonidos para alarmas y avisos.',
    funciona: '<p>Hay dos tipos. El <strong>activo</strong> tiene un oscilador interno: basta con alimentarlo y suena a una frecuencia fija. El <strong>pasivo</strong> necesita una señal de frecuencia que se genera con <code>tone()</code>, y así puedes elegir el tono.</p>',
    conexion: [['Positivo (+)', 'Pin digital (p. ej., D8)'], ['Negativo (−)', 'GND']],
    codigo: 'const int BUZZER = 8;\nvoid setup() { pinMode(BUZZER, OUTPUT); }\nvoid loop() {\n  tone(BUZZER, 1000, 300);  // 1 kHz durante 300 ms (buzzer pasivo)\n  delay(800);\n}',
    precauciones: ['Con un buzzer activo, tone() suena igual con una frecuencia fija.', 'No lo conectes directo a un pin si consume mucha corriente; usa un transistor en tal caso.']
  },
  {
    id: 'pir', categoria: 'Movimiento y posición', nombre: 'Sensor de movimiento PIR (HC-SR501)', voltaje: '5 V',
    resumen: 'Detecta el movimiento de cuerpos calientes (personas, animales).',
    funciona: '<p>El PIR mide cambios de radiación infrarroja de cuerpos calientes en su campo de visión. Su salida pasa a HIGH cuando detecta movimiento y vuelve a LOW después de un tiempo. Tiene dos potenciómetros: <strong>sensibilidad</strong> (distancia) y <strong>tiempo</strong> de salida.</p>',
    conexion: [['VCC', '5 V'], ['OUT', 'Pin digital (p. ej., D2)'], ['GND', 'GND']],
    codigo: 'const int PIR = 2, LED = 13;\nvoid setup() {\n  pinMode(PIR, INPUT);\n  pinMode(LED, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(LED, digitalRead(PIR));\n  delay(100);\n}',
    precauciones: ['Espera un minuto después de encenderlo para que se estabilice.', 'Evita corrientes de aire y superficies con cambios de temperatura cerca del sensor.']
  },
  {
    id: 'ir-obstaculo', categoria: 'Movimiento y posición', nombre: 'Sensor infrarrojo de obstáculos (KY-032)', voltaje: '3,3–5 V',
    resumen: 'Indica si hay un objeto cercano delante de él.',
    funciona: '<p>Un emisor infrarrojo ilumina el frente y un receptor detecta el reflejo. Si hay un objeto cerca, la salida cambia de estado. En muchos módulos la salida es <strong>LOW cuando hay obstáculo</strong>; un potenciómetro ajusta la distancia.</p>',
    conexion: [['VCC', '5 V'], ['OUT', 'Pin digital (p. ej., D7)'], ['GND', 'GND']],
    codigo: 'const int OBS = 7;\nvoid setup() { pinMode(OBS, INPUT); Serial.begin(9600); }\nvoid loop() {\n  Serial.println(digitalRead(OBS) == LOW ? "Obstaculo" : "Libre");\n  delay(200);\n}',
    precauciones: ['La luz solar intensa puede confundirlo.', 'Los objetos oscuros y brillantes reflejan de forma distinta.']
  },
  {
    id: 'tilt', categoria: 'Movimiento y posición', nombre: 'Sensor de inclinación de bola (SW-520D)', voltaje: 'Interruptor digital',
    resumen: 'Cambia de estado cuando se inclina más allá de un ángulo.',
    funciona: '<p>Tiene una bola metálica que cierra un contacto al inclinarse. Funciona como un pulsador: se conecta con <code>INPUT_PULLUP</code>. Sirve para detectar si algo se ha caído o volcado, pero no mide el ángulo.</p>',
    conexion: [['Una pata', 'Pin digital (p. ej., D2)'], ['Otra pata', 'GND']],
    codigo: 'const int TILT = 2;\nvoid setup() { pinMode(TILT, INPUT_PULLUP); Serial.begin(9600); }\nvoid loop() {\n  Serial.println(digitalRead(TILT) == LOW ? "Inclinado" : "Normal");\n  delay(200);\n}',
    precauciones: ['Para medir el ángulo, usa el acelerómetro (ficha MPU-6050).']
  },
  {
    id: 'acelerometro', categoria: 'Movimiento y posición', nombre: 'Acelerómetro y giroscopio MPU-6050 (GY-521)', voltaje: '3,3–5 V (módulo) · comunicación I²C',
    resumen: 'Mide aceleración en tres ejes y rotación; detecta inclinación y vibración.',
    funciona: '<p>Se comunica por <strong>I²C</strong> con dos cables: SDA (datos) y SCL (reloj). Con el sensor quieto mide la gravedad, que te dice hacia dónde está inclinado. Por defecto en ±2 g, 16 384 cuentas equivalen a 1 g. La dirección I²C habitual es <code>0x68</code>.</p>',
    conexion: [['VCC', '5 V (o 3,3 V según el módulo)'], ['GND', 'GND'], ['SDA', 'A4 en UNO'], ['SCL', 'A5 en UNO']],
    codigo: '#include <Wire.h>\nconst int MPU = 0x68;\n\nint16_t leer16() {\n  uint8_t alto = Wire.read();\n  uint8_t bajo = Wire.read();\n  return (int16_t)((alto << 8) | bajo);\n}\n\nvoid setup() {\n  Serial.begin(9600);\n  Wire.begin();\n  Wire.beginTransmission(MPU);\n  Wire.write(0x6B); Wire.write(0);  // sacar del modo reposo\n  Wire.endTransmission(true);\n}\n\nvoid loop() {\n  Wire.beginTransmission(MPU);\n  Wire.write(0x3B);\n  Wire.endTransmission(false);\n  Wire.requestFrom(MPU, 6, true);\n  int16_t ax = leer16();\n  int16_t ay = leer16();\n  int16_t az = leer16();\n  Serial.print("X: "); Serial.print(ax / 16384.0, 2);\n  Serial.print("  Y: "); Serial.print(ay / 16384.0, 2);\n  Serial.print("  Z: "); Serial.println(az / 16384.0, 2);\n  delay(300);\n}',
    precauciones: ['Los módulos baratos pueden tener la dirección 0x69 si el pin AD0 está en HIGH.', 'Lee los valores en orden (no en la misma línea de código): el orden de evaluación de Wire.read() no está garantizado.']
  },
  {
    id: 'mq2', categoria: 'Sensores ambientales', nombre: 'Sensor de gas y humo MQ-2', voltaje: '5 V · calentador interno',
    resumen: 'Detecta gases combustibles y humo. Entrega un valor analógico y una salida digital con umbral.',
    funciona: '<p>Dentro hay un óxido metálico calentado. Su resistencia cambia cuando hay gases combustibles o humo, y eso cambia el voltaje de salida. El valor es <strong>relativo</strong>: sirve para comparar y disparar una alarma, no para medir concentraciones exactas. Necesita unos minutos de calentamiento antes de dar lecturas estables.</p>',
    conexion: [['VCC', '5 V'], ['GND', 'GND'], ['AO (analógica)', 'A0'], ['DO (digital, opcional)', 'Pin digital (p. ej., D7)']],
    codigo: 'const int GAS = A0;\nvoid setup() { Serial.begin(9600); }\nvoid loop() {\n  Serial.println(analogRead(GAS));\n  delay(500);\n}',
    precauciones: ['No es un detector de seguridad certificado: no reemplaza una alarma comercial.', 'Calibra el umbral en aire limpio y deja un margen.']
  },
  {
    id: 'mq135', categoria: 'Sensores ambientales', nombre: 'Sensor de calidad del aire MQ-135', voltaje: '5 V · calentador interno',
    resumen: 'Responde a varios gases contaminantes (amoníaco, CO₂ aproximado, humos).',
    funciona: '<p>Funciona como el MQ-2, pero es más sensible a gases de calidad del aire. Su lectura es <strong>relativa</strong> y varía con la temperatura y la humedad. Úsalo para comparar lugares o momentos, con la misma conexión.</p>',
    conexion: [['VCC', '5 V'], ['GND', 'GND'], ['AO', 'A0']],
    codigo: 'const int AIRE = A0;\nvoid setup() { Serial.begin(9600); }\nvoid loop() {\n  Serial.println(analogRead(AIRE));\n  delay(1000);\n}',
    precauciones: ['Necesita calentamiento prolongado para estabilizarse.']
  },
  {
    id: 'lm35', categoria: 'Sensores ambientales', nombre: 'Sensor de temperatura LM35', voltaje: '4–20 V (usar 5 V)',
    resumen: 'Entrega 10 mV por cada grado Celsius, con salida analógica.',
    funciona: '<p>El voltaje de salida es proporcional a la temperatura: <strong>10 mV por °C</strong>. Con 5 V de referencia y 10 bits (1023 pasos), cada paso del ADC equivale a unos 0,49 °C.</p>',
    conexion: [['+Vs (pata izquierda)', '5 V'], ['Vout (central)', 'A0'], ['GND (derecha)', 'GND']],
    codigo: 'const int LM35 = A0;\nvoid setup() { Serial.begin(9600); }\nvoid loop() {\n  float voltaje = analogRead(LM35) * 5.0 / 1023.0;\n  float tempC = voltaje * 100.0;   // 10 mV por grado\n  Serial.print("Temperatura: "); Serial.print(tempC, 1); Serial.println(" C");\n  delay(1000);\n}',
    precauciones: ['La resolución es de unos 0,5 °C con el Uno. Para mayor precisión, promedia lecturas.']
  },
  {
    id: 'dht11', categoria: 'Sensores ambientales', nombre: 'Temperatura y humedad DHT11', voltaje: '3–5 V · señal digital',
    resumen: 'Mide temperatura y humedad relativa con un solo cable de datos.',
    funciona: '<p>Tiene un sensor capacitivo de humedad y un termistor. Envía los datos por un protocolo propio de un solo cable. Responde lento: espera al menos 2 segundos entre lecturas.</p>',
    conexion: [['VCC', '5 V'], ['DATA', 'Pin digital (p. ej., D7)'], ['GND', 'GND']],
    codigo: '#include <DHT.h>\nDHT dht(7, DHT11);\nvoid setup() { Serial.begin(9600); dht.begin(); }\nvoid loop() {\n  float t = dht.readTemperature();\n  float h = dht.readHumidity();\n  if (isnan(t) || isnan(h)) { Serial.println("Error"); }\n  else { Serial.print(t); Serial.print(" C  "); Serial.print(h); Serial.println(" %"); }\n  delay(2000);\n}',
    precauciones: ['Instala la librería “DHT sensor library” (Adafruit).', 'Su precisión es modesta; es ideal para aprender.']
  },
  {
    id: 'humedad-suelo', categoria: 'Sensores ambientales', nombre: 'Sensor de humedad de suelo capacitivo', voltaje: '3,3–5 V',
    resumen: 'Mide la humedad de la tierra con una salida analógica.',
    funciona: '<p>Mide la capacidad eléctrica de la tierra, que cambia con el agua. En la versión capacitiva, el valor <strong>baja</strong> cuando la tierra está más húmeda (depende del módulo). Debes calibrarlo: toma un valor en aire (seco) y otro sumergido en agua hasta la marca.</p>',
    conexion: [['VCC', '5 V'], ['AOUT', 'A0'], ['GND', 'GND']],
    codigo: 'const int SUELO = A0;\nvoid setup() { Serial.begin(9600); }\nvoid loop() {\n  Serial.println(analogRead(SUELO));  // anota seco y mojado\n  delay(1000);\n}',
    precauciones: ['No sumerjas la parte electrónica del módulo.', 'Los sensores resistivos de dos varillas se corroen: prefiere el capacitivo.']
  },
  {
    id: 'sonido', categoria: 'Luz y sonido', nombre: 'Sensor de sonido (módulo con micrófono)', voltaje: '5 V',
    resumen: 'Detecta la presencia de sonido fuerte con una salida analógica y otra digital.',
    funciona: '<p>Un micrófono electret convierte el sonido en una señal eléctrica. El módulo calcula una amplitud: en silencio el valor se queda cerca del punto medio (alrededor de 512 en el Uno) y sube al haber ruido. La salida digital se activa al superar un umbral que ajustas con un potenciómetro.</p>',
    conexion: [['VCC', '5 V'], ['GND', 'GND'], ['AO', 'A0'], ['DO (opcional)', 'Pin digital']],
    codigo: 'const int MIC = A0;\nvoid setup() { Serial.begin(9600); }\nvoid loop() {\n  Serial.println(abs(analogRead(MIC) - 512));  // amplitud aproximada\n  delay(100);\n}',
    precauciones: ['Mide en silencio y con ruido para fijar el umbral.']
  },
  {
    id: 'joystick', categoria: 'Movimiento y posición', nombre: 'Joystick analógico', voltaje: '5 V',
    resumen: 'Dos potenciómetros (ejes X e Y) y un pulsador.',
    funciona: '<p>Cada eje es un potenciómetro: el valor va de 0 a 1023 con el centro cerca de 512. El botón de la palanca es un pulsador conectado con <code>INPUT_PULLUP</code>.</p>',
    conexion: [['VCC', '5 V'], ['GND', 'GND'], ['VRx (eje X)', 'A0'], ['VRy (eje Y)', 'A1'], ['SW (botón)', 'Pin digital (p. ej., D2)']],
    codigo: 'const int JX = A0, JY = A1, JSW = 2;\nvoid setup() { pinMode(JSW, INPUT_PULLUP); Serial.begin(9600); }\nvoid loop() {\n  Serial.print(analogRead(JX)); Serial.print("  ");\n  Serial.print(analogRead(JY)); Serial.print("  ");\n  Serial.println(digitalRead(JSW) == LOW ? "pulsado" : "suelto");\n  delay(150);\n}',
    precauciones: ['El centro no siempre da exactamente 512: calibra con la palanca quieta.']
  },
  {
    id: 'rfid', categoria: 'Identificación y localización', nombre: 'Lector RFID RC522', voltaje: '3,3 V (¡no 5 V!)',
    resumen: 'Lee el identificador (UID) de tarjetas y llaveros RFID de 13,56 MHz.',
    funciona: '<p>El lector emite un campo magnético de baja potencia. Cuando acercas una tarjeta, esta se alimenta del campo y responde con su <strong>UID</strong>, un número único. Se comunica por <strong>SPI</strong>.</p>',
    conexion: [['VCC', '3,3 V'], ['GND', 'GND'], ['RST', 'D9'], ['SDA (SS)', 'D10'], ['MOSI', 'D11'], ['MISO', 'D12'], ['SCK', 'D13']],
    codigo: '#include <SPI.h>\n#include <MFRC522.h>\n\nMFRC522 rfid(10, 9);   // SS = D10, RST = D9\n\nvoid setup() {\n  Serial.begin(9600);\n  SPI.begin();\n  rfid.PCD_Init();\n  Serial.println("Acerca una tarjeta");\n}\n\nvoid loop() {\n  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;\n  Serial.print("UID:");\n  for (byte i = 0; i < rfid.uid.size; i++) {\n    Serial.print(rfid.uid.uidByte[i] < 0x10 ? " 0" : " ");\n    Serial.print(rfid.uid.uidByte[i], HEX);\n  }\n  Serial.println();\n  rfid.PICC_HaltA();\n}',
    precauciones: ['Alimentar el RC522 con 5 V puede dañarlo.', 'Instala la librería MFRC522 de GithubCommunity.', 'El UID puede copiarse: no lo uses como única protección en sistemas reales.']
  },
  {
    id: 'gps', categoria: 'Identificación y localización', nombre: 'Módulo GPS NEO-6M', voltaje: '3,3–5 V (revisa el módulo) · serie 9600 baudios',
    resumen: 'Recibe señales de satélites y entrega latitud, longitud y hora.',
    funciona: '<p>El GPS envía frases de texto (NMEA) por serie a 9600 baudios. Necesita <strong>cielo despejado</strong> y entre 30 segundos y varios minutos para tener la primera posición (“fix”). La librería TinyGPSPlus decodifica las frases.</p>',
    conexion: [['VCC', '5 V (si el módulo tiene regulador)'], ['GND', 'GND'], ['TX del GPS', 'Pin 4 del UNO (RX de SoftwareSerial)'], ['RX del GPS', 'Pin 3 del UNO (TX de SoftwareSerial)']],
    codigo: '#include <SoftwareSerial.h>\n#include <TinyGPSPlus.h>\n\nSoftwareSerial gps(4, 3);   // RX = D4, TX = D3\nTinyGPSPlus tinyGps;\n\nvoid setup() {\n  Serial.begin(9600);\n  gps.begin(9600);\n}\n\nvoid loop() {\n  while (gps.available()) tinyGps.encode(gps.read());\n  if (tinyGps.location.isUpdated()) {\n    Serial.print("Lat: "); Serial.print(tinyGps.location.lat(), 6);\n    Serial.print("  Lon: "); Serial.println(tinyGps.location.lng(), 6);\n  }\n}',
    precauciones: ['Sin fix no hay coordenadas: sal al exterior y espera.', 'El GPS no funciona bien dentro de edificios.']
  },
  {
    id: 'rele', categoria: 'Actuadores', nombre: 'Módulo relé de 5 V', voltaje: 'Bobina 5 V · contacto según carga',
    resumen: 'Interruptor eléctrico controlado por una señal de bajo voltaje.',
    funciona: '<p>Una bobina electromagnética cierra o abre un contacto. Así una señal de 5 V puede encender una carga separada. Muchos módulos se activan con la entrada en <strong>LOW</strong>; confírmalo en tu módulo.</p>',
    conexion: [['VCC', '5 V'], ['GND', 'GND'], ['IN', 'Pin digital (p. ej., D7)']],
    codigo: 'const int RELE = 7;\nvoid setup() {\n  pinMode(RELE, OUTPUT);\n  digitalWrite(RELE, HIGH);   // apagado (activo en LOW)\n}\nvoid loop() {\n  digitalWrite(RELE, LOW);  delay(3000);   // encendido\n  digitalWrite(RELE, HIGH); delay(3000);   // apagado\n}',
    precauciones: ['Solo con cargas de baja tensión en prácticas escolares.', 'Nunca manipules la red eléctrica de 110/220 V: solo un adulto calificado.']
  },
  {
    id: 'servo', categoria: 'Actuadores', nombre: 'Servomotor SG90', voltaje: '4,8–6 V',
    resumen: 'Gira hasta un ángulo entre 0° y 180° con una señal PWM.',
    funciona: '<p>Un motor con engranajes y un circuito que compara la posición con la señal recibida. La señal es un pulso de 50 Hz cuya duración indica el ángulo. La librería <code>Servo</code> lo genera por ti.</p>',
    conexion: [['Naranja (señal)', 'Pin PWM (p. ej., D9)'], ['Rojo', '5 V'], ['Marrón', 'GND']],
    codigo: '#include <Servo.h>\nServo s;\nvoid setup() { s.attach(9); }\nvoid loop() {\n  s.write(0);   delay(800);\n  s.write(180); delay(800);\n}',
    precauciones: ['Varios servos o picos de corriente necesitan fuente propia y GND común.']
  },
  {
    id: 'motor-dc', categoria: 'Actuadores', nombre: 'Motor DC con transistor', voltaje: 'Motor según fuente; el pin solo da señal',
    resumen: 'Cómo controlar un motor que consume más corriente de la que un pin puede dar.',
    funciona: '<p>Un pin de Arduino da unos 40 mA como máximo. Un motor pide mucho más. Por eso se usa un <strong>transistor</strong> (por ejemplo, NPN tipo 2N2222 o un MOSFET) como interruptor: el pin controla la base o puerta, y la corriente grande pasa entre colector y emisor desde una fuente externa. Un diodo de protección (flyback) en paralelo con el motor evita picos.</p>',
    conexion: [['Pin digital', 'Resistencia de 1 kΩ → base del transistor'], ['Emisor', 'GND común'], ['Colector', 'Una pata del motor (la otra va a +)'], ['Diodo de protección', 'En paralelo con el motor, cátodo hacia +']],
    codigo: 'const int MOTOR = 9;\nvoid setup() { pinMode(MOTOR, OUTPUT); }\nvoid loop() {\n  digitalWrite(MOTOR, HIGH); delay(2000);\n  digitalWrite(MOTOR, LOW);  delay(2000);\n}',
    precauciones: ['El motor se alimenta de una fuente externa, no del pin.', 'Une los GND de la fuente y del Arduino.']
  },
  {
    id: 'lcd-i2c', categoria: 'Pantallas y señales', nombre: 'Pantalla LCD 16×2 con módulo I²C', voltaje: '5 V · I²C',
    resumen: 'Muestra texto en dos líneas de 16 caracteres usando solo dos cables de datos.',
    funciona: '<p>El módulo I²C convierte las señales de la pantalla en un bus de dos cables. La dirección suele ser <code>0x27</code> o <code>0x3F</code>; confírmala con un escáner I²C si no responde. Ajusta el contraste con el potenciómetro azul del módulo.</p>',
    conexion: [['VCC', '5 V'], ['GND', 'GND'], ['SDA', 'A4 en UNO'], ['SCL', 'A5 en UNO']],
    codigo: '#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\n\nLiquidCrystal_I2C lcd(0x27, 16, 2);\n\nvoid setup() {\n  lcd.init();          // en librerías antiguas: lcd.begin(16, 2)\n  lcd.backlight();\n  lcd.setCursor(0, 0);\n  lcd.print("Hola IoT");\n  lcd.setCursor(0, 1);\n  lcd.print("Principiantes");\n}\n\nvoid loop() {}',
    precauciones: ['Sin texto visible: gira el potenciómetro de contraste.', 'Si no responde, prueba la dirección 0x3F.']
  },
  {
    id: 'bt-hc06', categoria: 'Identificación y localización', nombre: 'Bluetooth HC-06', voltaje: '3,3 V en su lógica (5 V de alimentación en muchos módulos)',
    resumen: 'Comunicación inalámbrica serie con el celular o una computadora.',
    funciona: '<p>Pasa los datos de Bluetooth a un puerto serie. Lo que llega por Bluetooth aparece en el puerto RX de la placa, y lo que envía la placa sale por TX hacia el celular.</p>',
    conexion: [['VCC / GND', '5 V / GND'], ['TXD del módulo', 'RX (D0) de la UNO'], ['RXD del módulo', 'TX (D1) de la UNO']],
    codigo: null,
    precauciones: ['D0 y D1 comparten el puerto USB: desconecta el módulo al subir código.', 'Usa un divisor de tensión si tu módulo no tolera 5 V en RX.']
  }
];

/* Explicación de resistencias: contenido de la ficha especial */
const RESISTENCIAS_HTML = `
<h2>Para qué sirve una resistencia</h2>
<p>Una resistencia <strong>se opone al paso de la corriente</strong>. Con ella puedes:</p>
<ul>
  <li><strong>Limitar la corriente</strong> de un LED para que no se queme.</li>
  <li><strong>Fijar un nivel</strong> de voltaje en una entrada (pull-up y pull-down).</li>
  <li><strong>Dividir el voltaje</strong> para leer sensores como la LDR o un potenciómetro.</li>
</ul>
<p>Se mide en <strong>ohmios (Ω)</strong>. Abreviaturas comunes: 1 kΩ = 1 000 Ω; 1 MΩ = 1 000 000 Ω.</p>

<h2>Código de colores</h2>
<p>Las bandas indican el valor. Se leen desde el lado donde están más juntas; la banda de tolerancia va al final (dorado o plateado). Las resistencias de 5 bandas tienen tres dígitos; las de 4 bandas, dos.</p>
<div class="tabla-wrap"><table>
<thead><tr><th>Color</th><th>1.er dígito</th><th>2.º dígito</th><th>3.er dígito</th><th>Multiplicador</th><th>Tolerancia</th></tr></thead>
<tbody>
<tr><td>Negro</td><td>0</td><td>0</td><td>0</td><td>10⁰ (×1)</td><td>—</td></tr>
<tr><td>Marrón</td><td>1</td><td>1</td><td>1</td><td>10¹ (×10)</td><td>±1 %</td></tr>
<tr><td>Rojo</td><td>2</td><td>2</td><td>2</td><td>10² (×100)</td><td>±2 %</td></tr>
<tr><td>Naranja</td><td>3</td><td>3</td><td>3</td><td>10³ (×1 000)</td><td>—</td></tr>
<tr><td>Amarillo</td><td>4</td><td>4</td><td>4</td><td>10⁴ (×10 000)</td><td>—</td></tr>
<tr><td>Verde</td><td>5</td><td>5</td><td>5</td><td>10⁵ (×100 000)</td><td>±0,5 %</td></tr>
<tr><td>Azul</td><td>6</td><td>6</td><td>6</td><td>10⁶ (×1 000 000)</td><td>±0,25 %</td></tr>
<tr><td>Violeta</td><td>7</td><td>7</td><td>7</td><td>10⁷</td><td>±0,1 %</td></tr>
<tr><td>Gris</td><td>8</td><td>8</td><td>8</td><td>10⁸</td><td>±0,05 %</td></tr>
<tr><td>Blanco</td><td>9</td><td>9</td><td>9</td><td>10⁹</td><td>—</td></tr>
<tr><td>Dorado</td><td colspan="3">—</td><td>×0,1</td><td>±5 %</td></tr>
<tr><td>Plateado</td><td colspan="3">—</td><td>×0,01</td><td>±10 %</td></tr>
</tbody></table></div>
<p>Ejemplos (5 bandas): <strong>rojo-rojo-negro-marrón-marrón</strong> = 220 × 10 = <strong>2 200 Ω</strong>. <strong>marrón-negro-negro-rojo-marrón</strong> = 100 × 100 = <strong>10 kΩ ±1 %</strong>. Con 4 bandas: <strong>rojo-rojo-marrón</strong> = 22 × 10 = <strong>220 Ω</strong>.</p>
<p class="pista">Si tienes dudas, mide la resistencia con un multímetro en la escala de Ω.</p>

<h2>Calcular la resistencia de un LED</h2>
<p>Fórmula: <strong>R = (Vfuente − Vled) / I</strong>. Ejemplo con 5 V, LED rojo de 2 V y 15 mA:</p>
<p>R = (5 − 2) / 0,015 = 200 Ω. Usa el valor comercial superior: <strong>220 Ω</strong>.</p>
<p>Con 220 Ω, la corriente es (5 − 2) / 220 ≈ 13,6 mA: suficiente para un LED y dentro del límite de un pin del Uno.</p>

<h2>Potencia que disipa</h2>
<p>Potencia = V × I. En el ejemplo del LED: 3 V × 0,0136 A ≈ 0,04 W. Una resistencia de <strong>1/4 W</strong> es suficiente. Si la resistencia se calienta mucho, es que disipa más potencia de la prevista.</p>

<h2>Resistencias en serie y en paralelo</h2>
<ul>
  <li><strong>Serie:</strong> se suman. 1 kΩ + 2,2 kΩ = 3,2 kΩ.</li>
  <li><strong>Paralelo:</strong> el total es menor que la menor. Dos de 10 kΩ en paralelo dan 5 kΩ.</li>
</ul>

<h2>Divisor de tensión</h2>
<p><strong>Vsalida = Ventrada × R₂ / (R₁ + R₂)</strong>, con R₂ conectada a GND. Por ejemplo, 5 V con R₁ = 10 kΩ y R₂ = 10 kΩ da 2,5 V en el punto medio. Así se lee una LDR o un sensor.</p>

<h2>Pull-up y pull-down</h2>
<p>Una resistencia de 10 kΩ entre el pin y 5 V (<strong>pull-up</strong>) o entre el pin y GND (<strong>pull-down</strong>) fija el nivel cuando el pulsador está suelto. En Arduino puedes usar la pull-up interna con <code>INPUT_PULLUP</code>, sin resistencia externa.</p>

<h2>Errores frecuentes</h2>
<ul>
  <li>Poner un LED sin resistencia: se quema o consume demasiada corriente.</li>
  <li>Confundir el orden de las bandas: lee desde el lado correcto.</li>
  <li>Usar una resistencia de 10 Ω en un LED: deja pasar demasiada corriente.</li>
</ul>
`;
