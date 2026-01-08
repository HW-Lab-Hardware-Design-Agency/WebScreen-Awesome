"use strict";

print("Starting Pomodoro Timer...");

// Timer configuration (in seconds)
let WORK_TIME = 25 * 60;      // 25 minutes
let SHORT_BREAK = 5 * 60;     // 5 minutes
let LONG_BREAK = 15 * 60;     // 15 minutes
let SESSIONS_BEFORE_LONG = 4;

// State
let timeRemaining = WORK_TIME;
let isRunning = 0;
let isWorkSession = 1;
let completedSessions = 0;
let totalWorkTime = 0;

// Colors
let COLOR_BG = 0x1a1a2e;
let COLOR_CIRCLE = 0x16213e;
let COLOR_CIRCLE_BREAK = 0x0f3460;
let COLOR_WHITE = 0xFFFFFF;
let COLOR_TEXT = 0xeee2dc;
let COLOR_RED = 0xe94560;
let COLOR_GREEN = 0x22c55e;
let COLOR_GRAY = 0x94a3b8;
let COLOR_DARK = 0x0f3460;
let COLOR_DIM = 0x64748b;

// Create styles
let titleStyle = create_style();
style_set_text_font(titleStyle, 24);
style_set_text_color(titleStyle, COLOR_TEXT);
style_set_text_align(titleStyle, 1);

let sessionStyle = create_style();
style_set_text_font(sessionStyle, 20);
style_set_text_color(sessionStyle, COLOR_RED);
style_set_text_align(sessionStyle, 1);

let circleStyle = create_style();
style_set_bg_color(circleStyle, COLOR_CIRCLE);
style_set_bg_opa(circleStyle, 255);
style_set_radius(circleStyle, 120);
style_set_width(circleStyle, 240);
style_set_height(circleStyle, 240);

let timerStyle = create_style();
style_set_text_font(timerStyle, 48);
style_set_text_color(timerStyle, COLOR_WHITE);
style_set_text_align(timerStyle, 1);

let progressStyle = create_style();
style_set_text_font(progressStyle, 14);
style_set_text_color(progressStyle, COLOR_DARK);
style_set_text_align(progressStyle, 1);

let statusStyle = create_style();
style_set_text_font(statusStyle, 16);
style_set_text_color(statusStyle, COLOR_GRAY);
style_set_text_align(statusStyle, 1);

let dotStyle1 = create_style();
style_set_bg_color(dotStyle1, COLOR_DARK);
style_set_bg_opa(dotStyle1, 255);
style_set_radius(dotStyle1, 8);
style_set_width(dotStyle1, 16);
style_set_height(dotStyle1, 16);

let dotStyle2 = create_style();
style_set_bg_color(dotStyle2, COLOR_DARK);
style_set_bg_opa(dotStyle2, 255);
style_set_radius(dotStyle2, 8);
style_set_width(dotStyle2, 16);
style_set_height(dotStyle2, 16);

let dotStyle3 = create_style();
style_set_bg_color(dotStyle3, COLOR_DARK);
style_set_bg_opa(dotStyle3, 255);
style_set_radius(dotStyle3, 8);
style_set_width(dotStyle3, 16);
style_set_height(dotStyle3, 16);

let dotStyle4 = create_style();
style_set_bg_color(dotStyle4, COLOR_DARK);
style_set_bg_opa(dotStyle4, 255);
style_set_radius(dotStyle4, 8);
style_set_width(dotStyle4, 16);
style_set_height(dotStyle4, 16);

let statsStyle = create_style();
style_set_text_font(statsStyle, 12);
style_set_text_color(statsStyle, COLOR_DIM);
style_set_text_align(statsStyle, 0);

// Create UI elements
let titleLabel = create_label(233, 30);
obj_add_style(titleLabel, titleStyle, 0);
label_set_text(titleLabel, "POMODORO");

let sessionLabel = create_label(233, 70);
obj_add_style(sessionLabel, sessionStyle, 0);
label_set_text(sessionLabel, "FOCUS");

let circleBg = create_label(113, 110);
obj_add_style(circleBg, circleStyle, 0);
label_set_text(circleBg, "");

let timerLabel = create_label(233, 200);
obj_add_style(timerLabel, timerStyle, 0);
label_set_text(timerLabel, "25:00");

let progressLabel = create_label(233, 270);
obj_add_style(progressLabel, progressStyle, 0);
label_set_text(progressLabel, "0%");

let statusLabel = create_label(233, 370);
obj_add_style(statusLabel, statusStyle, 0);
label_set_text(statusLabel, "Tap to start");

// Session dots
let dot1 = create_label(183, 410);
obj_add_style(dot1, dotStyle1, 0);
label_set_text(dot1, "");

let dot2 = create_label(213, 410);
obj_add_style(dot2, dotStyle2, 0);
label_set_text(dot2, "");

let dot3 = create_label(243, 410);
obj_add_style(dot3, dotStyle3, 0);
label_set_text(dot3, "");

let dot4 = create_label(273, 410);
obj_add_style(dot4, dotStyle4, 0);
label_set_text(dot4, "");

let statsLabel = create_label(20, 441);
obj_add_style(statsLabel, statsStyle, 0);
label_set_text(statsLabel, "Sessions: 0 | Focus: 0 min");

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
    let sessionsInCycle = completedSessions % SESSIONS_BEFORE_LONG;

    if (sessionsInCycle >= 1) {
        style_set_bg_color(dotStyle1, COLOR_RED);
    } else {
        style_set_bg_color(dotStyle1, COLOR_DARK);
    }

    if (sessionsInCycle >= 2) {
        style_set_bg_color(dotStyle2, COLOR_RED);
    } else {
        style_set_bg_color(dotStyle2, COLOR_DARK);
    }

    if (sessionsInCycle >= 3) {
        style_set_bg_color(dotStyle3, COLOR_RED);
    } else {
        style_set_bg_color(dotStyle3, COLOR_DARK);
    }

    if (sessionsInCycle >= 4) {
        style_set_bg_color(dotStyle4, COLOR_RED);
    } else {
        style_set_bg_color(dotStyle4, COLOR_DARK);
    }
};

// Update display
let updateDisplay = function() {
    label_set_text(timerLabel, formatTime(timeRemaining));

    // Session type styling
    if (isWorkSession) {
        label_set_text(sessionLabel, "FOCUS");
        style_set_text_color(sessionStyle, COLOR_RED);
        style_set_bg_color(circleStyle, COLOR_CIRCLE);
    } else {
        label_set_text(sessionLabel, "BREAK");
        style_set_text_color(sessionStyle, COLOR_GREEN);
        style_set_bg_color(circleStyle, COLOR_CIRCLE_BREAK);
    }

    // Progress percentage
    let totalTime = WORK_TIME;
    if (!isWorkSession) {
        if (completedSessions % SESSIONS_BEFORE_LONG === 0) {
            totalTime = LONG_BREAK;
        } else {
            totalTime = SHORT_BREAK;
        }
    }
    let elapsed = totalTime - timeRemaining;
    let progress = (elapsed * 100) / totalTime;
    progress = progress - (progress % 1);
    label_set_text(progressLabel, numberToString(progress) + "%");

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
    label_set_text(statsLabel, "Sessions: " + numberToString(completedSessions) + " | Focus: " + numberToString(totalMins) + " min");
};

// Complete current session
let completeSession = function() {
    if (isWorkSession) {
        completedSessions = completedSessions + 1;
        totalWorkTime = totalWorkTime + WORK_TIME;

        // Start break
        isWorkSession = 0;
        if (completedSessions % SESSIONS_BEFORE_LONG === 0) {
            timeRemaining = LONG_BREAK;
            print("Long break started!");
        } else {
            timeRemaining = SHORT_BREAK;
            print("Short break started!");
        }
    } else {
        // Start work session
        isWorkSession = 1;
        timeRemaining = WORK_TIME;
        print("Work session started!");
    }
};

// Timer tick - runs every second
let timer_tick = function() {
    if (!isRunning) return;

    if (timeRemaining > 0) {
        timeRemaining = timeRemaining - 1;

        if (timeRemaining <= 0) {
            completeSession();
        }
    }

    updateDisplay();
};

// Demo automation
let demoStep = 0;
let demoTimer = 0;

let demo_update = function() {
    demoTimer = demoTimer + 1;

    if (demoTimer === 2 && demoStep === 0) {
        // Start timer
        isRunning = 1;
        print("Pomodoro started");
        demoStep = 1;
    } else if (demoTimer === 30 && demoStep === 1) {
        // Simulate quick session completion for demo
        timeRemaining = 1;
    }

    updateDisplay();
};

// Initialize
updateDisplay();
print("Pomodoro Timer ready!");

// Start timers
create_timer("timer_tick", 1000);
create_timer("demo_update", 1000);
