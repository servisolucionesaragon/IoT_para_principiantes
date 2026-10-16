/* Videos del curso (YouTube). Se insertan con el reproductor oficial dentro de la lección
   correspondiente. Los videos son de sus autores: aquí solo se enlazan y se reproducen. */

const VIDEOS_CURSO = [
  { id: 'YCqzrAaYn6Y', titulo: '¿Qué es un Arduino?', leccion: 'm2-que-es-arduino' },
  { id: 'Zs9MZosVuqo', titulo: 'Arduino: qué es, cómo funciona y para qué se puede utilizar', leccion: 'm2-que-es-arduino' },
  { id: 'BBSjRQYtOXk', titulo: 'Partes de la placa Arduino UNO explicadas', leccion: 'm2-que-es-arduino' },
  { id: 'DbOxS5TpYAI', titulo: '10 primeros pasos para programar Arduino desde cero', leccion: 'm2-primer-programa' },
  { id: 'V0jOKsjeBWQ', titulo: 'Sensores con Arduino: gas, infrarrojos, luz, IMU, distancia, color y magnetismo', leccion: 'm4-potenciometro-ldr' },
  { id: 'azFFLbQvsRc', titulo: 'ESP32 PWM: cómo funciona y cómo usarlo', leccion: 'm3-esp32-programa' }
];

function bloqueVideo(v) {
  return `<h2>Video: ${esc(v.titulo)}</h2>
    <div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${v.id}" title="${esc(v.titulo)}" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
    <p class="pista">Video externo de YouTube: <a href="https://youtu.be/${v.id}" target="_blank" rel="noopener">abrir en YouTube</a>.</p>`;
}

VIDEOS_CURSO.forEach(v => {
  const l = LECCIONES.find(x => x.id === v.leccion);
  if (!l || l.cuerpo.indexOf('<h2>Fuentes</h2>') < 0) return;
  l.cuerpo = l.cuerpo.replace('<h2>Fuentes</h2>', bloqueVideo(v) + '<h2>Fuentes</h2>');
});
