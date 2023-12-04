#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

#include <uri/UriBraces.h>
#include <uri/UriRegex.h>

// #include <Arduino.h>

#ifndef STASSID
#define STASSID ""
#define STAPSK ""
#endif

const char *ssid = STASSID;
const char *password = STAPSK;
// 2 is led
// 0 and 16 are high at boot
const int pins[] = { 16, 14, 12, 13, 15, 0, 4, 5, 2 };

struct request {
  int pin;
  float delaySec;
};

request requests[10];
int requestPinsCount = 0;

ESP8266WebServer server(80);

void setup() {
  for (int i = 0; i <= sizeof(pins); i++) {
    pinMode(pins[i], OUTPUT);
  }

  digitalWrite(0, HIGH);
  digitalWrite(16, HIGH);

  Serial.begin(74880);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp8266")) { Serial.println("MDNS responder started"); }

  server.on(UriBraces("/api/pump/{}/seconds/{}"), []() {
    parseRequest(server.pathArg(0), server.pathArg(1));
    server.send(executeCommand(), "application/json", "");
  });

  server.on(UriBraces("/api/health"), []() {
    server.send(200, "application/json", "");
  });

  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}

void parseRequest(String pins, String delaysInSec) {
  int startPinIndex = 0;
  int startDelayIndex = 0;
  requestPinsCount = 0;
  do {
    int nextPinIndex = pins.indexOf('-', startPinIndex);
    int nextDelayIndex = delaysInSec.indexOf('-', startDelayIndex);

    if (nextPinIndex == -1) {
      nextPinIndex = pins.length();
    }

    if (nextDelayIndex == -1) {
      nextDelayIndex = delaysInSec.length();
    }

    requests[requestPinsCount++] = request{ pins.substring(startPinIndex, nextPinIndex).toInt(), delaysInSec.substring(startDelayIndex, nextDelayIndex).toFloat() };

    startPinIndex = nextPinIndex + 1;
    startDelayIndex = nextDelayIndex + 1;
  } while (startPinIndex < pins.length() && startDelayIndex < delaysInSec.length());
}

void sortRequest() {
  for (int i = 0; i < requestPinsCount; i++) {
    int higher = i;
    for (int j = i; j < requestPinsCount; j++) {
      if (requests[j].delaySec < requests[i].delaySec) {
        higher = j;
      }
    }

    if (i != higher) {
      request higherRequest = requests[higher];
      requests[higher] = requests[i];
      requests[i] = higherRequest;
    }
  }
}


int executeCommand() {
  Serial.print("Executing command: ");

  for (int i = 0; i < requestPinsCount; i++) {
    if (!valueinarray(requests[i].pin)) {
      return 404;
    }
  }

  sortRequest();

  for (int i = 0; i < requestPinsCount; i++) {
    Serial.print("Putting pin ");
    Serial.print(requests[i].pin);

    if (requests[i].pin == 0 || requests[i].pin == 16) {
      digitalWrite(requests[i].pin, LOW);
      Serial.println(" LOW");
    } else {
      digitalWrite(requests[i].pin, HIGH);
      Serial.println(" HIGH");
    }
  }

  int delaySecCount = 0;
  for (int i = 0; i < requestPinsCount; i++) {
    int delaySec = round(requests[i].delaySec * 1000) - delaySecCount;
    delaySecCount += delaySec;
    delay(delaySec);
    Serial.print("Putting pin ");
    Serial.print(requests[i].pin);

    if (requests[i].pin == 0 || requests[i].pin == 16) {
      digitalWrite(requests[i].pin, HIGH);
      Serial.print(" HIGH after ");
    } else {
      digitalWrite(requests[i].pin, LOW);
      Serial.print(" LOW after ");
    }
    Serial.print(delaySec);
    Serial.println(" seconds");
  }

  return 204;
}

bool valueinarray(int val) {
  return true;
  for (int i = 0; i <= sizeof(pins); i++) {
    if (pins[i] == val)
      return true;
  }

  return false;
}