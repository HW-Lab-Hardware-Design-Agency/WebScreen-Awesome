"use strict";

print("Starting Timer & Stopwatch...");

// Mode: 0 = Stopwatch, 1 = Timer
let mode = 0;
let isRunning = 0;

// Stopwatch state (in centiseconds)
let stopwatchTime = 0;
let lapCount = 0;
let lastLapTime = 0;

// Timer state (in seconds)
let timerTotal = 300; // 5 minutes default
let timerRemaining = 300;
let timerFinished = 0;

// Create styles
let modeStyle = create_style();
style_set_text_font(modeStyle, 18);
style_set_text_color(modeStyle, 0x888888);
style_set_text_align(modeStyle, 1);

let modeActiveStyle = create_style();
style_set_text_font(modeActiveStyle, 18);
style_set_text_color(modeActiveStyle, 0x00BFFF);
style_set_text_align(modeActiveStyle, 1);

let timeStyle = create_style();
style_set_text_font(timeStyle, 72);
style_set_text_color(timeStyle, 0xFFFFFF);
style_set_text_align(timeStyle, 1);

let msStyle = create_style();
style_set_text_font(msStyle, 36);
style_set_text_color(msStyle, 0x888888);
style_set_text_align(msStyle, 0);

let statusStyle = create_style();
style_set_text_font(statusStyle, 20);
style_set_text_color(statusStyle, 0x00FF00);
style_set_text_align(statusStyle, 1);

let lapStyle = create_style();
style_set_text_font(lapStyle, 16);
style_set_text_color(lapStyle, 0xAAAAAA);
style_set_text_align(lapStyle, 0);

let buttonStyle = create_style();
style_set_text_font(buttonStyle, 20);
style_set_text_color(buttonStyle, 0xFFFFFF);
style_set_text_align(buttonStyle, 1);
style_set_bg_color(buttonStyle, 0x333344);
style_set_bg_opa(buttonStyle, 255);
style_set_width(buttonStyle, 80);
style_set_height(buttonStyle, 36);
style_set_radius(buttonStyle, 18);

let startButtonStyle = create_style();
style_set_text_font(startButtonStyle, 20);
style_set_text_color(startButtonStyle, 0xFFFFFF);
style_set_text_align(startButtonStyle, 1);
style_set_bg_color(startButtonStyle, 0x00AA44);
style_set_bg_opa(startButtonStyle, 255);
style_set_width(startButtonStyle, 80);
style_set_height(startButtonStyle, 36);
style_set_radius(startButtonStyle, 18);

let stopButtonStyle = create_style();
style_set_text_font(stopButtonStyle, 20);
style_set_text_color(stopButtonStyle, 0xFFFFFF);
style_set_text_align(stopButtonStyle, 1);
style_set_bg_color(stopButtonStyle, 0xAA3333);
style_set_bg_opa(stopButtonStyle, 255);
style_set_width(stopButtonStyle, 80);
style_set_height(stopButtonStyle, 36);
style_set_radius(stopButtonStyle, 18);

// Mode tabs
let stopwatchTab = create_label(180, 15);
obj_add_style(stopwatchTab, modeActiveStyle, 0);
label_set_text(stopwatchTab, "STOPWATCH");

let timerTab = create_label(356, 15);
obj_add_style(timerTab, modeStyle, 0);
label_set_text(timerTab, "TIMER");

// Main time display
let timeLabel = create_label(220, 70);
obj_add_style(timeLabel, timeStyle, 0);
label_set_text(timeLabel, "00:00");

let msLabel = create_label(355, 100);
obj_add_style(msLabel, msStyle, 0);
label_set_text(msLabel, ".00");

// Status label
let statusLabel = create_label(268, 150);
obj_add_style(statusLabel, statusStyle, 0);
label_set_text(statusLabel, "Ready");

// Lap display
let lapLabel = create_label(40, 180);
obj_add_style(lapLabel, lapStyle, 0);
label_set_text(lapLabel, "");

// Control buttons
let startButton = create_label(178, 200);
obj_add_style(startButton, startButtonStyle, 0);
label_set_text(startButton, "Start");

let resetButton = create_label(268, 200);
obj_add_style(resetButton, buttonStyle, 0);
label_set_text(resetButton, "Reset");

let lapButton = create_label(358, 200);
obj_add_style(lapButton, buttonStyle, 0);
label_set_text(lapButton, "Lap");

// Helper functions
let padZero = function(num) {
  if (num < 10) {
    return "0" + numberToString(num);
  }
  return numberToString(num);
};

let formatStopwatch = function(cs) {
  let totalSecs = cs / 100;
  totalSecs = totalSecs - (totalSecs % 1);

  let mins = totalSecs / 60;
  mins = mins - (mins % 1);

  let secs = totalSecs - (mins * 60);

  let centis = cs % 100;

  return padZero(mins) + ":" + padZero(secs) + "." + padZero(centis);
};

let formatTimer = function(secs) {
  let mins = secs / 60;
  mins = mins - (mins % 1);

  let s = secs - (mins * 60);

  return padZero(mins) + ":" + padZero(s);
};

// Update stopwatch display
let updateStopwatchDisplay = function() {
  let totalSecs = stopwatchTime / 100;
  totalSecs = totalSecs - (totalSecs % 1);

  let mins = totalSecs / 60;
  mins = mins - (mins % 1);

  let secs = totalSecs - (mins * 60);

  let centis = stopwatchTime % 100;

  label_set_text(timeLabel, padZero(mins) + ":" + padZero(secs));
  label_set_text(msLabel, "." + padZero(centis));
};

// Update timer display
let updateTimerDisplay = function() {
  let mins = timerRemaining / 60;
  mins = mins - (mins % 1);

  let secs = timerRemaining - (mins * 60);

  label_set_text(timeLabel, padZero(mins) + ":" + padZero(secs));
  label_set_text(msLabel, "");

  if (timerRemaining <= 0 && timerFinished === 0) {
    timerFinished = 1;
    isRunning = 0;
    style_set_text_color(statusStyle, 0xFF4444);
    label_set_text(statusLabel, "Time's Up!");
    obj_add_style(startButton, startButtonStyle, 0);
    label_set_text(startButton, "Start");
    print("Timer finished!");
  }
};

// Stopwatch tick (every 10ms = 1 centisecond)
let stopwatch_tick = function() {
  if (isRunning === 0) return;
  if (mode !== 0) return;

  stopwatchTime++;
  updateStopwatchDisplay();
};

// Timer tick (every second)
let timer_tick = function() {
  if (isRunning === 0) return;
  if (mode !== 1) return;

  timerRemaining--;
  if (timerRemaining < 0) timerRemaining = 0;
  updateTimerDisplay();
};

// Demo automation
let demoStep = 0;
let demoTimer = 0;

let demo_update = function() {
  demoTimer++;

  // Demo sequence
  if (demoTimer === 2 && demoStep === 0) {
    // Start stopwatch
    isRunning = 1;
    style_set_text_color(statusStyle, 0x00FF00);
    label_set_text(statusLabel, "Running");
    obj_add_style(startButton, stopButtonStyle, 0);
    label_set_text(startButton, "Stop");
    demoStep = 1;
    print("Stopwatch started");
  } else if (demoTimer === 5 && demoStep === 1) {
    // Record lap
    lapCount++;
    let lapTime = stopwatchTime - lastLapTime;
    lastLapTime = stopwatchTime;
    label_set_text(lapLabel, "Lap " + numberToString(lapCount) + ": " + formatStopwatch(lapTime));
    print("Lap recorded");
  } else if (demoTimer === 8 && demoStep === 1) {
    // Stop stopwatch
    isRunning = 0;
    style_set_text_color(statusStyle, 0xFFAA00);
    label_set_text(statusLabel, "Paused");
    obj_add_style(startButton, startButtonStyle, 0);
    label_set_text(startButton, "Start");
    demoStep = 2;
    print("Stopwatch paused");
  } else if (demoTimer === 11 && demoStep === 2) {
    // Switch to timer mode
    mode = 1;
    obj_add_style(stopwatchTab, modeStyle, 0);
    obj_add_style(timerTab, modeActiveStyle, 0);
    label_set_text(lapButton, "+1m");
    label_set_text(lapLabel, "");

    // Reset timer
    timerRemaining = 10; // 10 seconds for demo
    timerFinished = 0;
    updateTimerDisplay();
    label_set_text(statusLabel, "Ready");
    style_set_text_color(statusStyle, 0x888888);
    demoStep = 3;
    print("Switched to Timer mode");
  } else if (demoTimer === 13 && demoStep === 3) {
    // Start timer
    isRunning = 1;
    style_set_text_color(statusStyle, 0x00FF00);
    label_set_text(statusLabel, "Running");
    obj_add_style(startButton, stopButtonStyle, 0);
    label_set_text(startButton, "Stop");
    demoStep = 4;
    print("Timer started");
  } else if (demoTimer === 25 && demoStep === 4) {
    // Reset and switch back to stopwatch
    demoTimer = 0;
    demoStep = 0;
    mode = 0;
    isRunning = 0;

    obj_add_style(stopwatchTab, modeActiveStyle, 0);
    obj_add_style(timerTab, modeStyle, 0);
    label_set_text(lapButton, "Lap");

    // Reset stopwatch
    stopwatchTime = 0;
    lapCount = 0;
    lastLapTime = 0;
    updateStopwatchDisplay();

    label_set_text(statusLabel, "Ready");
    style_set_text_color(statusStyle, 0x888888);
    obj_add_style(startButton, startButtonStyle, 0);
    label_set_text(startButton, "Start");
    label_set_text(lapLabel, "");

    print("Demo cycle complete, restarting...");
  }
};

// Initialize display
updateStopwatchDisplay();

// Start timers
create_timer("stopwatch_tick", 10);
create_timer("timer_tick", 1000);
create_timer("demo_update", 1000);

print("Timer & Stopwatch ready!");
