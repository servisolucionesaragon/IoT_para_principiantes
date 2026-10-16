/* Página de descargas: material complementario, organizado por categorías en tarjetas. */
function vistaDescargas() {
  const CATEGORIAS = [
    { id: 'libros-arduino', titulo: 'Libros de Arduino', grupos: ['mundo-arduino'], texto: 'Los cinco libros del curso, de Arduino desde cero hasta proyectos avanzados.' },
    { id: 'bonos', titulo: 'Bonos y plantillas', grupos: ['bonos-arduino'], texto: 'Lista de componentes, plantillas de código y solución de errores comunes.' },
    { id: 'kit-coche', titulo: 'Kit de coche Elegoo', grupos: ['espanol-elegoo'], texto: 'Lecciones del kit Smart Car, con sus programas de ejemplo (.ino).' },
    { id: 'robotica-ia', titulo: 'Robótica e IA', grupos: ['robotica-ia'], texto: 'Libros de inteligencia artificial educativa y robótica con Arduino.' },
    { id: 'retos', titulo: 'Retos sin pantallas', grupos: ['retos-sin-pantallas'], texto: 'Retos de ingenio, construcción y creatividad para hacer sin computadora.' }
  ];
  const nombreGrupo = {
    'mundo-arduino': 'Mundo Arduino', 'bonos-arduino': 'Bonos del curso', 'espanol-elegoo': 'Kit Elegoo',
    'robotica-ia': 'Robótica e IA', 'retos-sin-pantallas': '50 retos'
  };
  const enlace = (ruta) => 'descargas/' + ruta.split('/').map(encodeURIComponent).join('/');
  const tipo = (r) => {
    const x = r.toLowerCase();
    if (x.endsWith('.pdf')) return { icono: '📄', nombre: 'PDF' };
    if (x.endsWith('.ino')) return { icono: '💻', nombre: 'Código' };
    if (x.endsWith('.zip')) return { icono: '🗜️', nombre: 'Comprimido' };
    return { icono: '📁', nombre: 'Archivo' };
  };
  const titulo = (r) => {
    const partes = r.split('/');
    const archivo = partes[partes.length - 1].replace(/\.[^.]+$/, '');
    return archivo.replace(/[-_]+/g, ' ').trim();
  };
  const tarjeta = (a) => {
    const t = tipo(a.ruta);
    return `<a class="tarjeta" href="${enlace(a.ruta)}" download>
      <span class="etiqueta">${t.icono} ${t.nombre} · ${a.mb} MB</span>
      <strong>${esc(titulo(a.ruta))}</strong>
      <span class="pista">${esc(nombreGrupo[a.grupo] || a.grupo)}</span>
    </a>`;
  };
  const archivos = DESCARGAS.archivos;
  const bloques = CATEGORIAS.map(c => {
    const items = archivos.filter(a => c.grupos.includes(a.grupo));
    if (!items.length) return '';
    return `<section style="margin-top:32px">
      <h2>${esc(c.titulo)} <small class="vacio">(${items.length})</small></h2>
      <p class="vacio" style="margin-top:0">${esc(c.texto)}</p>
      <div class="tarjetas">${items.map(tarjeta).join('')}</div>
    </section>`;
  }).join('');
  const pendientes = DESCARGAS.excluidos.length
    ? `<div class="caja advertencia"><strong>Pendientes</strong>Estos archivos pesan más de 25 MB y aún no se publican: ${DESCARGAS.excluidos.map(x => esc(x.archivo) + ' (' + x.mb + ' MB)').join(', ')}.</div>`
    : '';
  return `<p class="migas"><a href="#/inicio">Inicio</a> › Descargas</p>
    <h1>Material complementario para descargar</h1>
    <p>Documentos, bonos y programas de apoyo del curso, organizados por categoría. Pulsa una tarjeta para descargar el archivo.</p>
    ${bloques}
    ${pendientes}`;
}
