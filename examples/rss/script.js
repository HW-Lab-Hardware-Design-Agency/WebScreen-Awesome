"use strict";

print("Starting RSS Reader...");

// Demo news items (8 total, showing 2 at a time)
let allNews = "WebScreen 2.0 Released,ESP32-S3 Performance Tips,Building IoT with LVGL,Open Source Hardware Growing,JavaScript Engine for Embedded,Smart Display Projects Guide,AMOLED vs LCD Comparison,Home Automation Trends";
let allSources = "WebScreen Blog,Tech News,Maker Weekly,OSH News,Dev Journal,DIY Weekly,Display Tech,Smart Home";
let allTimes = "2h ago,4h ago,6h ago,8h ago,10h ago,12h ago,1d ago,2d ago";

let currentPage = 0;
let totalPages = 4;

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

// Colors
let COLOR_BG = 0xfafafa;
let COLOR_HEADER = 0xff6600;
let COLOR_WHITE = 0xFFFFFF;
let COLOR_TITLE = 0x1a1a1a;
let COLOR_SOURCE = 0xff6600;
let COLOR_TIME = 0x888888;

// Styles
let headerStyle = create_style();
style_set_text_font(headerStyle, 20);
style_set_text_color(headerStyle, COLOR_WHITE);

let titleStyle = create_style();
style_set_text_font(titleStyle, 16);
style_set_text_color(titleStyle, COLOR_TITLE);

let sourceStyle = create_style();
style_set_text_font(sourceStyle, 12);
style_set_text_color(sourceStyle, COLOR_SOURCE);

let timeStyle = create_style();
style_set_text_font(timeStyle, 12);
style_set_text_color(timeStyle, COLOR_TIME);

let navStyle = create_style();
style_set_text_font(navStyle, 12);
style_set_text_color(navStyle, COLOR_TIME);
style_set_text_align(navStyle, 1);

let headerBgStyle = create_style();
style_set_bg_color(headerBgStyle, COLOR_HEADER);
style_set_bg_opa(headerBgStyle, 255);
style_set_width(headerBgStyle, 536);
style_set_height(headerBgStyle, 45);

// Card style - 2 cards side by side for 536x240 screen
let cardStyle = create_style();
style_set_bg_color(cardStyle, COLOR_WHITE);
style_set_bg_opa(cardStyle, 255);
style_set_radius(cardStyle, 8);
style_set_width(cardStyle, 250);
style_set_height(cardStyle, 140);

// Header - display is 536x240
let headerBg = create_label(0, 0);
obj_add_style(headerBg, headerBgStyle, 0);
label_set_text(headerBg, "");

let headerLabel = create_label(15, 12);
obj_add_style(headerLabel, headerStyle, 0);
label_set_text(headerLabel, "RSS READER");

let navLabel = create_label(450, 15);
obj_add_style(navLabel, navStyle, 0);
label_set_text(navLabel, "1 / 4");

// Card 1 (left) - at x=15, y=55
let card1 = create_label(15, 55);
obj_add_style(card1, cardStyle, 0);
label_set_text(card1, "");

let title1 = create_label(25, 65);
obj_add_style(title1, titleStyle, 0);
label_set_text(title1, "");

let title1b = create_label(25, 85);
obj_add_style(title1b, titleStyle, 0);
label_set_text(title1b, "");

let source1 = create_label(25, 155);
obj_add_style(source1, sourceStyle, 0);
label_set_text(source1, "");

let time1 = create_label(25, 175);
obj_add_style(time1, timeStyle, 0);
label_set_text(time1, "");

// Card 2 (right) - at x=275, y=55
let card2 = create_label(275, 55);
obj_add_style(card2, cardStyle, 0);
label_set_text(card2, "");

let title2 = create_label(285, 65);
obj_add_style(title2, titleStyle, 0);
label_set_text(title2, "");

let title2b = create_label(285, 85);
obj_add_style(title2b, titleStyle, 0);
label_set_text(title2b, "");

let source2 = create_label(285, 155);
obj_add_style(source2, sourceStyle, 0);
label_set_text(source2, "");

let time2 = create_label(285, 175);
obj_add_style(time2, timeStyle, 0);
label_set_text(time2, "");

// Page indicator dots
let dotStyle = create_style();
style_set_bg_color(dotStyle, 0xcccccc);
style_set_bg_opa(dotStyle, 255);
style_set_radius(dotStyle, 4);
style_set_width(dotStyle, 8);
style_set_height(dotStyle, 8);

let dotActiveStyle = create_style();
style_set_bg_color(dotActiveStyle, COLOR_HEADER);
style_set_bg_opa(dotActiveStyle, 255);
style_set_radius(dotActiveStyle, 4);
style_set_width(dotActiveStyle, 8);
style_set_height(dotActiveStyle, 8);

let dot0 = create_label(238, 210);
let dot1 = create_label(254, 210);
let dot2 = create_label(270, 210);
let dot3 = create_label(286, 210);

obj_add_style(dot0, dotActiveStyle, 0); label_set_text(dot0, "");
obj_add_style(dot1, dotStyle, 0); label_set_text(dot1, "");
obj_add_style(dot2, dotStyle, 0); label_set_text(dot2, "");
obj_add_style(dot3, dotStyle, 0); label_set_text(dot3, "");

// Update page display
let updateDisplay = function() {
    let idx1 = currentPage * 2;
    let idx2 = currentPage * 2 + 1;

    // Card 1
    let news1 = getItem(allNews, idx1);
    let src1 = getItem(allSources, idx1);
    let tm1 = getItem(allTimes, idx1);
    label_set_text(title1, news1);
    label_set_text(title1b, "");
    label_set_text(source1, src1);
    label_set_text(time1, tm1);

    // Card 2
    let news2 = getItem(allNews, idx2);
    let src2 = getItem(allSources, idx2);
    let tm2 = getItem(allTimes, idx2);
    label_set_text(title2, news2);
    label_set_text(title2b, "");
    label_set_text(source2, src2);
    label_set_text(time2, tm2);

    // Update nav
    label_set_text(navLabel, numberToString(currentPage + 1) + " / " + numberToString(totalPages));

    // Update dots
    if (currentPage === 0) {
        obj_add_style(dot0, dotActiveStyle, 0);
    } else {
        obj_add_style(dot0, dotStyle, 0);
    }
    if (currentPage === 1) {
        obj_add_style(dot1, dotActiveStyle, 0);
    } else {
        obj_add_style(dot1, dotStyle, 0);
    }
    if (currentPage === 2) {
        obj_add_style(dot2, dotActiveStyle, 0);
    } else {
        obj_add_style(dot2, dotStyle, 0);
    }
    if (currentPage === 3) {
        obj_add_style(dot3, dotActiveStyle, 0);
    } else {
        obj_add_style(dot3, dotStyle, 0);
    }
};

// Demo scroll timer
let scrollTimer = 0;

let scroll_tick = function() {
    scrollTimer = scrollTimer + 1;

    if (scrollTimer >= 5) {
        scrollTimer = 0;
        currentPage = currentPage + 1;
        if (currentPage >= totalPages) {
            currentPage = 0;
        }
        updateDisplay();
    }
};

// Initialize
updateDisplay();
print("RSS Reader ready!");

create_timer("scroll_tick", 1000);
