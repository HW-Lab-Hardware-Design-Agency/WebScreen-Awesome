"use strict";

print("Starting Dual Clock...");

// Wait for WiFi connection
for (;;) {
  if (wifi_status()) break;
  delay(500);
  print("Waiting for Wi-Fi...");
}
print("Connected! IP: " + wifi_get_ip());

// Read configuration
let config = sd_read_file("/webscreen.json");

// Default timezones (IANA format for worldtimeapi.org)
let timezone1 = "America/New_York";
let city1 = "New York";
let timezone2 = "Europe/London";
let city2 = "London";

// Try to read from config
if (config) {
  if (config !== "") {
    let configTz1 = parse_json_value(config, "timezone1");
    let configCity1 = parse_json_value(config, "city1");
    let configTz2 = parse_json_value(config, "timezone2");
    let configCity2 = parse_json_value(config, "city2");

    if (configTz1 !== "") timezone1 = configTz1;
    if (configCity1 !== "") city1 = configCity1;
    if (configTz2 !== "") timezone2 = configTz2;
    if (configCity2 !== "") city2 = configCity2;
  }
}

print("Zone 1: " + city1 + " (" + timezone1 + ")");
print("Zone 2: " + city2 + " (" + timezone2 + ")");

// Time data for both zones
let hour1 = 0;
let minute1 = 0;
let seconds1 = 0;
let year1 = 2026;
let month1 = 1;
let day1 = 1;

let hour2 = 0;
let minute2 = 0;
let seconds2 = 0;
let year2 = 2026;
let month2 = 1;
let day2 = 1;

// Colors
let COLOR_WHITE = 0xFFFFFF;
let COLOR_CYAN = 0x00BFFF;
let COLOR_GRAY = 0x888888;
let COLOR_DIM = 0x444444;

// Month name helper (simple if-based)
let getMonthName = function(m) {
  if (m === 1) return "Jan";
  if (m === 2) return "Feb";
  if (m === 3) return "Mar";
  if (m === 4) return "Apr";
  if (m === 5) return "May";
  if (m === 6) return "Jun";
  if (m === 7) return "Jul";
  if (m === 8) return "Aug";
  if (m === 9) return "Sep";
  if (m === 10) return "Oct";
  if (m === 11) return "Nov";
  if (m === 12) return "Dec";
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

// Pre-allocated variables for timer callbacks (reduces memory churn)
let displayHour = 0;
let ampm = "AM";
let timeStr1 = "";
let timeStr2 = "";
let dateStr1 = "";
let dateStr2 = "";
let monthName = "";

// Helper function to pad numbers
let padZero = function(num) {
  if (num < 10) {
    return "0" + numberToString(num);
  }
  return numberToString(num);
};

// Format time in 12-hour format
let formatTime = function(h, m, s) {
  displayHour = h;
  ampm = "AM";

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
let formatDate = function(y, m, d) {
  monthName = getMonthName(m);
  return monthName + " " + numberToString(d) + ", " + numberToString(y);
};

// Fetch time for a timezone from worldtimeapi.org
let fetchTime = function(tz, zoneNum) {
  let url = "http://worldtimeapi.org/api/timezone/" + tz;
  print("Fetching: " + url);
  let json = http_get(url);
  if (json === "") {
    print("Failed to fetch time for " + tz);
    return 0;
  }

  let datetime = parse_json_value(json, "datetime");
  if (datetime === "") {
    print("Failed to parse datetime");
    return 0;
  }

  // Parse datetime: "2026-01-16T12:45:10.662556-05:00"
  let y = toNumber(str_substring(datetime, 0, 4));
  let mo = toNumber(str_substring(datetime, 5, 2));
  let d = toNumber(str_substring(datetime, 8, 2));
  let h = toNumber(str_substring(datetime, 11, 2));
  let mi = toNumber(str_substring(datetime, 14, 2));
  let s = toNumber(str_substring(datetime, 17, 2));

  if (zoneNum === 1) {
    hour1 = h;
    minute1 = mi;
    seconds1 = s;
    year1 = y;
    month1 = mo;
    day1 = d;
  } else {
    hour2 = h;
    minute2 = mi;
    seconds2 = s;
    year2 = y;
    month2 = mo;
    day2 = d;
  }

  return 1;
};

// Update display
let updateDisplay = function() {
  timeStr1 = formatTime(hour1, minute1, seconds1);
  dateStr1 = formatDate(year1, month1, day1);
  timeStr2 = formatTime(hour2, minute2, seconds2);
  dateStr2 = formatDate(year2, month2, day2);

  label_set_text(time1Label, timeStr1);
  label_set_text(date1Label, dateStr1);
  label_set_text(time2Label, timeStr2);
  label_set_text(date2Label, dateStr2);
};

// Update clock - increment time locally
let update_clock = function() {
  // Increment zone 1
  seconds1 = seconds1 + 1;
  if (seconds1 >= 60) {
    seconds1 = 0;
    minute1 = minute1 + 1;
    if (minute1 >= 60) {
      minute1 = 0;
      hour1 = hour1 + 1;
      if (hour1 >= 24) {
        hour1 = 0;
      }
    }
  }

  // Increment zone 2
  seconds2 = seconds2 + 1;
  if (seconds2 >= 60) {
    seconds2 = 0;
    minute2 = minute2 + 1;
    if (minute2 >= 60) {
      minute2 = 0;
      hour2 = hour2 + 1;
      if (hour2 >= 24) {
        hour2 = 0;
      }
    }
  }

  updateDisplay();
};

// Fetch initial time for both zones
print("Fetching time for zone 1...");
let ok1 = fetchTime(timezone1, 1);

print("Fetching time for zone 2...");
let ok2 = fetchTime(timezone2, 2);

if (ok1 === 1 && ok2 === 1) {
  label_set_text(statusLabel, "Ready");
  updateDisplay();
  create_timer("update_clock", 1000);
  print("Dual Clock ready!");
} else {
  label_set_text(statusLabel, "Fetch failed");
  print("Failed to fetch time");
}
