"use strict";

print("Starting RSS Reader...");

// Demo news
let news1 = "WebScreen 2.0 Released";
let news2 = "ESP32-S3 Performance Tips";
let news3 = "Building IoT with LVGL";
let news4 = "Open Source Hardware Growing";
let currentPage = 1;

// Colors
let COLOR_BG = 0xfafafa;
let COLOR_HEADER = 0xff6600;
let COLOR_WHITE = 0xFFFFFF;
let COLOR_TITLE = 0x1a1a1a;
let COLOR_SOURCE = 0xff6600;
let COLOR_TIME = 0x888888;

// Styles
let headerStyle = create_style();
style_set_text_font(headerStyle, 24);
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
style_set_text_font(navStyle, 14);
style_set_text_color(navStyle, COLOR_TIME);
style_set_text_align(navStyle, 1);

let headerBgStyle = create_style();
style_set_bg_color(headerBgStyle, COLOR_HEADER);
style_set_bg_opa(headerBgStyle, 255);
style_set_width(headerBgStyle, 466);
style_set_height(headerBgStyle, 60);

let cardStyle = create_style();
style_set_bg_color(cardStyle, COLOR_WHITE);
style_set_bg_opa(cardStyle, 255);
style_set_radius(cardStyle, 8);
style_set_width(cardStyle, 436);
style_set_height(cardStyle, 85);

// Header
let headerBg = create_label(0, 0);
obj_add_style(headerBg, headerBgStyle, 0);
label_set_text(headerBg, "");

let headerLabel = create_label(20, 18);
obj_add_style(headerLabel, headerStyle, 0);
label_set_text(headerLabel, "RSS READER");

// Cards
let card1 = create_label(15, 75);
obj_add_style(card1, cardStyle, 0);
label_set_text(card1, "");

let title1 = create_label(25, 87);
obj_add_style(title1, titleStyle, 0);
label_set_text(title1, news1);

let source1 = create_label(25, 130);
obj_add_style(source1, sourceStyle, 0);
label_set_text(source1, "WebScreen Blog");

let time1 = create_label(350, 130);
obj_add_style(time1, timeStyle, 0);
label_set_text(time1, "2h ago");

let card2 = create_label(15, 170);
obj_add_style(card2, cardStyle, 0);
label_set_text(card2, "");

let title2 = create_label(25, 182);
obj_add_style(title2, titleStyle, 0);
label_set_text(title2, news2);

let source2 = create_label(25, 225);
obj_add_style(source2, sourceStyle, 0);
label_set_text(source2, "Tech News");

let time2 = create_label(350, 225);
obj_add_style(time2, timeStyle, 0);
label_set_text(time2, "4h ago");

let card3 = create_label(15, 265);
obj_add_style(card3, cardStyle, 0);
label_set_text(card3, "");

let title3 = create_label(25, 277);
obj_add_style(title3, titleStyle, 0);
label_set_text(title3, news3);

let source3 = create_label(25, 320);
obj_add_style(source3, sourceStyle, 0);
label_set_text(source3, "Maker Weekly");

let time3 = create_label(350, 320);
obj_add_style(time3, timeStyle, 0);
label_set_text(time3, "6h ago");

let card4 = create_label(15, 360);
obj_add_style(card4, cardStyle, 0);
label_set_text(card4, "");

let title4 = create_label(25, 372);
obj_add_style(title4, titleStyle, 0);
label_set_text(title4, news4);

let source4 = create_label(25, 415);
obj_add_style(source4, sourceStyle, 0);
label_set_text(source4, "OSH News");

let time4 = create_label(350, 415);
obj_add_style(time4, timeStyle, 0);
label_set_text(time4, "8h ago");

let navLabel = create_label(210, 450);
obj_add_style(navLabel, navStyle, 0);
label_set_text(navLabel, "1 / 2");

// Demo scroll
let scrollTimer = 0;

let scroll_tick = function() {
    scrollTimer = scrollTimer + 1;

    if (scrollTimer >= 8) {
        scrollTimer = 0;
        currentPage = currentPage + 1;
        if (currentPage > 2) {
            currentPage = 1;
        }

        if (currentPage === 1) {
            label_set_text(title1, "WebScreen 2.0 Released");
            label_set_text(title2, "ESP32-S3 Performance Tips");
            label_set_text(title3, "Building IoT with LVGL");
            label_set_text(title4, "Open Source Hardware Growing");
        } else {
            label_set_text(title1, "JavaScript Engine for Embedded");
            label_set_text(title2, "Smart Display Projects Guide");
            label_set_text(title3, "AMOLED vs LCD Comparison");
            label_set_text(title4, "Home Automation Trends");
        }

        label_set_text(navLabel, numberToString(currentPage) + " / 2");
    }
};

print("RSS Reader ready!");

create_timer("scroll_tick", 1000);
