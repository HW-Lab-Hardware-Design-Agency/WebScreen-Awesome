"use strict";

print("Starting Clock...");

for (;;) {
  if (wifi_status()) break;
  delay(500);
  print("Waiting for Wi-Fi...");
}
print("Connected! IP: " + wifi_get_ip());

let config = sd_read_file("/webscreen.json");
let timezone = "America/New_York";
if (config !== "") {
  let tz = parse_json_value(config, "timezone");
  if (tz !== "") timezone = tz;
}
print("Timezone: " + timezone);

let url = "http://worldtimeapi.org/api/timezone/" + timezone;
print("Fetching: " + url);
let json = http_get(url);
if (json === "") {
  print("HTTP GET failed!");
}

let dt = parse_json_value(json, "datetime");
let hour = toNumber(str_substring(dt, 11, 2));
let minute = toNumber(str_substring(dt, 14, 2));
let seconds = toNumber(str_substring(dt, 17, 2));

print("Time: " + numberToString(hour) + ":" + numberToString(minute));

let timeStyle = create_style();
style_set_text_font(timeStyle, 48);
style_set_text_color(timeStyle, 0xFFFFFF);
style_set_text_align(timeStyle, 1);

let smallStyle = create_style();
style_set_text_font(smallStyle, 24);
style_set_text_color(smallStyle, 0x00BFFF);
style_set_text_align(smallStyle, 1);

let timeLabel = create_label(268, 90);
obj_add_style(timeLabel, timeStyle, 0);

let ampmLabel = create_label(268, 150);
obj_add_style(ampmLabel, smallStyle, 0);

let padZero = function(n) {
  if (n < 10) return "0" + numberToString(n);
  return numberToString(n);
};

let update_clock = function() {
  seconds = seconds + 1;
  if (seconds >= 60) {
    seconds = 0;
    minute = minute + 1;
    if (minute >= 60) {
      minute = 0;
      hour = hour + 1;
      if (hour >= 24) hour = 0;
    }
  }

  let h = hour;
  let ap = "AM";
  if (hour === 0) {
    h = 12;
  } else if (hour === 12) {
    ap = "PM";
  } else if (hour > 12) {
    h = hour - 12;
    ap = "PM";
  }

  label_set_text(timeLabel, padZero(h) + ":" + padZero(minute) + ":" + padZero(seconds));
  label_set_text(ampmLabel, ap);
};

update_clock();
print("Clock ready!");
create_timer("update_clock", 1000);
