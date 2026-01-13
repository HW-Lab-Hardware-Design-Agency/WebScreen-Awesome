"use strict";

print("Starting Clock with Cat...");

// Wait for WiFi connection (device time will be synced)
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

// Create a style for the date label
let dateStyle = create_style();
style_set_text_font(dateStyle, 34);
style_set_text_color(dateStyle, 0x72F749);
style_set_pad_all(dateStyle, 5);
style_set_text_align(dateStyle, 1);

// Create label for the date
let dateLabel = create_label(211, 132);
obj_add_style(dateLabel, dateStyle, 0);
label_set_text(dateLabel, "Loading...");

// Create a style for time
let timeStyle = create_style();
style_set_text_font(timeStyle, 48);
style_set_text_color(timeStyle, 0xFFFFFF);
style_set_pad_all(timeStyle, 5);
style_set_text_align(timeStyle, 1);

// Create label for the time
let timeLabel = create_label(210, 72);
obj_add_style(timeLabel, timeStyle, 0);
label_set_text(timeLabel, "--:--:--");

// Load a gif from SD card
show_gif_from_sd("/cat.gif", 0, 0);

let padZero = function(num) {
  if (num < 10) {
    return "0" + numberToString(num);
  }
  return numberToString(num);
};

let update_clock = function() {
  // Get time from device
  let hour = get_hour();
  let minute = get_minute();
  let seconds = get_second();
  let year = get_year();
  let month = get_month();
  let day = get_day();

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
  let h_str = padZero(displayHour);
  let m_str = padZero(minute);
  let s_str = padZero(seconds);
  let timeString = h_str + ":" + m_str + ":" + s_str + " " + ampm;
  label_set_text(timeLabel, timeString);

  // Update date display
  let monthName = getMonthName(month);
  let dateStr = monthName + " " + numberToString(day) + ", " + numberToString(year);
  label_set_text(dateLabel, dateStr);
};

// Wait for time to be valid (synced from browser or NTP)
let waitForTime = function() {
  if (time_valid()) {
    print("Time synced successfully");
    update_clock();
    // Start the clock timer
    create_timer("update_clock", 1000);
    print("Clock with Cat ready!");
  } else {
    print("Waiting for time sync...");
    label_set_text(dateLabel, "Syncing...");
  }
};

// Check for time sync periodically until valid
create_timer("waitForTime", 1000);
