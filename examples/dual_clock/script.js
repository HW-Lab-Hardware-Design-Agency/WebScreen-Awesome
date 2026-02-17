"use strict";

print("Starting Dual Clock...");

// Wait for WiFi first, then NTP sync
let syncAttempts = 0;
if (wifi_status()) {
  for (;;) {
    if (ntp_synced()) break;
    delay(500);
    syncAttempts = syncAttempts + 1;
    print("Waiting for NTP sync...");
    if (syncAttempts > 20) {
      print("NTP sync timeout");
      break;
    }
  }
} else {
  print("No WiFi - NTP unavailable");
}

let config = sd_read_file("/webscreen.json");
let city1 = "Local";
let city2 = "UTC";
let offsetDiff = 0;

if (config !== "") {
  let c1 = parse_json_value(config, "city1");
  let c2 = parse_json_value(config, "city2");
  let od = parse_json_value(config, "offset_diff");
  if (c1 !== "") city1 = c1;
  if (c2 !== "") city2 = c2;
  if (od !== "") offsetDiff = toNumber(od);
}

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

let update_clock = function() {
  let h1 = get_hours();
  let m1 = get_minutes();
  let s1 = get_seconds();

  if (h1 < 0) return;

  // Calculate second timezone
  let h2 = h1 + offsetDiff;
  if (h2 >= 24) h2 = h2 - 24;
  if (h2 < 0) h2 = h2 + 24;

  label_set_text(time1, padZero(h1) + ":" + padZero(m1) + ":" + padZero(s1));
  label_set_text(time2, padZero(h2) + ":" + padZero(m1) + ":" + padZero(s1));
};

update_clock();
print("Dual Clock ready!");
create_timer("update_clock", 1000);
