/* Página de descargas: material complementario con autorización del docente. */
function vistaDescargas() {
  const grupos = {
    'mundo-arduino': 'Mundo Arduino',
    'robotica-ia': 'Robótica e IA',
    'espanol-elegoo': 'Kit Elegoo (español)',
    'retos-sin-pantallas': '50 retos sin pantallas'
  };
  const pdfTodos = DESCARGAS.archivos;
  const porGrupo = Object.keys(grupos).map(g => ({ g, nombre: grupos[g], items: pdfTodos.filter(a => a.grupo === g) }));
  const enlace = (ruta) => 'descargas/' + ruta.split('/').map(encodeURIComponent).join('/');
  const icono = (r) => r.toLowerCase().endsWith('.pdf') ? '📄' : (r.toLowerCase().endsWith('.zip') ? '🗜️' : '💾');
  return `<p class="migas"><a href="#/inicio">Inicio</a> › Descargas</p>
    <h1>Material complementario para descargar</h1>
    <p>Documentos y recursos de apoyo del curso, publicados con autorización del docente. Pulsa un archivo para abrirlo o descargarlo.</p>
    ${porGrupo.map(s => `<h2>${esc(s.nombre)} <small class="vacio">(${s.items.length} archivos)</small></h2>
      <ul class="descargas">${s.items.map(a => `<li><a href="${enlace(a.ruta)}" download>${icono(a.ruta)} ${esc(a.ruta.split('/').slice(1).join(' / '))}</a> <small class="vacio">${a.mb} MB</small></li>`).join('')}</ul>`).join('')}
    ${DESCARGAS.excluidos.length ? `<div class="caja advertencia"><strong>Pendientes</strong>Estos archivos pesan más de 25 MB y aún no se publican: ${DESCARGAS.excluidos.map(x => esc(x.archivo) + ' (' + x.mb + ' MB)').join(', ')}.</div>` : ''}`;
}
