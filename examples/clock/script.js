"use strict";

print("Starting Digital Clock...");

// Wait for WiFi connection (NTP will auto-configure)
for (;;) {
  if (wifi_status()) break;
  delay(500);
  print("Waiting for Wi-Fi...");
}
print("Connected! IP: " + wifi_get_ip());

// Read config for timezone (POSIX format, e.g., "EST5EDT,M3.2.0,M11.1.0" or "UTC0")
let config = sd_read_file("/webscreen.json");
let timezone = "UTC0";
let configTz = parse_json_value(config, "timezone");
if (configTz !== "") {
  timezone = configTz;
  set_timezone(timezone);
  print("Timezone set to: " + timezone);
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

// Days of week names
let dayNames = "Sun,Mon,Tue,Wed,Thu,Fri,Sat";
let monthNames = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec";

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

// Get day name from index
let getDayName = function(dayIndex) {
  let start = 0;
  let idx = 0;
  let i = 0;
  for (;;) {
    if (idx === dayIndex) {
      let end = i;
      while (i < 28) {
        let c = str_substring(dayNames, i, 1);
        if (c === ",") {
          end = i;
          break;
        }
        i = i + 1;
        end = i;
      }
      return str_substring(dayNames, start, end - start);
    }
    let c = str_substring(dayNames, i, 1);
    if (c === ",") {
      idx = idx + 1;
      start = i + 1;
    }
    i = i + 1;
    if (i > 28) break;
  }
  return "???";
};

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

// Update clock display using local time
let update_clock = function() {
  // Get time from device (NTP synced)
  let hour = get_hour();
  let minute = get_minute();
  let seconds = get_second();
  let year = get_year();
  let month = get_month();
  let day = get_day();
  let weekday = get_weekday();

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

  // Update time display
  label_set_text(timeLabel, padZero(displayHour) + ":" + padZero(minute));
  label_set_text(secondsLabel, padZero(seconds));
  label_set_text(ampmLabel, ampm);

  // Update date display
  let monthName = getMonthName(month);
  let dateStr = monthName + " " + numberToString(day) + ", " + numberToString(year);
  label_set_text(dateLabel, dateStr);

  // Update day of week
  let dayName = getDayName(weekday);
  label_set_text(dayLabel, dayName);
};

// Wait for time to be valid (NTP sync)
let waitForTime = function() {
  if (time_valid()) {
    print("Time synced successfully");
    update_clock();
    // Start the clock timer
    create_timer("update_clock", 1000);
    print("Digital Clock ready!");
  } else {
    print("Waiting for NTP sync...");
    label_set_text(dateLabel, "Syncing...");
  }
};

// Check for time sync periodically until valid
create_timer("waitForTime", 1000);
