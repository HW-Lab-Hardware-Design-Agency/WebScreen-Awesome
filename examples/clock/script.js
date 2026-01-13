"use strict";

print("Starting Digital Clock...");

// Load SSL certificate for HTTPS
let certOk = http_set_ca_cert_from_sd("/clock.pem");
if (certOk === 0) {
  print("Could not load CA cert, using insecure mode");
}

// Wait for WiFi connection
for (;;) {
  if (wifi_status()) break;
  delay(500);
  print("Waiting for Wi-Fi...");
}
print("Connected! IP: " + wifi_get_ip());

// Read config for timezone
let config = sd_read_file("/webscreen.json");
let timezone = "America/New_York";
let configTz = parse_json_value(config, "timezone");
if (configTz !== "") {
  timezone = configTz;
}

// Read theme from config (0=dark, 1=light, 2=blue, 3=green)
let theme = 0;
let configTheme = parse_json_value(config, "theme");
if (configTheme !== "") {
  theme = toNumber(configTheme);
}

// Theme colors
let bgColor = 0x000000;
let timeColor = 0xFFFFFF;
let dateColor = 0x888888;
let accentColor = 0x00BFFF;

if (theme === 1) {
  // Light theme
  bgColor = 0xFFFFFF;
  timeColor = 0x000000;
  dateColor = 0x666666;
  accentColor = 0x0066CC;
} else if (theme === 2) {
  // Blue theme
  bgColor = 0x0a1628;
  timeColor = 0x00BFFF;
  dateColor = 0x4488AA;
  accentColor = 0x00FFFF;
} else if (theme === 3) {
  // Green theme
  bgColor = 0x0a1a0a;
  timeColor = 0x00FF00;
  dateColor = 0x44AA44;
  accentColor = 0x88FF88;
}

// Time state
let hour = 0;
let minute = 0;
let seconds = 0;
let dateStr = "";
let dayOfWeek = "";

// Days of week
let days = "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday";

// Create styles
let timeStyle = create_style();
style_set_text_font(timeStyle, 72);
style_set_text_color(timeStyle, timeColor);
style_set_text_align(timeStyle, 1);

let secondsStyle = create_style();
style_set_text_font(secondsStyle, 36);
style_set_text_color(secondsStyle, accentColor);
style_set_text_align(secondsStyle, 0);

let ampmStyle = create_style();
style_set_text_font(ampmStyle, 24);
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

// Create labels - display is 536x240
let timeLabel = create_label(220, 80);
obj_add_style(timeLabel, timeStyle, 0);
label_set_text(timeLabel, "00:00");

let secondsLabel = create_label(380, 95);
obj_add_style(secondsLabel, secondsStyle, 0);
label_set_text(secondsLabel, "00");

let ampmLabel = create_label(380, 130);
obj_add_style(ampmLabel, ampmStyle, 0);
label_set_text(ampmLabel, "AM");

let dateLabel = create_label(268, 170);
obj_add_style(dateLabel, dateStyle, 0);
label_set_text(dateLabel, "Loading...");

let dayLabel = create_label(268, 205);
obj_add_style(dayLabel, dayStyle, 0);
label_set_text(dayLabel, "");

// Helper function
let padZero = function(num) {
  if (num < 10) {
    return "0" + numberToString(num);
  }
  return numberToString(num);
};

// Fetch time from API
let fetch_time = function() {
  let url = "https://timeapi.io/api/time/current/zone?timeZone=" + timezone;
  let response = http_get(url);

  if (response === "") {
    print("Time fetch failed");
    return;
  }

  hour = toNumber(parse_json_value(response, "hour"));
  minute = toNumber(parse_json_value(response, "minute"));
  seconds = toNumber(parse_json_value(response, "seconds"));
  dateStr = parse_json_value(response, "date");
  let dow = toNumber(parse_json_value(response, "dayOfWeek"));

  // Parse day of week from our days string
  let dayIndex = 0;
  let start = 0;
  let i = 0;
  for (;;) {
    if (dayIndex === dow) {
      let end = i;
      while (i < 56) {
        let c = str_substring(days, i, 1);
        if (c === ",") {
          end = i;
          break;
        }
        i++;
        end = i;
      }
      dayOfWeek = str_substring(days, start, end - start);
      break;
    }
    let c = str_substring(days, i, 1);
    if (c === ",") {
      dayIndex++;
      start = i + 1;
    }
    i++;
    if (i > 56) break;
  }

  label_set_text(dateLabel, dateStr);
  label_set_text(dayLabel, dayOfWeek);
  print("Time synced: " + padZero(hour) + ":" + padZero(minute));
};

// Update clock display
let update_clock = function() {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minute++;
    if (minute >= 60) {
      minute = 0;
      hour++;
      if (hour >= 24) {
        hour = 0;
      }
    }
  }

  // Convert to 12-hour format
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

// Resync counter
let resyncCounter = 0;

let check_resync = function() {
  resyncCounter++;
  // Resync every 10 minutes (600 seconds)
  if (resyncCounter >= 600) {
    resyncCounter = 0;
    fetch_time();
  }
};

// Initial fetch
fetch_time();
update_clock();

// Update every second
create_timer("update_clock", 1000);
create_timer("check_resync", 1000);

print("Digital Clock ready!");
