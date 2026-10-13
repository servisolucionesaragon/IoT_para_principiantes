/* Aplicación principal: enrutado por hash, lecciones, cuestionarios, progreso,
   búsqueda, copiar código y modo claro/oscuro. Sin dependencias. */

(function () {
  'use strict';

  const CLAVE_PROGRESO = 'iot-progreso-v1';
  const CLAVE_TEMA = 'iot-tema';
  const CLAVE_LAB = 'iot-lab-codigo';

  const $ = (sel, raiz) => (raiz || document).querySelector(sel);
  const $$ = (sel, raiz) => Array.from((raiz || document).querySelectorAll(sel));

  /* ---------- Almacenamiento seguro (puede fallar en modo privado) ---------- */
  function leer(clave, porDefecto) {
    try {
      const v = localStorage.getItem(clave);
      return v === null ? porDefecto : JSON.parse(v);
    } catch (e) { return porDefecto; }
  }
  function escribir(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento */ }
  }

  /* ---------- Progreso ---------- */
  function completadas() { return new Set(leer(CLAVE_PROGRESO, [])); }
  function marcar(id, hecho) {
    const s = completadas();
    hecho ? s.add(id) : s.delete(id);
    escribir(CLAVE_PROGRESO, Array.from(s));
    pintarProgreso();
  }
  function pintarProgreso() {
    const total = LECCIONES.length;
    const hechas = LECCIONES.filter(l => completadas().has(l.id)).length;
    const pct = Math.round((hechas / total) * 100);
    const barra = $('#barra-progreso');
    if (barra) barra.style.width = pct + '%';
    const txt = $('#texto-progreso');
    if (txt) txt.textContent = `${hechas} de ${total} lecciones (${pct} %)`;
    $$('[data-leccion]').forEach(a => {
      const id = a.getAttribute('data-leccion');
      const check = a.querySelector('.check');
      if (check) check.remove();
      if (completadas().has(id)) {
        const s = document.createElement('span');
        s.className = 'check';
        s.setAttribute('aria-label', 'completada');
        s.textContent = '✓';
        a.appendChild(s);
      }
    });
  }

  /* ---------- Utilidades ---------- */
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function leccionPorId(id) { return LECCIONES.find(l => l.id === id); }
  function moduloPorId(id) { return MODULOS.find(m => m.id === id); }
  function leccionesDeModulo(id) { return LECCIONES.filter(l => l.modulo === id); }
  function enlaceLeccion(l) { return `#/leccion/${l.id}`; }

  /* ---------- Menú lateral ---------- */
  function pintarMenu() {
    const cont = $('#menu-modulos');
    cont.innerHTML = MODULOS.map(m => `
      <h2>${esc(m.titulo.replace(/^Módulo \d+ · /, ''))}</h2>
      ${leccionesDeModulo(m.id).map(l => `<a href="${enlaceLeccion(l)}" data-leccion="${l.id}" data-ruta="leccion/${l.id}">${esc(l.titulo)}</a>`).join('')}
    `).join('');
    pintarProgreso();
  }

  function marcarMenuActivo(ruta) {
    $$('.menu a').forEach(a => a.classList.remove('activo'));
    const a = $(`.menu a[data-ruta="${ruta}"]`);
    if (a) a.classList.add('activo');
  }

  /* ---------- Copiar código ---------- */
  function copiarTexto(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(texto);
    }
    return new Promise((resolver, rechazar) => {
      const ta = document.createElement('textarea');
      ta.value = texto;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        const ok = document.execCommand('copy');
        ok ? resolver() : rechazar(new Error('execCommand'));
      } catch (e) { rechazar(e); }
      document.body.removeChild(ta);
    });
  }

  function anadirBotonesCopiar(raiz) {
    $$('pre.codigo', raiz).forEach(pre => {
      const cont = pre.parentElement;
      if (!cont || cont.querySelector('.copiar')) return;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'copiar';
      b.textContent = 'Copiar código';
      b.addEventListener('click', () => {
        const texto = pre.querySelector('code').textContent;
        copiarTexto(texto).then(() => {
          b.textContent = '✓ ¡Copiado!';
          b.classList.add('copiado');
          setTimeout(() => { b.textContent = 'Copiar código'; b.classList.remove('copiado'); }, 2000);
        }).catch(() => {
          b.textContent = 'Selecciona y copia (Ctrl+C)';
          const r = document.createRange();
          r.selectNodeContents(pre.querySelector('code'));
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(r);
        });
      });
      cont.appendChild(b);
    });
  }

  /* ---------- Cuestionarios ---------- */
  function montarQuiz(raiz) {
    $$('.quiz[data-quiz]', raiz).forEach(q => {
      const datos = JSON.parse(q.getAttribute('data-quiz'));
      const nombre = 'q-' + Math.random().toString(36).slice(2);
      q.innerHTML = `
        <fieldset>
          <legend>${esc(datos.pregunta)}</legend>
          ${datos.opciones.map((o, i) => `<label><input type="radio" name="${nombre}" value="${i}"> ${esc(o)}</label>`).join('')}
        </fieldset>
        <div class="acciones">
          <button type="button" class="secundario pista-btn">Pista</button>
        </div>
        <p class="pista pista-texto" hidden>${esc(datos.pista)}</p>
        <div class="retro" aria-live="polite"></div>`;
      $$('input[type=radio]', q).forEach(r => r.addEventListener('change', () => {
        const elegida = Number(r.value);
        const retro = $('.retro', q);
        if (elegida === datos.correcta) {
          retro.className = 'retro bien';
          retro.textContent = '¡Correcto! ' + datos.explicacion;
        } else {
          retro.className = 'retro mal';
          retro.textContent = 'Todavía no. ' + datos.explicacion;
        }
      }));
      $('.pista-btn', q).addEventListener('click', () => {
        const p = $('.pista-texto', q);
        p.hidden = false;
      });
    });
  }

  /* ---------- Vistas ---------- */
  function vistaInicio() {
    const total = LECCIONES.length;
    const hechas = LECCIONES.filter(l => completadas().has(l.id)).length;
    return `
      <p class="migas">Inicio</p>
      <h1>Aprende electrónica, Arduino, ESP32 y IoT desde cero</h1>
      <p>Esta plataforma te guía paso a paso: entiendes un concepto, ves cómo se conecta el circuito, copias el código, lo comprendes y compruebas el resultado. Todo está en español.</p>
      <div class="acciones">
        <a class="boton" href="#/leccion/m1-que-es-iot">Empezar por el principio</a>
        <a class="boton secundario" href="#/laboratorio">Abrir el laboratorio USB</a>
      </div>
      <h2>Cómo estudiar</h2>
      <ol class="pasos">
        <li><strong>1. Concepto</strong><br>Lee la idea principal y su ejemplo.</li>
        <li><strong>2. Conexión</strong><br>Sigue el esquema y la tabla de pines.</li>
        <li><strong>3. Código</strong><br>Copia el programa y lee la explicación.</li>
        <li><strong>4. Prueba</strong><br>Compara el resultado con lo esperado y responde el cuestionario.</li>
      </ol>
      <div class="caja advertencia"><strong>Antes de empezar</strong>Trabaja con la placa desconectada al cambiar cables. Los ESP32 usan 3,3 V: no conectes sensores de 5 V directamente a sus pines.</div>
      <h2>Tu progreso</h2>
      <div class="progreso-barra"><div style="width:${Math.round(hechas / total * 100)}%"></div></div>
      <p>${hechas} de ${total} lecciones completadas.</p>
      <h2>Módulos</h2>
      <div class="tarjetas">
        ${MODULOS.map(m => {
          const ls = leccionesDeModulo(m.id);
          const h = ls.filter(l => completadas().has(l.id)).length;
          return `<a class="tarjeta" href="#/leccion/${ls[0].id}">
            <span class="etiqueta">${ls.length} lecciones</span>
            <strong>${esc(m.titulo)}</strong>
            <span>${esc(m.descripcion)}</span>
            <span class="estado">${h} completadas</span>
          </a>`;
        }).join('')}
      </div>
      <h2>Herramientas</h2>
      <div class="tarjetas">
        <a class="tarjeta" href="#/laboratorio"><strong>Laboratorio USB</strong><span>Conecta tu placa y usa el editor y el monitor serie.</span></a>
        <a class="tarjeta" href="#/proyectos"><strong>Biblioteca de proyectos</strong><span>Proyectos por niveles de dificultad.</span></a>
        <a class="tarjeta" href="#/diagnostico"><strong>Solución de problemas</strong><span>Qué hacer cuando algo no funciona.</span></a>
        <a class="tarjeta" href="#/retos"><strong>Retos</strong><span>Ejercicios con pistas progresivas.</span></a>
      </div>`;
  }

  function vistaModulo(id) {
    const m = moduloPorId(id);
    if (!m) return vistaNoEncontrada();
    return `<p class="migas"><a href="#/inicio">Inicio</a> › ${esc(m.titulo)}</p>
      <h1>${esc(m.titulo)}</h1><p>${esc(m.descripcion)}</p>
      <div class="tarjetas">${leccionesDeModulo(id).map(l => `
        <a class="tarjeta" href="${enlaceLeccion(l)}">
          <span class="etiqueta">${esc(l.nivel)} · ${l.minutos} min</span>
          <strong>${esc(l.titulo)}</strong><span>${esc(l.resumen)}</span>
          ${completadas().has(l.id) ? '<span class="estado">✓ completada</span>' : ''}
        </a>`).join('')}
      </div>`;
  }

  function vistaLeccion(id) {
    const l = leccionPorId(id);
    if (!l) return vistaNoEncontrada();
    const idx = LECCIONES.findIndex(x => x.id === id);
    const ant = LECCIONES[idx - 1];
    const sig = LECCIONES[idx + 1];
    const m = moduloPorId(l.modulo);
    const hecha = completadas().has(id);
    const tieneCodigo = /<pre class="codigo">/.test(l.cuerpo);
    const quizHtml = (l.quiz || []).map(q => `<div class="quiz" data-quiz='${JSON.stringify(q).replace(/'/g, '&#39;')}'></div>`).join('');
    return `
      <p class="migas"><a href="#/inicio">Inicio</a> › <a href="#/modulo/${m.id}">${esc(m.titulo)}</a> › ${esc(l.titulo)}</p>
      <h1>${esc(l.titulo)}</h1>
      <p class="pista">Nivel: ${esc(l.nivel)} · Tiempo aproximado: ${l.minutos} min</p>
      <p>${esc(l.resumen)}</p>
      <div class="acciones">
        ${tieneCodigo ? '<button type="button" class="secundario" id="btn-lab-leccion">Abrir primer ejemplo en el laboratorio</button>' : ''}
        <button type="button" id="btn-completar" aria-pressed="${hecha}">${hecha ? '✓ Completada (desmarcar)' : 'Marcar como completada'}</button>
      </div>
      ${l.cuerpo}
      <h2>Comprueba lo aprendido</h2>
      ${quizHtml || '<p class="pista">Esta lección no tiene cuestionario.</p>'}
      ${l.fuentes && l.fuentes.length ? `<h2>Fuentes</h2><ul>${l.fuentes.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
      <nav class="navegacion-lecciones" aria-label="Lecciones anterior y siguiente">
        ${ant ? `<a class="boton secundario" href="${enlaceLeccion(ant)}">← ${esc(ant.titulo)}</a>` : '<span></span>'}
        ${sig ? `<a class="boton" href="${enlaceLeccion(sig)}">${esc(sig.titulo)} →</a>` : '<span></span>'}
      </nav>`;
  }

  function vistaProyectos() {
    const niveles = [
      [1, 'Nivel 1 · Principiante'], [2, 'Nivel 2 · Básico-intermedio'], [3, 'Nivel 3 · Intermedio'], [4, 'Nivel 4 · Integrador IoT']
    ];
    return `<p class="migas"><a href="#/inicio">Inicio</a> › Proyectos</p>
      <h1>Biblioteca de proyectos</h1>
      <p>Cada proyecto indica materiales, conexiones, código, pruebas y problemas frecuentes. Los proyectos de nivel 3 se añadirán en versiones posteriores.</p>
      ${niveles.map(([n, t]) => {
        const ps = PROYECTOS.filter(p => p.nivel === n);
        if (!ps.length) return `<h2>${t}</h2><p class="pista">Próximamente.</p>`;
        return `<h2>${t}</h2><div class="tarjetas">${ps.map(p => `
          <a class="tarjeta" href="#/proyecto/${p.id}">
            <span class="etiqueta">${esc(p.dificultad)} · ${esc(p.tiempo)}</span>
            <strong>${esc(p.titulo)}</strong><span>${esc(p.problema)}</span>
          </a>`).join('')}</div>`;
      }).join('')}`;
  }

  function vistaProyecto(id) {
    const p = PROYECTOS.find(x => x.id === id);
    if (!p) return vistaNoEncontrada();
    return `<p class="migas"><a href="#/inicio">Inicio</a> › <a href="#/proyectos">Proyectos</a> › ${esc(p.titulo)}</p>
      <h1>${esc(p.titulo)}</h1>
      <p class="pista">Nivel ${p.nivel} · ${esc(p.dificultad)} · Tiempo aproximado: ${esc(p.tiempo)} · Placa: ${esc(p.placa)}</p>
      <h2>Problema que resuelve</h2><p>${esc(p.problema)}</p>
      <h2>Objetivo de aprendizaje</h2><p>${esc(p.objetivo)}</p>
      <h2>Materiales</h2><ul>${p.componentes.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
      <h2>Conexiones</h2>
      <div class="tabla-wrap"><table><thead><tr><th>Componente / pin</th><th>Conexión</th></tr></thead>
        <tbody>${p.conexiones.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}</tbody></table></div>
      ${p.codigo
        ? `<div class="acciones"><button type="button" class="secundario" id="btn-lab-proyecto" data-proyecto="${p.id}">Abrir en el laboratorio</button></div>
           <h2>Código</h2>${cod(p.codigo)}`
        : `<div class="caja advertencia"><strong>Código pendiente</strong>Este proyecto de diseño aún no tiene un programa verificado en esta plataforma.</div>`}
      <h2>Pruebas para comprobar</h2><ul>${p.pruebas.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <h2>Problemas frecuentes</h2><ul>${p.problemas.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <h2>Mejoras opcionales</h2><ul>${p.mejoras.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <h2>Fuentes</h2><p class="pista">${esc(p.fuentes)}</p>`;
  }

  function vistaDiagnostico() {
    return `<p class="migas"><a href="#/inicio">Inicio</a> › Solución de problemas</p>
      <h1>Solución de problemas</h1>
      <p>Sigue el orden: <strong>problema → causas probables → comprobaciones → solución</strong>. Empieza por lo más simple (cables, puerto, alimentación).</p>
      <div class="caja peligro"><strong>Seguridad</strong>Si notas calor excesivo, olor a quemado o humo, desconecta la alimentación de inmediato.</div>
      ${DIAGNOSTICO.map(d => `
        <details class="panel">
          <summary><strong>${esc(d.problema)}</strong></summary>
          <p><strong>Causas probables:</strong> ${esc(d.causas)}</p>
          <p><strong>Comprobaciones:</strong> ${esc(d.comprobaciones)}</p>
          <p><strong>Solución recomendada:</strong> ${esc(d.solucion)}</p>
        </details>`).join('')}`;
  }

  function vistaRetos() {
    return `<p class="migas"><a href="#/inicio">Inicio</a> › Retos</p>
      <h1>Retos y evaluación</h1>
      <p>Cada reto tiene pistas progresivas: pide una pista solo cuando la necesites.</p>
      ${RETOS.map((r, i) => `
        <div class="panel" data-reto="${i}">
          <h3>${esc(r.titulo)} <small class="pista">(${esc(r.nivel)})</small></h3>
          <p>${esc(r.enunciado)}</p>
          <div class="acciones"><button type="button" class="secundario btn-pista" data-i="${i}" data-n="0">Pista 1 de ${r.pistas.length}</button></div>
          <div class="pistas-mostradas"></div>
        </div>`).join('')}
      <h2>Evaluación por módulo</h2>
      <p>Los cuestionarios de cada lección dan retroalimentación inmediata. La evaluación por módulo se basa en esas preguntas: marca una lección como completada solo cuando comprendas su contenido.</p>`;
  }

  function vistaRecursos() {
    return `<p class="migas"><a href="#/inicio">Inicio</a> › Recursos</p>
      <h1>Recursos y fuentes</h1>
      <p>El material original que se revisó y cómo se usa en la plataforma. Detalle completo en <code>docs/INVENTARIO.md</code>.</p>
      <div class="tabla-wrap"><table><thead><tr><th>Documento (carpeta)</th><th>Uso en la plataforma</th></tr></thead><tbody>
        ${FUENTES_RESUMEN.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}
      </tbody></table></div>
      <h2>Recursos oficiales</h2>
      <ul>
        <li><a href="https://www.tinkercad.com/" target="_blank" rel="noopener">Tinkercad</a></li>
        <li>Documentación del Arduino IDE y del núcleo Arduino-ESP32 (fuente oficial de cada API usada en los ejemplos).</li>
      </ul>`;
  }

  function vistaNoEncontrada() {
    return `<h1>Página no encontrada</h1><p>Vuelve al <a href="#/inicio">inicio</a>.</p>`;
  }

  const FUENTES_RESUMEN = [
    ['Mundo Arduino (5 PDF, solo imágenes): 1 Arduino desde cero; 2 Programación; 3 Proyectos con sensores; 4 Robótica básica; 5 Proyectos avanzados', 'Módulos 1, 2, 4 y 5 (conceptos, programación, sensores, protoboard). Requirieron OCR.'],
    ['Robotica_IA: IA Educativa Tomo 3 (Arduino + PictoBlox), Aprende IA Jugando, IA para Casas Inteligentes', 'Módulos 1, 2, 4 (servo) y 7 (mención de IoT). PictoBlox no se enseña aquí.'],
    ['Coleccion_Completa_Robotica (PDF, texto)', 'Referencia de componentes y de proyectos. Sin copia de texto.'],
    ['MEGA_KIT / Gran Enciclopedia de componentes (PDF)', 'Vocabulario y clasificación de componentes (electrónicos, mecánicos, materiales).'],
    ['Guia-del-Pequeno-Inventor', 'Referencia general de creatividad; no se usa como base técnica.'],
    ['Robots_en_Movimiento_30_Proyectos (30 PDF)', 'Proyectos mecánicos y eléctricos sin microcontrolador: no incluidos en la biblioteca.'],
    ['50_retos_sin_pantallas_acceso (3 PDF)', 'Inspiración para retos sin computadora; no incluidos en la biblioteca.'],
    ['Espanol Elegoo: kit Smart Car (lecciones 0–5, 30 MB, PDF y .ino)', 'Módulo 9 (coche inteligente con Arduino UNO). Código propio; pines verificados con la tabla de cableado.'],
    ['PictoBlox-Setup-9.2.1.exe (instalador)', 'No se usa: es un instalador de software, no contenido.']
  ];

  /* ---------- Búsqueda ---------- */
  let indice = null;
  function construirIndice() {
    indice = [];
    LECCIONES.forEach(l => indice.push({ tipo: 'Lección', titulo: l.titulo, ruta: enlaceLeccion(l), texto: l.resumen + ' ' + textoPlano(l.cuerpo) }));
    PROYECTOS.forEach(p => indice.push({ tipo: 'Proyecto', titulo: p.titulo, ruta: '#/proyecto/' + p.id, texto: p.problema + ' ' + p.componentes.join(' ') }));
    DIAGNOSTICO.forEach(d => indice.push({ tipo: 'Solución', titulo: d.problema, ruta: '#/diagnostico', texto: d.causas + ' ' + d.solucion }));
    indice.forEach(e => { e.tituloN = e.titulo.toLowerCase(); e.textoN = (e.texto || '').toLowerCase(); });
  }

  function buscar(q) {
    const termino = q.trim().toLowerCase();
    const caja = $('#resultados');
    if (!termino) { caja.classList.remove('abierto'); caja.innerHTML = ''; return; }
    if (!indice) construirIndice();
    const palabras = termino.split(/\s+/);
    const hits = indice
      .map(e => {
        let puntos = 0;
        palabras.forEach(p => {
          if (e.tituloN.includes(p)) puntos += 5;
          if (e.textoN.includes(p)) puntos += 1;
        });
        return { e, puntos };
      })
      .filter(x => x.puntos > 0)
      .sort((a, b) => b.puntos - a.puntos)
      .slice(0, 10);
    caja.innerHTML = hits.length
      ? hits.map(h => `<a href="${h.e.ruta}" role="option"><strong>${esc(h.e.titulo)}</strong><small>${esc(h.e.tipo)}</small></a>`).join('')
      : `<div class="vacio">Sin resultados para «${esc(q)}». Prueba con «LED», «sensor», «ESP32» o «Wi-Fi».</div>`;
    caja.classList.add('abierto');
  }

  /* ---------- Enrutado ---------- */
  function rutaActual() {
    const h = (location.hash || '#/inicio').replace(/^#\/?/, '');
    return h.split('/').filter(Boolean);
  }

  function renderizar() {
    const [a, b] = rutaActual();
    const main = $('#vista');
    let html;
    let ruta = a || 'inicio';
    if (!a || a === 'inicio') { html = vistaInicio(); ruta = 'inicio'; }
    else if (a === 'modulo') { html = vistaModulo(b); ruta = 'modulo'; }
    else if (a === 'leccion') { html = vistaLeccion(b); ruta = 'leccion/' + b; }
    else if (a === 'proyectos') { html = vistaProyectos(); ruta = 'proyectos'; }
    else if (a === 'proyecto') { html = vistaProyecto(b); ruta = 'proyectos'; }
    else if (a === 'diagnostico') { html = vistaDiagnostico(); ruta = 'diagnostico'; }
    else if (a === 'retos') { html = vistaRetos(); ruta = 'retos'; }
    else if (a === 'recursos') { html = vistaRecursos(); ruta = 'recursos'; }
    else if (a === 'tinkercad') { location.hash = '#/leccion/m8-tinkercad'; return; }
    else if (a === 'laboratorio') {
      html = '<div id="lab-raiz"></div>';
      ruta = 'laboratorio';
    }
    else { html = vistaNoEncontrada(); }

    main.innerHTML = html;
    marcarMenuActivo(ruta === 'modulo' ? 'inicio' : ruta);
    if (ruta.startsWith('leccion/')) marcarMenuActivo(ruta);
    anadirBotonesCopiar(main);
    montarQuiz(main);
    enlazarVista(a, b);
    if (a === 'laboratorio' && typeof window.montarLaboratorio === 'function') {
      window.montarLaboratorio($('#lab-raiz'));
    }
    pintarProgreso();
    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
    cerrarMenuMovil();
  }

  function enlazarVista(a, b) {
    const btnCompletar = $('#btn-completar');
    if (btnCompletar) {
      btnCompletar.addEventListener('click', () => {
        const hecha = !completadas().has(b);
        marcar(b, hecha);
        btnCompletar.setAttribute('aria-pressed', String(hecha));
        btnCompletar.textContent = hecha ? '✓ Completada (desmarcar)' : 'Marcar como completada';
      });
    }
    const btnLabLeccion = $('#btn-lab-leccion');
    if (btnLabLeccion) {
      btnLabLeccion.addEventListener('click', () => {
        const pre = $('#vista pre.codigo code');
        if (pre) escribir(CLAVE_LAB, pre.textContent);
        location.hash = '#/laboratorio';
      });
    }
    const btnLabProyecto = $('#btn-lab-proyecto');
    if (btnLabProyecto) {
      btnLabProyecto.addEventListener('click', () => {
        const p = PROYECTOS.find(x => x.id === btnLabProyecto.getAttribute('data-proyecto'));
        if (p && p.codigo) escribir(CLAVE_LAB, p.codigo);
        location.hash = '#/laboratorio';
      });
    }
    $$('.btn-pista').forEach(btn => btn.addEventListener('click', () => {
      const i = Number(btn.getAttribute('data-i'));
      const reto = RETOS[i];
      const n = Number(btn.getAttribute('data-n'));
      if (n < reto.pistas.length) {
        const p = document.createElement('p');
        p.className = 'pista';
        p.textContent = 'Pista ' + (n + 1) + ': ' + reto.pistas[n];
        btn.closest('[data-reto]').querySelector('.pistas-mostradas').appendChild(p);
        const siguiente = n + 1;
        btn.setAttribute('data-n', String(siguiente));
        btn.textContent = siguiente < reto.pistas.length ? `Pista ${siguiente + 1} de ${reto.pistas.length}` : 'Sin más pistas';
        if (siguiente >= reto.pistas.length) btn.disabled = true;
      }
    }));
  }

  /* ---------- Menú móvil ---------- */
  function cerrarMenuMovil() {
    const m = $('#menu');
    if (m) m.classList.remove('abierto');
    const b = $('#btn-menu');
    if (b) b.setAttribute('aria-expanded', 'false');
  }

  /* ---------- Tema ---------- */
  function aplicarTema(t) {
    if (t === 'claro' || t === 'oscuro') document.documentElement.setAttribute('data-theme', t === 'claro' ? 'light' : 'dark');
  }
  function alternarTema() {
    const actual = document.documentElement.getAttribute('data-theme');
    const esOscuro = actual === 'dark' || (!actual && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const nuevo = esOscuro ? 'claro' : 'oscuro';
    escribir(CLAVE_TEMA, nuevo);
    aplicarTema(nuevo);
  }

  /* ---------- Arranque ---------- */
  function iniciar() {
    aplicarTema(leer(CLAVE_TEMA, null));
    pintarMenu();

    $('#btn-tema').addEventListener('click', alternarTema);
    $('#btn-menu').addEventListener('click', () => {
      const m = $('#menu');
      const abierto = m.classList.toggle('abierto');
      $('#btn-menu').setAttribute('aria-expanded', String(abierto));
    });
    $('#btn-reiniciar-progreso').addEventListener('click', (e) => {
      e.preventDefault();
      if (!confirm('¿Borrar el progreso guardado en este navegador?')) return;
      escribir(CLAVE_PROGRESO, []);
      renderizar();
    });

    const campo = $('#buscar');
    campo.addEventListener('input', () => buscar(campo.value));
    campo.addEventListener('keydown', (e) => { if (e.key === 'Escape') { campo.value = ''; buscar(''); } });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.buscador')) { const r = $('#resultados'); r.classList.remove('abierto'); }
    });
    campo.addEventListener('blur', () => setTimeout(() => $('#resultados').classList.remove('abierto'), 200));

    window.addEventListener('hashchange', () => { $('#buscar').value = ''; renderizar(); });
    renderizar();
  }

  /* Expuesto para laboratorio.js */
  window.IoTPlataforma = { esc, copiarTexto, escribir, leer, CLAVE_LAB };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
