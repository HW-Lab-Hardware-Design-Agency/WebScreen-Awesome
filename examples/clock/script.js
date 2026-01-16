"use strict";

print("Starting Digital Clock...");

// Wait for WiFi connection
for (;;) {
  if (wifi_status()) break;
  delay(500);
  print("Waiting for Wi-Fi...");
}
print("Connected! IP: " + wifi_get_ip());

// Read config
let timezone = "America/New_York";
let theme = 0;
let config = sd_read_file("/webscreen.json");
if (config) {
  if (config !== "") {
    let configTz = parse_json_value(config, "timezone");
    if (configTz !== "") {
      timezone = configTz;
    }
    let configTheme = parse_json_value(config, "theme");
    if (configTheme !== "") {
      theme = toNumber(configTheme);
    }
  }
}
print("Timezone: " + timezone);

// Fetch time from worldtimeapi.org (use HTTP - their HTTPS is broken)
let url = "http://worldtimeapi.org/api/timezone/" + timezone;
print("Fetching: " + url);
let jsonResponse = http_get(url);
if (jsonResponse === "") {
  print("HTTP GET failed! Showing error.");
  // Create error label and stop
  let errStyle = create_style();
  style_set_text_font(errStyle, 24);
  style_set_text_color(errStyle, 0xFF0000);
  let errLabel = create_label(150, 100);
  obj_add_style(errLabel, errStyle, 0);
  label_set_text(errLabel, "Failed to fetch time");
  // Stop execution - don't create timer
  for (;;) {
    delay(10000);
  }
}

// Parse response - datetime format: "2024-01-15T10:30:45.123456+00:00"
let datetime = parse_json_value(jsonResponse, "datetime");
let dayOfWeek = toNumber(parse_json_value(jsonResponse, "day_of_week"));

// Extract time from datetime string (format: YYYY-MM-DDTHH:MM:SS...)
// Position: 0123456789012345678
//           2024-01-15T10:30:45
let year = toNumber(str_substring(datetime, 0, 4));
let month = toNumber(str_substring(datetime, 5, 2));
let day = toNumber(str_substring(datetime, 8, 2));
let hour = toNumber(str_substring(datetime, 11, 2));
let minute = toNumber(str_substring(datetime, 14, 2));
let seconds = toNumber(str_substring(datetime, 17, 2));

print("Time: " + numberToString(hour) + ":" + numberToString(minute) + ":" + numberToString(seconds));

// Theme colors
let timeColor = 0xFFFFFF;
let dateColor = 0x888888;
let accentColor = 0x00BFFF;

if (theme === 1) {
  timeColor = 0x000000;
  dateColor = 0x666666;
  accentColor = 0x0066CC;
} else if (theme === 2) {
  timeColor = 0x00BFFF;
  dateColor = 0x4488AA;
  accentColor = 0x00FFFF;
} else if (theme === 3) {
  timeColor = 0x00FF00;
  dateColor = 0x44AA44;
  accentColor = 0x88FF88;
}

// Create styles
let timeStyle = create_style();
style_set_text_font(timeStyle, 48);
style_set_text_color(timeStyle, timeColor);
style_set_text_align(timeStyle, 1);

let secondsStyle = create_style();
style_set_text_font(secondsStyle, 34);
style_set_text_color(secondsStyle, accentColor);
style_set_text_align(secondsStyle, 0);

let ampmStyle = create_style();
style_set_text_font(ampmStyle, 28);
style_set_text_color(ampmStyle, accentColor);
style_set_text_align(ampmStyle, 0);

let dateStyle = create_style();
style_set_text_font(dateStyle, 28);
style_set_text_color(dateStyle, dateColor);
style_set_text_align(dateStyle, 1);

let dayStyle = create_style();
style_set_text_font(dayStyle, 20);
style_set_text_color(dayStyle, accentColor);
style_set_text_align(dayStyle, 1);

// Create labels
let timeLabel = create_label(220, 80);
obj_add_style(timeLabel, timeStyle, 0);

let secondsLabel = create_label(380, 95);
obj_add_style(secondsLabel, secondsStyle, 0);

let ampmLabel = create_label(380, 130);
obj_add_style(ampmLabel, ampmStyle, 0);

let dateLabel = create_label(268, 170);
obj_add_style(dateLabel, dateStyle, 0);

let dayLabel = create_label(268, 205);
obj_add_style(dayLabel, dayStyle, 0);

// Day name (worldtimeapi: 1=Monday, 7=Sunday)
let dayName = "???";
if (dayOfWeek === 1) dayName = "Mon";
if (dayOfWeek === 2) dayName = "Tue";
if (dayOfWeek === 3) dayName = "Wed";
if (dayOfWeek === 4) dayName = "Thu";
if (dayOfWeek === 5) dayName = "Fri";
if (dayOfWeek === 6) dayName = "Sat";
if (dayOfWeek === 7) dayName = "Sun";

// Month name
let monthName = "???";
if (month === 1) monthName = "Jan";
if (month === 2) monthName = "Feb";
if (month === 3) monthName = "Mar";
if (month === 4) monthName = "Apr";
if (month === 5) monthName = "May";
if (month === 6) monthName = "Jun";
if (month === 7) monthName = "Jul";
if (month === 8) monthName = "Aug";
if (month === 9) monthName = "Sep";
if (month === 10) monthName = "Oct";
if (month === 11) monthName = "Nov";
if (month === 12) monthName = "Dec";

// Set date labels
label_set_text(dateLabel, monthName + " " + numberToString(day) + ", " + numberToString(year));
label_set_text(dayLabel, dayName);

// Helper function
let padZero = function(num) {
  if (num < 10) {
    return "0" + numberToString(num);
  }
  return numberToString(num);
};

// Simple timer callback - just increment and display
let update_clock = function() {
  seconds = seconds + 1;
  if (seconds >= 60) {
    seconds = 0;
    minute = minute + 1;
    if (minute >= 60) {
      minute = 0;
      hour = hour + 1;
      if (hour >= 24) {
        hour = 0;
      }
    }
  }

  let displayHour = hour;
  let ampm = "AM";

  if (hour === 0) {
    displayHour = 12;
  } else if (hour === 12) {
    ampm = "PM";
  } else if (hour > 12) {
    displayHour = hour - 12;
    ampm = "PM";
  }

  label_set_text(timeLabel, padZero(displayHour) + ":" + padZero(minute));
  label_set_text(secondsLabel, padZero(seconds));
  label_set_text(ampmLabel, ampm);
};

// Initial display
update_clock();

// Start timer
print("Clock ready!");
create_timer("update_clock", 1000);
