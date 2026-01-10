"use strict";

print("Starting System Monitor...");

// Create styles
let titleStyle = create_style();
style_set_text_font(titleStyle, 24);
style_set_text_color(titleStyle, 0xFFFFFF);
style_set_text_align(titleStyle, 1);

let headerStyle = create_style();
style_set_text_font(headerStyle, 18);
style_set_text_color(headerStyle, 0x00BFFF);
style_set_text_align(headerStyle, 0);

let valueStyle = create_style();
style_set_text_font(valueStyle, 20);
style_set_text_color(valueStyle, 0xFFFFFF);
style_set_text_align(valueStyle, 0);

let unitStyle = create_style();
style_set_text_font(unitStyle, 14);
style_set_text_color(unitStyle, 0x888888);
style_set_text_align(unitStyle, 0);

let statusOnStyle = create_style();
style_set_text_font(statusOnStyle, 18);
style_set_text_color(statusOnStyle, 0x00FF00);
style_set_text_align(statusOnStyle, 0);

let statusOffStyle = create_style();
style_set_text_font(statusOffStyle, 18);
style_set_text_color(statusOffStyle, 0xFF4444);
style_set_text_align(statusOffStyle, 0);

// Title - display is 536x240
let titleLabel = create_label(268, 15);
obj_add_style(titleLabel, titleStyle, 0);
label_set_text(titleLabel, "System Monitor");

// Left column - WiFi info
let wifiHeader = create_label(30, 50);
obj_add_style(wifiHeader, headerStyle, 0);
label_set_text(wifiHeader, "WiFi Status");

let wifiStatusLabel = create_label(30, 75);
obj_add_style(wifiStatusLabel, statusOnStyle, 0);
label_set_text(wifiStatusLabel, "Checking...");

let ipHeader = create_label(30, 105);
obj_add_style(ipHeader, headerStyle, 0);
label_set_text(ipHeader, "IP Address");

let ipLabel = create_label(30, 130);
obj_add_style(ipLabel, valueStyle, 0);
label_set_text(ipLabel, "...");

// Middle column - Uptime
let uptimeHeader = create_label(200, 50);
obj_add_style(uptimeHeader, headerStyle, 0);
label_set_text(uptimeHeader, "Uptime");

let uptimeLabel = create_label(200, 75);
obj_add_style(uptimeLabel, valueStyle, 0);
label_set_text(uptimeLabel, "0s");

let refreshHeader = create_label(200, 105);
obj_add_style(refreshHeader, headerStyle, 0);
label_set_text(refreshHeader, "Refresh Rate");

let refreshLabel = create_label(200, 130);
obj_add_style(refreshLabel, valueStyle, 0);
label_set_text(refreshLabel, "1s");

// Right column - SD Card
let sdHeader = create_label(370, 50);
obj_add_style(sdHeader, headerStyle, 0);
label_set_text(sdHeader, "SD Card");

let sdStatusLabel = create_label(370, 75);
obj_add_style(sdStatusLabel, statusOnStyle, 0);
label_set_text(sdStatusLabel, "Checking...");

let filesHeader = create_label(370, 105);
obj_add_style(filesHeader, headerStyle, 0);
label_set_text(filesHeader, "Root Files");

let filesLabel = create_label(370, 130);
obj_add_style(filesLabel, valueStyle, 0);
label_set_text(filesLabel, "...");

// Bottom row - Script info
let scriptHeader = create_label(30, 170);
obj_add_style(scriptHeader, headerStyle, 0);
label_set_text(scriptHeader, "Running Script");

let scriptLabel = create_label(30, 195);
obj_add_style(scriptLabel, valueStyle, 0);

// Read current script from config
let config = sd_read_file("/webscreen.json");
let scriptName = parse_json_value(config, "script");
if (scriptName === "") {
  scriptName = "monitor_app.js";
}
label_set_text(scriptLabel, scriptName);

// Check SD card and count files
let sdOk = 0;
let fileCount = 0;
let fileList = sd_list_dir("/");
if (fileList !== "") {
  sdOk = 1;
  // Count files (separated by newlines)
  let len = str_length(fileList);
  let i = 0;
  fileCount = 1;
  while (i < len) {
    let c = str_substring(fileList, i, 1);
    if (c === "\n") {
      fileCount++;
    }
    i++;
  }
}

if (sdOk) {
  label_set_text(sdStatusLabel, "OK");
  label_set_text(filesLabel, numberToString(fileCount) + " items");
} else {
  obj_add_style(sdStatusLabel, statusOffStyle, 0);
  label_set_text(sdStatusLabel, "Not Found");
  label_set_text(filesLabel, "-");
}

// Uptime tracking
let uptimeSeconds = 0;

let padZero = function(num) {
  if (num < 10) {
    return "0" + numberToString(num);
  }
  return numberToString(num);
};

let formatUptime = function(secs) {
  let hours = 0;
  let mins = 0;

  if (secs >= 3600) {
    hours = secs / 3600;
    hours = hours - (hours % 1); // floor
    secs = secs - (hours * 3600);
  }

  if (secs >= 60) {
    mins = secs / 60;
    mins = mins - (mins % 1); // floor
    secs = secs - (mins * 60);
  }

  if (hours > 0) {
    return numberToString(hours) + "h " + padZero(mins) + "m";
  } else if (mins > 0) {
    return numberToString(mins) + "m " + padZero(secs) + "s";
  } else {
    return numberToString(secs) + "s";
  }
};

let update_stats = function() {
  uptimeSeconds++;

  // Update uptime display
  label_set_text(uptimeLabel, formatUptime(uptimeSeconds));

  // Update WiFi status
  if (wifi_status()) {
    obj_add_style(wifiStatusLabel, statusOnStyle, 0);
    label_set_text(wifiStatusLabel, "Connected");
    label_set_text(ipLabel, wifi_get_ip());
  } else {
    obj_add_style(wifiStatusLabel, statusOffStyle, 0);
    label_set_text(wifiStatusLabel, "Disconnected");
    label_set_text(ipLabel, "-");
  }
};

// Initial update
update_stats();

// Update every second
create_timer("update_stats", 1000);

print("System Monitor ready!");
