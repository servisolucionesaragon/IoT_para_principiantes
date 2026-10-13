/* Nuevos sensores, actuadores y elementos de uso común (ampliación de la sección
   «Sensores y dispositivos»). Texto original. Se carga después de componentes.js.
   Las librerías indicadas son las habituales del IDE de Arduino; confirma el nombre en el Gestor de Librerías. */

CATEGORIAS_COMPONENTES.push('Placas de desarrollo', 'Entradas de usuario', 'Comunicación y tiempo', 'Potencia y medición');

COMPONENTES.push(
  {
    id: 'arduino-uno', categoria: 'Placas de desarrollo', nombre: 'Arduino UNO R3', voltaje: '7–12 V de entrada · lógica de 5 V',
    resumen: 'Placa con microcontrolador ATmega328P, pines digitales y analógicos, y puerto USB.',
    funciona: '<p>Ejecuta el programa que escribes en el IDE de Arduino. Tiene 14 pines digitales (6 con PWM), 6 entradas analógicas de 10 bits, salidas de 5 V y 3,3 V, y el conector USB con el que se programa y se alimenta. Es la placa de partida de las lecciones del curso.</p>',
    conexion: [['5V / 3.3V / GND', 'Alimentar sensores (revisa el voltaje de cada uno)'], ['D0–D13', 'Entradas y salidas digitales (~ = PWM)'], ['A0–A5', 'Entradas analógicas']],
    codigo: null,
    precauciones: ['Los pines dan como máximo unos 40 mA cada uno: no conectes motores directos.', 'No conectes módulos de 3,3 V a 5 V sin revisar.']
  },
  {
    id: 'esp32', categoria: 'Placas de desarrollo', nombre: 'ESP32 DevKit', voltaje: '3,3 V lógicos · alimentación 5 V por USB',
    resumen: 'Microcontrolador con Wi-Fi y Bluetooth integrados, pensado para proyectos IoT.',
    funciona: '<p>Tiene doble núcleo, Wi-Fi y Bluetooth. Su lógica es de 3,3 V y sus GPIO no toleran 5 V. El ADC es de 12 bits (0–4095). Algunos pines se usan al arrancar o con la memoria: revisa el diagrama de tu placa.</p>',
    conexion: [['3V3 / GND', 'Alimentar sensores de 3,3 V'], ['GPIO (D2, D4, D5…)', 'Entradas y salidas; el ADC2 no sirve con Wi-Fi activo']],
    codigo: null,
    precauciones: ['Nunca conectes una señal de 5 V directo a un GPIO.', 'Confirma los pines en la serigrafía de tu placa concreta.']
  },
  {
    id: 'ds18b20', categoria: 'Sensores ambientales', nombre: 'Sensor de temperatura DS18B20', voltaje: '3–5,5 V · protocolo 1-Wire',
    resumen: 'Sensor digital de temperatura, preciso y con sonda impermeable.',
    funciona: '<p>Envía la temperatura en formato digital por un solo cable de datos (1-Wire). Puede haber varios sensores en la misma línea, cada uno con su código único. Necesita una resistencia de 4,7 kΩ entre DATA y VCC.</p>',
    conexion: [['VDD (rojo)', '5 V'], ['DQ (datos)', 'D2 con resistencia de 4,7 kΩ a 5 V'], ['GND (negro)', 'GND']],
    codigo: '#include <OneWire.h>\n#include <DallasTemperature.h>\n\nOneWire bus(2);\nDallasTemperature sensores(&bus);\n\nvoid setup() {\n  Serial.begin(9600);\n  sensores.begin();\n}\n\nvoid loop() {\n  sensores.requestTemperatures();\n  Serial.print("Temperatura: ");\n  Serial.print(sensores.getTempCByIndex(0));\n  Serial.println(" C");\n  delay(1000);\n}',
    precauciones: ['Instala las librerías OneWire y DallasTemperature.', 'Sin la resistencia de 4,7 kΩ puede leer valores erróneos.']
  },
  {
    id: 'bmp280', categoria: 'Sensores ambientales', nombre: 'Sensor de presión BMP280', voltaje: '3,3 V (muchos módulos aceptan 5 V) · I²C',
    resumen: 'Mide presión atmosférica y temperatura; sirve para estimar la altitud.',
    funciona: '<p>Usa I²C con la dirección 0x76 o 0x77 (según el pin SDO). La presión sirve para estimar la altura sobre el nivel del mar y para detectar cambios del clima.</p>',
    conexion: [['VCC', '3,3 V o 5 V según el módulo'], ['GND', 'GND'], ['SDA', 'A4 (UNO) / GPIO21 (ESP32)'], ['SCL', 'A5 (UNO) / GPIO22 (ESP32)']],
    codigo: '#include <Adafruit_BMP280.h>\n\nAdafruit_BMP280 bmp;\n\nvoid setup() {\n  Serial.begin(9600);\n  if (!bmp.begin(0x76)) {\n    Serial.println("Sensor no encontrado: prueba 0x77");\n    while (1);\n  }\n}\n\nvoid loop() {\n  Serial.print(bmp.readTemperature()); Serial.print(" C  ");\n  Serial.print(bmp.readPressure() / 100.0); Serial.println(" hPa");\n  delay(1000);\n}',
    precauciones: ['Instala la librería Adafruit BMP280.', 'Evita que le dé el aire del ventilador: afecta la temperatura.']
  },
  {
    id: 'sensor-lluvia', categoria: 'Sensores ambientales', nombre: 'Sensor de lluvia', voltaje: '5 V',
    resumen: 'Una placa con pistas que detecta el agua sobre su superficie.',
    funciona: '<p>La placa conduce mejor cuando está mojada, así que la resistencia baja. La salida analógica (AO) baja al mojarse y la digital (DO) cambia al superar un umbral que fijas con un potenciómetro.</p>',
    conexion: [['VCC', '5 V'], ['GND', 'GND'], ['AO', 'A0'], ['DO', 'D7 (opcional)']],
    codigo: 'const int LLUVIA = A0;\nvoid setup() { Serial.begin(9600); }\nvoid loop() {\n  int v = analogRead(LLUVIA);\n  Serial.println(v < 500 ? "Esta lloviendo" : "Seco");  // ajusta 500\n  delay(500);\n}',
    precauciones: ['Las pistas se corroen si quedan mojadas mucho tiempo: sécalas.']
  },
  {
    id: 'sensor-llama', categoria: 'Sensores ambientales', nombre: 'Sensor de llama infrarrojo', voltaje: '3,3–5 V',
    resumen: 'Detecta la luz infrarroja de una llama.',
    funciona: '<p>Un receptor infrarrojo capta la radiación de una llama. En muchos módulos la salida pasa a LOW cuando detecta fuego. Un potenciómetro ajusta la sensibilidad.</p>',
    conexion: [['VCC', '5 V'], ['GND', 'GND'], ['DO', 'D7']],
    codigo: 'const int LLAMA = 7;\nvoid setup() { pinMode(LLAMA, INPUT); Serial.begin(9600); }\nvoid loop() {\n  if (digitalRead(LLAMA) == LOW) Serial.println("Llama detectada");\n  delay(200);\n}',
    precauciones: ['Es una práctica: no sustituye un detector de incendios.', 'La luz solar intensa puede dar falsas alarmas.']
  },
  {
    id: 'sensor-nivel-agua', categoria: 'Sensores ambientales', nombre: 'Sensor de nivel de agua (WN328)', voltaje: '3,3–5 V',
    resumen: 'Pistas de contacto que dan una lectura según el agua que las cubre.',
    funciona: '<p>Varias pistas paralelas miden la resistencia del agua entre ellas. Más agua cubre más pistas y la lectura analógica sube.</p>',
    conexion: [['VCC (+)', '5 V'], ['GND (−)', 'GND'], ['S (señal)', 'A0']],
    codigo: 'const int NIVEL = A0;\nvoid setup() { Serial.begin(9600); }\nvoid loop() {\n  Serial.println(analogRead(NIVEL));  // más agua = valor mayor\n  delay(500);\n}',
    precauciones: ['No dejes la parte electrónica sumergida.', 'Las pistas se oxidan: úsalo solo en prácticas.']
  },
  {
    id: 'termistor-ntc', categoria: 'Sensores ambientales', nombre: 'Termistor NTC', voltaje: 'Resistencia que depende de la temperatura',
    resumen: 'Resistencia que baja cuando sube la temperatura.',
    funciona: '<p>Un NTC cambia mucho su resistencia con la temperatura. Con un divisor de tensión de 10 kΩ se convierte en una lectura analógica. Para la temperatura exacta se usa la ecuación B (aquí con β ≈ 3950).</p>',
    conexion: [['Una pata', '5 V'], ['Otra pata y resistencia de 10 kΩ', 'A0 (punto medio)'], ['Resistencia de 10 kΩ', 'GND']],
    codigo: 'const float R_FIJA = 10000.0, BETA = 3950.0, R0 = 10000.0, T0 = 298.15;\nvoid setup() { Serial.begin(9600); }\nvoid loop() {\n  int v = analogRead(A0);\n  float rNtc = R_FIJA * (1023.0 / v - 1.0);\n  float tK = 1.0 / (1.0 / T0 + log(rNtc / R0) / BETA);\n  Serial.print(tK - 273.15); Serial.println(" C");\n  delay(1000);\n}',
    precauciones: ['Los valores de β y R0 vienen en la hoja de tu NTC: úsalos.', 'Evita v = 0 (división por cero).']
  },
  {
    id: 'sensor-vibracion', categoria: 'Movimiento y posición', nombre: 'Sensor de vibración (SW-420)', voltaje: '3,3–5 V',
    resumen: 'Detecta sacudidas o golpes con un interruptor sensible.',
    funciona: '<p>Tiene un muelle con un contacto. Cuando vibra, el módulo cambia su salida digital. El potenciómetro ajusta la sensibilidad. Sirve para alarmas de golpes.</p>',
    conexion: [['VCC', '5 V'], ['GND', 'GND'], ['DO', 'D7']],
    codigo: 'const int VIB = 7;\nvoid setup() { pinMode(VIB, INPUT); Serial.begin(9600); }\nvoid loop() {\n  if (digitalRead(VIB) == HIGH) Serial.println("Vibracion!");\n  delay(50);\n}',
    precauciones: ['Comprueba si tu módulo da HIGH o LOW con vibración (depende del módulo).']
  },
  {
    id: 'sensor-hall', categoria: 'Movimiento y posición', nombre: 'Sensor de efecto Hall (KY-003)', voltaje: '5 V · salida digital',
    resumen: 'Detecta la presencia de un imán sin tocarlo.',
    funciona: '<p>Un chip detecta el campo magnético. Cuando un polo del imán se acerca, la salida cambia de estado. Sirve para contar vueltas de una rueda o detectar puertas.</p>',
    conexion: [['VCC', '5 V'], ['GND', 'GND'], ['DO', 'D2 con INPUT_PULLUP']],
    codigo: 'const int HALL = 2;\nvoid setup() { pinMode(HALL, INPUT_PULLUP); Serial.begin(9600); }\nvoid loop() {\n  if (digitalRead(HALL) == LOW) Serial.println("Iman detectado");\n  delay(100);\n}',
    precauciones: ['Prueba qué polo activa el sensor antes de usarlo.']
  },
  {
    id: 'acs712', categoria: 'Potencia y medición', nombre: 'Sensor de corriente ACS712', voltaje: '5 V · salida analógica',
    resumen: 'Mide la corriente que pasa por una carga de baja tensión.',
    funciona: '<p>El chip mide el campo del conductor y entrega un voltaje: 2,5 V sin corriente y, en la versión de 5 A, 185 mV por amperio. Hay versiones de 20 A (100 mV/A) y de 30 A (66 mV/A).</p>',
    conexion: [['VCC', '5 V'], ['GND', 'GND'], ['OUT', 'A0'], ['IP+ / IP−', 'En serie con la carga (baja tensión)']],
    codigo: 'const int CORRIENTE = A0;\nconst float SENSIBILIDAD = 0.185;   // V por A (versión 5 A)\nvoid setup() { Serial.begin(9600); }\nvoid loop() {\n  float v = analogRead(CORRIENTE) * 5.0 / 1023.0;\n  float amperios = (v - 2.5) / SENSIBILIDAD;\n  Serial.println(amperios, 2);\n  delay(500);\n}',
    precauciones: ['Mide en vacío para ajustar el cero (puede no ser exactamente 2,5 V).', 'Nunca lo uses con la red de 110/220 V sin un adulto calificado.']
  },
  {
    id: 'teclado-matricial', categoria: 'Entradas de usuario', nombre: 'Teclado matricial 4×4', voltaje: 'Contactos mecánicos (8 pines)',
    resumen: 'Teclado de 16 teclas leído con 8 pines.',
    funciona: '<p>Las teclas están en una matriz de 4 filas y 4 columnas. El programa pone una fila en LOW y lee las columnas para saber qué tecla se pulsó. La librería Keypad lo hace por ti.</p>',
    conexion: [['Filas (4)', 'D9, D8, D7, D6'], ['Columnas (4)', 'D5, D4, D3, D2']],
    codigo: '#include <Keypad.h>\n\nconst byte F = 4, C = 4;\nchar teclas[F][C] = {\n  {\'1\',\'2\',\'3\',\'A\'}, {\'4\',\'5\',\'6\',\'B\'},\n  {\'7\',\'8\',\'9\',\'C\'}, {\'*\',\'0\',\'#\',\'D\'}\n};\nbyte pinFilas[F] = {9, 8, 7, 6};\nbyte pinColumnas[C] = {5, 4, 3, 2};\nKeypad teclado = Keypad(makeKeymap(teclas), pinFilas, pinColumnas, F, C);\n\nvoid setup() { Serial.begin(9600); }\nvoid loop() {\n  char t = teclado.getKey();\n  if (t) Serial.println(t);\n}',
    precauciones: ['Instala la librería Keypad.', 'Un rebote puede repetir una tecla: la librería ya lo filtra.']
  },
  {
    id: 'encoder', categoria: 'Entradas de usuario', nombre: 'Encoder rotatorio KY-040', voltaje: '5 V · contactos mecánicos',
    resumen: 'Perilla que gira sin fin y envía pulsos según el sentido.',
    funciona: '<p>Tiene dos señales (CLK y DT) desfasadas. Según cuál cambia primero, sabes si giró a la derecha o a la izquierda. Su botón (SW) funciona como un pulsador.</p>',
    conexion: [['CLK', 'D2'], ['DT', 'D3'], ['SW', 'D4 con INPUT_PULLUP'], ['+ / GND', '5 V / GND']],
    codigo: 'const int CLK = 2, DT = 3, SW = 4;\nint contador = 0;\nint ultimo;\n\nvoid setup() {\n  pinMode(CLK, INPUT);\n  pinMode(DT, INPUT);\n  pinMode(SW, INPUT_PULLUP);\n  Serial.begin(9600);\n  ultimo = digitalRead(CLK);\n}\n\nvoid loop() {\n  int actual = digitalRead(CLK);\n  if (actual != ultimo && actual == LOW) {\n    contador += (digitalRead(DT) != actual) ? 1 : -1;\n    Serial.println(contador);\n  }\n  ultimo = actual;\n}',
    precauciones: ['Si el sentido sale al revés, invierte la condición (cambia +1 por −1).']
  },
  {
    id: 'sensor-tactil', categoria: 'Entradas de usuario', nombre: 'Sensor táctil capacitivo TTP223', voltaje: '2–5,5 V · salida digital',
    resumen: 'Botón sin mecanismo: basta tocar la superficie.',
    funciona: '<p>Mide cambios de capacidad cuando tocas la superficie. Su salida pasa a HIGH al tocarlo. No necesita fuerza ni se desgasta como un pulsador.</p>',
    conexion: [['VCC', '3,3 V o 5 V'], ['GND', 'GND'], ['I/O', 'D2']],
    codigo: 'const int TOQUE = 2;\nvoid setup() { pinMode(TOQUE, INPUT); Serial.begin(9600); }\nvoid loop() {\n  if (digitalRead(TOQUE) == HIGH) Serial.println("Tocado");\n  delay(100);\n}',
    precauciones: ['Puede activarse con la humedad: prueba en tu montaje.']
  },
  {
    id: 'oled', categoria: 'Pantallas y señales', nombre: 'Pantalla OLED SSD1306 128×64', voltaje: '3,3–5 V · I²C (0x3C)',
    resumen: 'Pantalla pequeña de alto contraste que muestra texto y gráficos.',
    funciona: '<p>Cada píxel emite luz propia, por eso el contraste es muy alto. Se controla por I²C. Usa las librerías Adafruit SSD1306 y Adafruit GFX.</p>',
    conexion: [['VCC / GND', '5 V o 3,3 V / GND'], ['SDA', 'A4 (UNO) / GPIO21 (ESP32)'], ['SCL', 'A5 (UNO) / GPIO22 (ESP32)']],
    codigo: '#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>\n\nAdafruit_SSD1306 oled(128, 64, &Wire, -1);\n\nvoid setup() {\n  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);\n  oled.clearDisplay();\n  oled.setTextSize(1);\n  oled.setTextColor(SSD1306_WHITE);\n  oled.setCursor(0, 0);\n  oled.println("Hola IoT");\n  oled.display();\n}\n\nvoid loop() {}',
    precauciones: ['Si no se ve nada, prueba la dirección 0x3D.']
  },
  {
    id: 'display-7seg', categoria: 'Pantallas y señales', nombre: 'Display de 4 dígitos TM1637', voltaje: '5 V · dos pines',
    resumen: 'Muestra números de cuatro cifras con solo dos cables.',
    funciona: '<p>Un chip controla los segmentos de cada dígito. Se comunica con dos líneas (CLK y DIO). La librería TM1637Display muestra números y ajusta el brillo.</p>',
    conexion: [['VCC / GND', '5 V / GND'], ['CLK', 'D2'], ['DIO', 'D3']],
    codigo: '#include <TM1637Display.h>\n\nconst int CLK = 2, DIO = 3;\nTM1637Display pantalla(CLK, DIO);\n\nvoid setup() {\n  pantalla.setBrightness(5);   // 0 a 7\n}\n\nvoid loop() {\n  pantalla.showNumberDec(1234);\n  delay(2000);\n}',
    precauciones: ['Instala la librería TM1637Display (avishorp).']
  },
  {
    id: 'neopixel', categoria: 'Pantallas y señales', nombre: 'LED RGB direccionable WS2812B (NeoPixel)', voltaje: '5 V · una sola señal',
    resumen: 'Cada LED tiene su propio color y se controla con un solo cable.',
    funciona: '<p>Cada módulo contiene un chip que recibe el color por la línea de datos y lo pasa al siguiente. Puedes encadenar muchos. Para tiras grandes, alimenta con una fuente externa.</p>',
    conexion: [['5V / GND', '5 V / GND (consumo alto: fuente externa)'], ['DIN (entrada de datos)', 'D6']],
    codigo: '#include <Adafruit_NeoPixel.h>\n\nconst int PIN = 6, N = 8;\nAdafruit_NeoPixel tira(N, PIN, NEO_GRB + NEO_KHZ800);\n\nvoid setup() {\n  tira.begin();\n  tira.setBrightness(50);\n}\n\nvoid loop() {\n  tira.fill(tira.Color(255, 0, 0)); tira.show(); delay(500);\n  tira.fill(tira.Color(0, 0, 255)); tira.show(); delay(500);\n}',
    precauciones: ['Instala la librería Adafruit NeoPixel.', 'Un pixel a todo brillo consume bastante: no pongas muchos sin fuente externa.']
  },
  {
    id: 'motor-paso-paso', categoria: 'Actuadores', nombre: 'Motor paso a paso 28BYJ-48 con ULN2003', voltaje: '5 V · consumo medio',
    resumen: 'Gira en pasos exactos: útil para mover algo una cantidad controlada.',
    funciona: '<p>El motor avanza en pasos fijos. El controlador ULN2003 tiene transistores que dan la corriente necesaria. La librería Stepper envía la secuencia correcta de cuatro bobinas.</p>',
    conexion: [['IN1 / IN2 / IN3 / IN4', 'D8 / D9 / D10 / D11'], ['+ / −', '5 V / GND']],
    codigo: '#include <Stepper.h>\n\nconst int PASOS_VUELTA = 2048;\n// Orden de la librería: IN1, IN3, IN2, IN4\nStepper motor(PASOS_VUELTA, 8, 10, 9, 11);\n\nvoid setup() {\n  motor.setSpeed(10);   // revoluciones por minuto\n}\n\nvoid loop() {\n  motor.step(PASOS_VUELTA);   // una vuelta\n  delay(1000);\n  motor.step(-PASOS_VUELTA);  // y de vuelta\n  delay(1000);\n}',
    precauciones: ['Con el orden de cables equivocado el motor vibra y no gira.', 'No lo alimentes desde un pin de la placa.']
  },
  {
    id: 'bomba-agua', categoria: 'Actuadores', nombre: 'Mini bomba de agua de 5 V', voltaje: '5 V · consumo de 100–300 mA',
    resumen: 'Bombea agua pequeñas cantidades, como en un riego automático.',
    funciona: '<p>Un motor pequeño mueve el agua. Consume más corriente de la que un pin puede dar, así que se controla con un relé o un transistor, con su propia fuente de 5 V.</p>',
    conexion: [['Control (relé o transistor)', 'Pin digital (p. ej., D7)'], ['Fuente externa 5 V', 'Bomba (+), y GND común con el Arduino']],
    codigo: 'const int BOMBA = 7;\nvoid setup() { pinMode(BOMBA, OUTPUT); }\nvoid loop() {\n  digitalWrite(BOMBA, HIGH); delay(3000);   // encendida 3 s (relé activo en HIGH)\n  digitalWrite(BOMBA, LOW);  delay(7000);\n}',
    precauciones: ['No dejes la bomba funcionando sin agua: se calienta y se daña.', 'El relé puede ser activo en LOW; revisa tu módulo.']
  },
  {
    id: 'transistor', categoria: 'Componentes básicos', nombre: 'Transistor NPN 2N2222', voltaje: 'Hasta 40 V · 600 mA',
    resumen: 'Interruptor electrónico: una pequeña corriente en la base controla una grande.',
    funciona: '<p>Tiene tres patas: base, colector y emisor. Con corriente en la base (a través de una resistencia de 1 kΩ), el transistor deja pasar la corriente del colector al emisor. Sirve para encender motores, bombas o buzzers desde un pin.</p>',
    conexion: [['Base', 'Pin digital con resistencia de 1 kΩ'], ['Emisor', 'GND'], ['Colector', 'Carga (la otra pata de la carga, a +)']],
    codigo: null,
    precauciones: ['Pon un diodo en paralelo con cargas inductivas (motores, relés).', 'Verifica la pinout de tu transistor (E-B-C en el 2N2222 de frente).']
  },
  {
    id: 'cable-jumper', categoria: 'Componentes básicos', nombre: 'Cables jumper (Dupont)', voltaje: '—',
    resumen: 'Cables de colores con conectores para unir placas, protoboards y módulos.',
    funciona: '<p>Hay tres tipos: macho-macho (para protoboard), hembra-macho (para conectar módulos con pines) y hembra-hembra. Los colores ayudan a identificar señales: rojo para 5 V, negro para GND.</p>',
    conexion: [['Macho-macho', 'Protoboard con protoboard o con pines'], ['Hembra-macho', 'Módulos con pines a la placa']],
    codigo: null,
    precauciones: ['Revisa que los conectores entren firmes: un cable suelto da fallas intermitentes.']
  },
  {
    id: 'rtc-ds3231', categoria: 'Comunicación y tiempo', nombre: 'Reloj de tiempo real DS3231', voltaje: '3,3–5 V · I²C (0x68) · pila CR2032',
    resumen: 'Mantiene la fecha y la hora aunque la placa se apague.',
    funciona: '<p>Un cristal muy preciso lleva la cuenta del tiempo. La pila CR2032 mantiene la hora cuando no hay alimentación. Se lee por I²C con la librería RTClib.</p>',
    conexion: [['VCC / GND', '5 V / GND'], ['SDA', 'A4 (UNO) / GPIO21 (ESP32)'], ['SCL', 'A5 (UNO) / GPIO22 (ESP32)']],
    codigo: '#include <Wire.h>\n#include <RTClib.h>\n\nRTC_DS3231 rtc;\n\nvoid setup() {\n  Serial.begin(9600);\n  rtc.begin();\n  if (rtc.lostPower()) {\n    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));   // pone la hora de compilación\n  }\n}\n\nvoid loop() {\n  DateTime t = rtc.now();\n  Serial.print(t.hour()); Serial.print(":"); Serial.println(t.minute());\n  delay(1000);\n}',
    precauciones: ['Instala la librería RTClib (Adafruit).', 'La hora se pone al compilar: recuerda ajustarla luego con tu hora real.']
  },
  {
    id: 'modulo-microsd', categoria: 'Comunicación y tiempo', nombre: 'Módulo lector de tarjetas microSD', voltaje: '5 V (con regulador) · SPI',
    resumen: 'Guarda datos en una tarjeta de memoria para registrar mediciones.',
    funciona: '<p>Se comunica por SPI con el microcontrolador. La librería SD crea y escribe archivos de texto en la tarjeta (formato FAT32). Es útil para guardar historiales de sensores.</p>',
    conexion: [['VCC / GND', '5 V / GND'], ['CS', 'D10'], ['MOSI / MISO / SCK', 'D11 / D12 / D13']],
    codigo: '#include <SPI.h>\n#include <SD.h>\n\nconst int CS_PIN = 10;\n\nvoid setup() {\n  Serial.begin(9600);\n  if (!SD.begin(CS_PIN)) {\n    Serial.println("Sin tarjeta o mal conectada");\n    return;\n  }\n  File f = SD.open("datos.txt", FILE_WRITE);\n  if (f) {\n    f.println("Medicion de prueba");\n    f.close();\n    Serial.println("Escrito");\n  }\n}\n\nvoid loop() {}',
    precauciones: ['Usa tarjetas de 2 GB a 32 GB en formato FAT32.', 'Retira la tarjeta solo con la placa apagada.']
  }
);
