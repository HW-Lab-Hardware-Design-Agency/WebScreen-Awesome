"use strict";

print("Starting Dual Clock...");

for (;;) {
  if (wifi_status()) break;
  delay(500);
  print("Waiting for Wi-Fi...");
}
print("Connected! IP: " + wifi_get_ip());

let config = sd_read_file("/webscreen.json");
let tz1 = "America/New_York";
let tz2 = "Europe/London";
let city1 = "New York";
let city2 = "London";

if (config !== "") {
  let t1 = parse_json_value(config, "timezone1");
  let t2 = parse_json_value(config, "timezone2");
  let c1 = parse_json_value(config, "city1");
  let c2 = parse_json_value(config, "city2");
  if (t1 !== "") tz1 = t1;
  if (t2 !== "") tz2 = t2;
  if (c1 !== "") city1 = c1;
  if (c2 !== "") city2 = c2;
}

let h1 = 0;
let m1 = 0;
let s1 = 0;
let h2 = 0;
let m2 = 0;
let s2 = 0;

let timeStyle = create_style();
style_set_text_font(timeStyle, 34);
style_set_text_color(timeStyle, 0xFFFFFF);
style_set_text_align(timeStyle, 1);

let cityStyle = create_style();
style_set_text_font(cityStyle, 20);
style_set_text_color(cityStyle, 0x00BFFF);
style_set_text_align(cityStyle, 1);

let lbl1 = create_label(134, 60);
obj_add_style(lbl1, cityStyle, 0);
label_set_text(lbl1, city1);

let time1 = create_label(134, 100);
obj_add_style(time1, timeStyle, 0);

let lbl2 = create_label(402, 60);
obj_add_style(lbl2, cityStyle, 0);
label_set_text(lbl2, city2);

let time2 = create_label(402, 100);
obj_add_style(time2, timeStyle, 0);

let padZero = function(n) {
  if (n < 10) return "0" + numberToString(n);
  return numberToString(n);
};

let fetchTime = function(tz, zone) {
  let url = "http://worldtimeapi.org/api/timezone/" + tz;
  let json = http_get(url);
  if (json === "") return;
  let dt = parse_json_value(json, "datetime");
  let hh = toNumber(str_substring(dt, 11, 2));
  let mm = toNumber(str_substring(dt, 14, 2));
  let ss = toNumber(str_substring(dt, 17, 2));
  if (zone === 1) {
    h1 = hh;
    m1 = mm;
    s1 = ss;
  } else {
    h2 = hh;
    m2 = mm;
    s2 = ss;
  }
};

fetchTime(tz1, 1);
fetchTime(tz2, 2);

let update_clock = function() {
  s1 = s1 + 1;
  if (s1 >= 60) { s1 = 0; m1 = m1 + 1; }
  if (m1 >= 60) { m1 = 0; h1 = h1 + 1; }
  if (h1 >= 24) h1 = 0;

  s2 = s2 + 1;
  if (s2 >= 60) { s2 = 0; m2 = m2 + 1; }
  if (m2 >= 60) { m2 = 0; h2 = h2 + 1; }
  if (h2 >= 24) h2 = 0;

  label_set_text(time1, padZero(h1) + ":" + padZero(m1) + ":" + padZero(s1));
  label_set_text(time2, padZero(h2) + ":" + padZero(m2) + ":" + padZero(s2));
};

update_clock();
print("Dual Clock ready!");
create_timer("update_clock", 1000);
