/* Lección: señales analógicas y digitales (módulo 1).
   Texto original. La gráfica se genera en el navegador con los mismos datos.
   Se inserta justo después de la lección «Electricidad básica». */

(function () {
  /* Curva continua (analógica): cualquier valor entre dos extremos */
  function puntosAnalogica() {
    const pts = [];
    for (let x = 20; x <= 580; x += 4) {
      const y = 85 - 45 * Math.sin(((x - 20) / 560) * 4 * Math.PI);
      pts.push(x + ',' + y.toFixed(1));
    }
    return pts.join(' ');
  }

  /* Escalón (digital): solo dos niveles, alto o bajo */
  function trazoDigital() {
    let d = '';
    for (let i = 0; i < 8; i++) {
      const x = 20 + i * 70;
      const y = i % 2 === 0 ? 205 : 265;
      d += (i === 0 ? 'M' + x + ',' + y : ' V' + y) + ' H' + (x + 70);
    }
    return d;
  }

  /* Puntos de muestreo: la señal analógica se toma a intervalos regulares */
  function muestras() {
    let s = '';
    for (let k = 0; k <= 10; k++) {
      const x = 20 + k * 56;
      const y = 85 - 45 * Math.sin(((x - 20) / 560) * 4 * Math.PI);
      s += '<circle cx="' + x + '" cy="' + y.toFixed(1) + '" r="5" fill="#cf000f"/>';
    }
    return s;
  }

  const SVG_SENALES = `<svg viewBox="0 0 600 310" role="img" aria-label="Comparación: una señal analógica es una curva continua y una digital solo tiene dos niveles">
    <text x="20" y="20" font-size="16" font-weight="700" fill="currentColor">Analógica: cualquier valor</text>
    <line x1="20" y1="85" x2="580" y2="85" stroke="#9aa5ae" stroke-dasharray="4 4"/>
    <polyline points="${puntosAnalogica()}" fill="none" stroke="#0a6e8a" stroke-width="3"/>
    <text x="20" y="150" font-size="16" font-weight="700" fill="currentColor">Digital: dos niveles (1 o 0)</text>
    <path d="${trazoDigital()}" fill="none" stroke="#00a8c6" stroke-width="3"/>
    <text x="584" y="209" text-anchor="end" font-size="13" fill="currentColor">HIGH (1)</text>
    <text x="584" y="269" text-anchor="end" font-size="13" fill="currentColor">LOW (0)</text>
    <text x="20" y="300" font-size="13" fill="currentColor">Puntos rojos: muestras que toma el microcontrolador de la señal analógica.</text>
  </svg>`;

  const SVG_MUESTREO = `<svg viewBox="0 0 600 170" role="img" aria-label="Muestreo: la señal se mide en intervalos regulares y cada medida se convierte en un número">
    <polyline points="${puntosAnalogica()}" fill="none" stroke="#0a6e8a" stroke-width="2.5" transform="translate(0,-40)"/>
    ${muestras().replace(/cy="([\d.]+)"/g, (m, y) => 'cy="' + (parseFloat(y) - 40).toFixed(1) + '"')}
    <text x="20" y="165" font-size="13" fill="currentColor">Cada punto rojo se convierte en un número (ej.: 512). Más muestras por segundo = señal más fiel.</text>
  </svg>`;

  const LECCION_SENALES = {
    id: 'm1-senales', modulo: 'm1', titulo: 'Señales analógicas y digitales', nivel: 'Principiante', minutos: 15,
    resumen: 'Cómo se representa la información en un circuito: curvas continuas o niveles de 0 y 1.',
    cuerpo: `
<h2>Qué es una señal</h2>
<p>Una señal es una magnitud eléctrica que cambia con el tiempo y lleva información: un voltaje que representa la temperatura, un nivel que indica si un botón está presionado, un pulso que cuenta giros. Un microcontrolador como el Arduino o el ESP32 solo entiende números, así que todo sensor debe convertir su información en una señal que pueda leer.</p>

<h2>Señal analógica</h2>
<p>Puede tomar <strong>cualquier valor</strong> entre dos extremos. Su gráfica es una curva continua.</p>
<ul>
  <li><strong>Ejemplos:</strong> el voltaje de un potenciómetro, la temperatura medida con un LM35, la luz que recibe una LDR, el sonido de un micrófono.</li>
  <li><strong>Ventaja:</strong> describe con detalle lo que pasa.</li>
  <li><strong>Desventaja:</strong> el ruido puede alterar el valor, y hay que convertirlo a números para procesarlo.</li>
</ul>

<h2>Señal digital</h2>
<p>Solo tiene <strong>dos niveles</strong>: alto (HIGH, cercano a la alimentación) o bajo (LOW, cercano a 0 V). Su gráfica es un escalón.</p>
<ul>
  <li><strong>Ejemplos:</strong> un pulsador (suelto o presionado), un interruptor, un LED encendido o apagado, un relé.</li>
  <li><strong>Ventaja:</strong> es robusta: el ruido pequeño no cambia el nivel, porque solo importa si está alto o bajo.</li>
  <li><strong>Desventaja:</strong> no distingue matices: un valor intermedio no existe.</li>
</ul>

${figura(SVG_SENALES, 'Arriba, una señal analógica (curva continua). Abajo, una señal digital (solo dos niveles).')}

<h2>Tabla de comparación</h2>
${tabla(['Característica', 'Analógica', 'Digital'], [
  ['Valores posibles', 'Infinitos (dentro de un rango)', 'Dos: HIGH (1) o LOW (0)'],
  ['Ejemplo típico', 'Potenciómetro, LM35, LDR', 'Pulsador, interruptor, LED'],
  ['Lectura en Arduino', '<code>analogRead()</code>, valor de 0 a 1023', '<code>digitalRead()</code>, valor HIGH o LOW'],
  ['Escritura en Arduino', '<code>analogWrite()</code> (PWM, simula niveles)', '<code>digitalWrite()</code>'],
  ['Sensible al ruido', 'Sí', 'Poco']
])}

<h2>Cómo se convierte lo analógico en números</h2>
<p>El microcontrolador toma muestras de la señal a intervalos regulares. Cada muestra se convierte en un número con un <strong>conversor analógico-digital (ADC)</strong>. Cuantos más bits tenga, más niveles distingue:</p>
${tabla(['Placa', 'Resolución', 'Niveles', 'Valor para 5 V (o 3,3 V en ESP32)'], [
  ['Arduino UNO', '10 bits', '1 024 (0 a 1023)', 'Cada paso ≈ 4,9 mV a 5 V'],
  ['ESP32', '12 bits', '4 096 (0 a 4095)', 'Cada paso ≈ 0,8 mV a 3,3 V (la respuesta no es lineal en los extremos)']
])}
${figura(SVG_MUESTREO, 'Muestreo: el microcontrolador mide la señal en intervalos regulares y guarda un número por cada medida.')}
<p>Fórmula para el Arduino UNO: <strong>voltaje = lectura × 5 / 1023</strong>. Ejemplo: una lectura de 512 equivale a unos 2,5 V.</p>

<h2>Y la salida: PWM simula una señal analógica</h2>
<p>Un pin de salida solo entrega 0 V o 5 V. Con <strong>PWM</strong> enciende y apaga el pin muy rápido: si pasa la mitad del tiempo encendido, el valor promedio es 2,5 V. Así <code>analogWrite(pin, 128)</code> da un brillo medio a un LED, aunque el pin sea digital.</p>

<h2>Ejemplo: leer las dos señales en el mismo programa</h2>
${cod(`
const int POT = A0;       // señal analógica (0 a 1023)
const int BOTON = 2;      // señal digital (0 o 1)

void setup() {
  pinMode(BOTON, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  int valor = analogRead(POT);                  // número de 0 a 1023
  float voltaje = valor * 5.0 / 1023.0;         // lo convertimos a voltios
  bool pulsado = digitalRead(BOTON) == LOW;     // solo dos estados
  Serial.print(voltaje);
  Serial.print(" V   boton=");
  Serial.println(pulsado);
  delay(300);
}`, 'Señal analógica y digital en el monitor serie (Arduino UNO)')}

${caja('advertencia', 'Errores frecuentes', '<ul><li>Leer una señal analógica con <code>digitalRead()</code>: siempre dará HIGH o LOW y se pierden los valores intermedios.</li><li>Conectar un sensor analógico de 5 V a un ESP32 (que trabaja a 3,3 V).</li><li>Confundir la lectura de 0 a 1023 con voltios: hay que convertirla con la fórmula.</li></ul>')}

<h2>Fuentes</h2>
<p class="pista">Conceptos generales de electrónica y de la lectura analógica del Arduino UNO (libro 3 «Proyectos con sensores» del material «Mundo Arduino»). Valores de resolución según la documentación de cada placa.</p>`,
    quiz: [
      { pregunta: '¿Cuál de estas señales es digital?', opciones: ['El voltaje de un potenciómetro', 'La luz medida con una LDR', 'Un pulsador que se presiona o se suelta', 'La temperatura con un LM35'], correcta: 2, explicacion: 'Un pulsador solo tiene dos estados: presionado (LOW) o suelto (HIGH).', pista: 'Piensa en si solo puede estar en dos estados.' },
      { pregunta: 'En un Arduino UNO, ¿qué lectura corresponde aproximadamente a 2,5 V?', opciones: ['256', '512', '1023', '2,5'], correcta: 1, explicacion: 'Con analogRead() de 10 bits: 2,5 × 1023 / 5 ≈ 512.', pista: 'La mitad de 5 V es 2,5 V; la mitad de 1023 es unos 512.' }
    ],
    fuentes: ['Conceptos generales de electrónica', 'Mundo Arduino 3 · Proyectos con sensores (lectura analógica)']
  };

  /* Se inserta justo después de la lección «Electricidad básica» */
  const idx = LECCIONES.findIndex(l => l.id === 'm1-electricidad');
  if (idx >= 0) LECCIONES.splice(idx + 1, 0, LECCION_SENALES);
  else LECCIONES.push(LECCION_SENALES);
})();
