"use strict";

print("Starting MQTT Notifications...");

// Read config
let config = sd_read_file("/webscreen.json");
let broker = "broker.hivemq.com";
let port = 1883;
let topic = "webscreen/notifications";
let clientId = "webscreen01";

if (config !== "") {
  let b = parse_json_value(config, "config.mqtt_broker");
  let p = parse_json_value(config, "config.mqtt_port");
  let t = parse_json_value(config, "config.mqtt_topic");
  let c = parse_json_value(config, "config.client_id");
  if (b !== "") broker = b;
  if (p !== "") port = toNumber(p);
  if (t !== "") topic = t;
  if (c !== "") clientId = c;
}

print("Broker: " + broker + ":" + numberToString(port));
print("Topic: " + topic);

// State
let notifCount = 0;
let currentNotif = 0;
let mqttConnected = 0;

// Comma-separated storage (max 5 notifications)
let storedTitles = ",,,,";
let storedMessages = ",,,,";
let storedSources = ",,,,";

// String helpers
let getItem = function(str, idx) {
  let len = str_length(str);
  let pos = 0;
  let count = 0;
  let start = 0;
  while (pos <= len) {
    let c = "";
    if (pos < len) c = str_substring(str, pos, 1);
    if (c === "," || pos === len) {
      if (count === idx) return str_substring(str, start, pos - start);
      count++;
      start = pos + 1;
    }
    pos++;
  }
  return "";
};

let setItem = function(str, idx, val) {
  let len = str_length(str);
  let result = "";
  let pos = 0;
  let count = 0;
  let start = 0;
  while (pos <= len) {
    let c = "";
    if (pos < len) c = str_substring(str, pos, 1);
    if (c === "," || pos === len) {
      if (result !== "") result = result + ",";
      if (count === idx) {
        result = result + val;
      } else {
        result = result + str_substring(str, start, pos - start);
      }
      count++;
      start = pos + 1;
    }
    pos++;
  }
  return result;
};

// Styles (max 5)
let headerStyle = create_style();
style_set_text_font(headerStyle, 20);
style_set_text_color(headerStyle, 0xFFFFFF);

let statusStyle = create_style();
style_set_text_font(statusStyle, 14);
style_set_text_color(statusStyle, 0x888888);

let titleStyle = create_style();
style_set_text_font(titleStyle, 28);
style_set_text_color(titleStyle, 0xFFFFFF);

let msgStyle = create_style();
style_set_text_font(msgStyle, 20);
style_set_text_color(msgStyle, 0xAAAAAA);

let smallStyle = create_style();
style_set_text_font(smallStyle, 14);
style_set_text_color(smallStyle, 0x58A6FF);

// Card background
let cardBg = create_label(15, 50);
let cardStyle = create_style();
style_set_bg_color(cardStyle, 0x161B22);
style_set_bg_opa(cardStyle, 255);
style_set_width(cardStyle, 506);
style_set_height(cardStyle, 130);
style_set_radius(cardStyle, 12);
style_set_pad_all(cardStyle, 15);
obj_add_style(cardBg, cardStyle, 0);
label_set_text(cardBg, "");

// Labels
let headerLabel = create_label(20, 15);
obj_add_style(headerLabel, headerStyle, 0);
label_set_text(headerLabel, "MQTT Notifications");

let statusLabel = create_label(380, 17);
obj_add_style(statusLabel, statusStyle, 0);
label_set_text(statusLabel, "Connecting...");

let sourceLabel = create_label(30, 58);
obj_add_style(sourceLabel, smallStyle, 0);
label_set_text(sourceLabel, "");

let notifTitle = create_label(30, 80);
obj_add_style(notifTitle, titleStyle, 0);
label_set_text(notifTitle, "");

let notifMsg = create_label(30, 115);
obj_add_style(notifMsg, msgStyle, 0);
label_set_text(notifMsg, "Waiting for messages...");

let pageLabel = create_label(230, 195);
obj_add_style(pageLabel, statusStyle, 0);
label_set_text(pageLabel, "");

let topicLabel = create_label(20, 215);
obj_add_style(topicLabel, statusStyle, 0);
label_set_text(topicLabel, topic);

// Update display
let updateDisplay = function() {
  if (notifCount === 0) {
    label_set_text(sourceLabel, "");
    label_set_text(notifTitle, "");
    label_set_text(notifMsg, "Waiting for messages...");
    label_set_text(pageLabel, "");
    return;
  }
  let t = getItem(storedTitles, currentNotif);
  let m = getItem(storedMessages, currentNotif);
  let s = getItem(storedSources, currentNotif);
  label_set_text(sourceLabel, s);
  label_set_text(notifTitle, t);
  label_set_text(notifMsg, m);
  let pg = numberToString(currentNotif + 1) + " / " + numberToString(notifCount);
  label_set_text(pageLabel, pg);
};

// Add notification (newest first)
let addNotif = function(title, message, source) {
  let i = 3;
  while (i >= 0) {
    storedTitles = setItem(storedTitles, i + 1, getItem(storedTitles, i));
    storedMessages = setItem(storedMessages, i + 1, getItem(storedMessages, i));
    storedSources = setItem(storedSources, i + 1, getItem(storedSources, i));
    i--;
  }
  storedTitles = setItem(storedTitles, 0, title);
  storedMessages = setItem(storedMessages, 0, message);
  storedSources = setItem(storedSources, 0, source);
  notifCount++;
  if (notifCount > 5) notifCount = 5;
  currentNotif = 0;
  updateDisplay();
  print("Notification: " + title + " - " + message);
};

// MQTT message callback
// Accepts plain text or JSON: {"title":"...","message":"...","source":"..."}
let on_mqtt_msg = function(t, msg) {
  print("MQTT [" + t + "]: " + msg);
  let title = parse_json_value(msg, "title");
  if (title !== "") {
    let message = parse_json_value(msg, "message");
    let source = parse_json_value(msg, "source");
    if (source === "") source = "MQTT";
    if (message === "") message = msg;
    addNotif(title, message, source);
  } else {
    addNotif("New Message", msg, "MQTT");
  }
};

// Wait for WiFi
let wifiReady = 0;

let check_wifi = function() {
  if (wifiReady) return;
  if (wifi_status()) {
    wifiReady = 1;
    print("WiFi connected: " + wifi_get_ip());
    label_set_text(statusLabel, "WiFi OK");

    // Connect MQTT
    mqtt_init(broker, port);
    if (mqtt_connect(clientId)) {
      mqttConnected = 1;
      mqtt_subscribe(topic);
      mqtt_on_message("on_mqtt_msg");
      label_set_text(statusLabel, "Connected");
      style_set_text_color(statusStyle, 0x3FB950);
      print("MQTT connected, subscribed to: " + topic);
    } else {
      label_set_text(statusLabel, "MQTT failed");
      style_set_text_color(statusStyle, 0xFF4444);
      print("MQTT connection failed");
    }
  }
};

// Main loop - process MQTT and cycle notifications
let cycleCount = 0;

let main_loop = function() {
  if (!wifiReady) {
    check_wifi();
    return;
  }

  if (mqttConnected) {
    mqtt_loop();
  }

  // Auto-cycle notifications every 6 seconds
  cycleCount++;
  if (cycleCount >= 6 && notifCount > 1) {
    cycleCount = 0;
    currentNotif++;
    if (currentNotif >= notifCount) currentNotif = 0;
    updateDisplay();
  }
};

create_timer("main_loop", 1000);
print("MQTT Notifications ready!");
