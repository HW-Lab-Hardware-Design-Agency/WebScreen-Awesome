"use strict";

print("Starting Clock with Cat...");

for (;;) {
  if (wifi_status()) break;
  delay(500);
  print("Waiting for Wi-Fi...");
}
print("Connected! IP: " + wifi_get_ip());

let config = sd_read_file("/webscreen.json");
let timezone = "America/New_York";

if (config !== "") {
  let configTz = parse_json_value(config, "timezone");
  if (configTz !== "") {
    timezone = configTz;
  }
}
print("Timezone: " + timezone);

let url = "http://worldtimeapi.org/api/timezone/" + timezone;
print("Fetching: " + url);
let jsonResponse = http_get(url);
if (jsonResponse === "") {
  print("HTTP GET failed!");
}

let datetime = parse_json_value(jsonResponse, "datetime");

let year = toNumber(str_substring(datetime, 0, 4));
let month = toNumber(str_substring(datetime, 5, 2));
let day = toNumber(str_substring(datetime, 8, 2));
let hour = toNumber(str_substring(datetime, 11, 2));
let minute = toNumber(str_substring(datetime, 14, 2));
let seconds = toNumber(str_substring(datetime, 17, 2));

print("Time: " + numberToString(hour) + ":" + numberToString(minute));

let months = "JanFebMarAprMayJunJulAugSepOctNovDec";

let dateStyle = create_style();
style_set_text_font(dateStyle, 34);
style_set_text_color(dateStyle, 0x72F749);
style_set_text_align(dateStyle, 1);

let dateLabel = create_label(211, 132);
obj_add_style(dateLabel, dateStyle, 0);

let monthName = str_substring(months, (month - 1) * 3, 3);
label_set_text(dateLabel, monthName + " " + numberToString(day) + ", " + numberToString(year));

let timeStyle = create_style();
style_set_text_font(timeStyle, 48);
style_set_text_color(timeStyle, 0xFFFFFF);
style_set_text_align(timeStyle, 1);

let timeLabel = create_label(210, 72);
obj_add_style(timeLabel, timeStyle, 0);

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

  label_set_text(timeLabel, padZero(displayHour) + ":" + padZero(minute) + ":" + padZero(seconds) + " " + ampm);
};

update_clock();

print("Clock with Cat ready!");
create_timer("update_clock", 1000);
