"use strict";

print("Starting Pomodoro...");

let WORK_TIME = 25 * 60;
let BREAK_TIME = 5 * 60;

let timeRemaining = WORK_TIME;
let isWork = 1;
let sessions = 0;

let bigStyle = create_style();
style_set_text_font(bigStyle, 48);
style_set_text_color(bigStyle, 0xFFFFFF);
style_set_text_align(bigStyle, 1);

let smallStyle = create_style();
style_set_text_font(smallStyle, 28);
style_set_text_color(smallStyle, 0xe94560);
style_set_text_align(smallStyle, 1);

let timerLabel = create_label(268, 80);
obj_add_style(timerLabel, bigStyle, 0);
label_set_text(timerLabel, "25:00");

let statusLabel = create_label(268, 150);
obj_add_style(statusLabel, smallStyle, 0);
label_set_text(statusLabel, "FOCUS");

let padZero = function(n) {
    if (n < 10) return "0" + numberToString(n);
    return numberToString(n);
};

let timer_tick = function() {
    timeRemaining = timeRemaining - 1;

    if (timeRemaining <= 0) {
        if (isWork) {
            sessions = sessions + 1;
            isWork = 0;
            timeRemaining = BREAK_TIME;
            style_set_text_color(smallStyle, 0x22c55e);
            label_set_text(statusLabel, "BREAK");
        } else {
            isWork = 1;
            timeRemaining = WORK_TIME;
            style_set_text_color(smallStyle, 0xe94560);
            label_set_text(statusLabel, "FOCUS");
        }
    }

    let m = timeRemaining / 60;
    m = m - (m % 1);
    let s = timeRemaining % 60;
    label_set_text(timerLabel, padZero(m) + ":" + padZero(s));
};

print("Pomodoro ready!");
create_timer("timer_tick", 1000);
