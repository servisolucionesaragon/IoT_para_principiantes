/* Laboratorio USB (versión 1): conexión por Web Serial, monitor serie y editor.
   Compilar y cargar el firmware NO están implementados todavía (ver docs/CONTEXTO.md y README).
   Solo se muestra "conectado" cuando el navegador confirma que el puerto se abrió. */

(function () {
  'use strict';

  const E = () => window.IoTPlataforma;

  const EJEMPLOS = {
    'Parpadeo (Arduino UNO, LED en pin 13)': `const int PIN_LED = 13;

void setup() {
  pinMode(PIN_LED, OUTPUT);
  Serial.begin(9600);
  Serial.println("Hola desde Arduino");
}

void loop() {
  digitalWrite(PIN_LED, HIGH);
  delay(500);
  digitalWrite(PIN_LED, LOW);
  delay(500);
}
`,
    'Eco de texto (monitor serie)': `void setup() {
  Serial.begin(9600);
  Serial.println("Escribe algo y pulsa Enviar");
}

void loop() {
  if (Serial.available() > 0) {
    String texto = Serial.readStringUntil('\\n');
    Serial.print("Recibido: ");
    Serial.println(texto);
  }
}
`,
    'Lectura analógica A0': `void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println(analogRead(A0));
  delay(200);
}
`
  };

  const VELOCIDADES = [9600, 115200];

  // Pistas de identificación por identificador USB (sin asumir la placa).
  const POSIBLES_CHIPS = {
    '0x2341': 'Placa Arduino oficial (posible)',
    '0x2a03': 'Placa Arduino (posible)',
    '0x1a86': 'Chip CH340 (muy común en clones)',
    '0x10c4': 'Chip CP210x (común en ESP32)',
    '0x0403': 'Chip FTDI',
    '0x303a': 'Espressif (ESP32 con USB nativo, posible)'
  };

  function soportado() { return 'serial' in navigator && window.isSecureContext; }

  function montarLaboratorio(raiz) {
    const { esc, escribir, leer, CLAVE_LAB } = E();
    if (!raiz) return;

    if (!soportado()) {
      raiz.innerHTML = `
        <h1>Laboratorio USB</h1>
        <div class="caja advertencia"><strong>Tu navegador no permite usar el puerto USB aquí</strong>
          Necesitas Google Chrome o Microsoft Edge de escritorio, abrir la plataforma en <code>https://</code> o en <code>localhost</code>.
          Si no puedes, usa el <strong>Arduino IDE</strong> para cargar los programas de esta plataforma.</div>
        <p>Puedes seguir leyendo el editor de código sin conexión, pero sin el puerto no se puede enviar nada a la placa.</p>
        ${editorHtml()}`;
      conectarEditor(raiz);
      return;
    }

    raiz.innerHTML = `
      <h1>Laboratorio USB: programa tu placa desde el navegador</h1>
      <p>Sigue los pasos en orden. Cada paso te dice qué hacer a continuación.</p>
      <ol class="pasos" id="pasos">
        <li data-paso="1" class="actual"><strong>1. Conecta tu placa</strong><br>Usa un cable USB que transmita datos (no un cable solo de carga).</li>
        <li data-paso="2"><strong>2. Elige el puerto</strong><br>Pulsa «Seleccionar puerto» y elige tu placa en el cuadro del navegador.</li>
        <li data-paso="3"><strong>3. Velocidad</strong><br>Debe coincidir con <code>Serial.begin()</code> de tu programa.</li>
        <li data-paso="4"><strong>4. Escribe o elige un ejemplo</strong><br>Edita el código en el editor.</li>
        <li data-paso="5"><strong>5. Compilar y cargar</strong><br>Pendiente en esta versión: usa el Arduino IDE por ahora.</li>
        <li data-paso="6"><strong>6. Comprueba</strong><br>Lee el monitor serie y compara con lo esperado.</li>
      </ol>

      <div class="panel">
        <p><span class="estado-punto" id="punto"></span><strong id="estado-texto">Desconectado</strong></p>
        <p class="pista" id="info-puerto">Ningún puerto seleccionado.</p>
        <div class="acciones">
          <button type="button" id="btn-puerto">Seleccionar puerto</button>
          <label>Velocidad:
            <select id="velocidad">${VELOCIDADES.map(v => `<option value="${v}">${v} baudios</option>`).join('')}</select>
          </label>
          <button type="button" class="secundario" id="btn-desconectar" disabled>Desconectar de forma segura</button>
        </div>
        <div class="caja advertencia" id="aviso-reset" hidden><strong>Ten en cuenta</strong>Al abrir el puerto, muchas placas Arduino se reinician. El programa que tengan cargado volverá a empezar.</div>
        <div class="caja consejo"><strong>Si la placa no aparece</strong>Prueba otro cable de datos y otro puerto USB; instala el driver CH340 o CP210x del fabricante del clon; cierra el Arduino IDE u otros programas que usen el puerto.</div>
      </div>

      ${editorHtml()}

      <div class="panel">
        <div class="acciones">
          <button type="button" class="secundario" disabled title="Pendiente en esta versión">Validar código (pendiente)</button>
          <button type="button" class="secundario" disabled title="Pendiente en esta versión">Compilar (pendiente)</button>
          <button type="button" class="secundario" disabled title="Pendiente en esta versión">Cargar a la placa (pendiente)</button>
        </div>
        <p class="pista">Compilar y cargar requieren un compilador y un cargador que se ejecuten en el navegador. Esta versión no los incluye todavía; por ahora carga el programa con el Arduino IDE.</p>
      </div>

      <h2>Monitor serie</h2>
      <div class="panel">
        <div class="consola" id="consola" aria-live="polite" role="log"></div>
        <form class="linea-entrada" id="form-envio">
          <label class="sr-only" for="entrada">Texto a enviar</label>
          <input id="entrada" type="text" placeholder="Escribe un comando y pulsa Enviar" autocomplete="off" disabled>
          <button type="submit" id="btn-enviar" disabled>Enviar</button>
          <button type="button" class="secundario" id="btn-limpiar">Limpiar</button>
        </form>
      </div>`;

    conectarEditor(raiz);
    conectarLaboratorio(raiz);
  }

  function editorHtml() {
    return `
      <h2>Editor de código</h2>
      <div class="panel">
        <div class="acciones">
          <label>Ejemplo:
            <select id="ejemplo">
              <option value="">— elegir —</option>
              ${Object.keys(EJEMPLOS).map(k => `<option value="${esc(k)}">${esc(k)}</option>`).join('')}
            </select>
          </label>
          <button type="button" class="secundario" id="btn-copiar-editor">Copiar código</button>
          <button type="button" class="secundario" id="btn-borrar-editor">Vaciar</button>
        </div>
        <label class="sr-only" for="editor">Editor de código</label>
        <textarea id="editor" class="editor" spellcheck="false" aria-label="Editor de código"></textarea>
      </div>`;
  }

  function conectarEditor(raiz) {
    const { copiarTexto, escribir, leer, CLAVE_LAB } = E();
    const editor = raiz.querySelector('#editor');
    const pendiente = leer(CLAVE_LAB, null);
    editor.value = pendiente !== null ? pendiente : EJEMPLOS['Parpadeo (Arduino UNO, LED en pin 13)'];
    if (pendiente !== null) escribir(CLAVE_LAB, null);
    // tab inserta espacios en lugar de cambiar de campo
    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = editor.selectionStart;
        editor.value = editor.value.slice(0, s) + '  ' + editor.value.slice(editor.selectionEnd);
        editor.selectionStart = editor.selectionEnd = s + 2;
      }
    });
    raiz.querySelector('#ejemplo').addEventListener('change', (e) => {
      const txt = EJEMPLOS[e.target.value];
      if (txt) editor.value = txt;
    });
    raiz.querySelector('#btn-copiar-editor').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      copiarTexto(editor.value).then(() => {
        btn.textContent = '✓ ¡Copiado!';
        setTimeout(() => { btn.textContent = 'Copiar código'; }, 2000);
      }).catch(() => { editor.select(); btn.textContent = 'Selecciona y copia (Ctrl+C)'; });
    });
    raiz.querySelector('#btn-borrar-editor').addEventListener('click', () => { editor.value = ''; });
  }

  function conectarLaboratorio(raiz) {
    const estado = { puerto: null, lector: null, escritor: null, conectado: false };
    const consola = raiz.querySelector('#consola');
    const ui = {
      punto: raiz.querySelector('#punto'),
      texto: raiz.querySelector('#estado-texto'),
      info: raiz.querySelector('#info-puerto'),
      btnPuerto: raiz.querySelector('#btn-puerto'),
      btnDesc: raiz.querySelector('#btn-desconectar'),
      vel: raiz.querySelector('#velocidad'),
      reset: raiz.querySelector('#aviso-reset'),
      entrada: raiz.querySelector('#entrada'),
      btnEnviar: raiz.querySelector('#btn-enviar'),
      form: raiz.querySelector('#form-envio')
    };

    function log(linea, tipo) {
      const div = document.createElement('div');
      if (tipo === 'sistema') div.style.color = 'var(--acento)';
      if (tipo === 'error') div.style.color = '#ff8a8f';
      div.textContent = linea;
      consola.appendChild(div);
      consola.scrollTop = consola.scrollHeight;
    }

    function pintar(conectado, mensaje) {
      estado.conectado = conectado;
      ui.punto.className = 'estado-punto ' + (conectado ? 'on' : '');
      ui.texto.textContent = mensaje;
      ui.btnDesc.disabled = !conectado;
      ui.entrada.disabled = !conectado;
      ui.btnEnviar.disabled = !conectado;
      ui.btnPuerto.textContent = conectado ? 'Cambiar puerto' : 'Seleccionar puerto';
      const pasos = raiz.querySelectorAll('#pasos li');
      pasos.forEach((li, i) => {
        li.classList.toggle('hecho', conectado ? i < 2 : false);
        li.classList.toggle('actual', conectado ? i === 3 : i === 0);
      });
    }

    function descripcionPuerto(port) {
      try {
        const info = port.getInfo();
        if (info && info.usbVendorId) {
          const vid = '0x' + info.usbVendorId.toString(16).padStart(4, '0');
          const pista = POSIBLES_CHIPS[vid] || 'Dispositivo USB desconocido';
          return `Identificador USB ${vid}: ${pista}. Esto es solo una pista; confirma el modelo tú mismo.`;
        }
      } catch (e) { /* algunos navegadores no informan */ }
      return 'Puerto serie seleccionado. El navegador no informa el modelo de la placa.';
    }

    async function leerBucle(port) {
      const decoder = new TextDecoderStream();
      port.readable.pipeTo(decoder.writable).catch(() => {});
      const reader = decoder.readable.getReader();
      estado.lector = reader;
      let acumulado = '';
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) {
            acumulado += value;
            let idx;
            while ((idx = acumulado.indexOf('\n')) >= 0) {
              const linea = acumulado.slice(0, idx).replace(/\r$/, '');
              acumulado = acumulado.slice(idx + 1);
              log(linea);
            }
          }
        }
      } catch (e) {
        log('Error de lectura: ' + (e && e.message ? e.message : e), 'error');
      } finally {
        try { reader.releaseLock(); } catch (e) { /* ya liberado */ }
      }
    }

    async function conectar() {
      try {
        const port = await navigator.serial.requestPort();
        const baud = Number(ui.vel.value);
        await port.open({ baudRate: baud });
        estado.puerto = port;
        estado.escritor = port.writable.getWriter();
        ui.info.textContent = descripcionPuerto(port) + ` Velocidad: ${baud} baudios.`;
        ui.reset.hidden = false;
        pintar(true, 'Puerto abierto (la comunicación se verifica al recibir datos)');
        log(`Puerto abierto a ${baud} baudios.`, 'sistema');
        leerBucle(port);
      } catch (err) {
        const msg = err && err.name === 'NotFoundError'
          ? 'No seleccionaste ningún puerto.'
          : (err && err.name === 'NetworkError'
            ? 'El puerto está ocupado. Cierra el Arduino IDE u otro programa que lo use.'
            : 'No se pudo abrir el puerto: ' + (err && err.message ? err.message : err));
        pintar(false, 'Desconectado');
        log(msg, 'error');
      }
    }

    async function desconectar() {
      try {
        if (estado.lector) await estado.lector.cancel();
        if (estado.escritor) { estado.escritor.releaseLock(); estado.escritor = null; }
        if (estado.puerto) await estado.puerto.close();
        log('Desconectado de forma segura.', 'sistema');
      } catch (err) {
        log('Aviso al desconectar: ' + (err && err.message ? err.message : err), 'error');
      } finally {
        estado.puerto = null; estado.lector = null;
        pintar(false, 'Desconectado');
        ui.info.textContent = 'Ningún puerto seleccionado.';
        ui.reset.hidden = true;
      }
    }

    ui.btnPuerto.addEventListener('click', async () => {
      if (estado.conectado) await desconectar();
      conectar();
    });
    ui.btnDesc.addEventListener('click', desconectar);
    raiz.querySelector('#btn-limpiar').addEventListener('click', () => { consola.textContent = ''; });
    ui.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const texto = ui.entrada.value;
      if (!texto || !estado.escritor) return;
      try {
        await estado.escritor.write(new TextEncoder().encode(texto + '\n'));
        log('> ' + texto, 'sistema');
        ui.entrada.value = '';
      } catch (err) {
        log('No se pudo enviar: ' + (err && err.message ? err.message : err), 'error');
      }
    });
    window.addEventListener('beforeunload', () => { if (estado.puerto) desconectar(); });
    pintar(false, 'Desconectado');
    log('Listo. Pulsa «Seleccionar puerto» cuando tu placa esté conectada.', 'sistema');
  }

  window.montarLaboratorio = montarLaboratorio;
})();
