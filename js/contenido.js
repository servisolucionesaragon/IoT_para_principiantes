/* Contenido educativo original de la plataforma.
   Las explicaciones están escritas para esta plataforma; los documentos de origen
   se citan en la sección «Fuentes» de cada lección y en docs/INVENTARIO.md.
   Los fragmentos de código son ilustrativos hasta que se verifiquen en hardware real
   (ver la sección "Estado de verificación" de README.md). */

/** Escapa texto para HTML. */
function esc(t) {
  return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Bloque de código con botón de copiar (el botón lo añade app.js). */
function cod(texto, etiqueta) {
  const etq = etiqueta ? `<p class="etiqueta-codigo">${esc(etiqueta)}</p>` : '';
  return `${etq}<div class="bloque-codigo"><pre class="codigo"><code>${esc(texto.replace(/^\n/, '').replace(/\s+$/, ''))}</code></pre></div>`;
}

function caja(tipo, titulo, html) {
  return `<div class="caja ${tipo}"><strong>${titulo}</strong>${html}</div>`;
}

function tabla(cabeceras, filas) {
  return `<div class="tabla-wrap"><table><thead><tr>${cabeceras.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${filas.map(f => `<tr>${f.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function figura(svg, pie) {
  return `<figure class="diagrama">${svg}<figcaption>${pie}</figcaption></figure>`;
}

/* ---------- Diagramas SVG (esquemas simplificados, no a escala) ---------- */

const SVG_LED_UNO = `<svg viewBox="0 0 640 230" role="img" aria-label="Esquema: pin 13 de Arduino UNO, resistencia de 220 ohmios, LED y GND">
  <rect x="20" y="40" width="170" height="150" rx="12" fill="#1d6f8c"/>
  <text x="105" y="120" fill="#fff" text-anchor="middle" font-size="17" font-weight="700">Arduino UNO</text>
  <text x="180" y="75" fill="currentColor" font-size="14" text-anchor="end" dx="-2">D13</text>
  <text x="105" y="175" fill="#fff" text-anchor="middle" font-size="13">GND</text>
  <line x1="190" y1="72" x2="250" y2="72" stroke="currentColor" stroke-width="3"/>
  <rect x="250" y="62" width="80" height="20" fill="none" stroke="currentColor" stroke-width="3"/>
  <text x="290" y="50" fill="currentColor" text-anchor="middle" font-size="14">220 Ω</text>
  <line x1="330" y1="72" x2="390" y2="72" stroke="currentColor" stroke-width="3"/>
  <polygon points="390,56 390,88 420,72" fill="none" stroke="currentColor" stroke-width="3"/>
  <line x1="422" y1="56" x2="422" y2="88" stroke="currentColor" stroke-width="3"/>
  <text x="405" y="46" fill="currentColor" text-anchor="middle" font-size="14">LED</text>
  <text x="438" y="104" fill="currentColor" font-size="12">ánodo (+) ← pata larga</text>
  <line x1="422" y1="72" x2="520" y2="72" stroke="currentColor" stroke-width="3"/>
  <line x1="520" y1="72" x2="520" y2="172" stroke="currentColor" stroke-width="3"/>
  <line x1="190" y1="172" x2="520" y2="172" stroke="currentColor" stroke-width="3"/>
  <text x="530" y="130" fill="currentColor" font-size="12">cátodo (−)</text>
</svg>`;

const SVG_PULSADOR = `<svg viewBox="0 0 640 230" role="img" aria-label="Esquema: pulsador conectado al pin 2 con INPUT_PULLUP y a GND">
  <rect x="20" y="40" width="170" height="150" rx="12" fill="#1d6f8c"/>
  <text x="105" y="120" fill="#fff" text-anchor="middle" font-size="17" font-weight="700">Arduino UNO</text>
  <text x="180" y="75" fill="currentColor" font-size="14" text-anchor="end" dx="-2">D2</text>
  <text x="105" y="175" fill="#fff" text-anchor="middle" font-size="13">GND</text>
  <line x1="190" y1="72" x2="330" y2="72" stroke="currentColor" stroke-width="3"/>
  <circle cx="340" cy="72" r="4" fill="currentColor"/>
  <line x1="340" y1="72" x2="400" y2="40" stroke="currentColor" stroke-width="3"/>
  <circle cx="410" cy="72" r="4" fill="currentColor"/>
  <line x1="410" y1="72" x2="460" y2="72" stroke="currentColor" stroke-width="3"/>
  <text x="400" y="30" fill="currentColor" font-size="13" text-anchor="middle">pulsador</text>
  <line x1="460" y1="72" x2="460" y2="172" stroke="currentColor" stroke-width="3"/>
  <line x1="190" y1="172" x2="460" y2="172" stroke="currentColor" stroke-width="3"/>
  <text x="470" y="125" fill="currentColor" font-size="12">Sin pulsar: entrada en HIGH</text>
  <text x="470" y="142" fill="currentColor" font-size="12">(resistencia interna activa)</text>
  <text x="470" y="160" fill="currentColor" font-size="12">Pulsado: entrada en LOW</text>
</svg>`;

const SVG_ESP32_PINES = `<svg viewBox="0 0 640 260" role="img" aria-label="Resumen de tensiones: ESP32 trabaja a 3,3 V y Arduino UNO a 5 V">
  <rect x="20" y="30" width="280" height="200" rx="14" fill="#2c3e50"/>
  <text x="160" y="70" fill="#fff" text-anchor="middle" font-size="18" font-weight="700">ESP32 (DevKit)</text>
  <text x="160" y="105" fill="#cfe9f2" text-anchor="middle" font-size="14">Lógica: 3,3 V</text>
  <text x="160" y="130" fill="#cfe9f2" text-anchor="middle" font-size="14">GPIO NO tolerantes a 5 V</text>
  <text x="160" y="155" fill="#cfe9f2" text-anchor="middle" font-size="14">ADC: 0–4095 (≈0–3,3 V)</text>
  <rect x="340" y="30" width="280" height="200" rx="14" fill="#1d6f8c"/>
  <text x="480" y="70" fill="#fff" text-anchor="middle" font-size="18" font-weight="700">Arduino UNO</text>
  <text x="480" y="105" fill="#d8f0f8" text-anchor="middle" font-size="14">Lógica: 5 V</text>
  <text x="480" y="130" fill="#d8f0f8" text-anchor="middle" font-size="14">Pines digitales: 5 V</text>
  <text x="480" y="155" fill="#d8f0f8" text-anchor="middle" font-size="14">ADC: 0–1023 (0–5 V)</text>
  <text x="320" y="250" fill="currentColor" text-anchor="middle" font-size="13">Un sensor de 5 V conectado directo a un GPIO del ESP32 puede dañarlo.</text>
</svg>`;

const SVG_DIVISOR = `<svg viewBox="0 0 640 230" role="img" aria-label="Divisor de tensión con LDR o potenciómetro hacia pin analógico">
  <text x="60" y="36" fill="currentColor" font-size="14" font-weight="700">5 V</text>
  <line x1="90" y1="40" x2="90" y2="70" stroke="currentColor" stroke-width="3"/>
  <rect x="70" y="70" width="40" height="70" fill="none" stroke="currentColor" stroke-width="3"/>
  <text x="130" y="110" fill="currentColor" font-size="14">LDR (sensor de luz)</text>
  <line x1="90" y1="140" x2="90" y2="165" stroke="currentColor" stroke-width="3"/>
  <line x1="90" y1="110" x2="260" y2="110" stroke="currentColor" stroke-width="3"/>
  <circle cx="200" cy="110" r="4" fill="currentColor"/>
  <text x="200" y="98" fill="currentColor" font-size="13" text-anchor="middle">A0</text>
  <rect x="260" y="95" width="30" height="0" />
  <rect x="260" y="95" width="0" height="0" />
  <rect x="330" y="80" width="40" height="70" fill="none" stroke="currentColor" stroke-width="3"/>
  <text x="380" y="125" fill="currentColor" font-size="13">resistencia fija 10 kΩ</text>
  <line x1="350" y1="150" x2="350" y2="170" stroke="currentColor" stroke-width="3"/>
  <line x1="90" y1="170" x2="350" y2="170" stroke="currentColor" stroke-width="3"/>
  <text x="90" y="200" fill="currentColor" font-size="14" font-weight="700">GND</text>
  <line x1="200" y1="110" x2="200" y2="110" />
  <line x1="260" y1="110" x2="330" y2="110" stroke="currentColor" stroke-width="3"/>
</svg>`;

/* ---------- Módulos ---------- */

const MODULOS = [
  { id: 'm1', titulo: 'Módulo 1 · Electrónica e IoT', descripcion: 'Qué es el Internet de las Cosas y las ideas eléctricas básicas.' },
  { id: 'm2', titulo: 'Módulo 2 · Arduino desde cero', descripcion: 'Placa, entorno de programación, entradas y salidas.' },
  { id: 'm3', titulo: 'Módulo 3 · ESP32 desde cero', descripcion: 'Diferencias con Arduino, niveles de 3,3 V, pines y Wi-Fi.' },
  { id: 'm4', titulo: 'Módulo 4 · Sensores y actuadores', descripcion: 'Fichas prácticas de sensores y de un actuador.' },
  { id: 'm5', titulo: 'Módulo 5 · Conexiones y montaje', descripcion: 'Cómo montar un circuito paso a paso.' },
  { id: 'm6', titulo: 'Módulo 6 · Depurar y programar mejor', descripcion: 'Monitor serie y temporizadores sin bloqueo.' },
  { id: 'm7', titulo: 'Módulo 7 · IoT: de la lectura a la nube', descripcion: 'Cómo viajan los datos desde el sensor hasta el usuario.' },
  { id: 'm8', titulo: 'Módulo 8 · Simulación con Tinkercad', descripcion: 'Simular antes de tocar el hardware: qué sí y qué no.' }
];

/* ---------- Lecciones ---------- */

const LECCIONES = [
  /* ===== MÓDULO 1 ===== */
  {
    id: 'm1-que-es-iot', modulo: 'm1', titulo: 'Qué es el Internet de las Cosas (IoT)', nivel: 'Principiante', minutos: 12,
    resumen: 'Dispositivos cotidianos que miden, deciden y se conectan a una red.',
    cuerpo: `
<h2>La idea</h2>
<p>El <strong>Internet de las Cosas</strong> (IoT, por sus siglas en inglés) es el conjunto de objetos físicos —una pulsera, un termómetro, una maceta, una cerradura— que tienen <em>sensores</em>, un pequeño <em>cerebro</em> electrónico y una forma de <em>comunicarse</em> con una red.</p>
<p>Un dispositivo IoT suele seguir siempre el mismo recorrido:</p>
<ol>
  <li><strong>Percibe</strong> el mundo con un sensor (temperatura, luz, distancia…).</li>
  <li><strong>Procesa</strong> la lectura con un controlador (Arduino, ESP32…).</li>
  <li><strong>Actúa</strong> si hace falta, encendiendo un LED, moviendo un servo o activando un relé.</li>
  <li><strong>Comunica</strong> el dato a otro equipo o a internet, por Wi-Fi, Bluetooth u otro medio.</li>
</ol>
<h2>Piezas de un sistema</h2>
${tabla(['Pieza', 'Qué hace', 'Ejemplo'], [
  ['Sensor', 'Convierte una magnitud física en una señal eléctrica', 'Sensor de temperatura DHT11'],
  ['Actuador', 'Convierte una señal eléctrica en una acción física', 'LED, motor, servomotor, relé'],
  ['Controlador', 'Ejecuta el programa que decide qué hacer', 'Arduino UNO, ESP32'],
  ['Comunicación', 'Lleva los datos a otro lugar', 'Wi-Fi, Bluetooth, MQTT, HTTP']
])}
${caja('consejo', 'Idea clave', '<p>Sensor = <em>oídos y ojos</em>. Controlador = <em>cerebro</em>. Actuador = <em>manos</em>. Comunicación = <em>voz</em>.</p>')}
<h2>Un ejemplo cotidiano</h2>
<p>Una maceta con sensor de humedad del suelo: el sensor mide, el controlador compara con un umbral, una bomba (actuador) riega si la tierra está seca, y el sistema envía un aviso al celular. Así funciona IoT: <strong>medir → decidir → actuar → informar</strong>.</p>
<h2>Fuentes</h2>
<p class="pista">Tomo 3 «IA Educativa» (introducción a robótica con Arduino) y Mundo Arduino 1 «Arduino desde cero» (conceptos generales). Ver docs/INVENTARIO.md.</p>`,
    quiz: [
      { pregunta: '¿Qué pieza del sistema IoT “percibe” el mundo?', opciones: ['El actuador', 'El sensor', 'La comunicación', 'La fuente de alimentación'], correcta: 1, explicacion: 'El sensor convierte una magnitud física (luz, temperatura, distancia) en una señal eléctrica.', pista: 'Piensa en los “ojos” y “oídos” del sistema.' },
      { pregunta: 'Un servomotor que gira una compuerta es un…', opciones: ['Sensor', 'Controlador', 'Actuador', 'Protocolo'], correcta: 2, explicacion: 'Un actuador produce una acción física a partir de una señal eléctrica.', pista: 'Lo que “hace” algo en el mundo real.' }
    ],
    fuentes: ['Tomo 3 · IA Educativa — Robótica + IA con Arduino', 'Mundo Arduino 1 · Arduino desde cero']
  },
  {
    id: 'm1-electricidad', modulo: 'm1', titulo: 'Electricidad básica: voltaje, corriente, resistencia y GND', nivel: 'Principiante', minutos: 15,
    resumen: 'Las cuatro magnitudes que necesitas para no quemar nada.',
    cuerpo: `
<h2>Cuatro magnitudes</h2>
${tabla(['Magnitud', 'Símbolo', 'Unidad', 'Imagen mental'], [
  ['Voltaje (tensión)', 'V', 'voltio (V)', 'La “presión” que empuja a los electrones'],
  ['Corriente', 'I', 'amperio (A) — en electrónica suele ser mA', 'La cantidad de electrones que circulan por segundo'],
  ['Resistencia', 'R', 'ohmio (Ω)', 'Una “estrechez” en el tubo que limita la corriente'],
  ['Potencia', 'P', 'vatio (W)', 'La energía que se convierte en calor o trabajo por segundo']
])}
<h2>Ley de Ohm</h2>
<p>La relación entre las tres primeras es <strong>V = I × R</strong>. Despejando: <strong>I = V / R</strong>. Ejemplo: un LED rojo con 5 V y una resistencia de 220 Ω deja pasar aproximadamente (5 − 2) / 220 ≈ <strong>14 mA</strong> si el LED cae 2 V.</p>
<h2>GND: el punto de referencia</h2>
<p>Todo voltaje se mide <em>respecto a algo</em>. Ese “algo” es <strong>GND</strong> (tierra o masa), definido como 0 V. <strong>Todos los componentes de un circuito deben compartir el mismo GND</strong>; si no, las señales no tienen referencia común y el circuito se comporta de forma errática.</p>
<h2>Digital y analógico</h2>
<ul>
  <li><strong>Digital:</strong> solo dos estados (HIGH / LOW, 1 / 0). Ej.: un pulsador.</li>
  <li><strong>Analógico:</strong> cualquier valor entre dos extremos. Ej.: un potenciómetro, una LDR.</li>
</ul>
<h2>Entradas y salidas</h2>
<p>Una <strong>entrada</strong> recibe información (un pulsador, un sensor). Una <strong>salida</strong> la entrega (un LED, un motor). En un pin de Arduino se configura cuál es con <code>pinMode()</code>.</p>
<h2>Un LED necesita resistencia</h2>
<p>El LED es un diodo: deja pasar la corriente solo en un sentido y, sin resistencia, consume demasiado y se quema. Por eso siempre va en serie con una resistencia (por ejemplo, de 220 Ω o 330 Ω).</p>
${figura(SVG_LED_UNO, 'Esquema de un LED con resistencia de 220 Ω en el pin D13 y GND común. La pata larga (ánodo) va hacia la resistencia.')}
${caja('advertencia', 'Cuidado con el sentido', '<p>Un LED invertido no enciende (y no siempre se daña). Si no enciende, lo primero es revisar la polaridad: pata larga (+) hacia el pin, pata corta (−) hacia GND.</p>')}
<h2>Fuentes</h2>
<p class="pista">Mundo Arduino 1 «Arduino desde cero» (conceptos eléctricos) y Gran Enciclopedia de Componentes (LED, resistencias). Las fórmulas son estándar.</p>`,
    quiz: [
      { pregunta: 'Con V = 9 V y R = 3 000 Ω, ¿cuál es la corriente aproximada?', opciones: ['27 mA', '3 mA', '0,33 mA', '9 mA'], correcta: 1, explicacion: 'I = V / R = 9 / 3000 = 0,003 A = 3 mA.', pista: 'Usa I = V / R y convierte a mA.' },
      { pregunta: '¿Por qué un LED lleva una resistencia en serie?', opciones: ['Para que brille más', 'Para limitar la corriente y protegerlo', 'Para convertir a digital', 'Para medir la temperatura'], correcta: 1, explicacion: 'Sin resistencia, la corriente puede superar lo que el LED soporta y quemarlo.', pista: 'Piensa en la “estrechez” del tubo.' }
    ],
    fuentes: ['Mundo Arduino 1 · Arduino desde cero', 'Gran Enciclopedia Ilustrada de los Componentes']
  },
  {
    id: 'm1-seguridad', modulo: 'm1', titulo: 'Seguridad al trabajar con electrónica', nivel: 'Principiante', minutos: 8,
    resumen: 'Reglas simples para no dañar placas, componentes ni personas.',
    cuerpo: `
<h2>Antes de conectar</h2>
<ul>
  <li><strong>Desconecta la placa</strong> del USB al cambiar cables.</li>
  <li><strong>Revisa el voltaje</strong> de cada componente en su hoja de datos o en la ficha de esta plataforma.</li>
  <li><strong>Verifica GND</strong> común antes de alimentar.</li>
  <li><strong>No cortes la alimentación</strong> de un motor con los dedos ni conectes motores directamente a un pin de la placa.</li>
</ul>
${caja('peligro', 'Nunca conectes…', '<p>Un motor, una bomba o una lámpara de red (110/220 V) directamente a un pin de Arduino o ESP32. Necesitan un controlador (transistor, driver o relé) y, si es red eléctrica, un adulto calificado.</p>')}
<h2>Cortocircuitos</h2>
<p>Un cortocircuito une 5 V (o 3,3 V) con GND <em>sin resistencia</em>. La placa puede reiniciarse, calentarse o dañarse. Señales: cables calientes, olor a quemado, la placa se apaga sola.</p>
<h2>Buenas prácticas</h2>
<ul>
  <li>Trabaja sobre una superficie no conductora.</li>
  <li>Empieza con poca tensión y pocos componentes; añade uno a uno.</li>
  <li>Si algo se calienta, desconecta y revisa.</li>
</ul>
<h2>Fuentes</h2>
<p class="pista">Recomendaciones generales de seguridad; no hay un documento específico en el material. Ver docs/INVENTARIO.md.</p>`,
    quiz: [
      { pregunta: '¿Qué debes hacer antes de cambiar cables de un circuito?', opciones: ['Nada, siempre es seguro', 'Desconectar la placa del USB', 'Subir el voltaje', 'Mojar la protoboard'], correcta: 1, explicacion: 'Desconectar evita cortocircuitos mientras cambias las conexiones.', pista: 'Piensa en la energía antes de tocar.' }
    ],
    fuentes: ['Recomendaciones generales de seguridad (no citan un documento del material)']
  },

  /* ===== MÓDULO 2 ===== */
  {
    id: 'm2-que-es-arduino', modulo: 'm2', titulo: 'Qué es Arduino y sus partes principales', nivel: 'Principiante', minutos: 12,
    resumen: 'Conoce la placa UNO: pines digitales, analógicos, alimentación y USB.',
    cuerpo: `
<h2>Qué es Arduino</h2>
<p>Arduino es una <strong>placa de desarrollo</strong> con un microcontrolador: un chip que ejecuta un programa en bucle. Tiene pines para conectar sensores y actuadores, y un puerto USB para programarlo y alimentarlo.</p>
<h2>Arduino UNO: partes principales</h2>
${tabla(['Zona', 'Qué encuentras', 'Para qué sirve'], [
  ['Pines digitales (0–13)', 'Pines numerados a lo largo del borde superior', 'Encender/apagar LED, leer pulsadores. Los marcados con ~ (3, 5, 6, 9, 10, 11) también sacan PWM'],
  ['Pines analógicos (A0–A5)', 'Pines con etiqueta A', 'Leer valores intermedios (potenciómetro, LDR)'],
  ['Alimentación', '5 V, 3.3 V, GND, VIN', 'Alimentar sensores. Revisa siempre el voltaje de cada componente'],
  ['Conector USB', 'Puerto tipo B', 'Programar la placa y alimentarla'],
  ['LED L (pin 13)', 'LED integrado en la placa', 'Primer LED de prueba sin cables'],
  ['Botón RESET', 'Pulsador de la placa', 'Reinicia el programa']
])}
${caja('consejo', 'Dato práctico', '<p>El <strong>Arduino UNO trabaja a 5 V</strong>. Sus pines digitales dan 5 V en HIGH. Esto importa al conectar sensores (ver Módulo 3 sobre ESP32).</p>')}
<h2>Arduino y el material del curso</h2>
<p>En el material de referencia aparecen placas Arduino de tipo UNO y el programa en bloques PictoBlox. En esta plataforma usamos <strong>texto (C++ de Arduino)</strong>, que es el lenguaje que se transfiere a la placa; PictoBlox genera código equivalente a partir de bloques.</p>
<h2>Fuentes</h2>
<p class="pista">Mundo Arduino 1 (portada e índice ilustrado), Tomo 3 · Introducción a Arduino (módulo 3). Las tablas de pines son de la placa UNO estándar.</p>`,
    quiz: [
      { pregunta: '¿Qué pines marcados con “~” permiten salida PWM en un UNO?', opciones: ['Solo A0–A5', 'Los pines 3, 5, 6, 9, 10 y 11', 'Todos los pines', 'Solo GND'], correcta: 1, explicacion: 'En el UNO, PWM funciona en 3, 5, 6, 9, 10 y 11.', pista: 'Busca el símbolo ~ junto a los números digitales.' },
      { pregunta: 'El Arduino UNO trabaja a…', opciones: ['3,3 V', '5 V', '12 V', '1,8 V'], correcta: 1, explicacion: 'El UNO usa lógica de 5 V.', pista: 'Compáralo con el ESP32.' }
    ],
    fuentes: ['Mundo Arduino 1 · Arduino desde cero (portada e índice)', 'Tomo 3 · Introducción a Arduino']
  },
  {
    id: 'm2-primer-programa', modulo: 'm2', titulo: 'Tu primer programa: setup(), loop() y la carga', nivel: 'Principiante', minutos: 18,
    resumen: 'Hacer parpadear un LED y cargarlo en la placa sin errores.',
    cuerpo: `
<h2>Estructura de un programa</h2>
<p>Todo programa de Arduino tiene dos funciones:</p>
<ul>
  <li><code>setup()</code>: se ejecuta <strong>una sola vez</strong> al encender o reiniciar. Aquí configuras los pines.</li>
  <li><code>loop()</code>: se repite <strong>sin fin</strong>. Aquí va la lógica.</li>
</ul>
<h2>Preparar el entorno</h2>
<ol>
  <li>Instala el <strong>Arduino IDE 2</strong> desde la web oficial de Arduino.</li>
  <li>Conecta la placa con un cable USB que transmita datos (no todos los cables sirven: los de solo carga no).</li>
  <li>En <em>Herramientas → Placa</em> elige <em>Arduino UNO</em>.</li>
  <li>En <em>Herramientas → Puerto</em> elige el puerto que aparece al conectar (COM3, COM4… en Windows).</li>
  <li>Pulsa <strong>Verificar</strong> (compilar) y luego <strong>Subir</strong> (cargar).</li>
</ol>
<h2>Programa: parpadeo del LED integrado</h2>
<p>En el UNO, el pin 13 tiene un LED integrado. No necesitas cables para esta prueba.</p>
${cod(`
const int PIN_LED = 13;          // pin donde está el LED

void setup() {
  pinMode(PIN_LED, OUTPUT);      // el pin 13 será una salida
}

void loop() {
  digitalWrite(PIN_LED, HIGH);   // enciende (5 V)
  delay(500);                    // espera 500 ms
  digitalWrite(PIN_LED, LOW);    // apaga (0 V)
  delay(500);
}
`, 'Parpadeo con LED integrado (Arduino UNO)')}
<h3>Qué significa cada línea</h3>
<table><tbody>
<tr><td><code>const int PIN_LED = 13;</code></td><td>Guarda el número de pin en una constante. Si cambias de pin, solo lo cambias aquí.</td></tr>
<tr><td><code>pinMode(PIN_LED, OUTPUT)</code></td><td>Configura el pin como salida.</td></tr>
<tr><td><code>digitalWrite(PIN, HIGH/LOW)</code></td><td>Pone el pin en 5 V (HIGH) o 0 V (LOW).</td></tr>
<tr><td><code>delay(500)</code></td><td>Detiene el programa 500 milisegundos.</td></tr>
</tbody></table>
<p>Valores que puedes modificar: <code>500</code> (velocidad del parpadeo) y <code>13</code> (pin).</p>
${caja('advertencia', 'Errores frecuentes al cargar', '<ul><li><strong>“Puerto no disponible” o no aparece:</strong> cierra otros programas que usen el puerto (monitor serie abierto, otro IDE).</li><li><strong>“avrdude: stk500_recv()”:</strong> casi siempre es placa o puerto equivocados.</li><li><strong>Compila pero no sube:</strong> cable solo de carga o driver CH340 sin instalar en clones.</li></ul>')}
<h2>Fuentes</h2>
<p class="pista">Mundo Arduino 2 «Programación para Arduino» (estructura de programas). Pasos del IDE según el procedimiento habitual del Arduino IDE 2; confírmalos en tu versión.</p>`,
    quiz: [
      { pregunta: '¿Cuántas veces se ejecuta setup()?', opciones: ['En cada ciclo', 'Una vez al encender o reiniciar', 'Cada segundo', 'Nunca'], correcta: 1, explicacion: 'setup() se ejecuta una vez; loop() se repite.', pista: 'Su nombre sugiere “preparar”.' },
      { pregunta: 'Si quieres que el LED parpadee más rápido, ¿qué cambias?', opciones: ['El número 13', 'Los valores de delay()', 'El USB', 'La palabra loop'], correcta: 1, explicacion: 'delay() controla el tiempo entre encendido y apagado.', pista: 'Mira la línea con “ms”.' }
    ],
    fuentes: ['Mundo Arduino 2 · Programación para Arduino', 'Tomo 3 · Introducción a Arduino']
  },
  {
    id: 'm2-entradas-salidas', modulo: 'm2', titulo: 'Entradas digitales: pulsador con INPUT_PULLUP', nivel: 'Básico', minutos: 18,
    resumen: 'Leer un botón y encender un LED cuando se presiona.',
    cuerpo: `
<h2>Por qué un pulsador “flota”</h2>
<p>Un pin de entrada sin conexión fija queda <em>flotando</em>: lee valores aleatorios. Hay que darle un estado de reposo. En Arduino, la forma más simple es activar la <strong>resistencia pull-up interna</strong> con <code>INPUT_PULLUP</code>.</p>
<h2>Cómo queda la lógica</h2>
${tabla(['Estado del pulsador', 'Lectura de digitalRead()'], [
  ['Sin pulsar', 'HIGH'],
  ['Pulsado (cierra a GND)', 'LOW']
])}
${figura(SVG_PULSADOR, 'Pulsador entre el pin D2 y GND. Con INPUT_PULLUP, el pin se mantiene en HIGH hasta que se pulsa.')}
<h2>Montaje</h2>
<ol>
  <li>Coloca el pulsador en la protoboard, cruzando la ranura central.</li>
  <li>Conecta una pata a <strong>D2</strong> y la pata opuesta (en la misma línea de diagonal) a <strong>GND</strong>.</li>
  <li>No necesitas resistencia externa gracias a INPUT_PULLUP.</li>
  <li>Opcional: un LED con resistencia en el pin 13 para ver el resultado.</li>
</ol>
<h2>Código</h2>
${cod(`
const int PIN_BOTON = 2;
const int PIN_LED = 13;

void setup() {
  pinMode(PIN_BOTON, INPUT_PULLUP);   // reposo = HIGH
  pinMode(PIN_LED, OUTPUT);
}

void loop() {
  bool pulsado = (digitalRead(PIN_BOTON) == LOW);
  digitalWrite(PIN_LED, pulsado ? HIGH : LOW);
}
`, 'Pulsador que enciende un LED')}
${caja('consejo', 'Rebotes', '<p>Al pulsar, los contactos mecánicos vibran unas milisegundos y pueden generar varias lecturas. Para este ejemplo simple no molesta. Si cuentas pulsaciones, usa un retardo corto (anti-rebote) o la práctica del Módulo 6.</p>')}
<h2>Fuentes</h2>
<p class="pista">Mundo Arduino 5 «Proyectos avanzados» (pulsadores) y Mundo Arduino 4 «Robótica básica». El circuito con INPUT_PULLUP es práctica habitual de Arduino.</p>`,
    quiz: [
      { pregunta: 'Con INPUT_PULLUP y el pulsador conectado a GND, ¿qué lee digitalRead() cuando está pulsado?', opciones: ['HIGH', 'LOW', '5', 'Un valor aleatorio'], correcta: 1, explicacion: 'El pulsador lleva el pin a GND, así que la lectura es LOW.', pista: 'Recuerda que en reposo el pin está en HIGH.' },
      { pregunta: '¿Para qué sirve INPUT_PULLUP?', opciones: ['Dar más corriente', 'Fijar un estado de reposo en la entrada', 'Medir voltaje', 'Enviar Wi-Fi'], correcta: 1, explicacion: 'Evita lecturas aleatorias cuando el pin no está conectado a una tensión fija.', pista: 'Evita que el pin “flote”.' }
    ],
    fuentes: ['Mundo Arduino 5 · Proyectos avanzados (pulsadores)', 'Mundo Arduino 4 · Robótica básica']
  },
  {
    id: 'm2-analogico-pwm', modulo: 'm2', titulo: 'Entradas analógicas y salidas PWM', nivel: 'Básico', minutos: 18,
    resumen: 'Leer un potenciómetro y controlar el brillo de un LED.',
    cuerpo: `
<h2>Analógico: leer valores intermedios</h2>
<p><code>analogRead(A0)</code> devuelve un número entre <strong>0 y 1023</strong> según el voltaje entre 0 V y 5 V en el pin. Un potenciómetro (resistencia variable de tres patas) entrega un voltaje ajustable.</p>
<h2>PWM: simular voltajes intermedios</h2>
<p>Una salida digital solo tiene 0 V o 5 V. El <strong>PWM</strong> (modulación por ancho de pulso) enciende y apaga el pin muy rápido; cuanto más tiempo está encendido, más brillante se ve el LED. <code>analogWrite(pin, valor)</code> acepta valores de <strong>0 a 255</strong>.</p>
${tabla(['Valor de analogWrite', 'Ciclo de trabajo aproximado', 'Brillo del LED'], [
  ['0', '0 %', 'Apagado'], ['128', '50 %', 'Medio'], ['255', '100 %', 'Máximo']
])}
<h2>Montaje</h2>
<ul>
  <li>Potenciómetro: pata izquierda a 5 V, pata derecha a GND, central a <strong>A0</strong>.</li>
  <li>LED con resistencia de 220 Ω en el pin <strong>9</strong> (PWM).</li>
</ul>
<h2>Código</h2>
${cod(`
const int PIN_POT = A0;     // entrada analógica
const int PIN_LED = 9;      // salida PWM

void setup() {
  pinMode(PIN_LED, OUTPUT);
  Serial.begin(9600);       // para ver valores en el monitor serie
}

void loop() {
  int lectura = analogRead(PIN_POT);             // 0 a 1023
  int brillo = map(lectura, 0, 1023, 0, 255);    // escala a 0 a 255
  analogWrite(PIN_LED, brillo);
  Serial.println(lectura);
  delay(100);
}
`, 'Potenciómetro controla el brillo (Arduino UNO)')}
${caja('advertencia', 'Ojo con el pin', '<p><code>analogWrite</code> solo funciona bien en pines PWM (~). Si usas el pin 8, el brillo no cambiará.</p>')}
<h2>Fuentes</h2>
<p class="pista">Mundo Arduino 3 «Proyectos con sensores» (lectura analógica) y Mundo Arduino 2 (PWM).</p>`,
    quiz: [
      { pregunta: 'analogRead() en un UNO devuelve valores entre…', opciones: ['0 y 255', '0 y 1023', '0 y 4095', '1 y 10'], correcta: 1, explicacion: 'El UNO tiene conversor de 10 bits: 0 a 1023.', pista: '2^10 − 1.' },
      { pregunta: '¿Qué pin es adecuado para analogWrite en un UNO?', opciones: ['Pin 8', 'Pin 9', 'Pin A3', 'GND'], correcta: 1, explicacion: 'El pin 9 tiene PWM (marcado con ~).', pista: 'Busca el símbolo ~.' }
    ],
    fuentes: ['Mundo Arduino 3 · Proyectos con sensores', 'Mundo Arduino 2 · Programación para Arduino']
  },

  /* ===== MÓDULO 3 ===== */
  {
    id: 'm3-esp32', modulo: 'm3', titulo: 'ESP32: qué es y en qué se diferencia de Arduino', nivel: 'Básico', minutos: 15,
    resumen: 'Wi-Fi y Bluetooth integrados, pero con 3,3 V. Lo que debes respetar.',
    cuerpo: `
<h2>Qué es el ESP32</h2>
<p>El ESP32 es un microcontrolador de Espressif con <strong>Wi-Fi y Bluetooth integrados</strong>, doble núcleo y muchos más pines que un UNO. Es la opción habitual cuando un proyecto necesita enviar datos a internet.</p>
<h2>Diferencias clave</h2>
${tabla(['Aspecto', 'Arduino UNO', 'ESP32 (DevKit típico)'], [
  ['Lógica', '5 V', '<strong>3,3 V</strong>'],
  ['Conectividad', 'Ninguna integrada (requiere módulo)', 'Wi-Fi y Bluetooth integrados'],
  ['Conversor analógico', '10 bits (0–1023)', '12 bits (0–4095), no lineal'],
  ['PWM', 'analogWrite, pines ~', 'Cualquier GPIO de salida (LEDC)'],
  ['Pines seguros', 'Mayoría', 'Algunos pines tienen funciones de arranque (ver tabla)']
])}
${figura(SVG_ESP32_PINES, 'Comparación de niveles lógicos: no conectes un sensor de 5 V directamente a un GPIO del ESP32.')}
${caja('peligro', 'Regla de oro del ESP32', '<p><strong>Los GPIO del ESP32 trabajan a 3,3 V y no son tolerantes a 5 V.</strong> Un sensor que entrega 5 V en su salida (como un HC-SR04) debe llevar un divisor de tensión o un adaptador de nivel. Verifica la hoja de datos de cada placa: nunca supongas.</p>')}
<h2>Pines que conviene evitar o usar con cuidado (DevKit típico)</h2>
${tabla(['Pines', 'Advertencia'], [
  ['GPIO 6–11', 'Conectados a la memoria flash interna. <strong>No los uses</strong>.'],
  ['GPIO 34–39', 'Solo entrada (no pueden ser salida). Ideales para ADC.'],
  ['GPIO 0, 2, 12, 15', 'Afectan al arranque. Evita cargas fuertes conectadas en el arranque.'],
  ['ADC2 (GPIO 0, 2, 4, 12–15, 25–27)', 'No se puede leer analógicamente mientras el Wi-Fi está activo. Para analógico con Wi-Fi usa ADC1 (GPIO 32–39)']
])}
<p class="pista">La tabla resume el DevKit de 30 pines habitual. Cada placa puede variar; confirma en el diagrama de pines de tu modelo exacto.</p>
<h2>Fuentes</h2>
<p class="pista">El material del curso menciona el ESP32 solo de forma breve (dos libros de IA). Esta lección se basa en la documentación técnica pública del fabricante, que debes consultar para tu modelo: no está verificada físicamente en esta plataforma.</p>`,
    quiz: [
      { pregunta: 'Un sensor entrega 5 V. ¿Qué haces antes de conectarlo a un GPIO del ESP32?', opciones: ['Conectarlo directo', 'Usar un divisor de tensión o un adaptador de nivel', 'Subir la frecuencia', 'Nada'], correcta: 1, explicacion: 'Los GPIO del ESP32 no toleran 5 V; reduce la tensión antes de conectar.', pista: 'El ESP32 trabaja a 3,3 V.' },
      { pregunta: 'Para leer un sensor analógico mientras el Wi-Fi está activo, conviene usar…', opciones: ['ADC2', 'ADC1 (GPIO 32–39)', 'Cualquier pin', 'El pin 6'], correcta: 1, explicacion: 'ADC2 no funciona con Wi-Fi activo; ADC1 sí.', pista: 'El ADC2 se bloquea con Wi-Fi.' }
    ],
    fuentes: ['Tomo 3 y libros de IA educativa (mención breve del ESP32)', 'Documentación técnica pública de Espressif (verifica tu modelo)']
  },
  {
    id: 'm3-esp32-programa', modulo: 'm3', titulo: 'Primeros programas en ESP32', nivel: 'Básico', minutos: 20,
    resumen: 'Parpadeo, lectura analógica y conexión Wi-Fi con datos de ejemplo.',
    cuerpo: `
<h2>Entorno</h2>
<p>Usa el <strong>Arduino IDE 2</strong> con el paquete de placas <em>esp32 de Espressif</em>. En el gestor de placas instala “esp32”, luego elige tu modelo (por ejemplo, <em>ESP32 Dev Module</em>) y el puerto.</p>
${caja('advertencia', 'Versiones', '<p>El núcleo esp32 cambió su API de PWM entre versiones 2.x y 3.x. Los ejemplos de esta lección usan la API de la versión 3.x (<code>ledcAttach</code>). Si tu versión es anterior, usa <code>ledcSetup</code> + <code>ledcAttachPin</code>.</p>')}
<h2>1. Parpadeo</h2>
<p>En muchos DevKit el LED integrado está en el GPIO 2, pero <strong>no en todos</strong>: confírmalo en tu placa.</p>
${cod(`
const int PIN_LED = 2;   // LED integrado (verifica en tu placa)

void setup() {
  pinMode(PIN_LED, OUTPUT);
}

void loop() {
  digitalWrite(PIN_LED, HIGH);
  delay(500);
  digitalWrite(PIN_LED, LOW);
  delay(500);
}
`, 'Parpadeo en ESP32')}
<h2>2. Lectura analógica</h2>
${cod(`
const int PIN_POT = 34;   // ADC1, solo entrada

void setup() {
  Serial.begin(115200);
}

void loop() {
  int lectura = analogRead(PIN_POT);   // 0 a 4095
  Serial.println(lectura);
  delay(200);
}
`, 'Potenciómetro en GPIO 34 (ADC1)')}
<p>Conecta el potenciómetro a <strong>3,3 V</strong> (no a 5 V) y GND. El centro va al GPIO 34.</p>
<h2>3. PWM con LEDC (brillo de un LED)</h2>
${cod(`
const int PIN_LED = 25;

void setup() {
  ledcAttach(PIN_LED, 5000, 8);   // pin, frecuencia 5 kHz, resolución 8 bits
}

void loop() {
  for (int brillo = 0; brillo <= 255; brillo++) {
    ledcWrite(PIN_LED, brillo);
    delay(5);
  }
  for (int brillo = 255; brillo >= 0; brillo--) {
    ledcWrite(PIN_LED, brillo);
    delay(5);
  }
}
`, 'Degradado con PWM (versión 3.x del núcleo)')}
<h2>4. Conexión Wi-Fi (plantilla sin credenciales)</h2>
<p>Las credenciales reales <strong>no deben publicarse</strong>. Sustituye los valores por los de tu red y no subas el archivo a repositorios públicos.</p>
${cod(`
#include <WiFi.h>

const char* RED_WIFI = "NOMBRE_DE_TU_RED";      // reemplaza localmente
const char* CLAVE_WIFI = "TU_CLAVE_LOCAL";      // no la compartas

void setup() {
  Serial.begin(115200);
  WiFi.begin(RED_WIFI, CLAVE_WIFI);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nConectado. IP: " + WiFi.localIP().toString());
}

void loop() {}
`, 'Conectar a Wi-Fi (ilustrativo: prueba en tu red)')}
${caja('ok', 'Estado de verificación', '<p>Estos fragmentos siguen la documentación habitual del núcleo esp32 pero <strong>no han sido probados en hardware real</strong> por esta plataforma. Compruébalos con tu placa antes de dar por hecho el resultado.</p>')}
<h2>Fuentes</h2>
<p class="pista">Documentación pública del núcleo Arduino-ESP32. Ver también Módulo 7 sobre envío de datos.</p>`,
    quiz: [
      { pregunta: 'En el ESP32, ¿qué resolución máxima de lectura analógica tiene analogRead()?', opciones: ['1023', '4095', '255', '65535'], correcta: 1, explicacion: 'El ADC del ESP32 es de 12 bits: 0 a 4095.', pista: '2^12 − 1.' },
      { pregunta: 'Para no publicar tu contraseña de Wi-Fi, lo correcto es…', opciones: ['Escribirla en el código del repositorio público', 'Mantenerla local y no compartir el archivo', 'Ponerla en el título de la placa', 'Enviarla por el monitor serie'], correcta: 1, explicacion: 'Las credenciales no deben publicarse en código compartido.', pista: 'Piensa en quién puede ver tu repositorio.' }
    ],
    fuentes: ['Documentación pública Arduino-ESP32 (verifica versión)']
  },

  /* ===== MÓDULO 4 ===== */
  {
    id: 'm4-potenciometro-ldr', modulo: 'm4', titulo: 'Sensores analógicos: potenciómetro y LDR (sensor de luz)', nivel: 'Básico', minutos: 15,
    resumen: 'Un divisor de tensión convierte la luz en un número que el microcontrolador lee.',
    cuerpo: `
<h2>Ficha: LDR (fotorresistencia)</h2>
${tabla(['Dato', 'Valor'], [
  ['Qué mide', 'Intensidad de luz'],
  ['Cómo funciona', 'Su resistencia baja cuando hay más luz'],
  ['Alimentación', '5 V (UNO) o 3,3 V (ESP32)'],
  ['Señal', 'Analógica, mediante un divisor con resistencia fija de 10 kΩ'],
  ['Aplicaciones', 'Luz nocturna automática, medidor de luz']
])}
${figura(SVG_DIVISOR, 'Divisor de tensión: la LDR y una resistencia fija de 10 kΩ forman un divisor. Su punto medio va a A0.')}
<h2>Código para un UNO</h2>
${cod(`
const int PIN_LDR = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int luz = analogRead(PIN_LDR);   // 0 a 1023
  Serial.print("Luz (0-1023): ");
  Serial.println(luz);
  delay(500);
}
`, 'Lectura de luz')}
<p>Interpretación: valores altos suelen corresponder a más luz <em>o a menos</em>, según cómo armes el divisor. Mide con la mano tapando la LDR para comprobar el sentido.</p>
<h2>Ficha: potenciómetro</h2>
<p>Es una resistencia con un cursor móvil. Entre sus patas extremas hay 5 V y GND; el cursor central da un voltaje ajustable. Se usa para perillas, volumen o velocidad.</p>
<h2>Fuentes</h2>
<p class="pista">Mundo Arduino 3 «Proyectos con sensores» y Gran Enciclopedia de Componentes (sección electricidad).</p>`,
    quiz: [
      { pregunta: 'La resistencia de una LDR…', opciones: ['Sube con más luz', 'Baja con más luz', 'No cambia', 'Depende del LED'], correcta: 1, explicacion: 'Con más luz, la LDR presenta menos resistencia.', pista: 'Es un sensor de luminosidad.' }
    ],
    fuentes: ['Mundo Arduino 3 · Proyectos con sensores', 'Gran Enciclopedia Ilustrada de los Componentes']
  },
  {
    id: 'm4-dht11', modulo: 'm4', titulo: 'Sensor de temperatura y humedad DHT11', nivel: 'Básico', minutos: 18,
    resumen: 'Leer temperatura y humedad con una sola línea de datos.',
    cuerpo: `
<h2>Ficha: DHT11</h2>
${tabla(['Dato', 'Valor'], [
  ['Qué mide', 'Temperatura (aprox. 0–50 °C) y humedad relativa (20–90 %)'],
  ['Alimentación', '3,3 V a 5 V (confirma en tu módulo)'],
  ['Señal', 'Digital de un solo cable (DATA), con protocolo propio'],
  ['Pines', 'VCC, DATA, GND (en algunos módulos hay un cuarto pin sin uso)'],
  ['Precisión', 'Baja: útil para aprender, no para mediciones de laboratorio'],
  ['Frecuencia de lectura', 'Espera al menos 2 segundos entre lecturas']
])}
<h2>Montaje</h2>
<ul>
  <li>VCC → 5 V (UNO) o 3,3 V (ESP32).</li>
  <li>DATA → pin digital (por ejemplo, <strong>D7</strong> en el UNO).</li>
  <li>GND → GND.</li>
  <li>Muchos módulos ya traen una resistencia de pull-up; si tu módulo es solo el sensor, añade una de 10 kΩ entre DATA y VCC.</li>
</ul>
<h2>Librería</h2>
<p>Instala desde el Gestor de Librerías del IDE la librería <strong>“DHT sensor library” de Adafruit</strong> (y su dependencia “Adafruit Unified Sensor” si la pide). Instalar la librería es paso obligatorio: sin ella el programa no compila.</p>
<h2>Código</h2>
${cod(`
#include <DHT.h>

const int PIN_DHT = 7;
#define TIPO_DHT DHT11

DHT dht(PIN_DHT, TIPO_DHT);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float humedad = dht.readHumidity();
  float temperatura = dht.readTemperature();   // en °C

  if (isnan(humedad) || isnan(temperatura)) {
    Serial.println("Error al leer el DHT11: revisa cableado");
  } else {
    Serial.print("Temperatura: ");
    Serial.print(temperatura);
    Serial.print(" C  Humedad: ");
    Serial.print(humedad);
    Serial.println(" %");
  }
  delay(2000);
}
`, 'Temperatura y humedad (Arduino UNO)')}
${caja('advertencia', 'Si el valor siempre es “error”', '<ul><li>Revisa VCC y GND (y que el sensor esté alimentado).</li><li>Confirma el número de pin de DATA en el código.</li><li>No leas más rápido de cada 2 s.</li></ul>')}
<h2>Fuentes</h2>
<p class="pista">Mundo Arduino 3 «Proyectos con sensores» y convenciones habituales de la librería DHT de Adafruit.</p>`,
    quiz: [
      { pregunta: '¿Cada cuánto conviene leer el DHT11?', opciones: ['Cada 10 ms', 'Al menos cada 2 segundos', 'Una sola vez en la vida', 'Cada 100 ms'], correcta: 1, explicacion: 'El DHT11 es lento: necesita unos 2 s entre lecturas.', pista: 'Es un sensor de respuesta lenta.' }
    ],
    fuentes: ['Mundo Arduino 3 · Proyectos con sensores']
  },
  {
    id: 'm4-hcsr04', modulo: 'm4', titulo: 'Sensor de distancia ultrasónico HC-SR04', nivel: 'Intermedio', minutos: 20,
    resumen: 'Medir distancias con sonido. Atención al nivel de 5 V en el ECHO.',
    cuerpo: `
<h2>Ficha: HC-SR04</h2>
${tabla(['Dato', 'Valor'], [
  ['Qué mide', 'Distancia aproximada entre 2 cm y 4 m'],
  ['Alimentación', '5 V'],
  ['Pines', 'VCC, TRIG (salida), ECHO (entrada), GND'],
  ['Principio', 'Emite un pulso ultrasónico y mide el tiempo del eco']
])}
<p>La distancia se calcula así: <strong>distancia (cm) = tiempo (µs) × 0,0343 / 2</strong>. Se divide entre 2 porque el sonido recorre ida y vuelta.</p>
${caja('peligro', 'ECHO sale a 5 V', '<p>En un Arduino UNO (5 V) puedes conectar ECHO directo. <strong>En un ESP32 no</strong>: reduce ECHO a 3,3 V con un divisor de tensión (por ejemplo, 1 kΩ y 2 kΩ) antes del GPIO.</p>')}
<h2>Montaje para UNO</h2>
<ul><li>VCC → 5 V, GND → GND.</li><li>TRIG → D9, ECHO → D10.</li></ul>
<h2>Código</h2>
${cod(`
const int PIN_TRIG = 9;
const int PIN_ECHO = 10;

void setup() {
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  Serial.begin(9600);
}

float medirCentimetros() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  long duracion = pulseIn(PIN_ECHO, HIGH, 30000);   // espera máx. 30 ms
  if (duracion == 0) return -1;                      // sin eco
  return duracion * 0.0343 / 2.0;
}

void loop() {
  float cm = medirCentimetros();
  if (cm < 0) {
    Serial.println("Sin lectura");
  } else {
    Serial.print("Distancia: ");
    Serial.print(cm);
    Serial.println(" cm");
  }
  delay(200);
}
`, 'Medir distancia (Arduino UNO)')}
<h2>Errores frecuentes</h2>
<ul>
  <li>Siempre “Sin lectura”: revisa TRIG/ECHO cruzados o el sensor sin alimentación.</li>
  <li>Lecturas muy irregulares: superficies blandas o inclinadas absorben el sonido.</li>
</ul>
<h2>Fuentes</h2>
<p class="pista">Mundo Arduino 3 «Proyectos con sensores» (sensor de distancia) y cálculo estándar de tiempo de vuelo del sonido.</p>`,
    quiz: [
      { pregunta: 'Un eco tarda 580 µs. ¿Qué distancia aproximada es?', opciones: ['10 cm', '1 cm', '100 cm', '58 cm'], correcta: 0, explicacion: '580 × 0,0343 / 2 ≈ 9,9 cm ≈ 10 cm.', pista: 'Divide entre 2 por el viaje de ida y vuelta.' },
      { pregunta: 'Por qué no conectar ECHO directo a un GPIO del ESP32?', opciones: ['Porque mide mal', 'Porque ECHO entrega 5 V y el ESP32 trabaja a 3,3 V', 'Porque no tiene Wi-Fi', 'Porque el sensor es analógico'], correcta: 1, explicacion: 'Los GPIO del ESP32 no toleran 5 V; hay que reducir la tensión.', pista: 'Revisa el aviso de la lección.' }
    ],
    fuentes: ['Mundo Arduino 3 · Proyectos con sensores']
  },
  {
    id: 'm4-servo', modulo: 'm4', titulo: 'Actuador: servomotor SG90', nivel: 'Básico', minutos: 15,
    resumen: 'Mover un brazo a un ángulo concreto con una señal PWM.',
    cuerpo: `
<h2>Ficha: SG90</h2>
${tabla(['Dato', 'Valor'], [
  ['Qué hace', 'Gira hasta un ángulo entre 0° y 180°'],
  ['Alimentación', '4,8–6 V (aprox.); confirma en la ficha de tu servo'],
  ['Cables', 'Naranja: señal · Rojo: 5 V · Marrón o negro: GND'],
  ['Control', 'Señal PWM de 50 Hz con ancho de pulso variable']
])}
${caja('advertencia', 'Alimentación separada', '<p>Un servo puede consumir picos de corriente que la placa no debe suministrar. Para varios servos o carga real, alimenta el servo con una fuente de 5 V independiente y <strong>une los GND</strong>.</p>')}
<h2>Montaje (UNO)</h2>
<ul><li>Naranja (señal) → pin <strong>9</strong>.</li><li>Rojo → 5 V.</li><li>Marrón → GND.</li></ul>
<h2>Código</h2>
${cod(`
#include <Servo.h>

Servo miServo;
const int PIN_SERVO = 9;

void setup() {
  miServo.attach(PIN_SERVO);
}

void loop() {
  for (int angulo = 0; angulo <= 180; angulo++) {
    miServo.write(angulo);
    delay(15);
  }
  for (int angulo = 180; angulo >= 0; angulo--) {
    miServo.write(angulo);
    delay(15);
  }
}
`, 'Barrido de 0° a 180° (Arduino UNO)')}
<h2>Fuentes</h2>
<p class="pista">Tomo 3 · Servomotores y calibración (módulos 4 y 5 del libro): el material trata este tema con el mismo montaje básico. El código es original.</p>`,
    quiz: [
      { pregunta: 'Para un servo en el UNO, ¿qué pin de señal es habitual?', opciones: ['A5', '9 (PWM)', 'GND', '13 solamente'], correcta: 1, explicacion: 'El pin 9 es PWM y se usa con la librería Servo.', pista: 'Un pin con ~.' }
    ],
    fuentes: ['Tomo 3 · Servomotores y calibración']
  },

  /* ===== MÓDULO 5 ===== */
  {
    id: 'm5-montaje', modulo: 'm5', titulo: 'Montaje en protoboard paso a paso', nivel: 'Principiante', minutos: 15,
    resumen: 'Cómo leer una protoboard y comprobar un circuito antes de encenderlo.',
    cuerpo: `
<h2>Cómo funciona la protoboard</h2>
<p>En la protoboard, cada fila vertical de cinco agujeros conectados está unida por dentro. Las líneas largas laterales (rieles) suelen usarse para 5 V y GND. Un componente que cruza el canal central queda aislado entre ambos lados.</p>
<h2>Procedimiento</h2>
<ol>
  <li><strong>Sin alimentación:</strong> coloca componentes y cables siguiendo el esquema.</li>
  <li><strong>Une GND primero</strong> (todos los GND al mismo riel).</li>
  <li><strong>Une la alimentación</strong> (5 V o 3,3 V) y verifica con el multímetro que no haya cortos entre 5 V y GND.</li>
  <li><strong>Conecta la placa al USB</strong> y prueba el programa.</li>
  <li>Si algo no funciona, desconecta el USB antes de revisar cables.</li>
</ol>
<h2>Lista de comprobación</h2>
<div class="panel">
  <label><input type="checkbox"> Todos los GND están unidos</label><br>
  <label><input type="checkbox"> Cada LED tiene su resistencia</label><br>
  <label><input type="checkbox"> Pulsador en INPUT_PULLUP con el otro lado a GND</label><br>
  <label><input type="checkbox"> Sensor alimentado con su voltaje correcto</label><br>
  <label><input type="checkbox"> El programa usa los mismos pines que el montaje</label>
</div>
<h2>Fuentes</h2>
<p class="pista">Mundo Arduino 1 «Arduino desde cero» (protoboard y montaje) y Mundo Arduino 2 (uso de resistencias y pulsadores).</p>`,
    quiz: [
      { pregunta: '¿Qué conviene hacer primero al montar un circuito?', opciones: ['Conectar todo al USB', 'Unir los GND', 'Subir el voltaje', 'Tapar los LED'], correcta: 1, explicacion: 'Unir GND primero asegura una referencia común antes de energizar.', pista: 'Es la referencia de todo.' }
    ],
    fuentes: ['Mundo Arduino 1 · Arduino desde cero', 'Mundo Arduino 2 · Programación para Arduino']
  },

  /* ===== MÓDULO 6 ===== */
  {
    id: 'm6-depurar', modulo: 'm6', titulo: 'Depurar con Serial y temporizadores sin bloqueo', nivel: 'Intermedio', minutos: 18,
    resumen: 'Ver lo que pasa dentro del programa y evitar que delay() detenga todo.',
    cuerpo: `
<h2>Monitor serie</h2>
<p><code>Serial.println()</code> envía texto a la computadora. En el IDE, <em>Monitor serie</em> (la lupa) lo muestra. La velocidad debe coincidir con <code>Serial.begin()</code> (9600 o 115200 en nuestros ejemplos).</p>
<h2>El problema de delay()</h2>
<p><code>delay()</code> detiene el programa: mientras espera, el microcontrolador no puede leer un botón ni un sensor. Para tareas en paralelo usa <code>millis()</code>, que devuelve el tiempo desde el encendido.</p>
${cod(`
const int PIN_LED = 13;
unsigned long ultimoCambio = 0;
const unsigned long INTERVALO = 500;   // ms
bool encendido = false;

void setup() {
  pinMode(PIN_LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  unsigned long ahora = millis();
  if (ahora - ultimoCambio >= INTERVALO) {
    ultimoCambio = ahora;
    encendido = !encendido;
    digitalWrite(PIN_LED, encendido ? HIGH : LOW);
    Serial.println(encendido ? "LED on" : "LED off");
  }
  // Aquí el programa sigue libre para leer otros sensores
}
`, 'Parpadeo sin delay() (Arduino UNO)')}
${caja('consejo', 'Usa el monitor', '<p>Imprime valores clave (lecturas, estados) para entender el programa. Quita los mensajes de depuración cuando termines.</p>')}
<h2>Fuentes</h2>
<p class="pista">Ejemplo original. El uso de millis() no aparece en los libros del material revisados por OCR; sigue la documentación oficial de Arduino.</p>`,
    quiz: [
      { pregunta: '¿Qué ventaja tiene millis() frente a delay()?', opciones: ['Es más lento', 'El programa sigue pudiendo leer sensores mientras espera', 'Usa menos pines', 'Requiere Wi-Fi'], correcta: 1, explicacion: 'millis() permite temporizar sin detener el resto del programa.', pista: 'Piensa en “sin bloquear”.' }
    ],
    fuentes: ['Ejemplo original (documentación oficial de Arduino)']
  },

  /* ===== MÓDULO 7 ===== */
  {
    id: 'm7-datos-iot', modulo: 'm7', titulo: 'De la lectura a la nube: HTTP, MQTT y seguridad', nivel: 'Intermedio', minutos: 20,
    resumen: 'Cómo viajan los datos del sensor hasta el usuario y qué proteger.',
    cuerpo: `
<h2>Recorrido de los datos</h2>
<p>Sensor → controlador (lectura y formato) → red Wi-Fi → servicio (servidor o broker) → panel, gráfica o alerta en el celular. Cada salto puede fallar; por eso se registran mensajes de estado.</p>
<h2>HTTP: pedir y responder</h2>
<p>El ESP32 hace una petición (<code>GET</code> o <code>POST</code>) a una dirección. Es sencillo y muy usado, pero cada envío abre una conexión nueva: poco eficiente para muchos sensores enviando datos cada segundo.</p>
<h2>MQTT: publicar y suscribirse</h2>
<p>MQTT funciona con un <strong>broker</strong>: los dispositivos <em>publican</em> mensajes en un tema (por ejemplo, <code>casa/salon/temperatura</code>) y otros equipos se <em>suscriben</em> a ese tema. Es ligero y pensado para dispositivos pequeños.</p>
${tabla(['', 'HTTP', 'MQTT'], [
  ['Modelo', 'Petición y respuesta', 'Publicación y suscripción'],
  ['Conexión', 'Se abre en cada envío', 'Conexión persistente'],
  ['Ideal para', 'Enviar datos esporádicos, APIs web', 'Muchas lecturas frecuentes, alertas en tiempo real']
])}
<h2>Seguridad básica</h2>
<ul>
  <li><strong>Nunca</strong> guardes contraseñas, tokens o claves en el código que compartes.</li>
  <li>Usa variables locales o un archivo de configuración que no subas a repositorios públicos.</li>
  <li>Cambia las credenciales por defecto de cualquier servicio o broker.</li>
  <li>Cifra la conexión (HTTPS / MQTT sobre TLS) cuando el servicio lo permita.</li>
</ul>
${cod(`
// Fragmento ilustrativo (no ejecutable tal cual): publicar una lectura por HTTP
// Sustituye la dirección por tu servicio. No incluyas claves en el código compartido.
String url = "https://TU_SERVIDOR/api/lectura";   // ejemplo
String cuerpo = "{\\"temperatura\\": 24.5}";
// http.POST(cuerpo) con la librería HTTPClient del ESP32
`, 'Ilustrativo: envío de una lectura')}
${caja('advertencia', 'Limitaciones', '<p>Los servicios gratuitos de datos e IoT tienen límites de mensajes, de tiempo de vida de cuentas y condiciones que cambian. Verifica el plan vigente antes de depender de uno.</p>')}
<h2>Fuentes</h2>
<p class="pista">Tomo 3 y libros de IA Educativa (mención breve de IoT y MQTT). Conceptos de protocolos según especificaciones públicas de MQTT y HTTP.</p>`,
    quiz: [
      { pregunta: 'En MQTT, un equipo que quiere recibir las temperaturas debe…', opciones: ['Publicar en el mismo tema', 'Suscribirse al tema', 'Cambiar el voltaje', 'Usar HTTP obligatoriamente'], correcta: 1, explicacion: 'Se suscribe al tema y el broker le reenvía los mensajes.', pista: 'Recibir = suscribirse.' }
    ],
    fuentes: ['Tomo 3 · IA Educativa (mención de IoT y MQTT)', 'Especificaciones públicas de MQTT y HTTP']
  },

  /* ===== MÓDULO 8 ===== */
  {
    id: 'm8-tinkercad', modulo: 'm8', titulo: 'Simulación con Tinkercad: qué sí y qué no', nivel: 'Principiante', minutos: 15,
    resumen: 'Pasos generales para simular un circuito y límites de la simulación.',
    cuerpo: `
${caja('advertencia', 'Verificación pendiente', '<p>En esta versión <strong>no pudimos confirmar en la plataforma Tinkercad</strong> qué placas y componentes están disponibles. Según fuentes secundarias consultadas, Tinkercad Circuits incluye Arduino UNO y componentes básicos, pero <strong>no ESP32</strong>. Confírmalo tú en la web antes de seguir esta guía.</p>')}
<h2>Qué es Tinkercad</h2>
<p>Tinkercad (Autodesk) es un entorno web gratuito que permite armar circuitos virtuales, conectar cables en una protoboard virtual y simular su comportamiento. Enlace oficial: <a href="https://www.tinkercad.com/" target="_blank" rel="noopener">tinkercad.com</a>.</p>
<h2>Pasos generales</h2>
<ol>
  <li>Entra con tu cuenta y crea un <em>nuevo circuito</em> desde la sección de circuitos.</li>
  <li>Busca en el panel de componentes (buscador) el LED, la resistencia, el pulsador o la placa.</li>
  <li>Arrastra los componentes a la protoboard.</li>
  <li>Conecta los cables uniendo los extremos a los pines.</li>
  <li>Abre el editor de código, escribe o pega el programa y pulsa <strong>Iniciar simulación</strong>.</li>
  <li>Observa el LED, el monitor serie o los valores, y ajusta.</li>
  <li><strong>Detén</strong> la simulación antes de cambiar componentes.</li>
</ol>
<h2>Ejercicio guiado: LED intermitente</h2>
<p>Monta un Arduino UNO, un LED con resistencia de 220 Ω en el pin 13 y GND. Carga el parpadeo de la lección <a href="#/leccion/m2-primer-programa">Tu primer programa</a>. Comprueba que el LED se enciende y apaga cada medio segundo.</p>
<h2>Simular no es probar</h2>
<p>La simulación no reproduce todos los efectos reales: tolerancias de componentes, rebotes de pulsadores, ruido de sensores, cables largos, alimentación débil o librerías de terceros. <strong>Un circuito que funciona en la simulación debe probarse también en hardware real</strong>.</p>
<h2>Si necesitas ESP32</h2>
<p>Si Tinkercad no admite tu modelo, puedes usar un simulador que sí lo incluya (las fuentes consultadas mencionan Wokwi). Verifica su disponibilidad en su web oficial antes de usarlo en clase.</p>
<h2>Fuentes</h2>
<p class="pista">Guía original. Búsquedas en fuentes secundarias (no oficiales) sobre compatibilidad; pendiente de verificación en tinkercad.com.</p>`,
    quiz: [
      { pregunta: '¿Qué afirma correctamente esta lección sobre simular?', opciones: ['Que la simulación garantiza el funcionamiento real', 'Que simular no reemplaza probar en hardware real', 'Que Tinkercad soporta todos los ESP32', 'Que no hace falta verificar la placa'], correcta: 1, explicacion: 'La simulación es una aproximación; el hardware real puede comportarse distinto.', pista: 'Piensa en tolerancias y ruido.' }
    ],
    fuentes: ['Tinkercad oficial (verificación pendiente)']
  }
];

/* ---------- Proyectos (Módulo 9) ---------- */

const PROYECTOS = [
  {
    id: 'semaforo', nivel: 1, dificultad: 'Principiante', tiempo: 'unos 30 min',
    titulo: 'Semáforo con tres LED', problema: 'Enseña a controlar varias salidas en secuencia, como en la vía pública.',
    objetivo: 'Usar varios pines de salida y una función auxiliar.',
    placa: 'Arduino UNO', componentes: ['3 LED (rojo, amarillo, verde)', '3 resistencias de 220 Ω', 'Protoboard y cables'],
    conexiones: [['LED rojo', 'Ánodo (+) → resistencia → pin 8'], ['LED amarillo', 'Ánodo (+) → resistencia → pin 9'], ['LED verde', 'Ánodo (+) → resistencia → pin 10'], ['Todos los cátodos (−)', 'GND']],
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
    pruebas: ['Verde 4 s, amarillo 1,5 s, rojo 4 s, sin solapamientos.', 'Ningún LED queda encendido a la vez.'],
    problemas: ['Un LED no enciende → revisa su polaridad.', 'Dos LED encendidos → revisa que cada pin tenga su propio LED.'],
    mejoras: ['Añadir un pulsador de peatón (lección de pulsadores).', 'Cambiar los tiempos desde constantes al inicio.'],
    fuentes: 'Lección de entradas y salidas; diseño original.'
  },
  {
    id: 'termometro', nivel: 2, dificultad: 'Básico-intermedio', tiempo: 'unos 45 min',
    titulo: 'Termómetro con DHT11 y alerta', problema: 'Vigilar la temperatura de un salón y avisar si se calienta demasiado.',
    objetivo: 'Leer un sensor digital, usar condiciones y mostrar datos en el monitor serie.',
    placa: 'Arduino UNO', componentes: ['Sensor DHT11', 'LED con resistencia de 220 Ω', 'Protoboard y cables'],
    conexiones: [['DHT11 VCC', '5 V'], ['DHT11 DATA', 'D7'], ['DHT11 GND', 'GND'], ['LED (alerta)', 'pin 13 con resistencia (cátodo a GND)']],
    codigo: `#include <DHT.h>

const int PIN_DHT = 7;
const int PIN_ALERTA = 13;
const float LIMITE_C = 28.0;   // umbral de alerta (ajústalo)

DHT dht(PIN_DHT, DHT11);

void setup() {
  pinMode(PIN_ALERTA, OUTPUT);
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float t = dht.readTemperature();
  if (isnan(t)) {
    Serial.println("Error de lectura");
    delay(2000);
    return;
  }
  Serial.print("Temperatura: ");
  Serial.println(t);
  digitalWrite(PIN_ALERTA, t > LIMITE_C ? HIGH : LOW);
  delay(2000);
}`,
    pruebas: ['Con el sensor a temperatura ambiente, el LED está apagado.', 'Al calentar suavemente el sensor (sin tocar la parte metálica con fuego), la temperatura sube y el LED se enciende al superar el límite.'],
    problemas: ['Siempre error → revisa VCC, GND y el pin de DATA.', 'Lecturas poco precisas → es normal en el DHT11; no es un instrumento de laboratorio.'],
    mejoras: ['Añadir un buzzer para la alerta.', 'Mostrar la humedad también y ajustar el umbral con un potenciómetro.'],
    fuentes: 'Lección DHT11; diseño original.'
  },
  {
    id: 'distancia', nivel: 2, dificultad: 'Intermedio', tiempo: 'unos 45 min',
    titulo: 'Alarma de proximidad con HC-SR04', problema: 'Detectar si algo se acerca demasiado (puerta, estante, cajón).',
    objetivo: 'Combinar un sensor de distancia con una salida de alerta.',
    placa: 'Arduino UNO', componentes: ['HC-SR04', 'LED con resistencia de 220 Ω', 'Protoboard y cables'],
    conexiones: [['HC-SR04 VCC / GND', '5 V / GND'], ['TRIG', 'D9'], ['ECHO', 'D10'], ['LED de alerta', 'pin 13 con resistencia']],
    codigo: `const int PIN_TRIG = 9;
const int PIN_ECHO = 10;
const int PIN_ALERTA = 13;
const float DISTANCIA_ALERTA_CM = 20.0;

float medirCentimetros() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  long duracion = pulseIn(PIN_ECHO, HIGH, 30000);
  if (duracion == 0) return -1;
  return duracion * 0.0343 / 2.0;
}

void setup() {
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_ALERTA, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  float cm = medirCentimetros();
  bool cerca = (cm > 0 && cm < DISTANCIA_ALERTA_CM);
  digitalWrite(PIN_ALERTA, cerca ? HIGH : LOW);
  Serial.println(cm);
  delay(200);
}`,
    pruebas: ['Sin objeto cerca, el LED está apagado.', 'Al acercar la mano por debajo de 20 cm, el LED se enciende.'],
    problemas: ['Siempre apagado → revisa ECHO y TRIG cruzados.', 'Respuesta irregular → superficies blandas absorben el sonido.'],
    mejoras: ['Usar un servo como “barrera” que gira al detectar.', 'Pasar a ESP32 y añadir divisor de tensión en ECHO (Módulo 3).'],
    fuentes: 'Lección HC-SR04; diseño original.'
  },
  {
    id: 'estacion-iot', nivel: 4, dificultad: 'Integrador IoT', tiempo: 'varias sesiones',
    titulo: 'Estación ambiental con ESP32 (diseño)', problema: 'Registrar temperatura y humedad de forma remota.',
    objetivo: 'Integrar lectura de sensor, Wi-Fi y envío de datos. Proyecto de diseño: no está probado en hardware en esta plataforma.',
    placa: 'ESP32 DevKit', componentes: ['ESP32 DevKit', 'Sensor DHT11 (confirma compatibilidad con 3,3 V)', 'Cables, protoboard y fuente USB'],
    conexiones: [['DHT11 VCC', '3,3 V'], ['DHT11 DATA', 'GPIO 4 (con pull-up si el módulo no lo trae)'], ['DHT11 GND', 'GND']],
    codigo: null,
    pruebas: ['El monitor serie muestra temperatura y humedad cada 2 s.', 'Tras conectar Wi-Fi, la IP aparece en el monitor serie.'],
    problemas: ['No conecta Wi-Fi → revisa nombre y clave locales (no publiques la clave).', 'Error en el sensor → confirma el pin y la alimentación de 3,3 V.'],
    mejoras: ['Enviar lecturas por HTTP a un servicio de tu elección (revisa límites del plan gratuito).', 'Mostrar datos en un panel (Módulo 7).'],
    fuentes: 'Módulos 3, 4 y 7; diseño original.'
  }
];

/* ---------- Diagnóstico (Módulo 10) ---------- */

const DIAGNOSTICO = [
  { problema: 'La placa no aparece en el puerto', causas: 'Cable solo de carga, puerto equivocado, driver CH340/CP2102 sin instalar.', comprobaciones: 'Prueba otro cable de datos y otro puerto USB. Mira el Administrador de dispositivos (Puertos COM).', solucion: 'Instala el driver del fabricante del clon y reinicia el IDE.' },
  { problema: 'El programa no compila', causas: 'Falta una librería, error de sintaxis, punto y coma olvidado.', comprobaciones: 'Lee el primer error en la consola del IDE; suele señalar la línea.', solucion: 'Instala la librería desde el Gestor de Librerías o corrige la sintaxis.' },
  { problema: 'No se puede cargar el código', causas: 'Placa o puerto equivocados, monitor serie abierto, cable defectuoso.', comprobaciones: 'Cierra el monitor serie; revisa Herramientas → Placa y Puerto.', solucion: 'Desconecta, vuelve a conectar y sube de nuevo.' },
  { problema: 'El LED no enciende', causas: 'Polaridad invertida, resistencia faltante, pin incorrecto, GND no conectado.', comprobaciones: 'Pata larga (+) hacia el pin. Verifica el número de pin en el código.', solucion: 'Corrige el sentido y el cableado; prueba el LED integrado del pin 13.' },
  { problema: 'El sensor no devuelve datos', causas: 'Sin alimentación, pin incorrecto, librería no instalada.', comprobaciones: 'Mide VCC y GND con multímetro. Compara el pin del código con el del montaje.', solucion: 'Corrige la alimentación o el pin; reinstala la librería.' },
  { problema: 'Las mediciones son incorrectas', causas: 'Voltaje de referencia distinto, sensor de baja precisión, ruido.', comprobaciones: 'Compara con otro instrumento. Revisa cables cortos y bien sujetos.', solucion: 'Promedia varias lecturas y calibra si es posible.' },
  { problema: 'La placa se reinicia', causas: 'Cortocircuito, sobrecorriente (motor o servo sin alimentación propia), fuente débil.', comprobaciones: 'Desconecta cargas grandes. Revisa que no haya 5 V tocando GND.', solucion: 'Alimenta actuadores por separado y une GND.' },
  { problema: 'El ESP32 no se conecta al Wi-Fi', causas: 'Clave o nombre de red incorrectos, red de 5 GHz (el ESP32 usa 2,4 GHz), señal débil.', comprobaciones: 'Revisa en el monitor serie el estado de WiFi.status().', solucion: 'Usa la red de 2,4 GHz y acerca el dispositivo al router.' },
  { problema: 'La comunicación MQTT o HTTP falla', causas: 'Dirección incorrecta, sin Internet, credenciales erradas, límite de uso del servicio.', comprobaciones: 'Prueba la dirección desde el navegador de tu computadora. Revisa el código de respuesta HTTP.', solucion: 'Corrige la dirección o las credenciales locales y revisa el plan del servicio.' },
  { problema: 'Errores de alimentación o conexiones', causas: 'Un sensor de 5 V en el ESP32, GND sin unir, cortos en la protoboard.', comprobaciones: 'Verifica el voltaje de cada componente y el GND común.', solucion: 'Reduce la tensión o usa adaptador de nivel; une GND.' },
  { problema: 'Falta una librería o hay incompatibilidad de versiones', causas: 'Librería antigua, núcleo de placa desactualizado (API de PWM distinta).', comprobaciones: 'Revisa la versión del núcleo esp32 y de la librería en el Gestor.', solucion: 'Actualiza o fija la versión que indica el ejemplo.' }
];

/* ---------- Retos (Módulo 11) ---------- */

const RETOS = [
  { titulo: 'Reto 1 · LED que cuenta', nivel: 'Principiante', enunciado: 'Enciende un LED y haz que parpadee tantas veces como indique una constante N (por ejemplo, 3).', pistas: ['Usa un bucle for.', 'Recuerda pinMode en setup().', 'Pausa entre parpadeos para distinguirlos.'] },
  { titulo: 'Reto 2 · Pulsador con memoria', nivel: 'Básico', enunciado: 'Cada pulsación cambia el LED de encendido a apagado y viceversa. Pista de rebote: espera 50 ms tras detectar un cambio.', pistas: ['Guarda el estado en una variable bool.', 'Detecta el flanco (cambio de HIGH a LOW), no solo el nivel.'] },
  { titulo: 'Reto 3 · Medidor de luz con escala', nivel: 'Intermedio', enunciado: 'Con la LDR, muestra en el monitor serie “oscuro”, “medio” o “claro” según rangos que tú elijas.', pistas: ['Prueba primero y anota valores reales.', 'Usa else if.'] },
  { titulo: 'Reto 4 · Aviso de error del sensor', nivel: 'Intermedio', enunciado: 'Si el DHT11 da error tres veces seguidas, enciende un LED rojo y mantenlo encendido hasta que haya una lectura válida.', pistas: ['Usa un contador de errores.', 'Reinicia el contador al leer bien.'] },
  { titulo: 'Reto 5 · Identifica el error', nivel: 'Básico', enunciado: 'Este código no enciende el LED: “pinMode(13, INPUT); void loop(){ digitalWrite(13, HIGH); }”. ¿Qué falta y por qué?', pistas: ['Revisa el modo del pin.', 'Un pin de salida necesita OUTPUT.'] }
];

/* ---------- Búsqueda: índice simple ---------- */

function textoPlano(html) {
  const d = document.createElement('div');
  d.innerHTML = html;
  return d.textContent || '';
}
