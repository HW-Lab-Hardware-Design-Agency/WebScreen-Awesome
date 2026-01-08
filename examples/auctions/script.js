"use strict";

print("Starting Bid Watcher...");

// Auction data (prices in cents)
let item1_title = "Vintage ESP32 Dev Board";
let item1_bid = 4500;
let item1_time = 3600;
let item1_status = 0;  // 0=outbid, 1=winning

let item2_title = "AMOLED Display Module";
let item2_bid = 2850;
let item2_time = 7200;
let item2_status = 1;

let item3_title = "Soldering Station Kit";
let item3_bid = 8999;
let item3_time = 1800;
let item3_status = 0;

// Colors
let COLOR_BG = 0xfef3c7;
let COLOR_HEADER = 0xd97706;
let COLOR_WHITE = 0xFFFFFF;
let COLOR_CARD = 0xFFFFFF;
let COLOR_TITLE = 0x1f2937;
let COLOR_GREEN = 0x059669;
let COLOR_RED = 0xdc2626;
let COLOR_GRAY = 0x6b7280;
let COLOR_NAV = 0x92400e;

// Styles
let headerStyle = create_style();
style_set_text_font(headerStyle, 24);
style_set_text_color(headerStyle, COLOR_WHITE);

let statsStyle = create_style();
style_set_text_font(statsStyle, 12);
style_set_text_color(statsStyle, COLOR_WHITE);

let titleStyle = create_style();
style_set_text_font(titleStyle, 16);
style_set_text_color(titleStyle, COLOR_TITLE);

let bidStyle = create_style();
style_set_text_font(bidStyle, 24);
style_set_text_color(bidStyle, COLOR_GREEN);

let countStyle = create_style();
style_set_text_font(countStyle, 12);
style_set_text_color(countStyle, COLOR_GRAY);

let timeStyle = create_style();
style_set_text_font(timeStyle, 14);
style_set_text_color(timeStyle, COLOR_RED);

let statusStyle1 = create_style();
style_set_text_font(statusStyle1, 12);
style_set_text_color(statusStyle1, COLOR_WHITE);
style_set_bg_opa(statusStyle1, 255);
style_set_radius(statusStyle1, 4);

let statusStyle2 = create_style();
style_set_text_font(statusStyle2, 12);
style_set_text_color(statusStyle2, COLOR_WHITE);
style_set_bg_opa(statusStyle2, 255);
style_set_radius(statusStyle2, 4);

let statusStyle3 = create_style();
style_set_text_font(statusStyle3, 12);
style_set_text_color(statusStyle3, COLOR_WHITE);
style_set_bg_opa(statusStyle3, 255);
style_set_radius(statusStyle3, 4);

let headerBgStyle = create_style();
style_set_bg_color(headerBgStyle, COLOR_HEADER);
style_set_bg_opa(headerBgStyle, 255);
style_set_width(headerBgStyle, 466);
style_set_height(headerBgStyle, 60);

let cardStyle = create_style();
style_set_bg_color(cardStyle, COLOR_CARD);
style_set_bg_opa(cardStyle, 255);
style_set_radius(cardStyle, 10);
style_set_width(cardStyle, 436);
style_set_height(cardStyle, 115);

// Header
let headerBg = create_label(0, 0);
obj_add_style(headerBg, headerBgStyle, 0);
label_set_text(headerBg, "");

let headerLabel = create_label(20, 18);
obj_add_style(headerLabel, headerStyle, 0);
label_set_text(headerLabel, "BID WATCHER");

let statsLabel = create_label(310, 22);
obj_add_style(statsLabel, statsStyle, 0);
label_set_text(statsLabel, "Win: 1 | Outbid: 2");

// Auction cards
let card1 = create_label(15, 75);
obj_add_style(card1, cardStyle, 0);
label_set_text(card1, "");

let title1 = create_label(25, 87);
obj_add_style(title1, titleStyle, 0);
label_set_text(title1, item1_title);

let bid1 = create_label(25, 120);
obj_add_style(bid1, bidStyle, 0);

let count1 = create_label(25, 155);
obj_add_style(count1, countStyle, 0);
label_set_text(count1, "12 bids");

let time1 = create_label(340, 155);
obj_add_style(time1, timeStyle, 0);

let status1 = create_label(370, 87);
obj_add_style(status1, statusStyle1, 0);

let card2 = create_label(15, 200);
obj_add_style(card2, cardStyle, 0);
label_set_text(card2, "");

let title2 = create_label(25, 212);
obj_add_style(title2, titleStyle, 0);
label_set_text(title2, item2_title);

let bid2 = create_label(25, 245);
obj_add_style(bid2, bidStyle, 0);

let count2 = create_label(25, 280);
obj_add_style(count2, countStyle, 0);
label_set_text(count2, "8 bids");

let time2 = create_label(340, 280);
obj_add_style(time2, timeStyle, 0);

let status2 = create_label(370, 212);
obj_add_style(status2, statusStyle2, 0);

let card3 = create_label(15, 325);
obj_add_style(card3, cardStyle, 0);
label_set_text(card3, "");

let title3 = create_label(25, 337);
obj_add_style(title3, titleStyle, 0);
label_set_text(title3, item3_title);

let bid3 = create_label(25, 370);
obj_add_style(bid3, bidStyle, 0);

let count3 = create_label(25, 405);
obj_add_style(count3, countStyle, 0);
label_set_text(count3, "23 bids");

let time3 = create_label(340, 405);
obj_add_style(time3, timeStyle, 0);

let status3 = create_label(370, 337);
obj_add_style(status3, statusStyle3, 0);

// Format price
let formatPrice = function(cents) {
    let dollars = cents / 100;
    dollars = dollars - (dollars % 1);
    let c = cents % 100;
    let cStr = numberToString(c);
    if (c < 10) {
        cStr = "0" + cStr;
    }
    return "$" + numberToString(dollars) + "." + cStr;
};

// Format time
let formatTime = function(secs) {
    if (secs <= 0) {
        return "Ended";
    }
    let hours = secs / 3600;
    hours = hours - (hours % 1);
    let mins = (secs % 3600) / 60;
    mins = mins - (mins % 1);
    return numberToString(hours) + "h " + numberToString(mins) + "m";
};

// Update display
let updateDisplay = function() {
    label_set_text(bid1, formatPrice(item1_bid));
    label_set_text(time1, formatTime(item1_time));
    if (item1_status) {
        label_set_text(status1, " WIN ");
        style_set_bg_color(statusStyle1, COLOR_GREEN);
    } else {
        label_set_text(status1, " OUT ");
        style_set_bg_color(statusStyle1, COLOR_RED);
    }

    label_set_text(bid2, formatPrice(item2_bid));
    label_set_text(time2, formatTime(item2_time));
    if (item2_status) {
        label_set_text(status2, " WIN ");
        style_set_bg_color(statusStyle2, COLOR_GREEN);
    } else {
        label_set_text(status2, " OUT ");
        style_set_bg_color(statusStyle2, COLOR_RED);
    }

    label_set_text(bid3, formatPrice(item3_bid));
    label_set_text(time3, formatTime(item3_time));
    if (item3_status) {
        label_set_text(status3, " WIN ");
        style_set_bg_color(statusStyle3, COLOR_GREEN);
    } else {
        label_set_text(status3, " OUT ");
        style_set_bg_color(statusStyle3, COLOR_RED);
    }
};

// Simulate auctions
let simTimer = 0;

let simulate_tick = function() {
    // Decrease time
    if (item1_time > 0) item1_time = item1_time - 1;
    if (item2_time > 0) item2_time = item2_time - 1;
    if (item3_time > 0) item3_time = item3_time - 1;

    simTimer = simTimer + 1;

    // Occasional bid increases
    if (simTimer % 15 === 0) {
        item1_bid = item1_bid + 50;
        item1_status = 0;
    }
    if (simTimer % 20 === 0) {
        item3_bid = item3_bid + 100;
    }

    updateDisplay();
};

// Initialize
updateDisplay();
print("Bid Watcher ready!");

create_timer("simulate_tick", 1000);
