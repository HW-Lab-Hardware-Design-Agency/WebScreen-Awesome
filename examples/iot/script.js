"use strict";

print("Starting IoT Monitor...");

// Sensor data
let temp1 = 225;  // 22.5C in tenths
let temp2 = 208;  // 20.8C
let humidity = 45;
let motion = 0;
let door = 1;     // 1 = closed
let light = 1;    // 1 = on

// Colors
let COLOR_BG = 0x0f172a;
let COLOR_HEADER = 0x1e293b;
let COLOR_CARD = 0x1e293b;
let COLOR_WHITE = 0xFFFFFF;
let COLOR_GREEN = 0x22c55e;
let COLOR_YELLOW = 0xf59e0b;
let COLOR_BLUE = 0x3b82f6;
let COLOR_RED = 0xef4444;
let COLOR_GRAY = 0x94a3b8;
let COLOR_DIM = 0x475569;

// Styles
let titleStyle = create_style();
style_set_text_font(titleStyle, 24);
style_set_text_color(titleStyle, COLOR_WHITE);

let connStyle = create_style();
style_set_text_font(connStyle, 12);
style_set_text_color(connStyle, COLOR_YELLOW);

let nameStyle = create_style();
style_set_text_font(nameStyle, 14);
style_set_text_color(nameStyle, COLOR_GRAY);

let valueStyle = create_style();
style_set_text_font(valueStyle, 28);
style_set_text_color(valueStyle, COLOR_WHITE);

let statusStyle = create_style();
style_set_text_font(statusStyle, 12);
style_set_text_color(statusStyle, COLOR_DIM);

let cardStyle = create_style();
style_set_bg_color(cardStyle, COLOR_CARD);
style_set_bg_opa(cardStyle, 255);
style_set_radius(cardStyle, 12);
style_set_width(cardStyle, 210);
style_set_height(cardStyle, 115);

// Header
let titleLabel = create_label(20, 15);
obj_add_style(titleLabel, titleStyle, 0);
label_set_text(titleLabel, "IoT MONITOR");

let connLabel = create_label(360, 18);
obj_add_style(connLabel, connStyle, 0);
label_set_text(connLabel, "Demo Mode");

// Sensor cards (2x3 grid)
let card1 = create_label(15, 70);
obj_add_style(card1, cardStyle, 0);
label_set_text(card1, "");

let name1 = create_label(27, 100);
obj_add_style(name1, nameStyle, 0);
label_set_text(name1, "Living Room");

let value1 = create_label(27, 125);
obj_add_style(value1, valueStyle, 0);

let card2 = create_label(240, 70);
obj_add_style(card2, cardStyle, 0);
label_set_text(card2, "");

let name2 = create_label(252, 100);
obj_add_style(name2, nameStyle, 0);
label_set_text(name2, "Humidity");

let value2 = create_label(252, 125);
obj_add_style(value2, valueStyle, 0);

let card3 = create_label(15, 195);
obj_add_style(card3, cardStyle, 0);
label_set_text(card3, "");

let name3 = create_label(27, 225);
obj_add_style(name3, nameStyle, 0);
label_set_text(name3, "Bedroom");

let value3 = create_label(27, 250);
obj_add_style(value3, valueStyle, 0);

let card4 = create_label(240, 195);
obj_add_style(card4, cardStyle, 0);
label_set_text(card4, "");

let name4 = create_label(252, 225);
obj_add_style(name4, nameStyle, 0);
label_set_text(name4, "Motion");

let value4 = create_label(252, 250);
obj_add_style(value4, valueStyle, 0);

let card5 = create_label(15, 320);
obj_add_style(card5, cardStyle, 0);
label_set_text(card5, "");

let name5 = create_label(27, 350);
obj_add_style(name5, nameStyle, 0);
label_set_text(name5, "Front Door");

let value5 = create_label(27, 375);
obj_add_style(value5, valueStyle, 0);

let card6 = create_label(240, 320);
obj_add_style(card6, cardStyle, 0);
label_set_text(card6, "");

let name6 = create_label(252, 350);
obj_add_style(name6, nameStyle, 0);
label_set_text(name6, "Kitchen Light");

let value6 = create_label(252, 375);
obj_add_style(value6, valueStyle, 0);

let statusLabel = create_label(15, 446);
obj_add_style(statusLabel, statusStyle, 0);
label_set_text(statusLabel, "Last update: just now");

// Format temperature
let formatTemp = function(tenths) {
    let whole = tenths / 10;
    whole = whole - (whole % 1);
    let decimal = tenths % 10;
    return numberToString(whole) + "." + numberToString(decimal) + "C";
};

// Update display
let updateDisplay = function() {
    label_set_text(value1, formatTemp(temp1));
    label_set_text(value2, numberToString(humidity) + "%");
    label_set_text(value3, formatTemp(temp2));

    if (motion) {
        label_set_text(value4, "Motion!");
    } else {
        label_set_text(value4, "Clear");
    }

    if (door) {
        label_set_text(value5, "Closed");
    } else {
        label_set_text(value5, "Open");
    }

    if (light) {
        label_set_text(value6, "ON");
    } else {
        label_set_text(value6, "OFF");
    }
};

// Simulate sensor updates
let simTimer = 0;

let simulate_tick = function() {
    simTimer = simTimer + 1;

    // Vary temperature
    if (simTimer % 5 === 0) {
        temp1 = temp1 + ((simTimer % 3) - 1);
        temp2 = temp2 + ((simTimer % 2) - 1);
    }

    // Vary humidity
    if (simTimer % 7 === 0) {
        humidity = humidity + ((simTimer % 3) - 1);
    }

    // Toggle motion occasionally
    if (simTimer % 10 === 0) {
        motion = 1 - motion;
    }

    // Toggle light
    if (simTimer % 20 === 0) {
        light = 1 - light;
    }

    updateDisplay();
};

// Initialize
updateDisplay();
print("IoT Monitor ready!");

create_timer("simulate_tick", 1000);
