// Publicación de IoT para Principiantes en Cloudflare Workers (solo archivos estáticos, plan gratuito).
// URL: https://iot-para-principiantes.servisolucionesti.workers.dev/
// Publicar (desde esta carpeta):  node publicar.mjs   (equivale a: cf deploy)
export default {
  accountId: "fd0f690f5092f930047c35d0084cb507", // cuenta Servisolucionesti@gmail.com (plan gratuito)
  worker: {
    name: "iot-para-principiantes",
    compatibilityDate: "2026-10-06",
  },
};
