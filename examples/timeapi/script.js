"use strict";

print("Starting Clock...");

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

if (ntp_synced()) {
  print("NTP synced! Time: " + numberToString(get_hours()) + ":" + numberToString(get_minutes()));
}

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
  let hour = get_hours();
  let minute = get_minutes();
  let seconds = get_seconds();

  if (hour < 0) return;

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
