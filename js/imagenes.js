/* Ilustraciones originales (SVG) de sensores, actuadores y componentes.
   Son dibujos propios, simplificados, para reconocer cada dispositivo. No son fotografías
   ni se copian de los kits o libros del material. Se cargan después de componentes.js. */

const MARCO_ILUSTRACION = (contenido, etiqueta) => `<svg viewBox="0 0 160 120" role="img" aria-label="${etiqueta}">
  <rect x="1" y="1" width="158" height="118" rx="10" fill="#eef6fa"/>
  ${contenido}
  <text x="80" y="114" text-anchor="middle" font-size="9" fill="#4a5b6b">${etiqueta}</text>
</svg>`;

const PATAS = (xs, y1, y2) => xs.map(x => `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#9aa5ae" stroke-width="2.5"/>`).join('');
const PLACA = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${c || '#1d6f8c'}"/>`;

const ILUSTRACIONES = {
  resistencias: MARCO_ILUSTRACION(`
    <line x1="30" y1="60" x2="46" y2="60" stroke="#9aa5ae" stroke-width="3"/>
    <line x1="114" y1="60" x2="130" y2="60" stroke="#9aa5ae" stroke-width="3"/>
    <rect x="46" y="48" width="68" height="24" rx="10" fill="#d9b382"/>
    <rect x="60" y="48" width="6" height="24" fill="#b3261e"/>
    <rect x="72" y="48" width="6" height="24" fill="#b3261e"/>
    <rect x="84" y="48" width="6" height="24" fill="#7a4a1f"/>
    <rect x="98" y="48" width="6" height="24" fill="#c9a227"/>`, 'Resistencia'),
  led: MARCO_ILUSTRACION(`
    <line x1="66" y1="78" x2="66" y2="104" stroke="#9aa5ae" stroke-width="3"/>
    <line x1="94" y1="78" x2="94" y2="96" stroke="#9aa5ae" stroke-width="3"/>
    <path d="M52 78 A28 28 0 0 1 108 78 Z" fill="#e53935"/>
    <rect x="50" y="76" width="60" height="8" rx="2" fill="#c62828"/>
    <path d="M60 38 l-6 -8 M80 32 l0 -9 M100 38 l6 -8" stroke="#f5b400" stroke-width="2"/>
    <text x="112" y="104" font-size="8" fill="#333">+ larga</text>`, 'LED'),
  pulsador: MARCO_ILUSTRACION(`
    <rect x="42" y="66" width="76" height="34" rx="4" fill="#4a5b6b"/>
    <rect x="58" y="44" width="44" height="26" rx="6" fill="#e53935"/>
    <rect x="50" y="88" width="10" height="10" fill="#c0c8cf"/>
    <rect x="100" y="88" width="10" height="10" fill="#c0c8cf"/>`, 'Pulsador'),
  potenciometro: MARCO_ILUSTRACION(`
    <rect x="46" y="72" width="68" height="30" rx="4" fill="#2f7fb5"/>
    <circle cx="80" cy="54" r="22" fill="#263238"/>
    <circle cx="80" cy="54" r="14" fill="#546e7a"/>
    <line x1="80" y1="54" x2="92" y2="42" stroke="#ffffff" stroke-width="3"/>
    <rect x="52" y="102" width="6" height="12" fill="#c0c8cf"/>
    <rect x="77" y="102" width="6" height="12" fill="#c0c8cf"/>
    <rect x="102" y="102" width="6" height="12" fill="#c0c8cf"/>`, 'Potenciómetro'),
  ldr: MARCO_ILUSTRACION(`
    <circle cx="80" cy="56" r="28" fill="#d9b382"/>
    <path d="M58 46 l10 8 l-10 8 l10 8 M74 40 l10 8 l-10 8 l10 8 M90 46 l10 8 l-10 8" stroke="#8a5a2b" stroke-width="2.5" fill="none"/>
    ${PATAS([70, 90], 84, 104)}`, 'Fotorresistencia'),
  buzzer: MARCO_ILUSTRACION(`
    <rect x="52" y="40" width="56" height="50" rx="26" fill="#263238"/>
    <circle cx="80" cy="65" r="12" fill="#546e7a"/>
    <path d="M118 48 q10 17 0 34 M130 40 q16 25 0 50" stroke="#2f7fb5" stroke-width="3" fill="none"/>
    ${PATAS([72, 88], 90, 104)}`, 'Buzzer'),
  pir: MARCO_ILUSTRACION(`
    ${PLACA(40, 80, 80, 28, '#2f7fb5')}
    <path d="M52 80 A28 28 0 0 1 108 80 Z" fill="#f5f5f5" stroke="#9aa5ae"/>
    <path d="M64 80 q16 -22 32 0 M72 80 q8 -11 16 0" stroke="#c0c8cf" fill="none"/>
    <rect x="60" y="92" width="6" height="8" fill="#c0c8cf"/><rect x="78" y="92" width="6" height="8" fill="#c0c8cf"/><rect x="96" y="92" width="6" height="8" fill="#c0c8cf"/>`, 'Sensor PIR'),
  'ir-obstaculo': MARCO_ILUSTRACION(`
    ${PLACA(36, 60, 88, 40, '#1d6f8c')}
    <circle cx="60" cy="80" r="10" fill="#222"/><circle cx="60" cy="80" r="5" fill="#7e57c2"/>
    <circle cx="100" cy="80" r="10" fill="#222"/><circle cx="100" cy="80" r="5" fill="#7e57c2"/>
    <rect x="72" y="66" width="16" height="8" fill="#f5b400"/>`, 'Obstáculo IR'),
  tilt: MARCO_ILUSTRACION(`
    <rect x="58" y="38" width="44" height="60" rx="8" fill="#eceff1" stroke="#90a4ae" stroke-width="2"/>
    <circle cx="80" cy="70" r="9" fill="#37474f"/>
    ${PATAS([70, 90], 98, 108)}`, 'Inclinación'),
  acelerometro: MARCO_ILUSTRACION(`
    ${PLACA(44, 44, 72, 52, '#1d6f8c')}
    <rect x="60" y="56" width="40" height="28" rx="2" fill="#263238"/>
    <text x="80" y="74" text-anchor="middle" font-size="8" fill="#fff">MPU</text>
    ${PATAS([50, 60, 70, 80, 90, 100], 96, 106)}`, 'MPU-6050'),
  mq2: MARCO_ILUSTRACION(`
    ${PLACA(40, 84, 80, 22, '#1d6f8c')}
    <rect x="54" y="30" width="52" height="56" rx="10" fill="#b0bec5" stroke="#78909c" stroke-width="2"/>
    <path d="M60 30 h40 M60 38 h40 M60 46 h40 M60 54 h40 M60 62 h40" stroke="#78909c" stroke-width="1.2"/>
    ${PATAS([62, 80, 98], 98, 108)}`, 'Gas y humo MQ-2'),
  mq135: MARCO_ILUSTRACION(`
    ${PLACA(40, 84, 80, 22, '#1d6f8c')}
    <rect x="54" y="30" width="52" height="56" rx="10" fill="#cfd8dc" stroke="#607d8b" stroke-width="2"/>
    <path d="M60 30 h40 M60 38 h40 M60 46 h40 M60 54 h40 M60 62 h40" stroke="#607d8b" stroke-width="1.2"/>
    <circle cx="80" cy="18" r="4" fill="#90a4ae"/>
    ${PATAS([62, 80, 98], 98, 108)}`, 'Aire MQ-135'),
  lm35: MARCO_ILUSTRACION(`
    <path d="M56 40 h48 v40 q-24 14 -48 0 Z" fill="#263238"/>
    <rect x="58" y="32" width="44" height="6" fill="#37474f"/>
    <text x="80" y="66" text-anchor="middle" font-size="9" fill="#fff">LM35</text>
    ${PATAS([66, 80, 94], 80, 104)}`, 'LM35'),
  dht11: MARCO_ILUSTRACION(`
    <rect x="46" y="34" width="68" height="58" rx="6" fill="#f5f5f5" stroke="#90a4ae" stroke-width="2"/>
    <path d="M56 46 h48 M56 54 h48 M56 62 h48 M56 70 h48" stroke="#b0bec5" stroke-width="2"/>
    ${PATAS([62, 80, 98], 92, 106)}`, 'DHT11'),
  'humedad-suelo': MARCO_ILUSTRACION(`
    ${PLACA(56, 22, 48, 26, '#2e7d32')}
    <rect x="98" y="30" width="8" height="8" fill="#c0c8cf"/>
    <rect x="62" y="48" width="8" height="58" fill="#9e9e9e"/>
    <rect x="90" y="48" width="8" height="58" fill="#9e9e9e"/>
    <path d="M40 80 q20 -6 40 0 t40 0 v20 h-80 z" fill="#8d6e63" opacity=".7"/>`, 'Humedad de suelo'),
  sonido: MARCO_ILUSTRACION(`
    ${PLACA(40, 70, 80, 30, '#1d6f8c')}
    <circle cx="80" cy="50" r="22" fill="#263238"/>
    <circle cx="80" cy="50" r="10" fill="#546e7a"/>
    <rect x="116" y="76" width="8" height="8" fill="#c0c8cf"/>`, 'Sonido'),
  joystick: MARCO_ILUSTRACION(`
    <rect x="44" y="72" width="72" height="30" rx="8" fill="#263238"/>
    <line x1="80" y1="72" x2="80" y2="40" stroke="#37474f" stroke-width="8"/>
    <circle cx="80" cy="36" r="12" fill="#e53935"/>
    <circle cx="60" cy="86" r="4" fill="#90a4ae"/>`, 'Joystick'),
  rfid: MARCO_ILUSTRACION(`
    ${PLACA(36, 40, 76, 58, '#2e7d32')}
    <circle cx="74" cy="69" r="20" fill="none" stroke="#c9a227" stroke-width="3"/>
    <rect x="112" y="60" width="26" height="36" rx="3" fill="#fff" stroke="#90a4ae"/>
    <text x="125" y="82" text-anchor="middle" font-size="8" fill="#2f7fb5">RFID</text>`, 'RFID RC522'),
  gps: MARCO_ILUSTRACION(`
    ${PLACA(44, 60, 72, 42, '#263238')}
    <rect x="56" y="34" width="48" height="26" rx="2" fill="#c9a227"/>
    <path d="M80 26 v8" stroke="#90a4ae" stroke-width="3"/>
    <text x="80" y="92" text-anchor="middle" font-size="9" fill="#fff">NEO-6M</text>`, 'GPS NEO-6M'),
  rele: MARCO_ILUSTRACION(`
    <rect x="44" y="40" width="72" height="50" rx="5" fill="#1565c0"/>
    <circle cx="66" cy="66" r="12" fill="#546e7a"/>
    <rect x="88" y="54" width="18" height="24" fill="#eceff1"/>
    <text x="80" y="58" text-anchor="middle" font-size="8" fill="#fff">RELÉ</text>
    ${PATAS([52, 80, 108], 90, 106)}`, 'Relé 5 V'),
  servo: MARCO_ILUSTRACION(`
    <rect x="36" y="50" width="78" height="44" rx="4" fill="#1e88e5"/>
    <circle cx="90" cy="48" r="16" fill="#f5f5f5" stroke="#90a4ae"/>
    <rect x="86" y="46" width="30" height="5" fill="#eceff1"/>
    <path d="M60 94 v10 M74 94 v10 M88 94 v10" stroke="#f5b400" stroke-width="3"/>`, 'Servomotor SG90'),
  'motor-dc': MARCO_ILUSTRACION(`
    <rect x="44" y="44" width="62" height="46" rx="20" fill="#90a4ae"/>
    <rect x="106" y="62" width="18" height="10" fill="#607d8b"/>
    <rect x="124" y="64" width="10" height="6" fill="#cfd8dc"/>
    <rect x="62" y="90" width="6" height="12" fill="#c0c8cf"/><rect x="82" y="90" width="6" height="12" fill="#c0c8cf"/>`, 'Motor DC'),
  'lcd-i2c': MARCO_ILUSTRACION(`
    ${PLACA(30, 36, 100, 56, '#2e7d32')}
    <rect x="40" y="46" width="80" height="34" rx="2" fill="#9ccc65"/>
    <rect x="46" y="54" width="68" height="6" fill="#33691e" opacity=".6"/>
    <rect x="46" y="66" width="52" height="6" fill="#33691e" opacity=".6"/>
    <text x="80" y="110" text-anchor="middle" font-size="8" fill="#4a5b6b">I²C</text>`, 'LCD 16×2 I²C'),
  'bt-hc06': MARCO_ILUSTRACION(`
    ${PLACA(40, 40, 80, 44, '#1565c0')}
    <rect x="50" y="34" width="10" height="10" fill="#c9a227"/>
    <text x="80" y="66" text-anchor="middle" font-size="10" fill="#fff">HC-06</text>
    ${PATAS([56, 68, 80, 92], 84, 100)}`, 'Bluetooth HC-06'),
  hcsr04: MARCO_ILUSTRACION(`
    ${PLACA(36, 66, 88, 28, '#1d6f8c')}
    <circle cx="56" cy="50" r="18" fill="#b0bec5" stroke="#546e7a" stroke-width="2"/>
    <circle cx="104" cy="50" r="18" fill="#b0bec5" stroke="#546e7a" stroke-width="2"/>
    <circle cx="56" cy="50" r="8" fill="#37474f"/><circle cx="104" cy="50" r="8" fill="#37474f"/>
    <text x="80" y="84" text-anchor="middle" font-size="8" fill="#fff">HC-SR04</text>`, 'Ultrasonido HC-SR04'),
  protoboard: MARCO_ILUSTRACION(`
    <rect x="22" y="26" width="116" height="78" rx="4" fill="#f5f5f5" stroke="#90a4ae"/>
    <rect x="28" y="32" width="104" height="8" fill="#ffcdd2"/>
    <rect x="28" y="92" width="104" height="8" fill="#bbdefb"/>
    ${Array.from({ length: 6 }, (_, r) => Array.from({ length: 10 }, (_, c) => `<circle cx="${36 + c * 10}" cy="${50 + r * 6}" r="1.6" fill="#90a4ae"/>`).join('')).join('')}`, 'Protoboard')
};

/* Relación sensor del texto de proyectos → id de componente */
const SENSOR_A_COMPONENTE = {
  'PIR (movimiento)': 'pir', 'MQ-2 (gas y humo)': 'mq2', 'LDR': 'ldr', 'Buzzer': 'buzzer', 'LED': 'led',
  'Resistencia': 'resistencias', 'Humedad de suelo': 'humedad-suelo', 'Relé': 'rele', 'Sensor de sonido': 'sonido',
  'Joystick': 'joystick', 'Pulsador': 'pulsador', 'Acelerómetro MPU-6050': 'acelerometro', 'Lector RFID RC522': 'rfid',
  'GPS NEO-6M': 'gps', 'LCD I²C': 'lcd-i2c', 'DHT11': 'dht11', 'LM35': 'lm35', 'Ultrasonido HC-SR04': 'hcsr04',
  'Servo': 'servo', 'Bluetooth HC-06': 'bt-hc06', 'Potenciómetro': 'potenciometro'
};

/* Figura del componente: foto real con licencia libre si existe; si no, ilustración original.
   mini = tamaño reducido para tarjetas. */
function imagenComponente(id, mini) {
  const reales = (typeof FOTOS_REALES !== 'undefined') ? FOTOS_REALES : {};
  const c = (typeof COMPONENTES !== 'undefined') ? COMPONENTES.find(x => x.id === id) : null;
  const nombre = c ? c.nombre : id;
  const clase = 'ilustracion' + (mini ? ' mini' : '');
  if (reales[id]) {
    const f = reales[id];
    const pie = mini ? '' : `<figcaption>Foto: ${esc(f.autor)} · ${esc(f.licencia)} · <a href="${esc(f.fuente)}" target="_blank" rel="noopener">fuente</a></figcaption>`;
    return `<figure class="${clase} foto"><img src="${esc(f.src)}" alt="${esc(nombre)}" loading="lazy">${pie}</figure>`;
  }
  const svg = ILUSTRACIONES[id];
  if (svg) return `<figure class="${clase}">${svg}</figure>`;
  return `<figure class="${clase} sin-imagen"><div class="marcador">${esc(nombre)}</div></figure>`;
}

/* Ilustraciones que faltan en COMPONENTES (ultrasonido, potenciómetro en el catálogo) */
if (typeof COMPONENTES !== 'undefined' && !COMPONENTES.some(c => c.id === 'hcsr04')) {
  COMPONENTES.push({
    id: 'hcsr04', categoria: 'Movimiento y posición', nombre: 'Sensor ultrasónico HC-SR04', voltaje: '5 V',
    resumen: 'Mide distancias con un pulso de sonido y el tiempo de su eco.',
    funciona: '<p>Emite un pulso de ultrasonido por el transductor de <strong>Trig</strong> y mide cuánto tarda el eco en volver por <strong>Echo</strong>. Distancia (cm) = tiempo (µs) × 0,0343 / 2. El rango útil es de unos 2 cm a 4 m.</p>',
    conexion: [['VCC', '5 V'], ['GND', 'GND'], ['Trig', 'Pin digital de salida (p. ej., D9)'], ['Echo', 'Pin digital de entrada (p. ej., D10)']],
    codigo: 'const int TRIG = 9, ECHO = 10;\nvoid setup() {\n  pinMode(TRIG, OUTPUT);\n  pinMode(ECHO, INPUT);\n  Serial.begin(9600);\n}\nvoid loop() {\n  digitalWrite(TRIG, LOW); delayMicroseconds(2);\n  digitalWrite(TRIG, HIGH); delayMicroseconds(10);\n  digitalWrite(TRIG, LOW);\n  float cm = pulseIn(ECHO, HIGH, 30000) * 0.0343 / 2.0;\n  Serial.println(cm);\n  delay(200);\n}',
    precauciones: ['En ESP32, Echo entrega 5 V: usa un divisor de tensión.', 'Superficies blandas o inclinadas dan lecturas irregulares.']
  });
}

/* Ilustración al inicio de las lecciones con sensores, actuadores o montaje */
const ILUSTRACION_LECCION = {
  'm1-electricidad': 'led', 'm2-primer-programa': 'led', 'm2-entradas-salidas': 'pulsador',
  'm2-analogico-pwm': 'potenciometro', 'm4-potenciometro-ldr': 'ldr', 'm4-dht11': 'dht11',
  'm4-hcsr04': 'hcsr04', 'm4-servo': 'servo', 'm5-montaje': 'protoboard', 'm3-esp32-programa': 'potenciometro'
};
LECCIONES.forEach(l => {
  const id = ILUSTRACION_LECCION[l.id];
  if (id && ILUSTRACIONES[id]) {
    l.cuerpo = imagenComponente(id) + l.cuerpo;
  }
});
