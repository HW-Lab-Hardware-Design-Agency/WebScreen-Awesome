"use strict";

print("Starting Reminders...");

let rem1 = "09:00 Team standup";
let rem2 = "10:30 Review PRs";
let rem3 = "12:00 Lunch break";
let rem4 = "14:00 Client call";

let done1 = 0;
let done2 = 0;
let done3 = 0;
let done4 = 0;

let hour = 8;
let minute = 45;

let titleStyle = create_style();
style_set_text_font(titleStyle, 20);
style_set_text_color(titleStyle, 0x16a34a);

let itemStyle = create_style();
style_set_text_font(itemStyle, 20);
style_set_text_color(itemStyle, 0xFFFFFF);

let timeStyle = create_style();
style_set_text_font(timeStyle, 14);
style_set_text_color(timeStyle, 0x888888);

let title = create_label(30, 15);
obj_add_style(title, titleStyle, 0);
label_set_text(title, "REMINDERS");

let clock = create_label(430, 15);
obj_add_style(clock, timeStyle, 0);
label_set_text(clock, "08:45");

let line1 = create_label(30, 50);
obj_add_style(line1, itemStyle, 0);
label_set_text(line1, "[ ] " + rem1);

let line2 = create_label(30, 85);
obj_add_style(line2, itemStyle, 0);
label_set_text(line2, "[ ] " + rem2);

let line3 = create_label(30, 120);
obj_add_style(line3, itemStyle, 0);
label_set_text(line3, "[ ] " + rem3);

let line4 = create_label(30, 155);
obj_add_style(line4, itemStyle, 0);
label_set_text(line4, "[ ] " + rem4);

let status = create_label(30, 200);
obj_add_style(status, timeStyle, 0);
label_set_text(status, "4 pending");

let padZero = function(n) {
    if (n < 10) return "0" + numberToString(n);
    return numberToString(n);
};

let tick = 0;

let update_tick = function() {
    tick = tick + 1;

    if (tick % 5 === 0) {
        minute = minute + 15;
        if (minute >= 60) {
            minute = minute - 60;
            hour = hour + 1;
        }
    }

    label_set_text(clock, padZero(hour) + ":" + padZero(minute));

    let t = hour * 100 + minute;
    if (t > 900 && done1 === 0) {
        done1 = 1;
        label_set_text(line1, "[X] " + rem1);
    }
    if (t > 1030 && done2 === 0) {
        done2 = 1;
        label_set_text(line2, "[X] " + rem2);
    }
    if (t > 1200 && done3 === 0) {
        done3 = 1;
        label_set_text(line3, "[X] " + rem3);
    }
    if (t > 1400 && done4 === 0) {
        done4 = 1;
        label_set_text(line4, "[X] " + rem4);
    }

    let pending = 4 - done1 - done2 - done3 - done4;
    label_set_text(status, numberToString(pending) + " pending");
};

print("Reminders ready!");
create_timer("update_tick", 1000);
