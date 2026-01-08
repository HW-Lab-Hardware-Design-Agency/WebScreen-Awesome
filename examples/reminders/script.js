"use strict";

print("Starting Reminders...");

// Reminder data
let rem1_text = "Team standup meeting";
let rem1_time = "09:00";
let rem1_done = 0;
let rem1_priority = 2;  // 0=low, 1=med, 2=high

let rem2_text = "Review pull requests";
let rem2_time = "10:30";
let rem2_done = 0;
let rem2_priority = 1;

let rem3_text = "Lunch break";
let rem3_time = "12:00";
let rem3_done = 0;
let rem3_priority = 0;

let rem4_text = "Call with client";
let rem4_time = "14:00";
let rem4_done = 0;
let rem4_priority = 2;

let currentHour = 8;
let currentMin = 45;

// Colors
let COLOR_BG = 0xf0fdf4;
let COLOR_HEADER = 0x16a34a;
let COLOR_WHITE = 0xFFFFFF;
let COLOR_CARD = 0xFFFFFF;
let COLOR_TITLE = 0x1f2937;
let COLOR_GREEN = 0x16a34a;
let COLOR_YELLOW = 0xf59e0b;
let COLOR_RED = 0xdc2626;
let COLOR_GRAY = 0x6b7280;
let COLOR_LIGHT_GREEN = 0xdcfce7;

// Styles
let headerStyle = create_style();
style_set_text_font(headerStyle, 24);
style_set_text_color(headerStyle, COLOR_WHITE);

let timeStyle = create_style();
style_set_text_font(timeStyle, 20);
style_set_text_color(timeStyle, COLOR_WHITE);

let statsStyle = create_style();
style_set_text_font(statsStyle, 12);
style_set_text_color(statsStyle, COLOR_LIGHT_GREEN);

let textStyle = create_style();
style_set_text_font(textStyle, 16);
style_set_text_color(textStyle, COLOR_TITLE);

let badgeStyle1 = create_style();
style_set_text_font(badgeStyle1, 14);
style_set_text_color(badgeStyle1, COLOR_WHITE);
style_set_bg_color(badgeStyle1, COLOR_GREEN);
style_set_bg_opa(badgeStyle1, 255);
style_set_radius(badgeStyle1, 6);

let badgeStyle2 = create_style();
style_set_text_font(badgeStyle2, 14);
style_set_text_color(badgeStyle2, COLOR_WHITE);
style_set_bg_color(badgeStyle2, COLOR_GREEN);
style_set_bg_opa(badgeStyle2, 255);
style_set_radius(badgeStyle2, 6);

let badgeStyle3 = create_style();
style_set_text_font(badgeStyle3, 14);
style_set_text_color(badgeStyle3, COLOR_WHITE);
style_set_bg_color(badgeStyle3, COLOR_GREEN);
style_set_bg_opa(badgeStyle3, 255);
style_set_radius(badgeStyle3, 6);

let badgeStyle4 = create_style();
style_set_text_font(badgeStyle4, 14);
style_set_text_color(badgeStyle4, COLOR_WHITE);
style_set_bg_color(badgeStyle4, COLOR_GREEN);
style_set_bg_opa(badgeStyle4, 255);
style_set_radius(badgeStyle4, 6);

let catStyle = create_style();
style_set_text_font(catStyle, 12);
style_set_text_color(catStyle, COLOR_GRAY);

let checkStyle = create_style();
style_set_text_font(checkStyle, 20);
style_set_text_color(checkStyle, COLOR_GRAY);

let headerBgStyle = create_style();
style_set_bg_color(headerBgStyle, COLOR_HEADER);
style_set_bg_opa(headerBgStyle, 255);
style_set_width(headerBgStyle, 466);
style_set_height(headerBgStyle, 70);

let cardStyle = create_style();
style_set_bg_color(cardStyle, COLOR_CARD);
style_set_bg_opa(cardStyle, 255);
style_set_radius(cardStyle, 10);
style_set_width(cardStyle, 436);
style_set_height(cardStyle, 80);

// Header
let headerBg = create_label(0, 0);
obj_add_style(headerBg, headerBgStyle, 0);
label_set_text(headerBg, "");

let headerLabel = create_label(20, 12);
obj_add_style(headerLabel, headerStyle, 0);
label_set_text(headerLabel, "REMINDERS");

let clockLabel = create_label(380, 15);
obj_add_style(clockLabel, timeStyle, 0);
label_set_text(clockLabel, "08:45");

let statsLabel = create_label(20, 45);
obj_add_style(statsLabel, statsStyle, 0);
label_set_text(statsLabel, "Today: 4 pending | 0 done");

// Reminder cards
let card1 = create_label(15, 85);
obj_add_style(card1, cardStyle, 0);
label_set_text(card1, "");

let badge1 = create_label(25, 95);
obj_add_style(badge1, badgeStyle1, 0);
label_set_text(badge1, " 09:00 ");

let text1 = create_label(100, 100);
obj_add_style(text1, textStyle, 0);
label_set_text(text1, rem1_text);

let cat1 = create_label(100, 135);
obj_add_style(cat1, catStyle, 0);
label_set_text(cat1, "WORK");

let check1 = create_label(420, 105);
obj_add_style(check1, checkStyle, 0);
label_set_text(check1, "[ ]");

let card2 = create_label(15, 175);
obj_add_style(card2, cardStyle, 0);
label_set_text(card2, "");

let badge2 = create_label(25, 185);
obj_add_style(badge2, badgeStyle2, 0);
label_set_text(badge2, " 10:30 ");

let text2 = create_label(100, 190);
obj_add_style(text2, textStyle, 0);
label_set_text(text2, rem2_text);

let cat2 = create_label(100, 225);
obj_add_style(cat2, catStyle, 0);
label_set_text(cat2, "WORK");

let check2 = create_label(420, 195);
obj_add_style(check2, checkStyle, 0);
label_set_text(check2, "[ ]");

let card3 = create_label(15, 265);
obj_add_style(card3, cardStyle, 0);
label_set_text(card3, "");

let badge3 = create_label(25, 275);
obj_add_style(badge3, badgeStyle3, 0);
label_set_text(badge3, " 12:00 ");

let text3 = create_label(100, 280);
obj_add_style(text3, textStyle, 0);
label_set_text(text3, rem3_text);

let cat3 = create_label(100, 315);
obj_add_style(cat3, catStyle, 0);
label_set_text(cat3, "LIFE");

let check3 = create_label(420, 285);
obj_add_style(check3, checkStyle, 0);
label_set_text(check3, "[ ]");

let card4 = create_label(15, 355);
obj_add_style(card4, cardStyle, 0);
label_set_text(card4, "");

let badge4 = create_label(25, 365);
obj_add_style(badge4, badgeStyle4, 0);
label_set_text(badge4, " 14:00 ");

let text4 = create_label(100, 370);
obj_add_style(text4, textStyle, 0);
label_set_text(text4, rem4_text);

let cat4 = create_label(100, 405);
obj_add_style(cat4, catStyle, 0);
label_set_text(cat4, "WORK");

let check4 = create_label(420, 375);
obj_add_style(check4, checkStyle, 0);
label_set_text(check4, "[ ]");

// Format time
let formatClock = function() {
    let h = numberToString(currentHour);
    let m = numberToString(currentMin);
    if (currentHour < 10) h = "0" + h;
    if (currentMin < 10) m = "0" + m;
    return h + ":" + m;
};

// Update display
let updateDisplay = function() {
    label_set_text(clockLabel, formatClock());

    let done = 0;
    if (rem1_done) done = done + 1;
    if (rem2_done) done = done + 1;
    if (rem3_done) done = done + 1;
    if (rem4_done) done = done + 1;
    let pending = 4 - done;
    label_set_text(statsLabel, "Today: " + numberToString(pending) + " pending | " + numberToString(done) + " done");

    // Check marks
    if (rem1_done) {
        label_set_text(check1, "[X]");
        style_set_text_color(checkStyle, COLOR_GREEN);
    }
    if (rem2_done) {
        label_set_text(check2, "[X]");
    }
    if (rem3_done) {
        label_set_text(check3, "[X]");
    }
    if (rem4_done) {
        label_set_text(check4, "[X]");
    }

    // Highlight due/overdue badges
    let currentTimeNum = currentHour * 100 + currentMin;
    if (currentTimeNum >= 900 && !rem1_done) {
        style_set_bg_color(badgeStyle1, COLOR_RED);
    }
    if (currentTimeNum >= 1030 && !rem2_done) {
        style_set_bg_color(badgeStyle2, COLOR_RED);
    }
    if (currentTimeNum >= 1200 && !rem3_done) {
        style_set_bg_color(badgeStyle3, COLOR_RED);
    }
    if (currentTimeNum >= 1400 && !rem4_done) {
        style_set_bg_color(badgeStyle4, COLOR_RED);
    }
};

// Simulate time passing
let simTimer = 0;

let simulate_tick = function() {
    simTimer = simTimer + 1;

    // Advance time every 5 seconds
    if (simTimer % 5 === 0) {
        currentMin = currentMin + 15;
        if (currentMin >= 60) {
            currentMin = currentMin - 60;
            currentHour = currentHour + 1;
        }
    }

    // Auto-complete past reminders
    let currentTimeNum = currentHour * 100 + currentMin;
    if (currentTimeNum > 900 && !rem1_done) rem1_done = 1;
    if (currentTimeNum > 1030 && !rem2_done) rem2_done = 1;
    if (currentTimeNum > 1200 && !rem3_done) rem3_done = 1;
    if (currentTimeNum > 1400 && !rem4_done) rem4_done = 1;

    updateDisplay();
};

// Initialize
updateDisplay();
print("Reminders ready!");

create_timer("simulate_tick", 1000);
