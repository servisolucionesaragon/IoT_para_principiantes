/* Práctica interactiva de código de colores de resistencias.
   Genera resistencias al azar (4 o 5 bandas), las dibuja en SVG y pide el valor entre cuatro opciones.
   Los valores se calculan con la misma regla que la ficha: dígitos × 10^multiplicador. */

const COLORES_DIGITO = ['negro', 'marrón', 'rojo', 'naranja', 'amarillo', 'verde', 'azul', 'violeta', 'gris', 'blanco'];
const HEX_COLOR = {
  negro: '#111827', marrón: '#7a4a1f', rojo: '#d62828', naranja: '#f77f00', amarillo: '#fcbf49',
  verde: '#2a9d4b', azul: '#1d4ed8', violeta: '#7b3fbf', gris: '#9ca3af', blanco: '#f5f5f5',
  dorado: '#c9a227', plata: '#c0c0c0'
};
const TOLERANCIA = { marrón: '±1 %', rojo: '±2 %', verde: '±0,5 %', azul: '±0,25 %', violeta: '±0,1 %', gris: '±0,05 %', dorado: '±5 %', plata: '±10 %' };
const TOL_5 = ['marrón', 'rojo', 'verde', 'azul', 'violeta', 'gris', 'dorado', 'plata'];
const TOL_4 = ['dorado', 'plata'];

const aleatorio = (n) => Math.floor(Math.random() * n);
const elegir = (lista) => lista[aleatorio(lista.length)];

/* Valor en ohmios a partir de las bandas */
function valorOhmios(digitos, multiplicador) {
  return Number(digitos.join('')) * Math.pow(10, multiplicador);
}

/* Texto legible: 220 Ω, 4,7 kΩ, 2,2 MΩ (coma decimal) */
function formatoOhmios(v) {
  const unidad = (valor, sufijo) => String(Number(valor.toFixed(2))).replace('.', ',') + ' ' + sufijo;
  if (v >= 1e6) return unidad(v / 1e6, 'MΩ');
  if (v >= 1e3) return unidad(v / 1e3, 'kΩ');
  return unidad(v, 'Ω');
}

/* Crea una resistencia aleatoria: bandas, valor y tolerancia */
function resistenciaAleatoria() {
  const cinco = Math.random() < 0.5;
  const digitos = [aleatorio(10), aleatorio(10)];
  if (digitos[0] === 0) digitos[0] = 1 + aleatorio(9);
  if (cinco) digitos.push(aleatorio(10));
  const mult = aleatorio(6);                       // ×1 … ×100 000
  const tol = cinco ? elegir(TOL_5) : elegir(TOL_4);
  const bandas = [...digitos.map(d => COLORES_DIGITO[d]), COLORES_DIGITO[mult], tol];
  return { cinco, digitos, mult, tol, bandas, ohmios: valorOhmios(digitos, mult) };
}

/* Opciones de respuesta: la correcta y tres distractores cercanos, sin repetir */
function opcionesDe(r) {
  const correcta = formatoOhmios(r.ohmios);
  const set = new Set([correcta]);
  let intentos = 0;
  while (set.size < 4 && intentos < 60) {
    intentos++;
    const cambio = aleatorio(3);
    let v;
    if (cambio === 0) v = valorOhmios([Math.min(9, Math.max(1, r.digitos[0] + (aleatorio(2) ? 1 : -1))), r.digitos[1]], r.mult);
    else if (cambio === 1) v = valorOhmios(r.digitos, Math.min(9, Math.max(0, r.mult + (aleatorio(2) ? 1 : -1))));
    else v = valorOhmios(r.digitos.map(d => (d + 3) % 10), r.mult);
    if (v > 0) set.add(formatoOhmios(v));
  }
  const lista = Array.from(set);
  // mezclar
  for (let i = lista.length - 1; i > 0; i--) { const j = aleatorio(i + 1); [lista[i], lista[j]] = [lista[j], lista[i]]; }
  return { lista, correcta };
}

/* Dibuja la resistencia en SVG con sus bandas */
function svgResistencia(r) {
  const xs = r.cinco ? [96, 116, 136, 156] : [100, 124, 148];
  const colores = r.bandas;
  const bandasSvg = colores.slice(0, xs.length).map((c, i) =>
    `<rect x="${xs[i]}" y="20" width="11" height="50" fill="${HEX_COLOR[c]}"/>`).join('');
  const tol = colores[colores.length - 1];
  return `<svg viewBox="0 0 300 90" role="img" aria-label="Resistencia con bandas de colores" style="width:100%;max-width:340px;height:auto">
    <line x1="10" y1="45" x2="290" y2="45" stroke="#9aa5ae" stroke-width="4"/>
    <rect x="70" y="18" width="160" height="54" rx="22" fill="#e8d3a4" stroke="#b08d57"/>
    ${bandasSvg}
    <rect x="214" y="20" width="11" height="50" fill="${HEX_COLOR[tol]}"/>
  </svg>`;
}

function iniciarPracticaResistencias() {
  const cont = document.getElementById('practica-resistencias');
  if (!cont) return;
  let actual = null;
  const nueva = () => {
    actual = resistenciaAleatoria();
    const { lista, correcta } = opcionesDe(actual);
    actual.correcta = correcta;
    cont.innerHTML = `
      <div class="panel" style="max-width:520px">
        <p class="vacio" style="margin-top:0">Observa las bandas y elige el valor:</p>
        <div style="display:flex;justify-content:center;margin:8px 0">${svgResistencia(actual)}</div>
        <div style="display:grid;gap:8px;grid-template-columns:repeat(2,minmax(0,1fr))">
          ${lista.map(op => `<button type="button" class="secundario op-resistencia" data-valor="${op}">${op}</button>`).join('')}
        </div>
        <p id="pr-resultado" role="status" style="min-height:1.6em;margin:12px 0 4px"></p>
        <div class="acciones"><button type="button" id="pr-nueva">Otra resistencia</button></div>
      </div>`;
    cont.querySelectorAll('.op-resistencia').forEach(b => b.addEventListener('click', () => {
      const res = document.getElementById('pr-resultado');
      if (b.dataset.valor === actual.correcta) {
        res.textContent = '✔ ¡Correcto! Son ' + actual.bandas.slice(0, actual.cinco ? 4 : 3).join(', ') + ' y ' + actual.tol + ' de tolerancia.';
        res.style.color = 'var(--ok)';
      } else {
        res.textContent = '✘ No es esa. Revisa cada banda: ' + actual.correcta + ' (' + actual.bandas.join(' · ') + ').';
        res.style.color = 'var(--error)';
      }
    }));
    document.getElementById('pr-nueva').addEventListener('click', nueva);
  };
  nueva();
}
