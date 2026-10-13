/* Módulo 9 · Coche inteligente con Arduino UNO (kit Elegoo Smart Car).
   Explicaciones y código ORIGINALES. Los pines salen de la tabla de cableado del kit
   («Wire connect table v2.0») y de los programas de ejemplo de sus lecciones, que se
   citan como fuente; no se copian sus textos ni sus programas.
   Se carga después de js/contenido.js. */

MODULOS.push({
  id: 'm9', titulo: 'Módulo 9 · Coche inteligente (kit Elegoo)', descripcion: 'Un coche con Arduino UNO: motores, Bluetooth, infrarrojos, obstáculos y seguimiento de línea.'
});

/* Mapa de pines del kit (verificado con la tabla de cableado y los programas del kit) */
const ELEGOO_PINES = [
  ['Motores (L298N): ENA / ENB', 'D5 / D11 (velocidad, PWM)'],
  ['Motores (L298N): IN1 / IN2 / IN3 / IN4', 'D6 / D7 / D8 / D9 (sentido)'],
  ['Servo SG90 (señal)', 'D3'],
  ['Ultrasonido HC-SR04: Trig / Echo', 'A5 / A4'],
  ['Receptor infrarrojo (señal)', 'D12'],
  ['Bluetooth HC-06: TXD / RXD', 'D0 (RX) / D1 (TX)'],
  ['Sensor de línea izquierdo', 'D2'],
  ['Sensor de línea central', 'D4'],
  ['Sensor de línea derecho', 'D10']
];

const LECCIONES_ELEGOO = [
  {
    id: 'e0-ensamble', modulo: 'm9', titulo: 'Ensamblar el coche y cablearlo', nivel: 'Principiante', minutos: 30,
    resumen: 'Piezas, tabla de pines del kit y reglas de seguridad con la batería.',
    cuerpo: `
<h2>Antes de empezar</h2>
<ul>
  <li><strong>Batería fuera</strong> mientras cableas. Un cable mal puesto con la batería conectada puede cortocircuitarla o quemar el L298N.</li>
  <li>Revisa la <strong>polaridad</strong> de la batería antes de conectarla al L298N.</li>
  <li>Los motores se alimentan de la <strong>batería</strong> (a través del L298N), no del 5 V del USB.</li>
  <li>Sigue el ensamblaje físico de la <em>Lección 0</em> del kit; aquí se explica la conexión.</li>
</ul>
<h2>Tabla de pines del kit</h2>
${tabla(['Módulo / función', 'Pin en Arduino UNO'], ELEGOO_PINES)}
<p class="pista">Los pines A0–A3 no se usan en el coche. Los cables de color sirven para identificar cada señal; los colores de la tabla original pueden variar según tu lote.</p>
${caja('advertencia', 'D0 y D1 son compartidos', '<p>Los pines D0 (RX) y D1 (TX) son también el puerto USB de programación. <strong>Desconecta el módulo Bluetooth HC-06 antes de subir un programa</strong>, o la carga fallará.</p>')}
<h2>Comprobación antes de encender</h2>
<div class="panel">
  <label><input type="checkbox"> Los tres sensores de línea están alimentados (5 V y GND)</label><br>
  <label><input type="checkbox"> El L298N tiene GND común con la UNO</label><br>
  <label><input type="checkbox"> ENA, ENB, IN1–IN4 están en los pines de la tabla</label><br>
  <label><input type="checkbox"> El servo está en D3 y su brazo puede girar libremente</label><br>
  <label><input type="checkbox"> La batería está desconectada mientras revisas</label>
</div>
<h2>Fuentes</h2>
<p class="pista">Kit Elegoo Smart Car · «Wire connect table v2.0» (tabla de pines) y «Lección 0 · Ensamble el coche» (ensamblaje físico, no copiado).</p>`,
    quiz: [
      { pregunta: '¿Por qué debes desconectar el Bluetooth HC-06 al subir un programa?', opciones: ['Porque consume mucha corriente', 'Porque comparte los pines D0 y D1 con el USB', 'Porque el servo lo bloquea', 'Porque es inalámbrico'], correcta: 1, explicacion: 'D0 y D1 son el puerto serie usado por el USB para cargar el programa.', pista: 'Mira los pines D0 y D1.' },
      { pregunta: 'Los motores del coche deben alimentarse de…', opciones: ['El 5 V del USB', 'La batería, a través del L298N', 'El pin A0', 'El servo'], correcta: 1, explicacion: 'Los motores consumen más corriente de la que el USB puede dar; la batería los alimenta por el L298N.', pista: 'Piensa en el consumo de los motores.' }
    ],
    fuentes: ['Kit Elegoo Smart Car · Wire connect table v2.0', 'Kit Elegoo Smart Car · Lección 0 Ensamble el coche']
  },
  {
    id: 'e1-movimiento', modulo: 'm9', titulo: 'Mover el coche: avanzar, retroceder y girar', nivel: 'Básico', minutos: 25,
    resumen: 'Controlar dos motores con el L298N y ajustar la velocidad con PWM.',
    cuerpo: `
<h2>Cómo se mueve el coche</h2>
<p>El L298N controla dos motores. Cada lado tiene una <strong>señal de velocidad</strong> (ENA o ENB, PWM) y dos pines de sentido (IN1/IN2 y IN3/IN4). Combinando los sentidos:</p>
${tabla(['Acción', 'IN1', 'IN2', 'IN3', 'IN4'], [
  ['Avanzar', 'HIGH', 'LOW', 'LOW', 'HIGH'],
  ['Retroceder', 'LOW', 'HIGH', 'HIGH', 'LOW'],
  ['Girar a la izquierda', 'HIGH', 'LOW', 'HIGH', 'LOW'],
  ['Girar a la derecha', 'LOW', 'HIGH', 'LOW', 'HIGH'],
  ['Parar', 'LOW', 'LOW', 'LOW', 'LOW']
])}
<p>Estos valores corresponden al cableado estándar del kit. Si una rueda gira al revés, invierte los dos cables de ese motor en el L298N (no cambies el código).</p>
<h2>Velocidad</h2>
<p><code>analogWrite(ENA, valor)</code> con un valor de 0 a 255 controla la velocidad. Empieza con <strong>150</strong> para pruebas con el coche sobre la mesa.</p>
<h2>Código</h2>
${cod(`
// Pines del kit (ver tabla de cableado)
const int ENA = 5, ENB = 11;
const int IN1 = 6, IN2 = 7, IN3 = 8, IN4 = 9;
const int VELOCIDAD = 150;   // 0 a 255

void configurarMotores() {
  pinMode(ENA, OUTPUT); pinMode(ENB, OUTPUT);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
}

void mover(bool a1, bool a2, bool b1, bool b2) {
  digitalWrite(IN1, a1); digitalWrite(IN2, a2);
  digitalWrite(IN3, b1); digitalWrite(IN4, b2);
  analogWrite(ENA, VELOCIDAD);
  analogWrite(ENB, VELOCIDAD);
}

void avanzar()          { mover(HIGH, LOW,  LOW,  HIGH); }
void retroceder()       { mover(LOW,  HIGH, HIGH, LOW);  }
void girarIzquierda()   { mover(HIGH, LOW,  HIGH, LOW);  }
void girarDerecha()     { mover(LOW,  HIGH, LOW,  HIGH); }

void parar() {
  digitalWrite(ENA, LOW);
  digitalWrite(ENB, LOW);
}

void setup() {
  configurarMotores();
  parar();
}

void loop() {
  avanzar();        delay(1000);
  parar();          delay(500);
  retroceder();     delay(1000);
  parar();          delay(500);
  girarIzquierda(); delay(500);
  girarDerecha();   delay(500);
  parar();          delay(2000);
}
`, 'Secuencia de movimientos (kit Elegoo, UNO)')}
${caja('peligro', 'Primera prueba', '<p>Levanta el coche para que las ruedas no toquen la mesa. Si el coche se mueve solo al encender, revisa la batería y que <code>parar()</code> esté en <code>setup()</code>.</p>')}
<h2>Fuentes</h2>
<p class="pista">Kit Elegoo Smart Car · Lección 1 «Hacer el movimiento del coche» (secuencia de sentidos y pines). Código original.</p>`,
    quiz: [
      { pregunta: 'Para avanzar, según la tabla, ¿qué estado tiene IN1?', opciones: ['LOW', 'HIGH', 'PWM', 'INPUT'], correcta: 1, explicacion: 'En la tabla, avanzar pone IN1 en HIGH e IN2 en LOW.', pista: 'Mira la fila “Avanzar”.' },
      { pregunta: 'Si una rueda gira al revés, lo más sencillo es…', opciones: ['Cambiar el código', 'Invertir los dos cables de ese motor en el L298N', 'Subir la velocidad', 'Quitar la batería'], correcta: 1, explicacion: 'Invertir los cables del motor cambia el sentido sin tocar el programa.', pista: 'El problema está en el cableado físico.' }
    ],
    fuentes: ['Kit Elegoo Smart Car · Lección 1 Hacer el movimiento del coche']
  },
  {
    id: 'e2-bluetooth', modulo: 'm9', titulo: 'Controlar el coche desde el celular (Bluetooth HC-06)', nivel: 'Básico', minutos: 25,
    resumen: 'Recibir comandos de una letra por Bluetooth y actuar sobre los motores.',
    cuerpo: `
<h2>Cómo llega la orden</h2>
<p>El módulo HC-06 recibe datos por Bluetooth y los reenvía a la UNO por su puerto serie (D0 y D1). El programa lee <strong>un carácter</strong> y actúa:</p>
${tabla(['Carácter', 'Acción'], [
  ['f', 'Avanzar'], ['b', 'Retroceder'], ['l', 'Girar a la izquierda'], ['r', 'Girar a la derecha'], ['s', 'Parar']
])}
<h2>Seguridad: parada automática</h2>
<p>Si la conexión se corta mientras el coche avanza, debe detenerse. El código de abajo para el coche si pasa más de un segundo sin órdenes.</p>
${cod(`
const int ENA = 5, ENB = 11;
const int IN1 = 6, IN2 = 7, IN3 = 8, IN4 = 9;
const int VELOCIDAD = 150;
const unsigned long TIEMPO_SIN_ORDEN = 1000;   // ms

unsigned long ultimaOrden = 0;

void mover(bool a1, bool a2, bool b1, bool b2) {
  digitalWrite(IN1, a1); digitalWrite(IN2, a2);
  digitalWrite(IN3, b1); digitalWrite(IN4, b2);
  analogWrite(ENA, VELOCIDAD);
  analogWrite(ENB, VELOCIDAD);
}

void parar() {
  digitalWrite(ENA, LOW);
  digitalWrite(ENB, LOW);
}

void setup() {
  pinMode(ENA, OUTPUT); pinMode(ENB, OUTPUT);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  Serial.begin(9600);
  parar();
}

void loop() {
  if (Serial.available() > 0) {
    char orden = Serial.read();
    ultimaOrden = millis();
    switch (orden) {
      case 'f': mover(HIGH, LOW,  LOW,  HIGH); break;
      case 'b': mover(LOW,  HIGH, HIGH, LOW);  break;
      case 'l': mover(HIGH, LOW,  HIGH, LOW);  break;
      case 'r': mover(LOW,  HIGH, LOW,  HIGH); break;
      case 's': parar(); break;
    }
  }
  if (millis() - ultimaOrden > TIEMPO_SIN_ORDEN) {
    parar();
  }
}
`, 'Control por Bluetooth con parada de seguridad (UNO)')}
${caja('advertencia', 'Desconecta el HC-06 al subir el código', '<p>Mientras el módulo está conectado a D0/D1, la carga desde el IDE puede fallar. Sube el programa con el módulo desconectado y vuelve a conectarlo después.</p>')}
<h2>Probar</h2>
<ol>
  <li>Empareja el celular con el HC-06 (código de emparejamiento habitual: 1234 o 0000; confirma en la hoja del módulo).</li>
  <li>Usa una app de terminal Bluetooth serie y envía <code>f</code>, luego <code>s</code>.</li>
  <li>Si no responde, revisa que TXD del HC-06 vaya a D0 y RXD a D1.</li>
</ol>
<h2>Fuentes</h2>
<p class="pista">Kit Elegoo Smart Car · Lección 2 «Coche Bluetooth» y hoja del HC-06 (comandos y pines). Código original con parada de seguridad.</p>`,
    quiz: [
      { pregunta: 'La orden “s” envía el coche a…', opciones: ['Avanzar', 'Retroceder', 'Parar', 'Girar'], correcta: 2, explicacion: 'En el protocolo de esta lección, “s” detiene el coche.', pista: 'Piensa en “stop”.' },
      { pregunta: '¿Por qué el código tiene un tiempo sin órdenes?', opciones: ['Para ahorrar batería', 'Para parar el coche si se pierde la conexión', 'Para medir distancia', 'Para cambiar de color'], correcta: 1, explicacion: 'Si no llegan órdenes, el coche se detiene por seguridad.', pista: 'Imagina que se apaga el celular.' }
    ],
    fuentes: ['Kit Elegoo Smart Car · Lección 2 Coche Bluetooth', 'Hoja técnica del módulo HC-06']
  },
  {
    id: 'e3-infrarrojo', modulo: 'm9', titulo: 'Control remoto infrarrojo: leer las teclas', nivel: 'Intermedio', minutos: 30,
    resumen: 'Leer el código de cada tecla del control y usarlo para mover el coche.',
    cuerpo: `
<h2>Cómo funciona</h2>
<p>El control remoto envía pulsos de luz infrarroja codificados. El receptor (en D12) los convierte en un número. <strong>Cada tecla tiene su propio número</strong>, y ese número puede ser distinto entre controles. Por eso el primer paso es <em>leerlo</em>, no suponerlo.</p>
<h2>Librería</h2>
<p>Usa la librería <strong>IRremote</strong> incluida en el material del kit (versión 2.x, la que usa la API de este código). Si aparece el error <code>IRremote.h: No such file</code>, instálala. Si aparece un error con <em>RobotIRremote</em> o <code>TKD2</code>, <strong>elimina la librería RobotIRremote</strong> antigua de tu IDE: entra en conflicto con IRremote.</p>
<h2>Paso 1: leer los códigos</h2>
${cod(`
#include <IRremote.h>

const int PIN_IR = 12;
IRrecv receptor(PIN_IR);
decode_results resultado;

void setup() {
  Serial.begin(9600);
  receptor.enableIRIn();
  Serial.println("Pulsa una tecla del control");
}

void loop() {
  if (receptor.decode(&resultado)) {
    Serial.println(resultado.value, DEC);   // anota este número por cada tecla
    receptor.resume();                      // prepara la siguiente lectura
  }
}
`, 'Imprimir el código de cada tecla (UNO)')}
<p>Abre el monitor serie a 9600 y anota el número de cada tecla que quieras usar (adelante, atrás, izquierda, derecha, parar).</p>
<h2>Paso 2: controlar el coche</h2>
<p>Sustituye los valores de abajo por los que anotaste. Las funciones de movimiento son las de la lección 1.</p>
${cod(`
#include <IRremote.h>

const int PIN_IR = 12;
const int ENA = 5, ENB = 11;
const int IN1 = 6, IN2 = 7, IN3 = 8, IN4 = 9;
const int VELOCIDAD = 150;

// Sustituye por los códigos que anotaste con el paso 1
const unsigned long TECLA_ADELANTE = 0;
const unsigned long TECLA_ATRAS    = 0;
const unsigned long TECLA_IZQUIERDA = 0;
const unsigned long TECLA_DERECHA  = 0;
const unsigned long TECLA_PARAR    = 0;

IRrecv receptor(PIN_IR);
decode_results resultado;

void mover(bool a1, bool a2, bool b1, bool b2) {
  digitalWrite(IN1, a1); digitalWrite(IN2, a2);
  digitalWrite(IN3, b1); digitalWrite(IN4, b2);
  analogWrite(ENA, VELOCIDAD);
  analogWrite(ENB, VELOCIDAD);
}

void parar() { digitalWrite(ENA, LOW); digitalWrite(ENB, LOW); }

void setup() {
  pinMode(ENA, OUTPUT); pinMode(ENB, OUTPUT);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  receptor.enableIRIn();
  parar();
}

void loop() {
  if (receptor.decode(&resultado)) {
    unsigned long tecla = resultado.value;
    receptor.resume();
    if (tecla == TECLA_ADELANTE)       mover(HIGH, LOW,  LOW,  HIGH);
    else if (tecla == TECLA_ATRAS)     mover(LOW,  HIGH, HIGH, LOW);
    else if (tecla == TECLA_IZQUIERDA) mover(HIGH, LOW,  HIGH, LOW);
    else if (tecla == TECLA_DERECHA)   mover(LOW,  HIGH, LOW,  HIGH);
    else if (tecla == TECLA_PARAR)     parar();
  }
}
`, 'Control remoto infrarrojo (UNO)')}
${caja('consejo', 'Por qué quedan ceros', '<p>Los valores <code>0</code> son marcadores: si los dejas así, ninguna tecla hará nada. Reemplázalos antes de probar.</p>')}
<h2>Fuentes</h2>
<p class="pista">Kit Elegoo Smart Car · Lección 3 «Control de infrarrojos» y FAQ de IRremote (errores de librería). Código original.</p>`,
    quiz: [
      { pregunta: 'Si cambias de control remoto, ¿qué debes hacer con los códigos?', opciones: ['Usar los mismos', 'Leerlos de nuevo con el paso 1', 'Cambiar el pin a D2', 'Nada'], correcta: 1, explicacion: 'Cada control puede tener códigos distintos; hay que leerlos otra vez.', pista: 'Cada control tiene sus propios números.' },
      { pregunta: 'Aparece el error “RobotIRremote / TKD2”. ¿Qué haces?', opciones: ['Cambiar el pin a 12', 'Eliminar la librería RobotIRremote antigua', 'Subir la velocidad', 'Instalar Bluetooth'], correcta: 1, explicacion: 'La librería antigua RobotIRremote entra en conflicto con IRremote.', pista: 'Revisa las librerías instaladas en el IDE.' }
    ],
    fuentes: ['Kit Elegoo Smart Car · Lección 3 Control de infrarrojos', 'Kit Elegoo Smart Car · FAQ IRremote']
  },
  {
    id: 'e4-obstaculos', modulo: 'm9', titulo: 'Evitar obstáculos con ultrasonido y servo', nivel: 'Intermedio', minutos: 30,
    resumen: 'Mirar a tres lados con el servo, medir distancias y elegir la ruta libre.',
    cuerpo: `
<h2>Idea general</h2>
<ol>
  <li>Mira al frente (servo a 90°) y mide la distancia.</li>
  <li>Si hay espacio, avanza.</li>
  <li>Si no, para, mira a la izquierda (150°) y a la derecha (30°).</li>
  <li>Gira hacia el lado con más espacio.</li>
</ol>
<h2>Medir la distancia</h2>
<p>El HC-SR04 emite un pulso de ultrasonido por <code>Trig</code> y mide cuánto tarda el eco en <code>Echo</code>. Con el tiempo en µs: distancia (cm) = tiempo × 0,0343 / 2. El servo mueve el sensor en la base del coche.</p>
${cod(`
#include <Servo.h>

const int PIN_SERVO = 3;
const int TRIG = A5, ECHO = A4;
const int ENA = 5, ENB = 11;
const int IN1 = 6, IN2 = 7, IN3 = 8, IN4 = 9;
const int VELOCIDAD = 150;
const float UMBRAL_CM = 25.0;

Servo servo;

float medirCm() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long t = pulseIn(ECHO, HIGH, 30000);   // espera máxima 30 ms
  if (t == 0) return 999;                // sin eco: espacio libre
  return t * 0.0343 / 2.0;
}

void mover(bool a1, bool a2, bool b1, bool b2) {
  digitalWrite(IN1, a1); digitalWrite(IN2, a2);
  digitalWrite(IN3, b1); digitalWrite(IN4, b2);
  analogWrite(ENA, VELOCIDAD);
  analogWrite(ENB, VELOCIDAD);
}

void parar() { digitalWrite(ENA, LOW); digitalWrite(ENB, LOW); }

void setup() {
  servo.attach(PIN_SERVO);
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  pinMode(ENA, OUTPUT); pinMode(ENB, OUTPUT);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  parar();
}

void loop() {
  servo.write(90);
  delay(300);
  if (medirCm() > UMBRAL_CM) {
    mover(HIGH, LOW, LOW, HIGH);   // avanzar
    return;
  }
  parar();
  servo.write(150);  delay(400);
  float izquierda = medirCm();
  servo.write(30);   delay(400);
  float derecha = medirCm();
  servo.write(90);   delay(300);

  if (izquierda > derecha) mover(HIGH, LOW, HIGH, LOW);   // girar a la izquierda
  else                     mover(LOW, HIGH, LOW, HIGH);   // girar a la derecha
  delay(500);
  parar();
}
`, 'Evitar obstáculos: mirar, medir y girar (UNO)')}
${caja('advertencia', 'Calibra el servo primero', '<p>Antes de usar el código, prueba el servo sola con un programa que solo mueva de 30° a 150°. Si el brazo choca con el chasis, reduce los ángulos. El kit trae un ejemplo de depuración del servo para esto.</p>')}
<h2>Errores frecuentes</h2>
<ul>
  <li><strong>Siempre gira:</strong> el umbral es demasiado alto; baja <code>UMBRAL_CM</code>.</li>
  <li><strong>No detecta nada:</strong> revisa que Trig esté en A5 y Echo en A4 (no al revés).</li>
  <li><strong>Lecturas erráticas:</strong> superficies blandas o inclinadas absorben el sonido.</li>
</ul>
<h2>Fuentes</h2>
<p class="pista">Kit Elegoo Smart Car · Lección 4 «Coche evita obstáculos» y «servo debug». Código original; la fórmula de distancia es la misma que en el Módulo 4.</p>`,
    quiz: [
      { pregunta: 'Un eco de 580 µs equivale a una distancia de…', opciones: ['10 cm', '1 cm', '100 cm', '58 cm'], correcta: 0, explicacion: '580 × 0,0343 / 2 ≈ 10 cm.', pista: 'Ida y vuelta: divide entre 2.' },
      { pregunta: 'Antes de usar el código de obstáculos conviene…', opciones: ['Subir la velocidad a 255', 'Calibrar el servo con un programa de prueba', 'Quitar el sensor', 'Conectar el Bluetooth'], correcta: 1, explicacion: 'Si el servo choca con el chasis, el giro del sensor puede dañar piezas.', pista: 'Piensa en los ángulos del servo.' }
    ],
    fuentes: ['Kit Elegoo Smart Car · Lección 4 Coche evita obstáculos', 'Kit Elegoo Smart Car · servo debug']
  },
  {
    id: 'e5-linea', modulo: 'm9', titulo: 'Seguir una línea con tres sensores', nivel: 'Intermedio', minutos: 30,
    resumen: 'Leer tres sensores de línea y corregir la trayectoria.',
    cuerpo: `
<h2>Cómo leen los sensores</h2>
<p>Cada sensor de línea tiene un LED infrarrojo y un receptor. La superficie oscura absorbe la luz y la clara la refleja. El módulo entrega una señal digital (HIGH o LOW) según lo que vea.</p>
${caja('advertencia', 'Verifica el sentido de la lectura', '<p>El programa de esta lección asume que <strong>HIGH = el sensor ve la línea</strong>. El programa de Bluetooth del kit invierte esta lectura. Compruébalo con el monitor serie: pon el sensor sobre la línea y mira qué valor aparece. Si no coincide, invierte la condición.</p>')}
<h2>Estrategia</h2>
<ul>
  <li>Si el sensor central ve la línea: <strong>avanza</strong>.</li>
  <li>Si solo ve el sensor izquierdo: la línea está a la izquierda, <strong>corrige a la izquierda</strong>.</li>
  <li>Si solo ve el derecho: <strong>corrige a la derecha</strong>.</li>
  <li>Si no ve nada: <strong>para</strong>.</li>
</ul>
${cod(`
const int SENSOR_IZQ = 2, SENSOR_CENTRO = 4, SENSOR_DER = 10;
const int ENA = 5, ENB = 11;
const int IN1 = 6, IN2 = 7, IN3 = 8, IN4 = 9;
const int VELOCIDAD = 150;

void mover(bool a1, bool a2, bool b1, bool b2) {
  digitalWrite(IN1, a1); digitalWrite(IN2, a2);
  digitalWrite(IN3, b1); digitalWrite(IN4, b2);
  analogWrite(ENA, VELOCIDAD);
  analogWrite(ENB, VELOCIDAD);
}

void parar() { digitalWrite(ENA, LOW); digitalWrite(ENB, LOW); }

void setup() {
  pinMode(SENSOR_IZQ, INPUT);
  pinMode(SENSOR_CENTRO, INPUT);
  pinMode(SENSOR_DER, INPUT);
  pinMode(ENA, OUTPUT); pinMode(ENB, OUTPUT);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  Serial.begin(9600);
  parar();
}

void loop() {
  bool izq    = digitalRead(SENSOR_IZQ) == HIGH;
  bool centro = digitalRead(SENSOR_CENTRO) == HIGH;
  bool der    = digitalRead(SENSOR_DER) == HIGH;

  if (centro)            mover(HIGH, LOW, LOW, HIGH);    // avanzar
  else if (izq)          mover(HIGH, LOW, HIGH, LOW);    // corregir a la izquierda
  else if (der)          mover(LOW, HIGH, LOW, HIGH);    // corregir a la derecha
  else                   parar();                         // sin línea
}
`, 'Seguimiento de línea con tres sensores (UNO)')}
<p>Prueba primero con el coche <strong>levantado</strong>: comprueba que las ruedas giran en el sentido correcto al pasar cada sensor sobre la línea. Solo después, sobre el suelo.</p>
<h2>Nota sobre el código del kit</h2>
<p>El programa de ejemplo del kit para seguir línea gira a la izquierda cuando el sensor derecho ve la línea. Ese comportamiento depende de cómo montaste los sensores y del color de la pista. Si tu coche se aleja de la línea, invierte la corrección.</p>
<h2>Errores frecuentes</h2>
<ul>
  <li><strong>Oscila de lado a lado:</strong> reduce <code>VELOCIDAD</code> o ajusta la altura de los sensores.</li>
  <li><strong>Se sale al primer giro:</strong> la corrección es muy lenta; añade una corrección más suave con la velocidad de un lado menor.</li>
  <li><strong>Nunca ve la línea:</strong> revisa la altura (unos milímetros sobre el suelo) y el contraste de la pista.</li>
</ul>
<h2>Fuentes</h2>
<p class="pista">Kit Elegoo Smart Car · Lección 5 «Línea de seguimiento» (asignación de pines D2, D4, D10) y Lección 2 (lectura invertida). Código original.</p>`,
    quiz: [
      { pregunta: 'Solo el sensor izquierdo ve la línea. ¿Qué corrige el coche?', opciones: ['Avanzar recto', 'Girar a la izquierda', 'Girar a la derecha', 'Retroceder'], correcta: 1, explicacion: 'La línea está a la izquierda, así que el coche gira hacia ese lado.', pista: 'Sigue el lado donde está la línea.' },
      { pregunta: 'Los programas de seguimiento del kit parecen leer los sensores de forma distinta. ¿Qué haces?', opciones: ['Ignorarlo', 'Comprobarlo con el monitor serie y ajustar la condición', 'Cambiar de pin', 'Subir la velocidad'], correcta: 1, explicacion: 'Verifica qué valor da el sensor sobre la línea y ajusta la lectura.', pista: 'Pon el sensor sobre la línea y mira el monitor.' }
    ],
    fuentes: ['Kit Elegoo Smart Car · Lección 5 Línea de seguimiento de coches', 'Kit Elegoo Smart Car · Lección 2 Coche Bluetooth (programa de referencia)']
  }
];

LECCIONES.push(...LECCIONES_ELEGOO);
