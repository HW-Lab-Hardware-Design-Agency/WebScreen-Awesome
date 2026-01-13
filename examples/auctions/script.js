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

let currentPage = 0;

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
style_set_text_font(headerStyle, 20);
style_set_text_color(headerStyle, COLOR_WHITE);

let statsStyle = create_style();
style_set_text_font(statsStyle, 14);
style_set_text_color(statsStyle, COLOR_WHITE);

let titleStyle = create_style();
style_set_text_font(titleStyle, 14);
style_set_text_color(titleStyle, COLOR_TITLE);

let bidStyle = create_style();
style_set_text_font(bidStyle, 20);
style_set_text_color(bidStyle, COLOR_GREEN);

let countStyle = create_style();
style_set_text_font(countStyle, 14);
style_set_text_color(countStyle, COLOR_GRAY);

let timeStyle = create_style();
style_set_text_font(timeStyle, 14);
style_set_text_color(timeStyle, COLOR_RED);

let statusStyle1 = create_style();
style_set_text_font(statusStyle1, 14);
style_set_text_color(statusStyle1, COLOR_WHITE);
style_set_bg_opa(statusStyle1, 255);
style_set_radius(statusStyle1, 4);

let statusStyle2 = create_style();
style_set_text_font(statusStyle2, 14);
style_set_text_color(statusStyle2, COLOR_WHITE);
style_set_bg_opa(statusStyle2, 255);
style_set_radius(statusStyle2, 4);

let headerBgStyle = create_style();
style_set_bg_color(headerBgStyle, COLOR_HEADER);
style_set_bg_opa(headerBgStyle, 255);
style_set_width(headerBgStyle, 536);
style_set_height(headerBgStyle, 45);

// Card style - 2 cards side by side for 536x240 screen
let cardStyle = create_style();
style_set_bg_color(cardStyle, COLOR_CARD);
style_set_bg_opa(cardStyle, 255);
style_set_radius(cardStyle, 10);
style_set_width(cardStyle, 250);
style_set_height(cardStyle, 140);

// Header - display is 536x240
let headerBg = create_label(0, 0);
obj_add_style(headerBg, headerBgStyle, 0);
label_set_text(headerBg, "");

let headerLabel = create_label(15, 12);
obj_add_style(headerLabel, headerStyle, 0);
label_set_text(headerLabel, "BID WATCHER");

let statsLabel = create_label(380, 15);
obj_add_style(statsLabel, statsStyle, 0);
label_set_text(statsLabel, "Win: 1 | Outbid: 2");

// Card 1 (left) - at x=15, y=55
let card1 = create_label(15, 55);
obj_add_style(card1, cardStyle, 0);
label_set_text(card1, "");

let title1 = create_label(25, 62);
obj_add_style(title1, titleStyle, 0);
label_set_text(title1, item1_title);

let bid1 = create_label(25, 85);
obj_add_style(bid1, bidStyle, 0);

let count1 = create_label(25, 115);
obj_add_style(count1, countStyle, 0);
label_set_text(count1, "12 bids");

let time1 = create_label(25, 160);
obj_add_style(time1, timeStyle, 0);

let status1 = create_label(180, 62);
obj_add_style(status1, statusStyle1, 0);

// Card 2 (right) - at x=275, y=55
let card2 = create_label(275, 55);
obj_add_style(card2, cardStyle, 0);
label_set_text(card2, "");

let title2 = create_label(285, 62);
obj_add_style(title2, titleStyle, 0);
label_set_text(title2, item2_title);

let bid2 = create_label(285, 85);
obj_add_style(bid2, bidStyle, 0);

let count2 = create_label(285, 115);
obj_add_style(count2, countStyle, 0);
label_set_text(count2, "8 bids");

let time2 = create_label(285, 160);
obj_add_style(time2, timeStyle, 0);

let status2 = create_label(440, 62);
obj_add_style(status2, statusStyle2, 0);

// Page indicator
let pageStyle = create_style();
style_set_text_font(pageStyle, 14);
style_set_text_color(pageStyle, COLOR_GRAY);
style_set_text_align(pageStyle, 1);

let pageLabel = create_label(268, 210);
obj_add_style(pageLabel, pageStyle, 0);
label_set_text(pageLabel, "1 / 2");

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

// Update display based on current page
let updateDisplay = function() {
    if (currentPage === 0) {
        // Show items 1 and 2
        label_set_text(title1, item1_title);
        label_set_text(bid1, formatPrice(item1_bid));
        label_set_text(time1, formatTime(item1_time));
        label_set_text(count1, "12 bids");
        if (item1_status) {
            label_set_text(status1, " WIN ");
            style_set_bg_color(statusStyle1, COLOR_GREEN);
        } else {
            label_set_text(status1, " OUT ");
            style_set_bg_color(statusStyle1, COLOR_RED);
        }

        label_set_text(title2, item2_title);
        label_set_text(bid2, formatPrice(item2_bid));
        label_set_text(time2, formatTime(item2_time));
        label_set_text(count2, "8 bids");
        if (item2_status) {
            label_set_text(status2, " WIN ");
            style_set_bg_color(statusStyle2, COLOR_GREEN);
        } else {
            label_set_text(status2, " OUT ");
            style_set_bg_color(statusStyle2, COLOR_RED);
        }
    } else {
        // Show item 3 and item 1 again
        label_set_text(title1, item3_title);
        label_set_text(bid1, formatPrice(item3_bid));
        label_set_text(time1, formatTime(item3_time));
        label_set_text(count1, "23 bids");
        if (item3_status) {
            label_set_text(status1, " WIN ");
            style_set_bg_color(statusStyle1, COLOR_GREEN);
        } else {
            label_set_text(status1, " OUT ");
            style_set_bg_color(statusStyle1, COLOR_RED);
        }

        label_set_text(title2, item1_title);
        label_set_text(bid2, formatPrice(item1_bid));
        label_set_text(time2, formatTime(item1_time));
        label_set_text(count2, "12 bids");
        if (item1_status) {
            label_set_text(status2, " WIN ");
            style_set_bg_color(statusStyle2, COLOR_GREEN);
        } else {
            label_set_text(status2, " OUT ");
            style_set_bg_color(statusStyle2, COLOR_RED);
        }
    }

    label_set_text(pageLabel, numberToString(currentPage + 1) + " / 2");
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

    // Switch pages every 8 seconds
    if (simTimer % 8 === 0) {
        currentPage = 1 - currentPage;
    }

    updateDisplay();
};

// Initialize
updateDisplay();
print("Bid Watcher ready!");

create_timer("simulate_tick", 1000);
