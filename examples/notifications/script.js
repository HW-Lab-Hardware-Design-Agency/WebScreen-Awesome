"use strict";

print("Starting Notification Center...");

// Notification state
let notifCount = 0;
let currentNotif = 0;
let demoIndex = 0;

// Demo notifications
let demoTitles = "New Message,Calendar Reminder,Weather Alert,System Update,Email Received";
let demoMessages = "John: Hey are you free tonight?,Meeting in 30 minutes,Rain expected this afternoon,Firmware v2.1 available,3 new emails from work";
let demoSources = "Messages,Calendar,Weather,System,Email";
let demoColors = "0x00BFFF,0xFFAA00,0x00FF00,0xFF6600,0xFF4444";

// Get value from comma-separated string
let getItem = function(str, idx) {
  let len = str_length(str);
  let pos = 0;
  let count = 0;
  let start = 0;
  while (pos <= len) {
    let c = "";
    if (pos < len) {
      c = str_substring(str, pos, 1);
    }
    if (c === "," || pos === len) {
      if (count === idx) {
        return str_substring(str, start, pos - start);
      }
      count++;
      start = pos + 1;
    }
    pos++;
  }
  return "";
};

// Create styles
let headerStyle = create_style();
style_set_text_font(headerStyle, 20);
style_set_text_color(headerStyle, 0xFFFFFF);
style_set_text_align(headerStyle, 0);

let countStyle = create_style();
style_set_text_font(countStyle, 16);
style_set_text_color(countStyle, 0x888888);
style_set_text_align(countStyle, 2);

let sourceStyle = create_style();
style_set_text_font(sourceStyle, 14);
style_set_text_color(sourceStyle, 0x00BFFF);
style_set_text_align(sourceStyle, 0);

let titleStyle = create_style();
style_set_text_font(titleStyle, 24);
style_set_text_color(titleStyle, 0xFFFFFF);
style_set_text_align(titleStyle, 0);

let messageStyle = create_style();
style_set_text_font(messageStyle, 18);
style_set_text_color(messageStyle, 0xAAAAAA);
style_set_text_align(messageStyle, 0);

let timeStyle = create_style();
style_set_text_font(timeStyle, 14);
style_set_text_color(timeStyle, 0x666666);
style_set_text_align(timeStyle, 0);

let emptyStyle = create_style();
style_set_text_font(emptyStyle, 24);
style_set_text_color(emptyStyle, 0x666666);
style_set_text_align(emptyStyle, 1);

let navStyle = create_style();
style_set_text_font(navStyle, 20);
style_set_text_color(navStyle, 0x888888);
style_set_text_align(navStyle, 1);

// Header bar
let headerLabel = create_label(20, 15);
obj_add_style(headerLabel, headerStyle, 0);
label_set_text(headerLabel, "Notifications");

let countLabel = create_label(490, 15);
obj_add_style(countLabel, countStyle, 0);
label_set_text(countLabel, "0 new");

// Notification card background
let cardBg = create_label(20, 50);
let cardStyle = create_style();
style_set_bg_color(cardStyle, 0x222233);
style_set_bg_opa(cardStyle, 255);
style_set_width(cardStyle, 496);
style_set_height(cardStyle, 130);
style_set_radius(cardStyle, 12);
obj_add_style(cardBg, cardStyle, 0);
label_set_text(cardBg, "");

// Notification indicator dot
let indicatorDot = create_label(35, 65);
let dotStyle = create_style();
style_set_bg_color(dotStyle, 0x00BFFF);
style_set_bg_opa(dotStyle, 255);
style_set_width(dotStyle, 12);
style_set_height(dotStyle, 12);
style_set_radius(dotStyle, 6);
obj_add_style(indicatorDot, dotStyle, 0);
label_set_text(indicatorDot, "");

// Source label
let sourceLabel = create_label(55, 62);
obj_add_style(sourceLabel, sourceStyle, 0);
label_set_text(sourceLabel, "");

// Title label
let notifTitleLabel = create_label(35, 85);
obj_add_style(notifTitleLabel, titleStyle, 0);
label_set_text(notifTitleLabel, "");

// Message label
let messageLabel = create_label(35, 115);
obj_add_style(messageLabel, messageStyle, 0);
label_set_text(messageLabel, "");

// Time label
let timeLabel = create_label(35, 150);
obj_add_style(timeLabel, timeStyle, 0);
label_set_text(timeLabel, "");

// Empty state label
let emptyLabel = create_label(268, 100);
obj_add_style(emptyLabel, emptyStyle, 0);
label_set_text(emptyLabel, "No notifications");

// Navigation indicators
let prevNav = create_label(200, 195);
obj_add_style(prevNav, navStyle, 0);
label_set_text(prevNav, "<");

let pageLabel = create_label(268, 195);
obj_add_style(pageLabel, navStyle, 0);
label_set_text(pageLabel, "");

let nextNav = create_label(336, 195);
obj_add_style(nextNav, navStyle, 0);
label_set_text(nextNav, ">");

// Stored notifications (max 5)
let storedTitles = ",,,,";
let storedMessages = ",,,,";
let storedSources = ",,,,";
let storedTimes = ",,,,";

// Set value in comma-separated string
let setItem = function(str, idx, val) {
  let len = str_length(str);
  let result = "";
  let pos = 0;
  let count = 0;
  let start = 0;
  while (pos <= len) {
    let c = "";
    if (pos < len) {
      c = str_substring(str, pos, 1);
    }
    if (c === "," || pos === len) {
      if (count === idx) {
        if (result !== "") result = result + ",";
        result = result + val;
      } else {
        if (result !== "") result = result + ",";
        result = result + str_substring(str, start, pos - start);
      }
      count++;
      start = pos + 1;
    }
    pos++;
  }
  return result;
};

// Update notification display
let updateDisplay = function() {
  if (notifCount === 0) {
    label_set_text(emptyLabel, "No notifications");
    label_set_text(sourceLabel, "");
    label_set_text(notifTitleLabel, "");
    label_set_text(messageLabel, "");
    label_set_text(timeLabel, "");
    label_set_text(pageLabel, "");
    label_set_text(countLabel, "0 new");
    return;
  }

  label_set_text(emptyLabel, "");

  let title = getItem(storedTitles, currentNotif);
  let message = getItem(storedMessages, currentNotif);
  let source = getItem(storedSources, currentNotif);
  let time = getItem(storedTimes, currentNotif);

  label_set_text(sourceLabel, source);
  label_set_text(notifTitleLabel, title);
  label_set_text(messageLabel, message);
  label_set_text(timeLabel, time);

  let page = numberToString(currentNotif + 1) + " / " + numberToString(notifCount);
  label_set_text(pageLabel, page);
  label_set_text(countLabel, numberToString(notifCount) + " new");
};

// Add a new notification
let addNotification = function(title, message, source) {
  // Shift existing notifications
  let i = 3;
  while (i >= 0) {
    storedTitles = setItem(storedTitles, i + 1, getItem(storedTitles, i));
    storedMessages = setItem(storedMessages, i + 1, getItem(storedMessages, i));
    storedSources = setItem(storedSources, i + 1, getItem(storedSources, i));
    storedTimes = setItem(storedTimes, i + 1, getItem(storedTimes, i));
    i--;
  }

  // Add new notification at front
  storedTitles = setItem(storedTitles, 0, title);
  storedMessages = setItem(storedMessages, 0, message);
  storedSources = setItem(storedSources, 0, source);
  storedTimes = setItem(storedTimes, 0, "Just now");

  notifCount++;
  if (notifCount > 5) notifCount = 5;
  currentNotif = 0;

  updateDisplay();
  print("New notification: " + title);
};

// Demo: Add notifications periodically
let demoTimer = 0;

let demo_update = function() {
  demoTimer++;

  // Add a demo notification every 8 seconds
  if (demoTimer >= 8) {
    demoTimer = 0;

    let title = getItem(demoTitles, demoIndex);
    let message = getItem(demoMessages, demoIndex);
    let source = getItem(demoSources, demoIndex);

    addNotification(title, message, source);

    demoIndex++;
    if (demoIndex > 4) demoIndex = 0;
  }

  // Update time display for aging notifications
  if (demoTimer === 4 && notifCount > 0) {
    storedTimes = setItem(storedTimes, 0, "1m ago");
    if (notifCount > 1) storedTimes = setItem(storedTimes, 1, "2m ago");
    updateDisplay();
  }
};

// Cycle through notifications
let cycleCounter = 0;

let cycle_notifs = function() {
  cycleCounter++;

  // Cycle to next notification every 5 seconds
  if (cycleCounter >= 5 && notifCount > 1) {
    cycleCounter = 0;
    currentNotif++;
    if (currentNotif >= notifCount) currentNotif = 0;
    updateDisplay();
  }
};

// Initialize display
updateDisplay();

// Start demo
create_timer("demo_update", 1000);
create_timer("cycle_notifs", 1000);

print("Notification Center ready!");
