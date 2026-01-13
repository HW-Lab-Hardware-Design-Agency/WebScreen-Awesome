"use strict";

print("Starting Dual Clock...");

// Wait for WiFi connection (device time will be synced)
for (;;) {
  if (wifi_status()) break;
  delay(500);
  print("Waiting for Wi-Fi...");
}
print("Connected! IP: " + wifi_get_ip());

// Read configuration
let config = sd_read_file("/webscreen.json");

// Default timezones (POSIX format)
// Examples: "JST-9" for Tokyo, "ART3" for Buenos Aires
let timezone1 = "UTC0";
let city1 = "UTC";
let timezone2 = "UTC0";
let city2 = "UTC";

// Try to read from config
let configTz1 = parse_json_value(config, "timezone1");
let configCity1 = parse_json_value(config, "city1");
let configTz2 = parse_json_value(config, "timezone2");
let configCity2 = parse_json_value(config, "city2");

if (configTz1 !== "") {
  timezone1 = configTz1;
}
if (configCity1 !== "") {
  city1 = configCity1;
}
if (configTz2 !== "") {
  timezone2 = configTz2;
}
if (configCity2 !== "") {
  city2 = configCity2;
}

print("Zone 1: " + city1 + " (" + timezone1 + ")");
print("Zone 2: " + city2 + " (" + timezone2 + ")");

// Time data for both zones
let hour1 = 0;
let minute1 = 0;
let seconds1 = 0;
let date1 = "";

let hour2 = 0;
let minute2 = 0;
let seconds2 = 0;
let date2 = "";

// Colors
let COLOR_WHITE = 0xFFFFFF;
let COLOR_CYAN = 0x00BFFF;
let COLOR_GRAY = 0x888888;
let COLOR_DIM = 0x444444;

// Month names for date formatting
let monthNames = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec";

// Get month name from index (1-12)
let getMonthName = function(monthIndex) {
  let start = 0;
  let idx = 1;
  let i = 0;
  for (;;) {
    if (idx === monthIndex) {
      let end = i;
      while (i < 40) {
        let c = str_substring(monthNames, i, 1);
        if (c === ",") {
          end = i;
          break;
        }
        i = i + 1;
        end = i;
      }
      return str_substring(monthNames, start, end - start);
    }
    let c = str_substring(monthNames, i, 1);
    if (c === ",") {
      idx = idx + 1;
      start = i + 1;
    }
    i = i + 1;
    if (i > 40) break;
  }
  return "???";
};

// Styles
let timeStyle = create_style();
style_set_text_font(timeStyle, 48);
style_set_text_color(timeStyle, COLOR_WHITE);
style_set_text_align(timeStyle, 1);

let cityStyle = create_style();
style_set_text_font(cityStyle, 28);
style_set_text_color(cityStyle, COLOR_CYAN);
style_set_text_align(cityStyle, 1);

let dateStyle = create_style();
style_set_text_font(dateStyle, 14);
style_set_text_color(dateStyle, COLOR_GRAY);
style_set_text_align(dateStyle, 1);

let dividerStyle = create_style();
style_set_text_font(dividerStyle, 14);
style_set_text_color(dividerStyle, COLOR_DIM);
style_set_text_align(dividerStyle, 1);

let statusStyle = create_style();
style_set_text_font(statusStyle, 14);
style_set_text_color(statusStyle, COLOR_DIM);
style_set_text_align(statusStyle, 1);

// UI Elements - Left side (Zone 2)
let city2Label = create_label(116, 30);
obj_add_style(city2Label, cityStyle, 0);
label_set_text(city2Label, city2);

let time2Label = create_label(116, 70);
obj_add_style(time2Label, timeStyle, 0);
label_set_text(time2Label, "--:--:--");

let date2Label = create_label(116, 135);
obj_add_style(date2Label, dateStyle, 0);
label_set_text(date2Label, "----/--/--");

// Divider
let dividerLabel = create_label(233, 80);
obj_add_style(dividerLabel, dividerStyle, 0);
label_set_text(dividerLabel, "|");

// UI Elements - Right side (Zone 1)
let city1Label = create_label(350, 30);
obj_add_style(city1Label, cityStyle, 0);
label_set_text(city1Label, city1);

let time1Label = create_label(350, 70);
obj_add_style(time1Label, timeStyle, 0);
label_set_text(time1Label, "--:--:--");

let date1Label = create_label(350, 135);
obj_add_style(date1Label, dateStyle, 0);
label_set_text(date1Label, "----/--/--");

// Status label
let statusLabel = create_label(233, 170);
obj_add_style(statusLabel, statusStyle, 0);
label_set_text(statusLabel, "Syncing...");

// Helper function to pad numbers
let padZero = function(num) {
  if (num < 10) {
    return "0" + numberToString(num);
  }
  return numberToString(num);
};

// Format time in 12-hour format
let formatTime = function(h, m, s) {
  let displayHour = h;
  let ampm = "AM";

  if (h === 0) {
    displayHour = 12;
  } else if (h === 12) {
    ampm = "PM";
  } else if (h > 12) {
    displayHour = h - 12;
    ampm = "PM";
  }

  return padZero(displayHour) + ":" + padZero(m) + ":" + padZero(s) + " " + ampm;
};

// Format date as "Mon DD, YYYY"
let formatDate = function(year, month, day) {
  let monthName = getMonthName(month);
  return monthName + " " + numberToString(day) + ", " + numberToString(year);
};

// Get time for a specific timezone
let getTimeForZone = function(tz, zoneNum) {
  // Set the timezone
  set_timezone(tz);

  // Get the time components
  let h = get_hour();
  let m = get_minute();
  let s = get_second();
  let y = get_year();
  let mo = get_month();
  let d = get_day();

  if (zoneNum === 1) {
    hour1 = h;
    minute1 = m;
    seconds1 = s;
    date1 = formatDate(y, mo, d);
  } else {
    hour2 = h;
    minute2 = m;
    seconds2 = s;
    date2 = formatDate(y, mo, d);
  }
};

// Update display
let updateDisplay = function() {
  label_set_text(time1Label, formatTime(hour1, minute1, seconds1));
  label_set_text(date1Label, date1);
  label_set_text(time2Label, formatTime(hour2, minute2, seconds2));
  label_set_text(date2Label, date2);
};

// Main update function - reads current time for both zones
let update_clock = function() {
  // Get time for zone 1
  getTimeForZone(timezone1, 1);

  // Get time for zone 2
  getTimeForZone(timezone2, 2);

  // Update the display
  updateDisplay();
};

// Wait for time to be valid (synced from browser or NTP)
let waitForTime = function() {
  if (time_valid()) {
    print("Time is valid");
    label_set_text(statusLabel, "Ready");

    // Do initial update
    update_clock();

    // Start the clock timer (update every second)
    create_timer("update_clock", 1000);
    print("Dual Clock ready!");
  } else {
    print("Waiting for time sync...");
    label_set_text(statusLabel, "Syncing...");
  }
};

// Check for time sync periodically until valid
create_timer("waitForTime", 1000);
