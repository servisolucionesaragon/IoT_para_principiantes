/* Diagramas gráficos de conexión: pines de Arduino UNO y ESP32, protoboard,
   y la ficha de protoboard. Se carga después de contenido.js.
   Los esquemas son simplificados. El ESP32 varía según el fabricante (DevKit de 30 pines
   es el más común): confirma siempre la numeración con la serigrafía de tu placa. */

const UNO_IZQ = [
  { k: 'D13', t: 'D13' }, { k: 'D12', t: 'D12' }, { k: 'D11', t: 'D11 ~' }, { k: 'D10', t: 'D10 ~' },
  { k: 'D9', t: 'D9 ~' }, { k: 'D8', t: 'D8' }, { k: 'D7', t: 'D7' }, { k: 'D6', t: 'D6 ~' },
  { k: 'D5', t: 'D5 ~' }, { k: 'D4', t: 'D4' }, { k: 'D3', t: 'D3 ~' }, { k: 'D2', t: 'D2' },
  { k: 'D1', t: 'D1 TX' }, { k: 'D0', t: 'D0 RX' }
];
const UNO_DER = [
  { k: 'A0', t: 'A0' }, { k: 'A1', t: 'A1' }, { k: 'A2', t: 'A2' }, { k: 'A3', t: 'A3' },
  { k: 'A4', t: 'A4 SDA' }, { k: 'A5', t: 'A5 SCL' }, { k: '5V', t: '5V' }, { k: '3V3', t: '3.3V' },
  { k: 'GND', t: 'GND' }, { k: 'VIN', t: 'VIN' }
];
const ESP_IZQ = [
  { k: '3V3', t: '3V3' }, { k: 'EN', t: 'EN' }, { k: 'D36', t: 'GPIO36 (VP)' }, { k: 'D39', t: 'GPIO39 (VN)' },
  { k: 'D34', t: 'GPIO34' }, { k: 'D35', t: 'GPIO35' }, { k: 'D32', t: 'GPIO32' }, { k: 'D33', t: 'GPIO33' },
  { k: 'D25', t: 'GPIO25' }, { k: 'D26', t: 'GPIO26' }, { k: 'D27', t: 'GPIO27' }, { k: 'D14', t: 'GPIO14' },
  { k: 'D12', t: 'GPIO12' }, { k: 'GND', t: 'GND' }, { k: 'D13', t: 'GPIO13' }
];
const ESP_DER = [
  { k: 'VIN', t: 'VIN (5 V)' }, { k: 'GND', t: 'GND' }, { k: 'D23', t: 'GPIO23' }, { k: 'D22', t: 'GPIO22' },
  { k: 'D1', t: 'GPIO1 TX0' }, { k: 'D3', t: 'GPIO3 RX0' }, { k: 'D21', t: 'GPIO21' }, { k: 'D19', t: 'GPIO19' },
  { k: 'D18', t: 'GPIO18' }, { k: 'D5', t: 'GPIO5' }, { k: 'D17', t: 'GPIO17' }, { k: 'D16', t: 'GPIO16' },
  { k: 'D4', t: 'GPIO4' }, { k: 'D0', t: 'GPIO0' }, { k: 'D2', t: 'GPIO2' }, { k: 'D15', t: 'GPIO15' }
];

/**
 * Esquema de placa con pines a ambos lados.
 * resaltar: [{k:'D13', texto:'LED'}, ...] numera los pines usados en orden.
 */
function diagramaPlaca(titulo, izq, der, color, resaltar, pie) {
  resaltar = resaltar || [];
  const idx = {};
  resaltar.forEach((r, i) => { idx[r.k] = i + 1; });
  const n = Math.max(izq.length, der.length);
  const W = 720, H = 110 + n * 26;
  const yPin = i => 84 + i * 26;
  const BX = 260, BW = 200;

  let pines = '';
  izq.forEach((p, i) => {
    const y = yPin(i), num = idx[p.k];
    pines += `<line x1="${BX - 14}" y1="${y}" x2="${BX}" y2="${y}" stroke="currentColor" stroke-width="2"/>`;
    pines += `<circle cx="${BX}" cy="${y}" r="5" fill="${num ? '#ffb300' : '#fff'}" stroke="#333"/>`;
    pines += `<text x="${BX - 20}" y="${y + 5}" text-anchor="end" font-size="14" fill="currentColor" font-weight="${num ? 700 : 400}">${esc(p.t)}${num ? ` (${num})` : ''}</text>`;
  });
  der.forEach((p, i) => {
    const y = yPin(i), num = idx[p.k];
    pines += `<line x1="${BX + BW}" y1="${y}" x2="${BX + BW + 14}" y2="${y}" stroke="currentColor" stroke-width="2"/>`;
    pines += `<circle cx="${BX + BW}" cy="${y}" r="5" fill="${num ? '#ffb300' : '#fff'}" stroke="#333"/>`;
    pines += `<text x="${BX + BW + 20}" y="${y + 5}" text-anchor="start" font-size="14" fill="currentColor" font-weight="${num ? 700 : 400}">${esc(p.t)}${num ? ` (${num})` : ''}</text>`;
  });

  const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(titulo)}">
    <rect x="${BX}" y="40" width="${BW}" height="${H - 60}" rx="14" fill="${color}"/>
    <text x="${BX + BW / 2}" y="66" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">${esc(titulo)}</text>
    ${pines}
  </svg>`;

  const leyenda = resaltar.length
    ? `<ol class="leyenda-pines">${resaltar.map(r => `<li><strong>${esc(r.k.replace(/^D(\d+)$/, 'D$1'))}</strong>: ${esc(r.texto)}</li>`).join('')}</ol>`
    : '';
  return `<figure class="diagrama">${svg}<figcaption>${pie ? esc(pie) : ''}${leyenda}</figcaption></figure>`;
}

function diagramaUno(resaltar, pie) {
  return diagramaPlaca('Arduino UNO', UNO_IZQ, UNO_DER, '#1d6f8c', resaltar, pie || 'Pines del Arduino UNO. Los marcados con ~ son PWM. Los pines amarillos y numerados son los usados en esta práctica.');
}

function diagramaEsp32(resaltar, pie) {
  return diagramaPlaca('ESP32 DevKit', ESP_IZQ, ESP_DER, '#2c3e50', resaltar, pie || 'Pines de un ESP32 DevKit de 30 pines (esquema simplificado). Confirma la numeración de tu placa. Recuerda: lógica de 3,3 V.');
}

/**
 * Protoboard: filas de cinco orificios conectados (a-e y f-j), canal central y rieles.
 */
function svgProtoboard() {
  const W = 680, H = 260, x0 = 70, paso = 34, columnas = 12;
  let s = '';
  // rieles
  s += `<rect x="20" y="14" width="${W - 40}" height="36" rx="6" fill="#f2f2f2" stroke="#999"/>`;
  s += `<rect x="20" y="206" width="${W - 40}" height="36" rx="6" fill="#f2f2f2" stroke="#999"/>`;
  s += `<text x="30" y="30" font-size="13" fill="#b00020" font-weight="700">+</text>`;
  s += `<text x="30" y="46" font-size="13" fill="#1d4ed8" font-weight="700">−</text>`;
  s += `<text x="30" y="222" font-size="13" fill="#b00020" font-weight="700">+</text>`;
  s += `<text x="30" y="238" font-size="13" fill="#1d4ed8" font-weight="700">−</text>`;
  s += `<line x1="${x0 - 10}" y1="22" x2="${x0 + columnas * paso}" y2="22" stroke="#b00020" stroke-width="2" opacity=".5"/>`;
  s += `<line x1="${x0 - 10}" y1="40" x2="${x0 + columnas * paso}" y2="40" stroke="#1d4ed8" stroke-width="2" opacity=".5"/>`;
  s += `<line x1="${x0 - 10}" y1="214" x2="${x0 + columnas * paso}" y2="214" stroke="#b00020" stroke-width="2" opacity=".5"/>`;
  s += `<line x1="${x0 - 10}" y1="232" x2="${x0 + columnas * paso}" y2="232" stroke="#1d4ed8" stroke-width="2" opacity=".5"/>`;
  // columna resaltada (ejemplo de conexión interna)
  const colRes = 3;
  s += `<rect x="${x0 + colRes * paso - 14}" y="62" width="28" height="60" rx="14" fill="#c7f0d8" opacity=".9"/>`;
  s += `<rect x="${x0 + colRes * paso - 14}" y="138" width="28" height="60" rx="14" fill="#fde7c8" opacity=".9"/>`;
  // orificios
  const filas = ['a', 'b', 'c', 'd', 'e'];
  const filas2 = ['f', 'g', 'h', 'i', 'j'];
  for (let c = 0; c < columnas; c++) {
    const x = x0 + c * paso;
    filas.forEach((f, i) => { s += `<circle cx="${x}" cy="${74 + i * 12}" r="3.5" fill="#555"/>`; });
    filas2.forEach((f, i) => { s += `<circle cx="${x}" cy="${150 + i * 12}" r="3.5" fill="#555"/>`; });
    s += `<circle cx="${x}" cy="30" r="3" fill="#777"/><circle cx="${x}" cy="46" r="3" fill="#777"/>`;
    s += `<circle cx="${x}" cy="222" r="3" fill="#777"/><circle cx="${x}" cy="238" r="3" fill="#777"/>`;
    s += `<text x="${x}" y="260" text-anchor="middle" font-size="10" fill="currentColor">${c + 1}</text>`;
  }
  s += `<text x="${x0 - 22}" y="78" font-size="12" fill="currentColor">a</text>`;
  s += `<text x="${x0 - 22}" y="126" font-size="12" fill="currentColor">e</text>`;
  s += `<text x="${x0 - 22}" y="154" font-size="12" fill="currentColor">f</text>`;
  s += `<text x="${x0 - 22}" y="202" font-size="12" fill="currentColor">j</text>`;
  s += `<text x="${x0 + columnas * paso / 2}" y="112" text-anchor="middle" font-size="13" fill="currentColor">canal central (separa los dos lados)</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Protoboard: filas a-e y f-j conectadas por columnas, rieles + y -">${s}</svg>`;
}

const PROTOBOARD_HTML = `
<h2>Qué es una protoboard</h2>
<p>La <strong>protoboard</strong> (también llamada placa de pruebas o breadboard) es una placa de plástico con cientos de orificios que permiten <strong>armar circuitos sin soldar</strong>. Sirve para probar una idea, cambiarla cuantas veces quieras y desarmarla después para usar los componentes otra vez.</p>
${figura(svgProtoboard(), 'Esquema de una protoboard. Los orificios de una misma columna (a–e) están unidos por dentro. Los rieles + y − recorren los lados de lado a lado.')}
<h2>Cómo están conectados los orificios por dentro</h2>
<ul>
  <li><strong>Columnas de 5:</strong> los orificios a, b, c, d y e de una misma columna están unidos. Lo mismo para f, g, h, i y j. Ese es el motivo por el que puedes poner un componente en una columna y otro cable en la misma columna para conectarlos.</li>
  <li><strong>Canal central:</strong> separa las dos mitades. Por eso los circuitos integrados se colocan cruzando el canal, con cada patilla en una mitad distinta.</li>
  <li><strong>Rieles (+ y −):</strong> las filas largas de los bordes se usan para la alimentación. Muchas protoboards tienen un corte en el medio del riel: revisa con un multímetro si tu riel es continuo.</li>
</ul>
<h2>Para qué sirve</h2>
<ul>
  <li>Probar un circuito antes de hacerlo permanente.</li>
  <li>Cambiar valores (resistencias, sensores) sin volver a soldar.</li>
  <li>Enseñar electrónica: el circuito se ve y se corrige rápido.</li>
</ul>
<h2>Cómo usarla paso a paso</h2>
<ol>
  <li><strong>Apaga la placa</strong> (desconecta el USB o la batería) mientras colocas componentes.</li>
  <li><strong>Coloca primero el GND</strong> en un riel − y lleva un cable desde el GND de Arduino o ESP32 a ese riel.</li>
  <li><strong>Lleva la alimentación</strong> (5 V o 3,3 V) al riel +. Confirma el voltaje con el multímetro antes de conectar sensores.</li>
  <li><strong>Inserta los componentes</strong> presionando hasta el fondo. Los LED, resistencias y pulsadores deben quedar a un lado del canal central.</li>
  <li><strong>Conecta cables de la placa</strong> a las columnas que necesites. Usa cables de colores: rojo para +, negro para GND, otro color para señales.</li>
  <li><strong>Comprueba</strong> con la lista de conexiones antes de encender.</li>
</ol>
<h2>Ejemplo: un LED con resistencia</h2>
<p>Coloca el LED en las columnas 5 (pata + en la fila a, pata − en la fila b, por ejemplo). La resistencia de 220 Ω va desde la columna del pin D13 hasta la misma columna del ánodo. El cátodo del LED va al riel −, que está unido al GND.</p>
<h2>Errores frecuentes</h2>
<ul>
  <li><strong>Una pata que no entra bien:</strong> el contacto es intermitente. Presiónala hasta el fondo o cambia el orificio.</li>
  <li><strong>Cortocircuito por cable mal puesto:</strong> un cable entre + y − sin resistencia. Revisa antes de encender.</li>
  <li><strong>Componentes en el mismo lado del canal</strong> cuando deben estar separados (un integrado con dos patillas en la misma mitad).</li>
  <li><strong>Riel cortado:</strong> si la alimentación no llega a toda la fila, mide el riel con el multímetro.</li>
  <li><strong>Protoboard sucia o con restos de cable:</strong> limpia el polvo y saca los trozos de cable antes de empezar.</li>
</ul>
<h2>Consejos prácticos</h2>
<ul>
  <li>Usa cables de núcleo sólido de calibre 22 AWG, con 5 a 7 mm de aislante quitado.</li>
  <li>Monta de forma ordenada: pon los componentes en filas paralelas y los cables cortos.</li>
  <li>Sigue el orden: GND, alimentación, componentes, señales.</li>
</ul>
<p class="pista">Diagrama de placa de referencia: los orificios numerados por columnas de la protoboard; la columna resaltada muestra los cinco orificios unidos.</p>`;

/* Entrada de protoboard en la sección de sensores y dispositivos */
COMPONENTES.push({
  id: 'protoboard', categoria: 'Componentes básicos', nombre: 'Protoboard (placa de pruebas)', especial: 'protoboard',
  resumen: 'Para armar circuitos sin soldar: qué es, cómo están unidos sus orificios y cómo usarla.'
});

/* Diagramas por práctica (se insertan en las lecciones, antes de «Fuentes») */
const DIAGRAMAS_LECCIONES = {
  'm2-que-es-arduino': diagramaUno([]),
  'm2-primer-programa': diagramaUno([{ k: 'D13', texto: 'LED integrado en la placa (no requiere cables)' }, { k: 'GND', texto: 'GND' }]),
  'm2-entradas-salidas': diagramaUno([{ k: 'D2', texto: 'Pulsador (con INPUT_PULLUP)' }, { k: 'GND', texto: 'Otra pata del pulsador' }, { k: 'D13', texto: 'LED integrado (indicador)' }]),
  'm2-analogico-pwm': diagramaUno([{ k: 'A0', texto: 'Cursor central del potenciómetro' }, { k: '5V', texto: 'Pata extrema del potenciómetro' }, { k: 'GND', texto: 'Pata extrema y cátodo del LED' }, { k: 'D9', texto: 'LED con resistencia (PWM)' }]),
  'm3-esp32': diagramaEsp32([]),
  'm3-esp32-programa': diagramaEsp32([{ k: 'D2', texto: 'LED integrado (verifica en tu placa)' }, { k: 'D34', texto: 'Cursor del potenciómetro (ADC1, solo entrada)' }, { k: '3V3', texto: 'Pata extrema del potenciómetro (3,3 V)' }, { k: 'GND', texto: 'Pata extrema y cátodo del LED' }, { k: 'D25', texto: 'LED con resistencia (PWM con LEDC)' }]),
  'm4-potenciometro-ldr': diagramaUno([{ k: 'A0', texto: 'Punto medio del divisor (LDR + 10 kΩ)' }, { k: '5V', texto: 'Extremo superior de la LDR' }, { k: 'GND', texto: 'Resistencia de 10 kΩ' }]),
  'm4-dht11': diagramaUno([{ k: 'D7', texto: 'DATA del DHT11' }, { k: '5V', texto: 'VCC del DHT11' }, { k: 'GND', texto: 'GND del DHT11' }]),
  'm4-hcsr04': diagramaUno([{ k: 'D9', texto: 'TRIG' }, { k: 'D10', texto: 'ECHO (5 V, válido en UNO)' }, { k: '5V', texto: 'VCC' }, { k: 'GND', texto: 'GND' }]),
  'm4-servo': diagramaUno([{ k: 'D9', texto: 'Señal (naranja) del servo' }, { k: '5V', texto: 'Rojo del servo' }, { k: 'GND', texto: 'Marrón del servo' }]),
};

/* Inserta cada diagrama antes de «Fuentes» de la lección correspondiente.
   En la lección de montaje se inserta la ficha completa de protoboard. */
LECCIONES.forEach(l => {
  if (l.cuerpo.indexOf('<h2>Fuentes</h2>') < 0) return;
  if (l.id === 'm5-montaje') {
    l.cuerpo = l.cuerpo.replace('<h2>Fuentes</h2>', PROTOBOARD_HTML + '<h2>Fuentes</h2>');
    return;
  }
  const html = DIAGRAMAS_LECCIONES[l.id];
  if (html) {
    l.cuerpo = l.cuerpo.replace('<h2>Fuentes</h2>', '<h2>Diagrama de conexión</h2>' + html + '<h2>Fuentes</h2>');
  }
});
