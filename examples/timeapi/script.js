"use strict";

print("Starting JavaScript execution...");

// 1) Try to load CA cert from SD
let certOk = http_set_ca_cert_from_sd("/timeapi.pem");
if (certOk === 0) {
  print("Could not load CA from /timeapi.pem. We'll use 'setInsecure()' fallback.");
}

// 2) Wait until connected
for (; ;) {
  if (wifi_status()) break;
  delay(500);
  print("Waiting for Wi-Fi...");
}
print("Connected! IP: " + wifi_get_ip());

// 3) Fetch JSON from timeapi.io
let url = "https://timeapi.io/api/time/current/zone?timeZone=Asia/Tokyo";
let jsonResponse = http_get(url);
if (jsonResponse === "") {
  print("HTTP GET failed, can't continue.");
  return;
}

// 4) Parse date and time components
let dateVal = parse_json_value(jsonResponse, "date");
let hour = toNumber(parse_json_value(jsonResponse, "hour"));
let minute = toNumber(parse_json_value(jsonResponse, "minute"));
let seconds = toNumber(parse_json_value(jsonResponse, "seconds"));

// 5) Create a style for the date label
let dateStyle = create_style();
style_set_text_font(dateStyle, 34);
style_set_text_color(dateStyle, 0x72F749);
style_set_pad_all(dateStyle, 5);
style_set_text_align(dateStyle, 1);

// 6) Create label for the date and set its text
let dateLabel = create_label(211, 132);
obj_add_style(dateLabel, dateStyle, 0);
label_set_text(dateLabel, dateVal);

// 7) Create a second style for time
let timeStyle = create_style();
style_set_text_font(timeStyle, 48);
style_set_text_color(timeStyle, 0xFFFFFF);
style_set_pad_all(timeStyle, 5);
style_set_text_align(timeStyle, 1);

// 8) Create label for the time
let timeLabel = create_label(210, 72);
obj_add_style(timeLabel, timeStyle, 0);

// 9) Load a gif from SD card
show_gif_from_sd("/cat.gif", 0, 0);

let padZero = function (num) {
  if (num < 10) {
    return "0" + numberToString(num);
  }
  return numberToString(num);
};

let update_clock = function () {
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

  let h_str = padZero(displayHour);
  let m_str = padZero(minute);
  let s_str = padZero(seconds);
  let timeString = h_str + ":" + m_str + ":" + s_str + " " + ampm;
  label_set_text(timeLabel, timeString);
};

// Start the timer
print("Setup complete. Clock timer is now running.");
update_clock();
create_timer("update_clock", 1000);