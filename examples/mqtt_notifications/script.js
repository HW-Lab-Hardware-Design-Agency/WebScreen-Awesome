"use strict";

print("Starting MQTT Notifications...");

// Read config
let config = sd_read_file("/webscreen.json");
let broker = "broker.hivemq.com";
let port = 1883;
let topic = "webscreen/notifications";
let clientId = "webscreen01";

if (config !== "") {
  let b = parse_json_value(config, "mqtt_broker");
  let p = parse_json_value(config, "mqtt_port");
  let t = parse_json_value(config, "mqtt_topic");
  let c = parse_json_value(config, "mqtt_client_id");
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

// Notification storage — 5 slots, individual variables (no string parsing needed)
let t0 = ""; let t1 = ""; let t2 = ""; let t3 = ""; let t4 = "";
let m0 = ""; let m1 = ""; let m2 = ""; let m3 = ""; let m4 = "";
let s0 = ""; let s1 = ""; let s2 = ""; let s3 = ""; let s4 = "";

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

// Get title/message/source by index
let getTitle = function(i) {
  if (i === 0) return t0;
  if (i === 1) return t1;
  if (i === 2) return t2;
  if (i === 3) return t3;
  return t4;
};
let getMsg = function(i) {
  if (i === 0) return m0;
  if (i === 1) return m1;
  if (i === 2) return m2;
  if (i === 3) return m3;
  return m4;
};
let getSrc = function(i) {
  if (i === 0) return s0;
  if (i === 1) return s1;
  if (i === 2) return s2;
  if (i === 3) return s3;
  return s4;
};

// Update display
let updateDisplay = function() {
  if (notifCount === 0) {
    label_set_text(sourceLabel, "");
    label_set_text(notifTitle, "");
    label_set_text(notifMsg, "Waiting for messages...");
    label_set_text(pageLabel, "");
    return;
  }
  label_set_text(sourceLabel, getSrc(currentNotif));
  label_set_text(notifTitle, getTitle(currentNotif));
  label_set_text(notifMsg, getMsg(currentNotif));
  let pg = numberToString(currentNotif + 1) + " / " + numberToString(notifCount);
  label_set_text(pageLabel, pg);
};

// Add notification (newest first) — shift slots right, insert at 0
let addNotif = function(title, message, source) {
  t4 = t3; t3 = t2; t2 = t1; t1 = t0; t0 = title;
  m4 = m3; m3 = m2; m2 = m1; m1 = m0; m0 = message;
  s4 = s3; s3 = s2; s2 = s1; s1 = s0; s0 = source;
  notifCount++;
  if (notifCount > 5) notifCount = 5;
  currentNotif = 0;
  updateDisplay();
  print("Notification: " + title + " - " + message);
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

// MQTT message callback
let on_mqtt_msg = function(t, msg) {
  print("MQTT [" + t + "]: " + msg);
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
    if (mqtt_has_message()) {
      let payload = mqtt_get_payload();
      mqtt_msg_clear();
      let title = parse_json_value(payload, "title");
      if (title !== "") {
        let message = parse_json_value(payload, "message");
        let source = parse_json_value(payload, "source");
        if (source === "") source = "MQTT";
        if (message === "") message = payload;
        addNotif(title, message, source);
      } else {
        addNotif("New Message", payload, "MQTT");
      }
    }
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
