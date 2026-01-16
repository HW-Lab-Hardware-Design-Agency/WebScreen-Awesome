"use strict";

print("Starting Clock with Cat...");

// Wait for WiFi connection
for (;;) {
  if (wifi_status()) break;
  delay(500);
  print("Waiting for Wi-Fi...");
}
print("Connected! IP: " + wifi_get_ip());

// Read config for timezone (IANA format, e.g., "America/New_York")
let config = sd_read_file("/webscreen.json");
let timezone = "America/New_York";

if (config) {
  if (config !== "") {
    let configTz = parse_json_value(config, "timezone");
    if (configTz !== "") {
      timezone = configTz;
    }
  }
}
print("Timezone: " + timezone);

// Fetch time from worldtimeapi.org
let url = "http://worldtimeapi.org/api/timezone/" + timezone;
print("Fetching: " + url);
let jsonResponse = http_get(url);
if (jsonResponse === "") {
  print("HTTP GET failed!");
}

// Parse response - datetime format: "2026-01-16T12:45:10.662556-05:00"
let datetime = parse_json_value(jsonResponse, "datetime");

// Extract time from datetime string
let year = toNumber(str_substring(datetime, 0, 4));
let month = toNumber(str_substring(datetime, 5, 2));
let day = toNumber(str_substring(datetime, 8, 2));
let hour = toNumber(str_substring(datetime, 11, 2));
let minute = toNumber(str_substring(datetime, 14, 2));
let seconds = toNumber(str_substring(datetime, 17, 2));

print("Time: " + numberToString(hour) + ":" + numberToString(minute) + ":" + numberToString(seconds));

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

// Create a style for the date label
let dateStyle = create_style();
style_set_text_font(dateStyle, 34);
style_set_text_color(dateStyle, 0x72F749);
style_set_pad_all(dateStyle, 5);
style_set_text_align(dateStyle, 1);

// Create label for the date
let dateLabel = create_label(211, 132);
obj_add_style(dateLabel, dateStyle, 0);

// Set initial date
let monthName = getMonthName(month);
let dateStr = monthName + " " + numberToString(day) + ", " + numberToString(year);
label_set_text(dateLabel, dateStr);

// Create a style for time
let timeStyle = create_style();
style_set_text_font(timeStyle, 48);
style_set_text_color(timeStyle, 0xFFFFFF);
style_set_pad_all(timeStyle, 5);
style_set_text_align(timeStyle, 1);

// Create label for the time
let timeLabel = create_label(210, 72);
obj_add_style(timeLabel, timeStyle, 0);

// Load a gif from SD card
show_gif_from_sd("/cat.gif", 0, 0);

let padZero = function(num) {
  if (num < 10) {
    return "0" + numberToString(num);
  }
  return numberToString(num);
};

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
};

// Initial display
update_clock();

// Start timer
print("Clock with Cat ready!");
create_timer("update_clock", 1000);
