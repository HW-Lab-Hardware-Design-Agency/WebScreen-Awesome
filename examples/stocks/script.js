"use strict";

print("Starting Stocks...");

let stock1 = "AAPL";
let price1 = 17852;
let stock2 = "GOOGL";
let price2 = 14180;
let stock3 = "MSFT";
let price3 = 37891;
let stock4 = "TSLA";
let price4 = 24850;

let titleStyle = create_style();
style_set_text_font(titleStyle, 20);
style_set_text_color(titleStyle, 0x58a6ff);

let priceStyle = create_style();
style_set_text_font(priceStyle, 20);
style_set_text_color(priceStyle, 0xFFFFFF);

let label1 = create_label(30, 40);
obj_add_style(label1, titleStyle, 0);
label_set_text(label1, stock1);

let val1 = create_label(30, 65);
obj_add_style(val1, priceStyle, 0);

let label2 = create_label(280, 40);
obj_add_style(label2, titleStyle, 0);
label_set_text(label2, stock2);

let val2 = create_label(280, 65);
obj_add_style(val2, priceStyle, 0);

let label3 = create_label(30, 130);
obj_add_style(label3, titleStyle, 0);
label_set_text(label3, stock3);

let val3 = create_label(30, 155);
obj_add_style(val3, priceStyle, 0);

let label4 = create_label(280, 130);
obj_add_style(label4, titleStyle, 0);
label_set_text(label4, stock4);

let val4 = create_label(280, 155);
obj_add_style(val4, priceStyle, 0);

let formatPrice = function(cents) {
    let d = cents / 100;
    d = d - (d % 1);
    let c = cents % 100;
    if (c < 10) return "$" + numberToString(d) + ".0" + numberToString(c);
    return "$" + numberToString(d) + "." + numberToString(c);
};

let tick = 0;

let update_tick = function() {
    tick = tick + 1;
    if (tick % 3 === 0) price1 = price1 + ((tick % 7) - 3) * 50;
    if (tick % 4 === 0) price2 = price2 + ((tick % 5) - 2) * 40;
    if (tick % 5 === 0) price3 = price3 + ((tick % 6) - 3) * 60;
    if (tick % 6 === 0) price4 = price4 + ((tick % 4) - 2) * 80;

    label_set_text(val1, formatPrice(price1));
    label_set_text(val2, formatPrice(price2));
    label_set_text(val3, formatPrice(price3));
    label_set_text(val4, formatPrice(price4));
};

update_tick();
print("Stocks ready!");
create_timer("update_tick", 2000);
