#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>

// ====== CONFIGURACION (reemplaza estos valores; no subas tus claves) ======
const char* WIFI_SSID = "TU_RED_WIFI";
const char* WIFI_PASS = "TU_CLAVE_WIFI";
const char* FB_HOST   = "TU-PROYECTO-default-rtdb.firebaseio.com"; // sin https://
const char* FB_AUTH   = "";  // opcional: token si activas reglas con autenticacion
// ===========================

// Pines ESP32 (SPI por defecto VSPI)
#define PIN_SCK   18
#define PIN_MISO  19
#define PIN_MOSI  23
#define SS_PIN    5    // SDA del RC522
#define RST_PIN   22
#define BUZZER    4
#define ACTIVO_BAJO false  // false = suena con HIGH. Pon true si suena con LOW

MFRC522 rfid(SS_PIN, RST_PIN);
WiFiClientSecure client;

void beep(int veces, int dur) {
  for (int i = 0; i < veces; i++) {
    digitalWrite(BUZZER, ACTIVO_BAJO ? LOW : HIGH);  delay(dur);
    digitalWrite(BUZZER, ACTIVO_BAJO ? HIGH : LOW);  delay(dur);
  }
}

// Peticion HTTPS a Firebase. Devuelve el cuerpo de la respuesta o "ERROR".
String fbRequest(const char* metodo, String ruta, String cuerpo = "") {
  String url = "/" + ruta + ".json";
  if (strlen(FB_AUTH) > 0) url += "?auth=" + String(FB_AUTH);

  if (!client.connect(FB_HOST, 443)) return "ERROR";
  client.print(String(metodo) + " " + url + " HTTP/1.0\r\n");
  client.print(String("Host: ") + FB_HOST + "\r\n");
  client.print("Content-Type: application/json\r\n");
  client.print("Content-Length: " + String(cuerpo.length()) + "\r\n");
  client.print("Connection: close\r\n\r\n");
  client.print(cuerpo);

  unsigned long t = millis();
  String resp = "";
  while (millis() - t < 8000 && (client.connected() || client.available())) {
    while (client.available()) resp += (char)client.read();
    delay(1);
  }
  client.stop();

  int i = resp.indexOf("\r\n\r\n");
  if (i < 0) return "ERROR";
  String cuerpoResp = resp.substring(i + 4);
  cuerpoResp.trim();
  return cuerpoResp;
}

// Quita las comillas de un valor JSON de tipo texto
String limpiar(String s) {
  s.replace("\"", "");
  s.trim();
  return s;
}

String leerUID() {
  String uid = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) uid += "0";
    uid += String(rfid.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();
  return uid;
}

void conectarWiFi() {
  Serial.print("Conectando a WiFi");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nWiFi OK. IP: " + WiFi.localIP().toString());
}

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER, OUTPUT);
  digitalWrite(BUZZER, ACTIVO_BAJO ? HIGH : LOW); // arranca en silencio
  SPI.begin(PIN_SCK, PIN_MISO, PIN_MOSI, SS_PIN);
  rfid.PCD_Init();
  client.setInsecure();   // no valida el certificado (suficiente para el proyecto escolar)
  conectarWiFi();
  Serial.println("Listo. Acerca una tarjeta...");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) conectarWiFi();

  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  String uid = leerUID();
  Serial.println("Tarjeta: " + uid);
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();

  String nombre = limpiar(fbRequest("GET", "estudiantes/" + uid + "/nombre"));

  if (nombre == "ERROR") {
    Serial.println("Error de conexion con Firebase");
    beep(3, 300);
  } else if (nombre == "null" || nombre == "") {
    // Tarjeta desconocida: queda pendiente para asignarla desde la web
    fbRequest("PUT", "pendientes/" + uid, "{\"ts\":{\".sv\":\"timestamp\"}}");
    Serial.println("Tarjeta nueva, pendiente de asignar");
    beep(2, 400);
  } else {
    String documento = limpiar(fbRequest("GET", "estudiantes/" + uid + "/documento"));
    String estado = fbRequest("GET", "abierto/" + uid);
    bool estabaDentro = (estado == "true");
    String tipo = estabaDentro ? "salida" : "entrada";

    String reg = "{\"uid\":\"" + uid + "\",\"nombre\":\"" + nombre +
                 "\",\"documento\":\"" + documento + "\",\"tipo\":\"" + tipo +
                 "\",\"ts\":{\".sv\":\"timestamp\"}}";
    fbRequest("POST", "registros", reg);
    fbRequest("PUT", "abierto/" + uid, estabaDentro ? "false" : "true");

    Serial.println(nombre + " -> " + tipo);
    beep(estabaDentro ? 2 : 1, 120);
  }

  delay(2000); // evita lecturas repetidas
}