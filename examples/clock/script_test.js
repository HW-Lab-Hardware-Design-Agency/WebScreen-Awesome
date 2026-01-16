"use strict";

print("Test script starting...");

// Just wait for WiFi
for (;;) {
  if (wifi_status()) break;
  delay(500);
}
print("WiFi connected!");

// Create a simple label
let style = create_style();
style_set_text_font(style, 48);
style_set_text_color(style, 0xFFFFFF);

let label = create_label(200, 100);
obj_add_style(label, style, 0);
label_set_text(label, "Test OK");

print("Test complete - no timer");
