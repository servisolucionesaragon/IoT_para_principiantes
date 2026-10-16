/* Diagramas de conexión generados a partir de la tabla de conexiones de cada ejemplo y proyecto.
   Placa a la izquierda, componentes a la derecha, un cable por cada conexión.
   Esquema simplificado: no sustituye la tabla ni la documentación de la placa. */

const COLORES_CABLE = ['#f5c518', '#ff7f00', '#2b5fd9', '#2e9e44', '#7b3fbf', '#00a8c6', '#e0527a', '#9aa5ae'];

/* Convierte un texto de pin (GPIO 5, D13, 5 V, 3,3 V, GND…) a un nombre normalizado */
function pinesDeTexto(texto) {
  const t = String(texto);
  const encontrados = [];
  const busca = (re, conv) => { let m; const r = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'); while ((m = r.exec(t))) encontrados.push(conv(m)); };
  busca(/GPIO\s*(\d+)/i, m => 'D' + m[1]);
  busca(/\bPin\s*(\d+)\b/i, m => 'D' + m[1]);
  busca(/\b3[.,]?3\s*V\b|\b3V3\b/i, () => '3V3');
  busca(/\b5\s*V\b|\b5V\b/i, () => '5V');
  busca(/\bGND\b/i, () => 'GND');
  busca(/\bVIN\b/i, () => 'VIN');
  busca(/\bD(\d{1,2})\b/i, m => 'D' + m[1]);
  busca(/\bA(\d)\b/i, m => 'A' + m[1]);
  return [...new Set(encontrados)];
}

/* Nombre base del componente: quita paréntesis y la descripción de la pata */
function nombreComponente(texto) {
  return String(texto).replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
}

/* Filas de conexión a partir de la tabla: [componente, pin del componente, pin de la placa, función] o [componente, pin de la placa] */
function filasDeConexiones(conexiones) {
  const filas = [];
  conexiones.forEach(c => {
    if (c.length >= 3) {
      const [comp, pinComp, pinPlaca, fn] = c;
      pinesDeTexto(pinPlaca).forEach(p => filas.push({ comp: nombreComponente(comp), pinComp: String(pinComp || ''), pinPlaca: p, fn: String(fn || '') }));
    } else {
      const [comp, destino] = c;
      pinesDeTexto(destino).forEach(p => filas.push({ comp: nombreComponente(comp), pinComp: String(comp), pinPlaca: p, fn: String(destino) }));
    }
  });
  return filas;
}

/* Dibuja el esquema en SVG */
function diagramaConexiones(conexiones, placa, titulo) {
  const filas = filasDeConexiones(conexiones || []);
  if (!filas.length) return '';
  const pinesPlaca = [...new Set(filas.map(f => f.pinPlaca))];
  const grupos = [];
  filas.forEach(f => {
    let g = grupos.find(x => x.nombre === f.comp);
    if (!g) { g = { nombre: f.comp, filas: [] }; grupos.push(g); }
    g.filas.push(f);
  });
  const ALTO_FILA = 34;
  const alturaGrupos = grupos.reduce((a, g) => a + 46 + g.filas.length * ALTO_FILA + 14, 0);
  const alturaPlaca = 70 + pinesPlaca.length * 40 + 20;
  const H = Math.max(alturaGrupos, alturaPlaca) + 40;
  const color = { GND: '#222', '5V': '#d62828', '3V3': '#d62828' };
  let svg = '';
  // placa
  const colorPlaca = /ESP32/i.test(placa || '') ? '#2c3e50' : '#1d6f8c';
  const nombrePlaca = placa || 'Arduino UNO';
  svg += `<rect x="24" y="18" width="232" height="${H - 36}" rx="16" fill="${colorPlaca}" stroke="#0d3b4d" stroke-width="2.5"/>`;
  svg += `<text x="140" y="46" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">${esc(nombrePlaca)}</text>`;
  const yPinPlaca = {};
  pinesPlaca.forEach((p, i) => {
    const y = 80 + i * 40;
    yPinPlaca[p] = y;
    svg += `<circle cx="256" cy="${y}" r="6" fill="#f5c518" stroke="#fff" stroke-width="2"/>`;
    svg += `<text x="242" y="${y + 5}" text-anchor="end" font-size="14" font-weight="700" fill="#fff">${esc(p)}</text>`;
  });
  // componentes y cables
  let yGrupo = 20;
  let idx = 0;
  grupos.forEach(g => {
    const h = 46 + g.filas.length * ALTO_FILA + 6;
    svg += `<rect x="470" y="${yGrupo}" width="300" height="${h}" rx="14" fill="var(--superficie)" stroke="var(--borde-fuerte)" stroke-width="2"/>`;
    svg += `<text x="486" y="${yGrupo + 28}" font-size="15" font-weight="700" fill="currentColor">${esc(g.nombre)}</text>`;
    g.filas.forEach((f, j) => {
      const y = yGrupo + 46 + j * ALTO_FILA + 14;
      const c = color[f.pinPlaca] || COLORES_CABLE[idx % COLORES_CABLE.length];
      idx++;
      const x1 = 256, y1 = yPinPlaca[f.pinPlaca], x2 = 470, y2 = y;
      const mx = (x1 + x2) / 2;
      svg += `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" opacity=".95"/>`;
      const etiqueta = (f.pinComp && f.pinComp !== g.nombre ? f.pinComp + ' → ' : '') + (f.fn ? f.fn : '');
      svg += `<text x="486" y="${y + 5}" font-size="12.5" fill="currentColor">${esc(etiqueta.length > 40 ? etiqueta.slice(0, 38) + '…' : etiqueta)}</text>`;
    });
    yGrupo += h + 14;
  });
  const cuerpo = `<svg viewBox="0 0 800 ${H}" role="img" aria-label="${esc('Esquema de conexión: ' + (titulo || nombrePlaca))}">${svg}</svg>`;
  return `<figure class="diagrama diagrama-ancho diagrama-auto">${cuerpo}<figcaption>Esquema de conexión: los cables unen cada pin de la placa con su componente. Sigue la tabla para los detalles.</figcaption></figure>`;
}

/* Inserta el diagrama en cada ejemplo del módulo 8 (antes del código) */
LECCIONES.forEach(l => {
  if (!l.conexionesEjemplo || l.cuerpo.indexOf('<h2>Código</h2>') < 0) return;
  l.cuerpo = l.cuerpo.replace('<h2>Código</h2>', '<h2>Diagrama de conexión</h2>' + diagramaConexiones(l.conexionesEjemplo, 'Arduino UNO', l.titulo) + '<h2>Código</h2>');
});
