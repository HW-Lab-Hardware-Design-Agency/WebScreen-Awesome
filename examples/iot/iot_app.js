// IoT Monitor App for WebScreen
// Monitor and control IoT devices and sensors via MQTT

// Screen dimensions
let screenWidth = 466;
let screenHeight = 466;

// MQTT Configuration
let MQTT_BROKER = "mqtt.example.com";
let MQTT_PORT = 1883;
let MQTT_USER = "";
let MQTT_PASS = "";

// Demo sensor data
let sensors = [
    { id: "temp_living", name: "Living Room", type: "temperature", value: 22.5, unit: "C", icon: "TEMP" },
    { id: "hum_living", name: "Living Room", type: "humidity", value: 45, unit: "%", icon: "HUM" },
    { id: "temp_bedroom", name: "Bedroom", type: "temperature", value: 20.8, unit: "C", icon: "TEMP" },
    { id: "motion_hall", name: "Hallway", type: "motion", value: 0, unit: "", icon: "MOT" },
    { id: "door_front", name: "Front Door", type: "contact", value: 1, unit: "", icon: "DOOR" },
    { id: "light_kitchen", name: "Kitchen Light", type: "switch", value: 1, unit: "", icon: "LIGHT" }
];

let mqttConnected = false;
let demoMode = true;

// Create UI elements

// Background
let bg = create_label(null);
let bgStyle = create_style();
style_set_bg_color(bgStyle, "#0f172a");
style_set_width(bgStyle, screenWidth);
style_set_height(bgStyle, screenHeight);
obj_add_style(bg, bgStyle, 0);

// Header
let headerLabel = create_label(null);
let headerStyle = create_style();
style_set_text_color(headerStyle, "#FFFFFF");
style_set_text_font(headerStyle, "montserrat_24");
style_set_bg_color(headerStyle, "#1e293b");
style_set_bg_opa(headerStyle, 255);
style_set_pad_all(headerStyle, 12);
style_set_width(headerStyle, screenWidth);
obj_add_style(headerLabel, headerStyle, 0);
label_set_text(headerLabel, "IoT MONITOR");
move_obj(headerLabel, 0, 0);

// Connection status
let connLabel = create_label(null);
let connStyle = create_style();
style_set_text_font(connStyle, "montserrat_12");
obj_add_style(connLabel, connStyle, 0);
move_obj(connLabel, screenWidth - 100, 18);

// Create sensor cards (2x3 grid)
let sensorLabels = [];
let valueLabels = [];
let statusLabels = [];

let row = 0;
while (row < 3) {
    let col = 0;
    while (col < 2) {
        let idx = row * 2 + col;
        let xPos = 15 + (col * 225);
        let yPos = 70 + (row * 125);

        // Card background
        let card = create_label(null);
        let cardStyle = create_style();
        style_set_bg_color(cardStyle, "#1e293b");
        style_set_bg_opa(cardStyle, 255);
        style_set_radius(cardStyle, 12);
        style_set_width(cardStyle, 210);
        style_set_height(cardStyle, 115);
        obj_add_style(card, cardStyle, 0);
        move_obj(card, xPos, yPos);

        // Sensor type icon/badge
        let iconLabel = create_label(null);
        let iconStyle = create_style();
        style_set_text_color(iconStyle, "#64748b");
        style_set_text_font(iconStyle, "montserrat_12");
        style_set_bg_color(iconStyle, "#334155");
        style_set_bg_opa(iconStyle, 255);
        style_set_radius(iconStyle, 4);
        style_set_pad_all(iconStyle, 4);
        obj_add_style(iconLabel, iconStyle, 0);
        move_obj(iconLabel, xPos + 12, yPos + 12);

        // Sensor name
        let nameLabel = create_label(null);
        let nameStyle = create_style();
        style_set_text_color(nameStyle, "#94a3b8");
        style_set_text_font(nameStyle, "montserrat_14");
        obj_add_style(nameLabel, nameStyle, 0);
        move_obj(nameLabel, xPos + 12, yPos + 40);

        // Value display
        let valLabel = create_label(null);
        let valStyle = create_style();
        style_set_text_color(valStyle, "#FFFFFF");
        style_set_text_font(valStyle, "montserrat_32");
        obj_add_style(valLabel, valStyle, 0);
        move_obj(valLabel, xPos + 12, yPos + 65);

        // Status indicator
        let statLabel = create_label(null);
        let statStyle = create_style();
        style_set_text_font(statStyle, "montserrat_12");
        style_set_radius(statStyle, 4);
        style_set_pad_all(statStyle, 3);
        obj_add_style(statLabel, statStyle, 0);
        move_obj(statLabel, xPos + 140, yPos + 12);

        sensorLabels[idx] = { icon: iconLabel, name: nameLabel };
        valueLabels[idx] = valLabel;
        statusLabels[idx] = { label: statLabel, style: statStyle };

        col = col + 1;
    }
    row = row + 1;
}

// Last update label
let updateLabel = create_label(null);
let updateStyle = create_style();
style_set_text_color(updateStyle, "#475569");
style_set_text_font(updateStyle, "montserrat_12");
obj_add_style(updateLabel, updateStyle, 0);
move_obj(updateLabel, 15, screenHeight - 25);

// Format sensor value for display
function formatValue(sensor) {
    if (sensor.type === "temperature") {
        return numberToString(sensor.value) + sensor.unit;
    }
    if (sensor.type === "humidity") {
        return numberToString(sensor.value) + sensor.unit;
    }
    if (sensor.type === "motion") {
        return sensor.value === 1 ? "Motion!" : "Clear";
    }
    if (sensor.type === "contact") {
        return sensor.value === 1 ? "Closed" : "Open";
    }
    if (sensor.type === "switch") {
        return sensor.value === 1 ? "ON" : "OFF";
    }
    return numberToString(sensor.value);
}

// Get status color for sensor
function getStatusColor(sensor) {
    if (sensor.type === "temperature") {
        if (sensor.value < 18) {
            return "#3b82f6";  // Cold - blue
        }
        if (sensor.value > 26) {
            return "#ef4444";  // Hot - red
        }
        return "#22c55e";  // Normal - green
    }
    if (sensor.type === "motion") {
        return sensor.value === 1 ? "#f59e0b" : "#22c55e";
    }
    if (sensor.type === "contact") {
        return sensor.value === 1 ? "#22c55e" : "#ef4444";
    }
    if (sensor.type === "switch") {
        return sensor.value === 1 ? "#22c55e" : "#64748b";
    }
    return "#22c55e";
}

// Update display
function updateDisplay() {
    // Connection status
    if (mqttConnected) {
        label_set_text(connLabel, "Connected");
        style_set_text_color(connStyle, "#22c55e");
    } else {
        label_set_text(connLabel, demoMode ? "Demo Mode" : "Offline");
        style_set_text_color(connStyle, "#f59e0b");
    }

    // Update sensor cards
    let i = 0;
    while (i < sensors.length && i < 6) {
        let sensor = sensors[i];

        label_set_text(sensorLabels[i].icon, sensor.icon);
        label_set_text(sensorLabels[i].name, sensor.name);
        label_set_text(valueLabels[i], formatValue(sensor));

        // Status indicator
        let statusColor = getStatusColor(sensor);
        style_set_bg_color(statusLabels[i].style, statusColor);
        style_set_bg_opa(statusLabels[i].style, 255);
        label_set_text(statusLabels[i].label, "  ");

        i = i + 1;
    }

    label_set_text(updateLabel, "Last update: just now");
}

// MQTT message handler
function handleMqttMessage(topic, message) {
    print("MQTT: " + topic + " = " + message);

    // Parse topic to find sensor
    let i = 0;
    while (i < sensors.length) {
        if (str_index_of(topic, sensors[i].id) >= 0) {
            sensors[i].value = toNumber(message);
            updateDisplay();
            break;
        }
        i = i + 1;
    }
}

// Connect to MQTT broker
function connectMQTT() {
    if (MQTT_BROKER === "mqtt.example.com") {
        print("MQTT not configured, using demo mode");
        demoMode = true;
        return;
    }

    mqtt_init(MQTT_BROKER, MQTT_PORT, "webscreen_iot");

    if (MQTT_USER.length > 0) {
        mqtt_connect(MQTT_USER, MQTT_PASS);
    } else {
        mqtt_connect("", "");
    }

    // Subscribe to sensor topics
    mqtt_subscribe("home/sensors/#");
    mqtt_on_message("handleMqttMessage");

    mqttConnected = true;
    demoMode = false;
}

// Simulate sensor updates in demo mode
function simulateSensors() {
    // Small random variations
    let i = 0;
    while (i < sensors.length) {
        if (sensors[i].type === "temperature") {
            let change = ((i % 3) - 1) * 0.1;
            sensors[i].value = sensors[i].value + change;
            sensors[i].value = toNumber(numberToString(sensors[i].value * 10)) / 10;
        }
        if (sensors[i].type === "humidity") {
            let hchange = ((i % 2) - 0.5);
            sensors[i].value = sensors[i].value + hchange;
            sensors[i].value = toNumber(numberToString(sensors[i].value));
        }
        i = i + 1;
    }
}

// Initialize
print("IoT Monitor starting...");

if (wifi_status()) {
    connectMQTT();
}

updateDisplay();

// Main loop
let updateCounter = 0;

while (true) {
    // Process MQTT if connected
    if (mqttConnected && !demoMode) {
        mqtt_loop();
    }

    // Demo mode updates
    if (demoMode) {
        updateCounter = updateCounter + 1;
        if (updateCounter >= 5) {
            updateCounter = 0;
            simulateSensors();
            updateDisplay();
        }
    }

    delay(1000);
}
