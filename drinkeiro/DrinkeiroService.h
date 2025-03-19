// DrinkeiroService.h
#ifndef DRINKEIRO_SERVICE_H
#define DRINKEIRO_SERVICE_H

const long interval = 1000;                       // 60 seconds in milliseconds
unsigned long lastMsgTime = millis() - interval;  // Track last message time


// 2 is led
// 0 and 16 are high at boot
const int ledIndex = 8;
const int pins[] = { 16, 14, 12, 13, 15, 0, 4, 5, 2 };
const int highPins[] = { 0, 16 };
const bool ledPinStartInLow = true;

// const int ledIndex = 2;
// const int pins[] = { 5, 4, 2 };
// const int highPins[] = {  };
// const bool ledPinStartInLow = false;

class DrinkeiroService {
public:
  static void sendPing(PubSubClient& client) {
    if (millis() - lastMsgTime > interval) {
      if (ledPinStartInLow) {
        digitalWrite(pins[ledIndex], HIGH);
      } else {
        digitalWrite(pins[ledIndex], LOW);
      }

      lastMsgTime = millis();

      char message[100];
      sprintf(message, "{\"ip\": \"%s\", \"status\": \"ok\"}", WiFi.localIP().toString().c_str());

      client.publish("/machines/status", message);

      delay(0.5);
      if (ledPinStartInLow) {
        digitalWrite(pins[ledIndex], LOW);
      } else {
        digitalWrite(pins[ledIndex], HIGH);
      }
    }
  }

  static void initiatePins() {
    for (int i = 0; i <= sizeof(pins); i++) {
      pinMode(pins[i], OUTPUT);
    }

    for (int i = 0; i <= sizeof(highPins); i++) {
      pinMode(highPins[i], HIGH);
    }

    if (ledPinStartInLow) {
      digitalWrite(pins[ledIndex], LOW);
    } else {
      digitalWrite(pins[ledIndex], HIGH);
    }
  }

  static void processRequest(char* topic, byte* payloadBytes, unsigned int length) {
    String payload = getPayloadStr(payloadBytes, length);

    int firstDash = payload.indexOf('-');

    // Parse initialPins
    String initialPinsStr = payload.substring(0, firstDash);

    // Split initialPins
    int pinIndex;
    while (initialPinsStr.length() > 0) {
      int commaIndex = initialPinsStr.indexOf(',');
      if (commaIndex == -1) {
        pinIndex = initialPinsStr.toInt();
        initialPinsStr = "";
      } else {
        pinIndex = initialPinsStr.substring(0, commaIndex).toInt();
        initialPinsStr = initialPinsStr.substring(commaIndex + 1);
      }
      Serial.print("Pin: ");
      Serial.println(pinIndex);
      digitalPinWrite(pins[pinIndex], true);
    }

    // Parse the remaining segments
    String remaining = payload.substring(firstDash + 1);
    while (remaining.length() > 0) {
      int nextDash = remaining.indexOf('-');
      String segment = (nextDash == -1) ? remaining : remaining.substring(0, nextDash);

      int semiColonIndex = segment.indexOf(';');
      String pinsStr = segment.substring(0, semiColonIndex);
      String floatValueStr = segment.substring(semiColonIndex + 1);

      Serial.print("Float Value: ");
      Serial.println(floatValueStr.toFloat() * 1000);
      delay(floatValueStr.toFloat() * 1000);

      // Process pins in this segment
      while (pinsStr.length() > 0) {
        int commaIndex = pinsStr.indexOf(',');
        if (commaIndex == -1) {
          pinIndex = pinsStr.toInt();
          pinsStr = "";
        } else {
          pinIndex = pinsStr.substring(0, commaIndex).toInt();
          pinsStr = pinsStr.substring(commaIndex + 1);
        }
        Serial.print("  Pin: ");
        Serial.println(pinIndex);
        digitalPinWrite(pins[pinIndex], false);
      }

      if (nextDash == -1) break;
      remaining = remaining.substring(nextDash + 1);
    }
  }

private:
  static void digitalPinWrite(int pin, bool isActive) {
    if (isActive) {
      if (pin == 0 || pin == 16) {
        digitalWrite(pin, LOW);
      } else {
        digitalWrite(pin, HIGH);
      }
    } else {
      if (pin == 0 || pin == 16) {
        digitalWrite(pin, HIGH);
      } else {
        digitalWrite(pin, LOW);
      }
    }
  }

  static String getPayloadStr(byte* payload, unsigned int length) {
    String payloadStr = "";
    for (size_t i = 0; i < length; i++) {
      payloadStr += (char)payload[i];
    }
    return payloadStr;
  }
};

#endif
