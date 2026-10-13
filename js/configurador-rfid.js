/* Configurador del proyecto de control de acceso RFID.
   Toma las plantillas públicas (plantillas/rfid/*.txt) y reemplaza la red WiFi, la clave,
   la URL de Firebase y la lógica del buzzer. Todo ocurre en el navegador: nada se envía
   a un servidor ni se guarda en la plataforma. */

const CONFIG_RFID = { plantillas: {}, ultimo: null };

/* Escapa una cadena para ponerla entre comillas en C/C++ */
function escCadenaC(t) {
  return String(t).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\r\n]/g, '');
}

/* Quita https:// y la barra final de una URL */
function hostDesdeUrl(url) {
  return String(url).trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
}

async function cargarPlantillaRfid(nombre) {
  if (CONFIG_RFID.plantillas[nombre]) return CONFIG_RFID.plantillas[nombre];
  const r = await fetch('plantillas/rfid/' + nombre + '.txt');
  if (!r.ok) throw new Error('No se pudo cargar la plantilla ' + nombre + '.');
  CONFIG_RFID.plantillas[nombre] = await r.text();
  return CONFIG_RFID.plantillas[nombre];
}

/* Reemplaza los valores configurables de un .ino (ESP32 o Arduino R4) */
function generarIno(plantilla, c) {
  let s = plantilla;
  s = s.replace(/const char\* WIFI_SSID\s*=\s*"[^"]*";/, 'const char* WIFI_SSID = "' + escCadenaC(c.ssid) + '";');
  s = s.replace(/const char\* WIFI_PASS\s*=\s*"[^"]*";/, 'const char* WIFI_PASS = "' + escCadenaC(c.clave) + '";');
  s = s.replace(/const char\* FB_HOST\s*=\s*"[^"]*";/, 'const char* FB_HOST   = "' + escCadenaC(c.host) + '";');
  s = s.replace(/#define ACTIVO_BAJO \w+/, '#define ACTIVO_BAJO ' + (c.activoBajo ? 'true' : 'false'));
  return s;
}

/* Reemplaza la URL de Firebase en index.html */
function generarIndex(plantilla, url) {
  return plantilla.replace(/const DB_URL = "[^"]*";/, 'const DB_URL = "' + escCadenaC('https://' + url) + '";');
}

function vistaConfiguradorRfid() {
  return `<p class="migas"><a href="#/inicio">Inicio</a> › <a href="#/proyecto/acceso-rfid-nube">Control de acceso RFID</a> › Configurador</p>
    <h1>Configurador del control de acceso RFID</h1>
    <p>Escribe los datos de tu red WiFi y de tu base de Firebase. La plataforma genera el código de tu placa y la página <code>index.html</code> con esos datos, listos para descargar.</p>
    <div class="caja advertencia"><strong>Privacidad</strong>Todo ocurre en tu navegador: los datos no se envían a ningún servidor y no se guardan en la plataforma. El archivo que descargues sí contiene tu clave WiFi: no lo subas a internet ni lo compartas.</div>
    <form id="cfg-rfid" class="panel" autocomplete="off">
      <div style="display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
        <label>Placa
          <select id="cfg-placa"><option value="esp32">ESP32 DevKit</option><option value="r4">Arduino UNO R4 WiFi</option></select>
        </label>
        <label>Nombre de la red WiFi (SSID)
          <input id="cfg-ssid" required maxlength="32" placeholder="Ej.: MiRed">
        </label>
        <label>Clave de la red WiFi
          <input id="cfg-clave" type="password" placeholder="Clave de tu red">
        </label>
        <label>URL de Firebase (Realtime Database)
          <input id="cfg-url" required placeholder="https://mi-proyecto-default-rtdb.firebaseio.com">
        </label>
        <label>El buzzer suena con…
          <select id="cfg-buzzer"><option value="false">HIGH (lo habitual)</option><option value="true">LOW (si tu buzzer suena al revés)</option></select>
        </label>
      </div>
      <p id="cfg-error" class="vacio" role="alert"></p>
      <div class="acciones"><button type="submit">Generar código</button></div>
    </form>
    <div id="cfg-resultado" hidden>
      <h2>Código de la placa</h2>
      <p id="cfg-nombre-ino" class="vacio"></p>
      <div class="acciones">
        <button type="button" id="cfg-copiar-ino" class="secundario">Copiar código</button>
        <button type="button" id="cfg-descargar-ino">Descargar .ino</button>
      </div>
      <pre class="codigo"><code id="cfg-codigo"></code></pre>
      <h2>Página web (index.html)</h2>
      <p>Descarga la página ya configurada con tu URL de Firebase.</p>
      <div class="acciones"><button type="button" id="cfg-descargar-html">Descargar index.html</button></div>
    </div>`;
}

function enlazarConfiguradorRfid() {
  const form = document.getElementById('cfg-rfid');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = document.getElementById('cfg-error');
    err.textContent = '';
    const ssid = document.getElementById('cfg-ssid').value.trim();
    const clave = document.getElementById('cfg-clave').value;
    const url = document.getElementById('cfg-url').value.trim();
    const host = hostDesdeUrl(url);
    if (!ssid) { err.textContent = 'Escribe el nombre de tu red WiFi.'; return; }
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*\.(firebaseio\.com|firebasedatabase\.app)$/i.test(host)) {
      err.textContent = 'La URL no parece de Firebase Realtime Database: debe terminar en firebaseio.com o firebasedatabase.app.';
      return;
    }
    const placa = document.getElementById('cfg-placa').value;
    const activoBajo = document.getElementById('cfg-buzzer').value === 'true';
    try {
      const plantilla = placa === 'esp32' ? 'esp32' : 'arduino-r4';
      const nombre = placa === 'esp32' ? 'esp32.ino' : 'arduino-r4.ino';
      const codigo = generarIno(await cargarPlantillaRfid(plantilla), { ssid, clave, host, activoBajo });
      document.getElementById('cfg-codigo').textContent = codigo;
      document.getElementById('cfg-nombre-ino').textContent = 'Archivo: ' + nombre + ' (abre con el Arduino IDE y súbelo a la placa).';
      document.getElementById('cfg-resultado').hidden = false;
      CONFIG_RFID.ultimo = { nombre, codigo, host };
    } catch (ex) {
      err.textContent = 'Error: ' + ex.message;
    }
  });

  const descargar = (nombre, texto, tipo) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([texto], { type: tipo }));
    a.download = nombre;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  document.getElementById('cfg-copiar-ino').addEventListener('click', (e) => {
    const texto = CONFIG_RFID.ultimo ? CONFIG_RFID.ultimo.codigo : '';
    window.IoTPlataforma.copiarTexto(texto).then(() => {
      e.currentTarget.textContent = '✓ ¡Copiado!';
      setTimeout(() => { e.currentTarget.textContent = 'Copiar código'; }, 2000);
    });
  });

  document.getElementById('cfg-descargar-ino').addEventListener('click', () => {
    if (CONFIG_RFID.ultimo) descargar(CONFIG_RFID.ultimo.nombre, CONFIG_RFID.ultimo.codigo, 'text/plain;charset=utf-8');
  });

  document.getElementById('cfg-descargar-html').addEventListener('click', async () => {
    if (!CONFIG_RFID.ultimo) return;
    const html = generarIndex(await cargarPlantillaRfid('index'), CONFIG_RFID.ultimo.host);
    descargar('index.html', html, 'text/html;charset=utf-8');
  });
}
