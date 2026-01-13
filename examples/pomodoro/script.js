"use strict";

print("Starting Pomodoro Timer...");

// Timer configuration (in seconds)
let WORK_TIME = 25 * 60;      // 25 minutes
let SHORT_BREAK = 5 * 60;     // 5 minutes
let LONG_BREAK = 15 * 60;     // 15 minutes
let LONG_CYCLE = 4;

// State
let timeRemaining = WORK_TIME;
let isRunning = 0;
let isWorkSession = 1;
let completedSessions = 0;
let totalWorkTime = 0;

// Colors - red/tomato theme
let COLOR_BG = 0x2e1a1a;
let COLOR_CIRCLE = 0xc41e3a;
let COLOR_CIRCLE_BREAK = 0x228b22;
let COLOR_WHITE = 0xFFFFFF;
let COLOR_TEXT = 0xeee2dc;
let COLOR_RED = 0xe94560;
let COLOR_GREEN = 0x22c55e;
let COLOR_GRAY = 0x94a3b8;
let COLOR_DARK = 0x4a1515;
let COLOR_DIM = 0x8b6464;

// Create styles
let titleStyle = create_style();
style_set_text_font(titleStyle, 20);
style_set_text_color(titleStyle, COLOR_TEXT);
style_set_text_align(titleStyle, 0);

let sessionStyle = create_style();
style_set_text_font(sessionStyle, 18);
style_set_text_color(sessionStyle, COLOR_RED);
style_set_text_align(sessionStyle, 0);

// Circle style for horizontal layout
let circleStyle = create_style();
style_set_bg_color(circleStyle, COLOR_CIRCLE);
style_set_bg_opa(circleStyle, 255);
style_set_radius(circleStyle, 85);
style_set_width(circleStyle, 170);
style_set_height(circleStyle, 170);

let timerStyle = create_style();
style_set_text_font(timerStyle, 48);
style_set_text_color(timerStyle, COLOR_WHITE);
style_set_text_align(timerStyle, 1);

let progressStyle = create_style();
style_set_text_font(progressStyle, 14);
style_set_text_color(progressStyle, COLOR_GRAY);
style_set_text_align(progressStyle, 1);

let statusStyle = create_style();
style_set_text_font(statusStyle, 14);
style_set_text_color(statusStyle, COLOR_GRAY);
style_set_text_align(statusStyle, 0);

let dotStyle1 = create_style();
style_set_bg_color(dotStyle1, COLOR_DARK);
style_set_bg_opa(dotStyle1, 255);
style_set_radius(dotStyle1, 7);
style_set_width(dotStyle1, 14);
style_set_height(dotStyle1, 14);

let dotStyle2 = create_style();
style_set_bg_color(dotStyle2, COLOR_DARK);
style_set_bg_opa(dotStyle2, 255);
style_set_radius(dotStyle2, 7);
style_set_width(dotStyle2, 14);
style_set_height(dotStyle2, 14);

let dotStyle3 = create_style();
style_set_bg_color(dotStyle3, COLOR_DARK);
style_set_bg_opa(dotStyle3, 255);
style_set_radius(dotStyle3, 7);
style_set_width(dotStyle3, 14);
style_set_height(dotStyle3, 14);

let dotStyle4 = create_style();
style_set_bg_color(dotStyle4, COLOR_DARK);
style_set_bg_opa(dotStyle4, 255);
style_set_radius(dotStyle4, 7);
style_set_width(dotStyle4, 14);
style_set_height(dotStyle4, 14);

let statsStyle = create_style();
style_set_text_font(statsStyle, 12);
style_set_text_color(statsStyle, COLOR_DIM);
style_set_text_align(statsStyle, 0);

// Create UI elements - horizontal layout
// Left side: timer circle
let circleBg = create_label(30, 35);
obj_add_style(circleBg, circleStyle, 0);
obj_set_size(circleBg, 170, 170);
label_set_text(circleBg, "");

let timerLabel = create_label(60, 100);
obj_add_style(timerLabel, timerStyle, 0);
label_set_text(timerLabel, "25:00");

let progressLabel = create_label(60, 150);
obj_add_style(progressLabel, progressStyle, 0);
label_set_text(progressLabel, "0%");

// Right side: info panel (x starting at 230)
let titleLabel = create_label(230, 25);
obj_add_style(titleLabel, titleStyle, 0);
label_set_text(titleLabel, "POMODORO");

let sessionLabel = create_label(230, 55);
obj_add_style(sessionLabel, sessionStyle, 0);
label_set_text(sessionLabel, "FOCUS");

let statusLabel = create_label(230, 90);
obj_add_style(statusLabel, statusStyle, 0);
label_set_text(statusLabel, "Tap to start");

// Session dots - horizontal row
let dot1 = create_label(230, 125);
obj_add_style(dot1, dotStyle1, 0);
label_set_text(dot1, "");

let dot2 = create_label(255, 125);
obj_add_style(dot2, dotStyle2, 0);
label_set_text(dot2, "");

let dot3 = create_label(280, 125);
obj_add_style(dot3, dotStyle3, 0);
label_set_text(dot3, "");

let dot4 = create_label(305, 125);
obj_add_style(dot4, dotStyle4, 0);
label_set_text(dot4, "");

let statsLabel = create_label(230, 160);
obj_add_style(statsLabel, statsStyle, 0);
label_set_text(statsLabel, "Sessions: 0");

let focusLabel = create_label(230, 180);
obj_add_style(focusLabel, statsStyle, 0);
label_set_text(focusLabel, "Focus: 0 min");

// Helper: pad number with zero
let padZero = function(num) {
    if (num < 10) {
        return "0" + numberToString(num);
    }
    return numberToString(num);
};

// Format time as MM:SS
let formatTime = function(seconds) {
    let mins = seconds / 60;
    mins = mins - (mins % 1);
    let secs = seconds % 60;
    return padZero(mins) + ":" + padZero(secs);
};

// Update session dots
let updateDots = function() {
    let cycle = completedSessions % LONG_CYCLE;

    if (cycle >= 1) {
        style_set_bg_color(dotStyle1, COLOR_RED);
    } else {
        style_set_bg_color(dotStyle1, COLOR_DARK);
    }

    if (cycle >= 2) {
        style_set_bg_color(dotStyle2, COLOR_RED);
    } else {
        style_set_bg_color(dotStyle2, COLOR_DARK);
    }

    if (cycle >= 3) {
        style_set_bg_color(dotStyle3, COLOR_RED);
    } else {
        style_set_bg_color(dotStyle3, COLOR_DARK);
    }

    if (cycle >= 4) {
        style_set_bg_color(dotStyle4, COLOR_RED);
    } else {
        style_set_bg_color(dotStyle4, COLOR_DARK);
    }
};

// Update display
let updateDisplay = function() {
    label_set_text(timerLabel, formatTime(timeRemaining));

    // Session type styling (circle stays red, text indicates mode)
    if (isWorkSession) {
        label_set_text(sessionLabel, "FOCUS");
        style_set_text_color(sessionStyle, COLOR_RED);
    } else {
        label_set_text(sessionLabel, "BREAK");
        style_set_text_color(sessionStyle, COLOR_GREEN);
    }

    // Progress percentage
    let totalTime = WORK_TIME;
    if (isWorkSession === 0) {
        let mod = completedSessions % LONG_CYCLE;
        if (mod === 0) {
            totalTime = LONG_BREAK;
        } else {
            totalTime = SHORT_BREAK;
        }
    }
    let elapsed = totalTime - timeRemaining;
    let progress = (elapsed * 100) / totalTime;
    progress = progress - (progress % 1);
    let pStr = numberToString(progress) + "%";
    label_set_text(progressLabel, pStr);

    // Status text
    if (isRunning) {
        if (isWorkSession) {
            label_set_text(statusLabel, "Stay focused!");
        } else {
            label_set_text(statusLabel, "Take a break");
        }
    } else {
        label_set_text(statusLabel, "Tap to start");
    }

    // Update dots
    updateDots();

    // Stats
    let totalMins = totalWorkTime / 60;
    totalMins = totalMins - (totalMins % 1);
    let n = numberToString(completedSessions);
    let sStr = "Sessions: " + n;
    label_set_text(statsLabel, sStr);
    let fStr = "Focus: " + numberToString(totalMins) + " min";
    label_set_text(focusLabel, fStr);
};

// Complete current session
let completeSession = function() {
    if (isWorkSession) {
        completedSessions = completedSessions + 1;
        totalWorkTime = totalWorkTime + WORK_TIME;
        isWorkSession = 0;
        let mod = completedSessions % LONG_CYCLE;
        if (mod === 0) {
            timeRemaining = LONG_BREAK;
            print("Long break!");
        } else {
            timeRemaining = SHORT_BREAK;
            print("Short break!");
        }
    } else {
        isWorkSession = 1;
        timeRemaining = WORK_TIME;
        print("Work session!");
    }
};

// Timer tick
let timer_tick = function() {
    if (isRunning === 0) {
        return;
    }
    timeRemaining = timeRemaining - 1;
    if (timeRemaining <= 0) {
        completeSession();
    }
    updateDisplay();
};

// Demo automation
let demoStep = 0;
let demoTimer = 0;

let demo_update = function() {
    demoTimer = demoTimer + 1;
    if (demoTimer === 2) {
        if (demoStep === 0) {
            isRunning = 1;
            print("Pomodoro started");
            demoStep = 1;
        }
    }
    if (demoTimer === 30) {
        if (demoStep === 1) {
            timeRemaining = 1;
        }
    }
    updateDisplay();
};

// GIF disabled for testing - may cause memory issues
// show_gif_from_sd("/tomato.gif", 100,100);

// Initialize
updateDisplay();
print("Pomodoro Timer ready!");

// Start timers
create_timer("timer_tick", 1000);
create_timer("demo_update", 1000);
