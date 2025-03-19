#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <PubSubClient.h>
#include "DrinkeiroService.h"

const char* mqttServer = "b49a9a23036d4b12ab0e5e3ef43cfc64.s1.eu.hivemq.cloud";
const char* mqttUser = "rodolfocugler";
const char* mqttPassword = "036d4b12ab0e5e3ef43c";
const int mqttPort = 8883;

const char* incomingTopic = "/machines/+/drink";

WiFiClientSecure espClient;
PubSubClient client(espClient);

void connect() {
  WiFiManager wifiManager;
  if (!wifiManager.autoConnect("ESP8266-Config", "senha123")) {
    Serial.println("Falha ao conectar e timeout atingido.");
    delay(3000);
    ESP.restart();
  }

  Serial.println("Conectado ao Wi-Fi!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), mqttUser, mqttPassword)) {
      Serial.println("connected to mqtt");
      client.subscribe(incomingTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  DrinkeiroService::initiatePins();

  // WiFi
  connect();

  // SSL (Skip cert verification for testing)
  espClient.setInsecure();

  // MQTT
  client.setServer(mqttServer, mqttPort);
  client.setCallback(DrinkeiroService::processRequest);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }

  client.loop();
  DrinkeiroService::sendPing(client);
}