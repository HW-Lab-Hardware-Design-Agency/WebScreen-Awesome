"use strict";

print("Starting Timer...");

let remaining = 300;
let running = 1;

let bigStyle = create_style();
style_set_text_font(bigStyle, 48);
style_set_text_color(bigStyle, 0xFFFFFF);
style_set_text_align(bigStyle, 1);

let smallStyle = create_style();
style_set_text_font(smallStyle, 24);
style_set_text_color(smallStyle, 0x00FF00);
style_set_text_align(smallStyle, 1);

let timerLabel = create_label(268, 80);
obj_add_style(timerLabel, bigStyle, 0);

let statusLabel = create_label(268, 150);
obj_add_style(statusLabel, smallStyle, 0);
label_set_text(statusLabel, "Running");

let padZero = function(n) {
  if (n < 10) return "0" + numberToString(n);
  return numberToString(n);
};

let timer_tick = function() {
  if (running === 0) return;

  remaining = remaining - 1;

  if (remaining <= 0) {
    remaining = 0;
    running = 0;
    style_set_text_color(smallStyle, 0xFF4444);
    label_set_text(statusLabel, "Done!");
  }

  let m = remaining / 60;
  m = m - (m % 1);
  let s = remaining % 60;
  label_set_text(timerLabel, padZero(m) + ":" + padZero(s));
};

timer_tick();
print("Timer ready!");
create_timer("timer_tick", 1000);
