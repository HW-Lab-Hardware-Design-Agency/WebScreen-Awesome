"use strict";

print("Starting Steam Connect...");

// Demo profile data
let profileName = "WebScreen Gamer";
let profileStatus = "Online";
let currentGame = "Counter-Strike 2";
let friendsOnline = 12;
let friendsTotal = 156;
let playerLevel = 42;

// Colors
let COLOR_BG = 0x1b2838;
let COLOR_HEADER = 0x171a21;
let COLOR_CARD = 0x2a475e;
let COLOR_BLUE = 0x66c0f4;
let COLOR_CYAN = 0x57cbde;
let COLOR_WHITE = 0xFFFFFF;
let COLOR_GREEN = 0xa3cf06;
let COLOR_GRAY = 0x8f98a0;
let COLOR_LIGHT = 0xc7d5e0;
let COLOR_DIM = 0x4a5568;

// Styles
let titleStyle = create_style();
style_set_text_font(titleStyle, 28);
style_set_text_color(titleStyle, COLOR_BLUE);
style_set_text_align(titleStyle, 0);
style_set_bg_color(titleStyle, COLOR_HEADER);
style_set_bg_opa(titleStyle, 255);

let usernameStyle = create_style();
style_set_text_font(usernameStyle, 24);
style_set_text_color(usernameStyle, COLOR_WHITE);
style_set_text_align(usernameStyle, 0);

let statusStyle = create_style();
style_set_text_font(statusStyle, 16);
style_set_text_color(statusStyle, COLOR_CYAN);
style_set_text_align(statusStyle, 0);

let levelStyle = create_style();
style_set_text_font(levelStyle, 14);
style_set_text_color(levelStyle, COLOR_LIGHT);
style_set_text_align(levelStyle, 0);

let headerStyle = create_style();
style_set_text_font(headerStyle, 14);
style_set_text_color(headerStyle, COLOR_GRAY);
style_set_text_align(headerStyle, 0);

let gameStyle = create_style();
style_set_text_font(gameStyle, 20);
style_set_text_color(gameStyle, COLOR_GREEN);
style_set_text_align(gameStyle, 0);

let friendsStyle = create_style();
style_set_text_font(friendsStyle, 32);
style_set_text_color(friendsStyle, COLOR_CYAN);
style_set_text_align(friendsStyle, 0);

let friendsTotalStyle = create_style();
style_set_text_font(friendsTotalStyle, 14);
style_set_text_color(friendsTotalStyle, COLOR_GRAY);
style_set_text_align(friendsTotalStyle, 0);

let updateStyle = create_style();
style_set_text_font(updateStyle, 12);
style_set_text_color(updateStyle, COLOR_DIM);
style_set_text_align(updateStyle, 0);

// Card style
let cardStyle = create_style();
style_set_bg_color(cardStyle, COLOR_CARD);
style_set_bg_opa(cardStyle, 255);
style_set_radius(cardStyle, 8);
style_set_width(cardStyle, 426);
style_set_height(cardStyle, 120);

let friendsCardStyle = create_style();
style_set_bg_color(friendsCardStyle, COLOR_CARD);
style_set_bg_opa(friendsCardStyle, 255);
style_set_radius(friendsCardStyle, 6);
style_set_width(friendsCardStyle, 426);
style_set_height(friendsCardStyle, 80);

// UI Elements
let titleLabel = create_label(20, 15);
obj_add_style(titleLabel, titleStyle, 0);
label_set_text(titleLabel, "STEAM");

let profileCard = create_label(20, 70);
obj_add_style(profileCard, cardStyle, 0);
label_set_text(profileCard, "");

let usernameLabel = create_label(35, 85);
obj_add_style(usernameLabel, usernameStyle, 0);
label_set_text(usernameLabel, profileName);

let statusLabel = create_label(35, 120);
obj_add_style(statusLabel, statusStyle, 0);
label_set_text(statusLabel, profileStatus);

let levelLabel = create_label(35, 150);
obj_add_style(levelLabel, levelStyle, 0);
label_set_text(levelLabel, "Level " + numberToString(playerLevel));

let playingHeader = create_label(20, 210);
obj_add_style(playingHeader, headerStyle, 0);
label_set_text(playingHeader, "CURRENTLY PLAYING");

let gameLabel = create_label(20, 235);
obj_add_style(gameLabel, gameStyle, 0);
label_set_text(gameLabel, currentGame);

let friendsHeader = create_label(20, 310);
obj_add_style(friendsHeader, headerStyle, 0);
label_set_text(friendsHeader, "FRIENDS");

let friendsCard = create_label(20, 335);
obj_add_style(friendsCard, friendsCardStyle, 0);
label_set_text(friendsCard, "");

let friendsOnlineLabel = create_label(35, 350);
obj_add_style(friendsOnlineLabel, friendsStyle, 0);
label_set_text(friendsOnlineLabel, numberToString(friendsOnline) + " Online");

let friendsTotalLabel = create_label(35, 390);
obj_add_style(friendsTotalLabel, friendsTotalStyle, 0);
label_set_text(friendsTotalLabel, numberToString(friendsTotal) + " friends total");

let updateLabel = create_label(20, 441);
obj_add_style(updateLabel, updateStyle, 0);
label_set_text(updateLabel, "Demo Mode - Configure API for live data");

// Update display
let updateDisplay = function() {
    label_set_text(usernameLabel, profileName);
    label_set_text(statusLabel, profileStatus);
    label_set_text(levelLabel, "Level " + numberToString(playerLevel));
    label_set_text(gameLabel, currentGame);
    label_set_text(friendsOnlineLabel, numberToString(friendsOnline) + " Online");
    label_set_text(friendsTotalLabel, numberToString(friendsTotal) + " friends total");
};

// Demo update
let demoTimer = 0;
let games = 0;

let demo_tick = function() {
    demoTimer = demoTimer + 1;

    // Cycle through games
    if (demoTimer === 15) {
        currentGame = "Dota 2";
        updateDisplay();
    } else if (demoTimer === 30) {
        currentGame = "Not playing";
        style_set_text_color(gameStyle, COLOR_GRAY);
        updateDisplay();
    } else if (demoTimer === 45) {
        currentGame = "Counter-Strike 2";
        style_set_text_color(gameStyle, COLOR_GREEN);
        demoTimer = 0;
        updateDisplay();
    }

    // Vary friends online
    if (demoTimer % 10 === 0) {
        friendsOnline = 10 + (demoTimer % 5);
        updateDisplay();
    }
};

print("Steam Connect ready!");

// Start timer
create_timer("demo_tick", 1000);
