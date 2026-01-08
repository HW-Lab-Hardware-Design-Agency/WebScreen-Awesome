"use strict";

print("Starting Teleprompter...");

// Configuration
let scrollSpeed = 2;
let currentY = 466;
let textHeight = 800;
let isPaused = 0;

// Sample speech text
let speechText = "Welcome to WebScreen Teleprompter.\n\nThis is a sample speech text that will scroll automatically on your display.\n\nYou can customize the scroll speed and load your own text from the SD card.\n\nThe teleprompter is perfect for:\n- Presentations\n- Video recordings\n- Public speaking\n- Reading scripts\n\nTo load your own text, create a file called speech.txt on your SD card.\n\nThank you for using WebScreen!";

// Colors
let COLOR_BLACK = 0x000000;
let COLOR_GREEN = 0x00FF00;
let COLOR_WHITE = 0xFFFFFF;
let COLOR_GRAY = 0x888888;
let COLOR_DARK = 0x1a1a1a;
let COLOR_DIM = 0x666666;

// Styles
let titleStyle = create_style();
style_set_text_font(titleStyle, 20);
style_set_text_color(titleStyle, COLOR_GREEN);
style_set_text_align(titleStyle, 0);
style_set_bg_color(titleStyle, COLOR_DARK);
style_set_bg_opa(titleStyle, 255);

let speedStyle = create_style();
style_set_text_font(speedStyle, 14);
style_set_text_color(speedStyle, COLOR_GRAY);
style_set_text_align(speedStyle, 2);

let textStyle = create_style();
style_set_text_font(textStyle, 24);
style_set_text_color(textStyle, COLOR_WHITE);
style_set_text_align(textStyle, 0);

let statusStyle = create_style();
style_set_text_font(statusStyle, 14);
style_set_text_color(statusStyle, COLOR_DIM);
style_set_text_align(statusStyle, 1);
style_set_bg_color(statusStyle, COLOR_DARK);
style_set_bg_opa(statusStyle, 200);

// UI Elements
let titleLabel = create_label(20, 15);
obj_add_style(titleLabel, titleStyle, 0);
label_set_text(titleLabel, "TELEPROMPTER");

let speedLabel = create_label(380, 15);
obj_add_style(speedLabel, speedStyle, 0);
label_set_text(speedLabel, "Speed: 2");

let textLabel = create_label(20, 466);
obj_add_style(textLabel, textStyle, 0);
label_set_text(textLabel, speechText);

let statusLabel = create_label(233, 440);
obj_add_style(statusLabel, statusStyle, 0);
label_set_text(statusLabel, "Scrolling...");

// Update scroll
let scroll_tick = function() {
    if (isPaused) return;

    currentY = currentY - scrollSpeed;

    // Reset when scrolled past
    if (currentY < -textHeight) {
        currentY = 466;
    }

    // Move text
    move_obj(textLabel, 20, currentY);

    // Calculate progress
    let totalScroll = textHeight + 466;
    let scrolled = 466 - currentY;
    if (scrolled < 0) scrolled = 0;
    let progress = (scrolled * 100) / totalScroll;
    progress = progress - (progress % 1);
    if (progress > 100) progress = 100;

    label_set_text(statusLabel, "Progress: " + numberToString(progress) + "%");
};

// Demo controls
let demoTimer = 0;

let demo_tick = function() {
    demoTimer = demoTimer + 1;

    // Toggle pause every 20 seconds
    if (demoTimer === 20) {
        isPaused = 1;
        label_set_text(statusLabel, "PAUSED");
        print("Paused");
    } else if (demoTimer === 25) {
        isPaused = 0;
        print("Resumed");
    } else if (demoTimer === 40) {
        // Increase speed
        if (scrollSpeed < 5) {
            scrollSpeed = scrollSpeed + 1;
            label_set_text(speedLabel, "Speed: " + numberToString(scrollSpeed));
            print("Speed increased");
        }
        demoTimer = 0;
    }
};

print("Teleprompter ready!");

// Start timers
create_timer("scroll_tick", 50);
create_timer("demo_tick", 1000);
