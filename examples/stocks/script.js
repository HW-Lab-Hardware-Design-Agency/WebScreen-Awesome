"use strict";

print("Starting Stock Ticker...");

// Stock data (prices in cents for integer math)
let stock1_symbol = "AAPL";
let stock1_price = 17852;
let stock1_change = 234;

let stock2_symbol = "GOOGL";
let stock2_price = 14180;
let stock2_change = -95;

let stock3_symbol = "MSFT";
let stock3_price = 37891;
let stock3_change = 421;

let stock4_symbol = "TSLA";
let stock4_price = 24850;
let stock4_change = -375;

// Colors
let COLOR_BG = 0x0d1117;
let COLOR_CARD = 0x21262d;
let COLOR_WHITE = 0xFFFFFF;
let COLOR_BLUE = 0x58a6ff;
let COLOR_GREEN = 0x7ee787;
let COLOR_RED = 0xf85149;
let COLOR_DIM = 0x484f58;

// Styles
let titleStyle = create_style();
style_set_text_font(titleStyle, 20);
style_set_text_color(titleStyle, COLOR_WHITE);
style_set_text_align(titleStyle, 0);

let marketStyle = create_style();
style_set_text_font(marketStyle, 14);
style_set_text_color(marketStyle, COLOR_GREEN);
style_set_text_align(marketStyle, 2);

let symbolStyle = create_style();
style_set_text_font(symbolStyle, 20);
style_set_text_color(symbolStyle, COLOR_BLUE);
style_set_text_align(symbolStyle, 0);

let priceStyle = create_style();
style_set_text_font(priceStyle, 28);
style_set_text_color(priceStyle, COLOR_WHITE);
style_set_text_align(priceStyle, 0);

let changeStyle1 = create_style();
style_set_text_font(changeStyle1, 14);
style_set_text_color(changeStyle1, COLOR_GREEN);

let changeStyle2 = create_style();
style_set_text_font(changeStyle2, 14);
style_set_text_color(changeStyle2, COLOR_RED);

let changeStyle3 = create_style();
style_set_text_font(changeStyle3, 14);
style_set_text_color(changeStyle3, COLOR_GREEN);

let changeStyle4 = create_style();
style_set_text_font(changeStyle4, 14);
style_set_text_color(changeStyle4, COLOR_RED);

// Card style - 2x2 grid layout for 536x240 screen
let cardStyle = create_style();
style_set_bg_color(cardStyle, COLOR_CARD);
style_set_bg_opa(cardStyle, 255);
style_set_radius(cardStyle, 8);
style_set_width(cardStyle, 250);
style_set_height(cardStyle, 85);

let updateStyle = create_style();
style_set_text_font(updateStyle, 14);
style_set_text_color(updateStyle, COLOR_DIM);

// UI Elements - display is 536x240
let titleLabel = create_label(15, 8);
obj_add_style(titleLabel, titleStyle, 0);
label_set_text(titleLabel, "STOCK TICKER");

let marketLabel = create_label(440, 10);
obj_add_style(marketLabel, marketStyle, 0);
label_set_text(marketLabel, "Market Open");

// Stock cards - 2x2 grid layout
// Row 1: cards at y=35
let card1 = create_label(15, 35);
obj_add_style(card1, cardStyle, 0);
label_set_text(card1, "");

let symbol1 = create_label(25, 42);
obj_add_style(symbol1, symbolStyle, 0);
label_set_text(symbol1, stock1_symbol);

let price1 = create_label(25, 65);
obj_add_style(price1, priceStyle, 0);

let change1 = create_label(25, 95);
obj_add_style(change1, changeStyle1, 0);

let card2 = create_label(275, 35);
obj_add_style(card2, cardStyle, 0);
label_set_text(card2, "");

let symbol2 = create_label(285, 42);
obj_add_style(symbol2, symbolStyle, 0);
label_set_text(symbol2, stock2_symbol);

let price2 = create_label(285, 65);
obj_add_style(price2, priceStyle, 0);

let change2 = create_label(285, 95);
obj_add_style(change2, changeStyle2, 0);

// Row 2: cards at y=130
let card3 = create_label(15, 130);
obj_add_style(card3, cardStyle, 0);
label_set_text(card3, "");

let symbol3 = create_label(25, 137);
obj_add_style(symbol3, symbolStyle, 0);
label_set_text(symbol3, stock3_symbol);

let price3 = create_label(25, 160);
obj_add_style(price3, priceStyle, 0);

let change3 = create_label(25, 190);
obj_add_style(change3, changeStyle3, 0);

let card4 = create_label(275, 130);
obj_add_style(card4, cardStyle, 0);
label_set_text(card4, "");

let symbol4 = create_label(285, 137);
obj_add_style(symbol4, symbolStyle, 0);
label_set_text(symbol4, stock4_symbol);

let price4 = create_label(285, 160);
obj_add_style(price4, priceStyle, 0);

let change4 = create_label(285, 190);
obj_add_style(change4, changeStyle4, 0);

let updateLabel = create_label(15, 222);
obj_add_style(updateLabel, updateStyle, 0);
label_set_text(updateLabel, "Demo data - Configure API for live prices");

// Format price from cents
let formatPrice = function(cents) {
    let dollars = cents / 100;
    dollars = dollars - (dollars % 1);
    let remaining = cents % 100;
    let centStr = numberToString(remaining);
    if (remaining < 10) {
        centStr = "0" + centStr;
    }
    return "$" + numberToString(dollars) + "." + centStr;
};

// Format change
let formatChange = function(cents) {
    let sign = "+";
    let absCents = cents;
    if (cents < 0) {
        sign = "-";
        absCents = 0 - cents;
    }
    let d = absCents / 100;
    d = d - (d % 1);
    let c = absCents % 100;
    let cStr = numberToString(c);
    if (c < 10) {
        cStr = "0" + cStr;
    }
    return sign + numberToString(d) + "." + cStr;
};

// Update display
let updateDisplay = function() {
    label_set_text(price1, formatPrice(stock1_price));
    label_set_text(change1, formatChange(stock1_change));
    if (stock1_change >= 0) {
        style_set_text_color(changeStyle1, COLOR_GREEN);
    } else {
        style_set_text_color(changeStyle1, COLOR_RED);
    }

    label_set_text(price2, formatPrice(stock2_price));
    label_set_text(change2, formatChange(stock2_change));
    if (stock2_change >= 0) {
        style_set_text_color(changeStyle2, COLOR_GREEN);
    } else {
        style_set_text_color(changeStyle2, COLOR_RED);
    }

    label_set_text(price3, formatPrice(stock3_price));
    label_set_text(change3, formatChange(stock3_change));
    if (stock3_change >= 0) {
        style_set_text_color(changeStyle3, COLOR_GREEN);
    } else {
        style_set_text_color(changeStyle3, COLOR_RED);
    }

    label_set_text(price4, formatPrice(stock4_price));
    label_set_text(change4, formatChange(stock4_change));
    if (stock4_change >= 0) {
        style_set_text_color(changeStyle4, COLOR_GREEN);
    } else {
        style_set_text_color(changeStyle4, COLOR_RED);
    }
};

// Simulate price changes
let simTimer = 0;

let simulate_tick = function() {
    simTimer = simTimer + 1;

    if (simTimer % 3 === 0) {
        stock1_change = ((simTimer % 7) - 3) * 50;
        stock1_price = stock1_price + stock1_change;
    }
    if (simTimer % 4 === 0) {
        stock2_change = ((simTimer % 5) - 2) * 40;
        stock2_price = stock2_price + stock2_change;
    }
    if (simTimer % 5 === 0) {
        stock3_change = ((simTimer % 6) - 3) * 60;
        stock3_price = stock3_price + stock3_change;
    }
    if (simTimer % 6 === 0) {
        stock4_change = ((simTimer % 4) - 2) * 80;
        stock4_price = stock4_price + stock4_change;
    }

    updateDisplay();
};

// Initialize
updateDisplay();
print("Stock Ticker ready!");

create_timer("simulate_tick", 2000);
