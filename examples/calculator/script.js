"use strict";

print("Starting Calculator...");

// Calculator state
let display = "0";
let operand1 = 0;
let operand2 = 0;
let operation = "";
let waitingForOperand = 0;
let demoStep = 0;

// Create styles
let displayStyle = create_style();
style_set_text_font(displayStyle, 48);
style_set_text_color(displayStyle, 0xFFFFFF);
style_set_text_align(displayStyle, 2);

let opDisplayStyle = create_style();
style_set_text_font(opDisplayStyle, 20);
style_set_text_color(opDisplayStyle, 0x888888);
style_set_text_align(opDisplayStyle, 2);

let buttonStyle = create_style();
style_set_text_font(buttonStyle, 24);
style_set_text_color(buttonStyle, 0xFFFFFF);
style_set_text_align(buttonStyle, 1);
style_set_bg_color(buttonStyle, 0x333344);
style_set_bg_opa(buttonStyle, 255);
style_set_width(buttonStyle, 60);
style_set_height(buttonStyle, 40);
style_set_radius(buttonStyle, 8);

let opButtonStyle = create_style();
style_set_text_font(opButtonStyle, 24);
style_set_text_color(opButtonStyle, 0xFFFFFF);
style_set_text_align(opButtonStyle, 1);
style_set_bg_color(opButtonStyle, 0x0066AA);
style_set_bg_opa(opButtonStyle, 255);
style_set_width(opButtonStyle, 60);
style_set_height(opButtonStyle, 40);
style_set_radius(opButtonStyle, 8);

let eqButtonStyle = create_style();
style_set_text_font(eqButtonStyle, 24);
style_set_text_color(eqButtonStyle, 0xFFFFFF);
style_set_text_align(eqButtonStyle, 1);
style_set_bg_color(eqButtonStyle, 0x00AA44);
style_set_bg_opa(eqButtonStyle, 255);
style_set_width(eqButtonStyle, 60);
style_set_height(eqButtonStyle, 40);
style_set_radius(eqButtonStyle, 8);

let clearButtonStyle = create_style();
style_set_text_font(clearButtonStyle, 24);
style_set_text_color(clearButtonStyle, 0xFFFFFF);
style_set_text_align(clearButtonStyle, 1);
style_set_bg_color(clearButtonStyle, 0xAA3333);
style_set_bg_opa(clearButtonStyle, 255);
style_set_width(clearButtonStyle, 60);
style_set_height(clearButtonStyle, 40);
style_set_radius(clearButtonStyle, 8);

let activeButtonStyle = create_style();
style_set_text_font(activeButtonStyle, 24);
style_set_text_color(activeButtonStyle, 0x000000);
style_set_text_align(activeButtonStyle, 1);
style_set_bg_color(activeButtonStyle, 0x00BFFF);
style_set_bg_opa(activeButtonStyle, 255);
style_set_width(activeButtonStyle, 60);
style_set_height(activeButtonStyle, 40);
style_set_radius(activeButtonStyle, 8);

// Display area background
let displayBg = create_label(168, 15);
let displayBgStyle = create_style();
style_set_bg_color(displayBgStyle, 0x1a1a2e);
style_set_bg_opa(displayBgStyle, 255);
style_set_width(displayBgStyle, 200);
style_set_height(displayBgStyle, 70);
style_set_radius(displayBgStyle, 10);
obj_add_style(displayBg, displayBgStyle, 0);
label_set_text(displayBg, "");

// Operation display (shows pending operation)
let opDisplay = create_label(355, 20);
obj_add_style(opDisplay, opDisplayStyle, 0);
label_set_text(opDisplay, "");

// Main display
let mainDisplay = create_label(355, 40);
obj_add_style(mainDisplay, displayStyle, 0);
label_set_text(mainDisplay, "0");

// Button layout - 4x5 grid starting at x=168, y=95
// Row 1: C, +/-, %, /
// Row 2: 7, 8, 9, x
// Row 3: 4, 5, 6, -
// Row 4: 1, 2, 3, +
// Row 5: 0, ., =

let btnC = create_label(178, 95);
obj_add_style(btnC, clearButtonStyle, 0);
label_set_text(btnC, "C");

let btnSign = create_label(248, 95);
obj_add_style(btnSign, buttonStyle, 0);
label_set_text(btnSign, "+/-");

let btnPct = create_label(318, 95);
obj_add_style(btnPct, buttonStyle, 0);
label_set_text(btnPct, "%");

let btnDiv = create_label(388, 95);
obj_add_style(btnDiv, opButtonStyle, 0);
label_set_text(btnDiv, "/");

// Row 2
let btn7 = create_label(178, 140);
obj_add_style(btn7, buttonStyle, 0);
label_set_text(btn7, "7");

let btn8 = create_label(248, 140);
obj_add_style(btn8, buttonStyle, 0);
label_set_text(btn8, "8");

let btn9 = create_label(318, 140);
obj_add_style(btn9, buttonStyle, 0);
label_set_text(btn9, "9");

let btnMul = create_label(388, 140);
obj_add_style(btnMul, opButtonStyle, 0);
label_set_text(btnMul, "x");

// Row 3
let btn4 = create_label(178, 185);
obj_add_style(btn4, buttonStyle, 0);
label_set_text(btn4, "4");

let btn5 = create_label(248, 185);
obj_add_style(btn5, buttonStyle, 0);
label_set_text(btn5, "5");

let btn6 = create_label(318, 185);
obj_add_style(btn6, buttonStyle, 0);
label_set_text(btn6, "6");

let btnSub = create_label(388, 185);
obj_add_style(btnSub, opButtonStyle, 0);
label_set_text(btnSub, "-");

// Demo status
let demoLabel = create_label(30, 200);
let demoStyle = create_style();
style_set_text_font(demoStyle, 14);
style_set_text_color(demoStyle, 0x666666);
style_set_text_align(demoStyle, 0);
obj_add_style(demoLabel, demoStyle, 0);
label_set_text(demoLabel, "Demo Mode");

// Row 4 (partial - showing for visual completeness)
let btn1 = create_label(178, 230);
let smallBtnStyle = create_style();
style_set_text_font(smallBtnStyle, 20);
style_set_text_color(smallBtnStyle, 0x888888);
style_set_text_align(smallBtnStyle, 0);
obj_add_style(btn1, smallBtnStyle, 0);
label_set_text(btn1, "1  2  3  +  0  .  =");

// Demo calculations
let demoCalcs = "12+5,25x4,100-37,84/4,15+27,50x2,99-11,144/12";
let demoResults = "17,100,63,21,42,100,88,12";
let currentCalc = 0;

// Get value from comma-separated string
let getItem = function(str, idx) {
  let pos = 0;
  let count = 0;
  let start = 0;
  for (;;) {
    if (pos > 200) return "";
    let c = str_substring(str, pos, 1);
    if (c === "," || c === "") {
      if (count === idx) {
        return str_substring(str, start, pos - start);
      }
      count++;
      start = pos + 1;
    }
    if (c === "") break;
    pos++;
  }
  return "";
};

// Update display
let updateDisplay = function() {
  label_set_text(mainDisplay, display);
};

// Perform calculation
let calculate = function() {
  let result = 0;
  if (operation === "+") {
    result = operand1 + operand2;
  } else if (operation === "-") {
    result = operand1 - operand2;
  } else if (operation === "x") {
    result = operand1 * operand2;
  } else if (operation === "/") {
    if (operand2 !== 0) {
      result = operand1 / operand2;
    } else {
      display = "Error";
      updateDisplay();
      return;
    }
  }
  // Round to avoid floating point issues
  result = result - (result % 0.0001);
  display = numberToString(result);
  operand1 = result;
  operation = "";
  updateDisplay();
};

// Demo step function
let demo_step = function() {
  demoStep++;

  if (demoStep === 1) {
    // Clear
    display = "0";
    operand1 = 0;
    operand2 = 0;
    operation = "";
    label_set_text(opDisplay, "");
    updateDisplay();
  } else if (demoStep === 2) {
    // Get next calculation
    let calc = getItem(demoCalcs, currentCalc);

    // Find operator position
    let opPos = 0;
    let op = "";
    let i = 0;
    for (;;) {
      if (i >= 10) break;
      let c = str_substring(calc, i, 1);
      if (c === "+" || c === "-" || c === "x" || c === "/") {
        opPos = i;
        op = c;
        break;
      }
      i++;
    }

    // Parse first number
    let num1Str = str_substring(calc, 0, opPos);
    operand1 = toNumber(num1Str);
    display = num1Str;
    updateDisplay();
  } else if (demoStep === 3) {
    // Get operation
    let calc = getItem(demoCalcs, currentCalc);
    let i = 0;
    for (;;) {
      if (i >= 10) break;
      let c = str_substring(calc, i, 1);
      if (c === "+" || c === "-" || c === "x" || c === "/") {
        operation = c;
        label_set_text(opDisplay, display + " " + c);
        break;
      }
      i++;
    }
  } else if (demoStep === 4) {
    // Parse second number
    let calc = getItem(demoCalcs, currentCalc);
    let opPos = 0;
    let i = 0;
    for (;;) {
      if (i >= 10) break;
      let c = str_substring(calc, i, 1);
      if (c === "+" || c === "-" || c === "x" || c === "/") {
        opPos = i;
        break;
      }
      i++;
    }
    let num2Str = str_substring(calc, opPos + 1, 10);
    operand2 = toNumber(num2Str);
    display = num2Str;
    updateDisplay();
  } else if (demoStep === 5) {
    // Calculate result
    calculate();
    label_set_text(opDisplay, "");
    print("Calculation: " + getItem(demoCalcs, currentCalc) + " = " + display);
  } else if (demoStep >= 8) {
    // Move to next calculation
    demoStep = 0;
    currentCalc++;
    if (currentCalc > 7) currentCalc = 0;
  }
};

// Start demo timer (step every 1 second)
create_timer("demo_step", 1000);

print("Calculator ready!");
