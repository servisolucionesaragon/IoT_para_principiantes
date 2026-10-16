/* Módulo 8 · Simulación con Tinkercad: tutorial y ejemplos guiados.
   Explicaciones originales. Los nombres de botones y componentes de Tinkercad pueden cambiar
   con las actualizaciones de la plataforma: por eso cada ejemplo indica cómo buscarlos.
   Se carga después de contenido.js (reemplaza la lección m8-tinkercad y agrega ejemplos). */

MODULOS.forEach(m => { if (m.id === 'm8') m.titulo = 'Módulo 8 · Simulación con Tinkercad'; if (m.id === 'm8') m.descripcion = 'Tutorial de Tinkercad y ejemplos para simular Arduino antes de tocar el hardware.'; });

const TINKERCAD_LECCION = {
  id: 'm8-tinkercad', modulo: 'm8', titulo: 'Tutorial: usar Tinkercad como simulador de Arduino', nivel: 'Principiante', minutos: 20,
  resumen: 'Qué es, cómo se arma un circuito, cómo se programa y cómo se simula.',
  cuerpo: `
<h2>Qué es Tinkercad</h2>
<p><strong>Tinkercad Circuits</strong> es un simulador gratuito del navegador (de Autodesk). Permite armar un circuito con una placa Arduino, componentes y cables, programarlo y ver cómo funciona antes de conectar nada real. Sitio oficial: <a href="https://www.tinkercad.com/" target="_blank" rel="noopener">tinkercad.com</a>.</p>
<h2>Simular no es probar</h2>
<p>La simulación sirve para equivocarte sin riesgo. Pero no reproduce todo: tolerancias de componentes, rebotes de pulsadores, ruido de sensores, cables reales o librerías de terceros. <strong>Un circuito que funciona en Tinkercad aún debe probarse en la placa real</strong>.</p>
<h2>Antes de empezar: qué sí y qué no</h2>
${caja('advertencia', 'Verifica la lista antes de planear un proyecto', '<p>Tinkercad admite Arduino Uno y componentes básicos (LED, resistencias, pulsadores, potenciómetro, servo, piezo). <strong>En esta plataforma no confirmamos todas las placas</strong>: en particular, no comprobamos que admita ESP32. Abre tinkercad.com y busca tu placa antes de usar un ejemplo. Si tu placa no está, usa una alternativa como Wokwi (fuentes secundarias la mencionan para ESP32; confírmalo).</p>')}
<h2>Paso 1 · Entrar y crear un circuito</h2>
<ol>
  <li>Entra a tinkercad.com con tu cuenta (es gratuita) y pulsa <strong>Crear → Circuito</strong> (los nombres pueden variar).</li>
  <li>Ponle un nombre al circuito, por ejemplo «LED intermitente».</li>
</ol>
<h2>Paso 2 · Agregar la placa y los componentes</h2>
<ol>
  <li>En el panel de componentes, busca <strong>Arduino Uno</strong> y arrástralo al área de trabajo.</li>
  <li>Busca cada componente por su nombre en inglés: <em>LED</em>, <em>Resistor</em>, <em>Pushbutton</em>, <em>Potentiometer</em>, <em>Servo</em>, <em>Piezo</em>.</li>
  <li>Arrastra a la protoboard virtual los componentes que necesites.</li>
</ol>
<h2>Paso 3 · Conectar con cables</h2>
<ol>
  <li>Pasa el cursor sobre el extremo de un pin: se marca en color.</li>
  <li>Haz clic y arrastra hasta el otro extremo: se crea el cable.</li>
  <li>Usa el <strong>rojo</strong> para 5 V, el <strong>negro</strong> para GND y otro color para las señales (si Tinkercad permite elegir color).</li>
  <li>Para borrar un cable, selecciónalo y pulsa <kbd>Supr</kbd> (o el botón de borrar).</li>
</ol>
<h2>Paso 4 · Programar</h2>
<ol>
  <li>Haz clic en la placa Arduino y abre el <strong>editor de código</strong>.</li>
  <li>Elige el modo <strong>Texto</strong> (C++ de Arduino) para usar los ejemplos de esta plataforma. El modo de bloques también existe, pero aquí usamos texto.</li>
  <li>Pega el código, bórralo todo antes si es necesario, y revisa que no haya errores (Tinkercad los marca en rojo).</li>
</ol>
<h2>Paso 5 · Simular</h2>
<ol>
  <li>Pulsa <strong>Iniciar simulación</strong>. Observa los LED, el servo o el buzzer.</li>
  <li>Para pausar o detener, usa el mismo botón (o <strong>Detener simulación</strong>).</li>
  <li>Si usas <code>Serial.println()</code>, abre el <strong>monitor serie</strong> para leer los valores.</li>
</ol>
<h2>Paso 6 · Resolver errores de conexión</h2>
${tabla(['Síntoma', 'Causa frecuente', 'Solución'], [
  ['El LED no enciende', 'Polaridad invertida o sin resistencia', 'Ánodo (+) hacia el pin, cátodo (−) a GND, con resistencia de 220 Ω'],
  ['El pulsador no responde', 'Pin equivocado o sin INPUT_PULLUP', 'Revisa el pin del código y usa <code>pinMode(pin, INPUT_PULLUP)</code>'],
  ['Todo queda encendido', 'Un cable va de 5 V directo a GND', 'Borra ese cable; revisa la pista roja y la negra'],
  ['La simulación no inicia', 'Error de sintaxis en el código', 'Lee el mensaje de error y corrige la línea indicada']
])}
<h2>Paso 7 · Guardar y compartir</h2>
<p>El circuito queda guardado en tu cuenta de Tinkercad. Para compartirlo, usa la opción de compartir del proyecto (puede requerir cuenta). Si el colegio no permite compartir, guarda una captura de pantalla y la copia del código.</p>
<h2>Cómo usar esta plataforma junto con Tinkercad</h2>
<ol>
  <li>Elige un ejemplo del módulo 8 (siguiente lección).</li>
  <li>Monta el circuito en Tinkercad siguiendo la tabla de conexiones.</li>
  <li>Copia el código del ejemplo y simúlalo.</li>
  <li>Cuando funcione, compara con la <a href="#/leccion/m5-montaje">guía de montaje en protoboard</a> y, si tienes la placa, prueba en hardware real.</li>
</ol>
<h2>Fuentes</h2>
<p class="pista">Guía original. Documentación general de Tinkercad (tinkercad.com). La lista de componentes y el nombre de los botones deben confirmarse en la plataforma.</p>`,
  quiz: [
    { pregunta: '¿Qué afirma correctamente esta lección sobre simular?', opciones: ['Que la simulación garantiza el funcionamiento real', 'Que simular no reemplaza probar en hardware real', 'Que Tinkercad soporta todos los ESP32', 'Que no hace falta verificar la placa'], correcta: 1, explicacion: 'La simulación es una aproximación; el hardware real puede comportarse distinto.', pista: 'Piensa en tolerancias y ruido.' }
  ],
  fuentes: ['Tinkercad oficial: https://www.tinkercad.com/']
};

/* Ejemplos guiados: cada uno con componentes, conexiones, código, pasos y resultado */
function ejemploTinkercad({ id, titulo, objetivo, componentes, conexiones, codigo, pasos, resultado, cambiar, quiz, fuentes }) {
  return {
    id, modulo: 'm8', titulo, conexionesEjemplo: conexiones, nivel: 'Principiante', minutos: 15,
    resumen: objetivo,
    cuerpo: `
<h2>Objetivo</h2>
<p>${objetivo}</p>
<h2>Componentes en Tinkercad</h2>
<ul>${componentes.map(c => `<li>${c}</li>`).join('')}</ul>
<h2>Conexiones</h2>
${tabla(['Componente', 'Pin del componente', 'Pin de Arduino', 'Función'], conexiones)}
<h2>Código</h2>
${cod(codigo, 'Pega este código en el editor de Texto de Tinkercad')}
<h2>Pasos en Tinkercad</h2>
<ol>${pasos.map(p => `<li>${p}</li>`).join('')}</ol>
<h2>Resultado esperado</h2>
<p>${resultado}</p>
${caja('consejo', 'Cambia algo y observa', `<p>${cambiar}</p>`)}
<h2>Fuentes</h2>
<p class="pista">${fuentes}</p>`,
    quiz: [quiz],
    fuentes: [fuentes]
  };
}

const EJEMPLOS_TINKERCAD = [
  ejemploTinkercad({
    id: 'm8-sim-led', titulo: 'Ejemplo 1: LED intermitente',
    objetivo: 'Encender y apagar un LED cada medio segundo, con una resistencia que protege el LED.',
    componentes: ['Arduino Uno', 'LED (color a elección)', 'Resistor de 220 Ω', 'Cables'],
    conexiones: [
      ['LED (ánodo, pata +)', 'Resistor → pin 13', 'D13', 'Señal que enciende el LED'],
      ['LED (cátodo, pata −)', 'GND', 'GND', 'Cierra el circuito'],
      ['Resistor', 'Entre el pin 13 y el ánodo', '—', 'Limita la corriente']
    ],
    codigo: `const int PIN_LED = 13;

void setup() {
  pinMode(PIN_LED, OUTPUT);
}

void loop() {
  digitalWrite(PIN_LED, HIGH);
  delay(500);
  digitalWrite(PIN_LED, LOW);
  delay(500);
}`,
    pasos: ['Crea un circuito nuevo y arrastra <em>Arduino Uno</em>.', 'Arrastra el <em>LED</em> y el <em>Resistor</em> y conéctalos como indica la tabla.', 'Abre el editor de la placa, elige Texto, pega el código.', 'Pulsa <strong>Iniciar simulación</strong> y observa el LED.'],
    resultado: 'El LED se enciende medio segundo y se apaga medio segundo, de forma repetida.',
    cambiar: 'Cambia los <code>delay(500)</code> por <code>100</code> para un parpadeo rápido, o por <code>2000</code> para uno lento.',
    quiz: { pregunta: '¿Para qué sirve el resistor en el circuito del LED?', opciones: ['Para que el LED brille más', 'Para limitar la corriente y proteger el LED', 'Para medir el tiempo', 'Para conectar la placa a internet'], correcta: 1, explicacion: 'Sin resistencia, la corriente puede quemar el LED.', pista: 'Piensa en la "estrechez" del tubo de corriente.' },
    fuentes: 'Ejemplo original basado en el parpadeo de la lección 2 de esta plataforma.'
  }),
  ejemploTinkercad({
    id: 'm8-sim-pulsador', titulo: 'Ejemplo 2: pulsador que enciende un LED',
    objetivo: 'Leer un pulsador y encender el LED solo mientras se mantiene presionado.',
    componentes: ['Arduino Uno', 'Pushbutton (pulsador)', 'LED y Resistor de 220 Ω', 'Cables'],
    conexiones: [
      ['Pulsador (una pata)', 'Pin 2', 'D2', 'Entrada: lee si está presionado'],
      ['Pulsador (pata opuesta)', 'GND', 'GND', 'Cierra el circuito al presionar'],
      ['LED (ánodo) + Resistor', 'Pin 13', 'D13', 'Salida: enciende el LED'],
      ['LED (cátodo)', 'GND', 'GND', 'Cierra el circuito']
    ],
    codigo: `const int BOTON = 2;
const int LED = 13;

void setup() {
  pinMode(BOTON, INPUT_PULLUP);   // reposo = HIGH
  pinMode(LED, OUTPUT);
}

void loop() {
  bool presionado = (digitalRead(BOTON) == LOW);
  digitalWrite(LED, presionado ? HIGH : LOW);
}`,
    pasos: ['Arma el circuito con el pulsador en las columnas centrales de la protoboard.', 'Pega el código y pulsa <strong>Iniciar simulación</strong>.', 'Haz clic sobre el pulsador en la simulación: el LED debe encenderse mientras lo mantienes.'],
    resultado: 'El LED se enciende al presionar el pulsador y se apaga al soltarlo.',
    cambiar: 'Quita <code>INPUT_PULLUP</code> para ver qué pasa cuando el pin "flota": el LED puede encenderse solo.',
    quiz: { pregunta: 'Con INPUT_PULLUP, ¿qué lee digitalRead() con el pulsador sin presionar?', opciones: ['LOW', 'HIGH', 'un valor aleatorio', '0 voltios'], correcta: 1, explicacion: 'La resistencia interna lleva el pin a HIGH mientras el pulsador está suelto.', pista: 'El reposo es HIGH.' },
    fuentes: 'Ejemplo original basado en la lección de entradas digitales.'
  }),
  ejemploTinkercad({
    id: 'm8-sim-potenciometro', titulo: 'Ejemplo 3: potenciómetro que controla el brillo',
    objetivo: 'Usar un potenciómetro para cambiar el brillo de un LED con PWM.',
    componentes: ['Arduino Uno', 'Potentiometer (potenciómetro)', 'LED y Resistor de 220 Ω', 'Cables'],
    conexiones: [
      ['Potenciómetro (pata extrema 1)', '5 V', '5V', 'Alimentación'],
      ['Potenciómetro (pata extrema 2)', 'GND', 'GND', 'Referencia'],
      ['Potenciómetro (cursor central)', 'Pin A0', 'A0', 'Entrada analógica'],
      ['LED + Resistor', 'Pin 9 (PWM)', 'D9', 'Salida con brillo variable']
    ],
    codigo: `const int POT = A0;
const int LED = 9;

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int lectura = analogRead(POT);             // 0 a 1023
  int brillo = map(lectura, 0, 1023, 0, 255);
  analogWrite(LED, brillo);
  Serial.println(lectura);
  delay(100);
}`,
    pasos: ['Coloca el potenciómetro y conecta sus tres pines.', 'Usa el pin 9 (marcado con ~) para el LED.', 'Simula y gira la perilla del potenciómetro en la simulación.', 'Abre el monitor serie para ver el valor de 0 a 1023.'],
    resultado: 'Al girar la perilla, el LED cambia de brillo; el monitor serie muestra el valor leído.',
    cambiar: 'Cambia <code>map(lectura, 0, 1023, 0, 255)</code> por <code>map(lectura, 0, 1023, 255, 0)</code> para invertir el sentido.',
    quiz: { pregunta: '¿Qué pin es adecuado para analogWrite en el Arduino Uno?', opciones: ['Pin 8', 'Pin 9', 'Pin A3', 'GND'], correcta: 1, explicacion: 'El pin 9 tiene PWM (marcado con ~).', pista: 'Busca el símbolo ~.' },
    fuentes: 'Ejemplo original basado en la lección de entradas analógicas y PWM.'
  }),
  ejemploTinkercad({
    id: 'm8-sim-semaforo', titulo: 'Ejemplo 4: semáforo con tres LED',
    objetivo: 'Simular un semáforo que cambia de verde a amarillo y a rojo en secuencia.',
    componentes: ['Arduino Uno', '3 LED (rojo, amarillo, verde)', '3 resistores de 220 Ω', 'Cables'],
    conexiones: [
      ['LED rojo', 'Pin 8', 'D8', 'Luz de alto'],
      ['LED amarillo', 'Pin 9', 'D9', 'Luz de precaución'],
      ['LED verde', 'Pin 10', 'D10', 'Luz de paso'],
      ['Cátodos de los tres LED', 'GND', 'GND', 'Referencia común']
    ],
    codigo: `const int ROJO = 8, AMARILLO = 9, VERDE = 10;

void setup() {
  pinMode(ROJO, OUTPUT);
  pinMode(AMARILLO, OUTPUT);
  pinMode(VERDE, OUTPUT);
}

void apagarTodos() {
  digitalWrite(ROJO, LOW);
  digitalWrite(AMARILLO, LOW);
  digitalWrite(VERDE, LOW);
}

void loop() {
  apagarTodos(); digitalWrite(VERDE, HIGH);    delay(4000);
  apagarTodos(); digitalWrite(AMARILLO, HIGH); delay(1500);
  apagarTodos(); digitalWrite(ROJO, HIGH);     delay(4000);
}`,
    pasos: ['Coloca los tres LED en la protoboard con su resistencia cada uno.', 'Une todos los cátodos a GND.', 'Pega el código y simula durante al menos 10 segundos.'],
    resultado: 'Los LED se encienden en orden: verde 4 s, amarillo 1,5 s, rojo 4 s, y se repiten.',
    cambiar: 'Agrega un pulsador de peatón (como en el proyecto del módulo 9) para cambiar la secuencia cuando alguien lo presione.',
    quiz: { pregunta: '¿Por qué la función apagarTodos() se llama antes de encender un LED?', opciones: ['Para ahorrar energía en la simulación', 'Para que nunca queden dos luces encendidas a la vez', 'Porque Tinkercad lo exige', 'Para medir el tiempo'], correcta: 1, explicacion: 'Apagar primero evita que dos luces se enciendan a la vez.', pista: 'Piensa en lo que sería un semáforo con dos luces encendidas.' },
    fuentes: 'Proyecto original del módulo 9 (semáforo) adaptado a Tinkercad.'
  }),
  ejemploTinkercad({
    id: 'm8-sim-servo', titulo: 'Ejemplo 5: servo que barre de 0° a 180°',
    objetivo: 'Mover el brazo de un servo en un barrido continuo y ver el ángulo en el monitor serie.',
    componentes: ['Arduino Uno', 'Servo (Servo Motor)', 'Cables'],
    conexiones: [
      ['Servo (señal, naranja)', 'Pin 9 (PWM)', 'D9', 'Ángulo del brazo'],
      ['Servo (rojo)', '5 V', '5V', 'Alimentación'],
      ['Servo (marrón o negro)', 'GND', 'GND', 'Referencia']
    ],
    codigo: `#include <Servo.h>

Servo miServo;
const int PIN_SERVO = 9;

void setup() {
  miServo.attach(PIN_SERVO);
  Serial.begin(9600);
}

void loop() {
  for (int angulo = 0; angulo <= 180; angulo++) {
    miServo.write(angulo);
    Serial.println(angulo);
    delay(15);
  }
  for (int angulo = 180; angulo >= 0; angulo--) {
    miServo.write(angulo);
    Serial.println(angulo);
    delay(15);
  }
}`,
    pasos: ['Agrega el servo y conecta sus tres cables.', 'Pega el código. Si el editor no reconoce <code>Servo.h</code>, usa el servo de la biblioteca incluida en Tinkercad.', 'Simula y observa el brazo y el monitor serie.'],
    resultado: 'El brazo sube de 0° a 180° y baja de nuevo, mientras el monitor muestra los ángulos.',
    cambiar: 'Cambia el <code>delay(15)</code> por <code>50</code> para ver el movimiento más lento.',
    quiz: { pregunta: '¿Qué controla el valor que se pasa a miServo.write()?', opciones: ['La velocidad de la placa', 'El ángulo del brazo', 'El brillo de un LED', 'La tensión del USB'], correcta: 1, explicacion: 'write() indica el ángulo, de 0 a 180 grados.', pista: 'El servo gira hasta un ángulo.' },
    fuentes: 'Ejemplo original basado en la lección de servomotor SG90.'
  }),
  ejemploTinkercad({
    id: 'm8-sim-alarma', titulo: 'Ejemplo 6: alarma sencilla con pulsador y buzzer',
    objetivo: 'Encender y apagar una alarma sonora con un pulsador (integrador de los ejemplos anteriores).',
    componentes: ['Arduino Uno', 'Pushbutton (pulsador)', 'Piezo (buzzer)', 'Cables'],
    conexiones: [
      ['Pulsador (una pata)', 'Pin 2', 'D2', 'Activa o desactiva la alarma'],
      ['Pulsador (pata opuesta)', 'GND', 'GND', 'Cierra el circuito'],
      ['Piezo (positivo)', 'Pin 8', 'D8', 'Genera el sonido'],
      ['Piezo (negativo)', 'GND', 'GND', 'Referencia']
    ],
    codigo: `const int BOTON = 2;
const int BUZZER = 8;
bool alarmaActiva = false;

void setup() {
  pinMode(BOTON, INPUT_PULLUP);
  pinMode(BUZZER, OUTPUT);
}

void loop() {
  if (digitalRead(BOTON) == LOW) {
    alarmaActiva = !alarmaActiva;   // cambia el estado
    delay(300);                     // evita contar varias pulsaciones
  }
  if (alarmaActiva) {
    tone(BUZZER, 1000);
  } else {
    noTone(BUZZER);
  }
}`,
    pasos: ['Arma el circuito con el pulsador y el piezo.', 'Pega el código y simula.', 'Presiona el pulsador una vez: suena. Otra vez: se detiene.'],
    resultado: 'Cada pulsación alterna entre alarma encendida y apagada.',
    cambiar: 'Cambia la frecuencia de <code>tone(BUZZER, 1000)</code> a <code>2000</code> para un tono más agudo.',
    quiz: { pregunta: '¿Para qué sirve el <code>delay(300)</code> dentro del if del pulsador?', opciones: ['Para ahorrar batería', 'Para no contar varias veces una sola pulsación', 'Para encender el buzzer', 'Para leer el sensor'], correcta: 1, explicacion: 'Al pulsar, los contactos rebotan; la pausa evita que una pulsación cuente varias veces.', pista: 'Piensa en los rebotes del pulsador.' },
    fuentes: 'Ejemplo original que combina pulsador y buzzer.'
  })
];

/* Reemplaza la lección de Tinkercad y agrega los ejemplos justo después, en el orden del módulo */
(function integrarTinkercad() {
  const idx = LECCIONES.findIndex(l => l.id === 'm8-tinkercad');
  const base = { ...TINKERCAD_LECCION };
  if (idx >= 0) LECCIONES.splice(idx, 1, base);
  else LECCIONES.push(base);
  const pos = LECCIONES.findIndex(l => l.id === 'm8-tinkercad');
  LECCIONES.splice(pos + 1, 0, ...EJEMPLOS_TINKERCAD);
})();
