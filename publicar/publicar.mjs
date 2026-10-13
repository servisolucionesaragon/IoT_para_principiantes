// Publica IoT para Principiantes en Cloudflare Workers:
// https://iot-para-principiantes.servisolucionesti.workers.dev/
//
// Uso (desde la carpeta publicar):
//     node publicar.mjs            publica
//     node publicar.mjs --probar   solo valida, no sube nada
//
// Qué hace:
//  1. Copia SOLO index.html, css/ y js/ de la carpeta del proyecto a ./sitio.
//     No se publican README.md, docs/, .git ni publicar/.
//  2. Ejecuta `cf deploy` (Worker "iot-para-principiantes", plan gratuito).
//  3. Comprueba que la página principal responde en internet.
// Requisitos: `cf` con sesión iniciada (cf auth login).
import { cpSync, rmSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const ORIGEN = join(AQUI, "..");
const DESTINO = join(AQUI, "sitio");
const PUBLICAR = ["index.html", "css", "js"];
const URL_SITIO = "https://iot-para-principiantes.servisolucionesti.workers.dev/";
const probar = process.argv.includes("--probar");

rmSync(DESTINO, { recursive: true, force: true });
mkdirSync(DESTINO);
for (const nombre of PUBLICAR) cpSync(join(ORIGEN, nombre), join(DESTINO, nombre), { recursive: true });
const contar = d => readdirSync(d).reduce((n, f) => { const p = join(d, f); return n + (statSync(p).isDirectory() ? contar(p) : 1); }, 0);
console.log(`Sitio preparado: ${contar(DESTINO)} archivos en ${DESTINO}`);

const r = spawnSync("cf deploy" + (probar ? " --dry-run" : ""), { cwd: AQUI, shell: true, stdio: ["ignore", "inherit", "inherit"] });
if (r.status !== 0) process.exit(r.status ?? 1);

if (!probar) {
  const res = await fetch(URL_SITIO);
  console.log(`${URL_SITIO} -> HTTP ${res.status}`);
  if (!res.ok) process.exit(1);
}
