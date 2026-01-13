"use strict";

print("Starting Snake Game...");

// Game constants - display is 536x240
let GRID_SIZE = 16;
let GRID_WIDTH = 30;  // 480 pixels playable
let GRID_HEIGHT = 12; // 192 pixels playable
let OFFSET_X = 28;
let OFFSET_Y = 30;

// Game state
let snakeX = 15;
let snakeY = 6;
let snakeLength = 3;
let foodX = 20;
let foodY = 6;
let direction = 0;  // 0=right, 1=down, 2=left, 3=up
let score = 0;
let gameOver = 0;
let speed = 200;

// Snake body positions (max 50 segments)
let bodyX = "15,14,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
let bodyY = "6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";

// Create styles
let titleStyle = create_style();
style_set_text_font(titleStyle, 20);
style_set_text_color(titleStyle, 0xFFFFFF);
style_set_text_align(titleStyle, 0);

let scoreStyle = create_style();
style_set_text_font(scoreStyle, 20);
style_set_text_color(scoreStyle, 0x00FF00);
style_set_text_align(scoreStyle, 2);

let gameOverStyle = create_style();
style_set_text_font(gameOverStyle, 34);
style_set_text_color(gameOverStyle, 0xFF4444);
style_set_text_align(gameOverStyle, 1);

// UI Labels
let titleLabel = create_label(30, 5);
obj_add_style(titleLabel, titleStyle, 0);
label_set_text(titleLabel, "Snake");

let scoreLabel = create_label(480, 5);
obj_add_style(scoreLabel, scoreStyle, 0);
label_set_text(scoreLabel, "Score: 0");

let gameOverLabel = create_label(268, 100);
obj_add_style(gameOverLabel, gameOverStyle, 0);
label_set_text(gameOverLabel, "");

// Draw game border using labels with background
let borderStyle = create_style();
style_set_bg_color(borderStyle, 0x444444);
style_set_bg_opa(borderStyle, 255);

let borderOuter = create_label(OFFSET_X - 2, OFFSET_Y - 2);
obj_add_style(borderOuter, borderStyle, 0);
obj_set_size(borderOuter, GRID_WIDTH * GRID_SIZE + 4, GRID_HEIGHT * GRID_SIZE + 4);
label_set_text(borderOuter, "");

let fieldStyle = create_style();
style_set_bg_color(fieldStyle, 0x111111);
style_set_bg_opa(fieldStyle, 255);

let fieldBg = create_label(OFFSET_X, OFFSET_Y);
obj_add_style(fieldBg, fieldStyle, 0);
obj_set_size(fieldBg, GRID_WIDTH * GRID_SIZE, GRID_HEIGHT * GRID_SIZE);
label_set_text(fieldBg, "");

// Snake head style
let headStyle = create_style();
style_set_bg_color(headStyle, 0x00FF00);
style_set_bg_opa(headStyle, 255);
style_set_radius(headStyle, 4);

// Snake head object
let snakeHead = create_label(0, 0);
obj_add_style(snakeHead, headStyle, 0);
obj_set_size(snakeHead, GRID_SIZE - 2, GRID_SIZE - 2);
label_set_text(snakeHead, "");

// Food style
let foodStyle = create_style();
style_set_bg_color(foodStyle, 0xFF0000);
style_set_bg_opa(foodStyle, 255);
style_set_radius(foodStyle, 8);

// Food object
let food = create_label(0, 0);
obj_add_style(food, foodStyle, 0);
obj_set_size(food, GRID_SIZE - 2, GRID_SIZE - 2);
label_set_text(food, "");

// Body style
let bodyStyle = create_style();
style_set_bg_color(bodyStyle, 0x00AA00);
style_set_bg_opa(bodyStyle, 255);
style_set_radius(bodyStyle, 3);

// Body segments (create 10 visible ones)
let seg0 = create_label(0, 0);
let seg1 = create_label(0, 0);
let seg2 = create_label(0, 0);
let seg3 = create_label(0, 0);
let seg4 = create_label(0, 0);
let seg5 = create_label(0, 0);
let seg6 = create_label(0, 0);
let seg7 = create_label(0, 0);
let seg8 = create_label(0, 0);
let seg9 = create_label(0, 0);

obj_add_style(seg0, bodyStyle, 0); obj_set_size(seg0, GRID_SIZE - 4, GRID_SIZE - 4); label_set_text(seg0, "");
obj_add_style(seg1, bodyStyle, 0); obj_set_size(seg1, GRID_SIZE - 4, GRID_SIZE - 4); label_set_text(seg1, "");
obj_add_style(seg2, bodyStyle, 0); obj_set_size(seg2, GRID_SIZE - 4, GRID_SIZE - 4); label_set_text(seg2, "");
obj_add_style(seg3, bodyStyle, 0); obj_set_size(seg3, GRID_SIZE - 4, GRID_SIZE - 4); label_set_text(seg3, "");
obj_add_style(seg4, bodyStyle, 0); obj_set_size(seg4, GRID_SIZE - 4, GRID_SIZE - 4); label_set_text(seg4, "");
obj_add_style(seg5, bodyStyle, 0); obj_set_size(seg5, GRID_SIZE - 4, GRID_SIZE - 4); label_set_text(seg5, "");
obj_add_style(seg6, bodyStyle, 0); obj_set_size(seg6, GRID_SIZE - 4, GRID_SIZE - 4); label_set_text(seg6, "");
obj_add_style(seg7, bodyStyle, 0); obj_set_size(seg7, GRID_SIZE - 4, GRID_SIZE - 4); label_set_text(seg7, "");
obj_add_style(seg8, bodyStyle, 0); obj_set_size(seg8, GRID_SIZE - 4, GRID_SIZE - 4); label_set_text(seg8, "");
obj_add_style(seg9, bodyStyle, 0); obj_set_size(seg9, GRID_SIZE - 4, GRID_SIZE - 4); label_set_text(seg9, "");

// Helper to get value from comma-separated string
let getVal = function(str, idx) {
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
        let numStr = str_substring(str, start, pos - start);
        return toNumber(numStr);
      }
      count++;
      start = pos + 1;
    }
    pos++;
  }
  return 0;
};

// Helper to set value in comma-separated string
let setVal = function(str, idx, val) {
  let len = str_length(str);
  let result = "";
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
        if (result !== "") result = result + ",";
        result = result + numberToString(val);
      } else {
        if (result !== "") result = result + ",";
        result = result + str_substring(str, start, pos - start);
      }
      count++;
      start = pos + 1;
    }
    pos++;
  }
  return result;
};

// Random number (simple LCG)
let randSeed = 12345;
let random = function(max) {
  randSeed = (randSeed * 1103515245 + 12345) % 2147483648;
  if (randSeed < 0) randSeed = 0 - randSeed;
  return randSeed % max;
};

// Spawn food at random position
let spawnFood = function() {
  foodX = random(GRID_WIDTH - 2) + 1;
  foodY = random(GRID_HEIGHT - 2) + 1;
  move_obj(food, OFFSET_X + foodX * GRID_SIZE + 1, OFFSET_Y + foodY * GRID_SIZE + 1);
};

// Update segment positions
let updateSegment = function(seg, idx) {
  let x = getVal(bodyX, idx);
  let y = getVal(bodyY, idx);
  move_obj(seg, OFFSET_X + x * GRID_SIZE + 2, OFFSET_Y + y * GRID_SIZE + 2);
};

// Simple AI to avoid walls and chase food
let updateDirection = function() {
  let nextX = snakeX;
  let nextY = snakeY;

  if (direction === 0) nextX++;
  else if (direction === 1) nextY++;
  else if (direction === 2) nextX--;
  else if (direction === 3) nextY--;

  // If heading into wall, turn toward food
  let needTurn = 0;
  if (nextX < 0 || nextX >= GRID_WIDTH) needTurn = 1;
  if (nextY < 0 || nextY >= GRID_HEIGHT) needTurn = 1;

  if (needTurn) {
    if (direction === 0 || direction === 2) {
      if (foodY > snakeY) direction = 1;
      else direction = 3;
    } else {
      if (foodX > snakeX) direction = 0;
      else direction = 2;
    }
  } else {
    // Occasionally turn toward food
    let r = random(10);
    if (r < 3) {
      if (direction === 0 || direction === 2) {
        if (foodY > snakeY + 2) direction = 1;
        else if (foodY < snakeY - 2) direction = 3;
      } else {
        if (foodX > snakeX + 2) direction = 0;
        else if (foodX < snakeX - 2) direction = 2;
      }
    }
  }
};

// Game update
let game_update = function() {
  if (gameOver) return;

  updateDirection();

  // Shift body positions
  let i = snakeLength - 1;
  while (i > 0) {
    let prevX = getVal(bodyX, i - 1);
    let prevY = getVal(bodyY, i - 1);
    bodyX = setVal(bodyX, i, prevX);
    bodyY = setVal(bodyY, i, prevY);
    i--;
  }

  bodyX = setVal(bodyX, 0, snakeX);
  bodyY = setVal(bodyY, 0, snakeY);

  // Move head
  if (direction === 0) snakeX++;
  else if (direction === 1) snakeY++;
  else if (direction === 2) snakeX--;
  else if (direction === 3) snakeY--;

  // Check wall collision
  if (snakeX < 0 || snakeX >= GRID_WIDTH || snakeY < 0 || snakeY >= GRID_HEIGHT) {
    gameOver = 1;
    label_set_text(gameOverLabel, "Game Over!");
    print("Game Over! Score: " + numberToString(score));
    return;
  }

  // Check food collision
  if (snakeX === foodX && snakeY === foodY) {
    score++;
    snakeLength++;
    if (snakeLength > 10) snakeLength = 10;
    label_set_text(scoreLabel, "Score: " + numberToString(score));
    randSeed = randSeed + score * 7;
    spawnFood();
    print("Score: " + numberToString(score));
  }

  // Update head position
  move_obj(snakeHead, OFFSET_X + snakeX * GRID_SIZE + 1, OFFSET_Y + snakeY * GRID_SIZE + 1);

  // Update body segments
  if (snakeLength > 1) updateSegment(seg0, 0);
  if (snakeLength > 2) updateSegment(seg1, 1);
  if (snakeLength > 3) updateSegment(seg2, 2);
  if (snakeLength > 4) updateSegment(seg3, 3);
  if (snakeLength > 5) updateSegment(seg4, 4);
  if (snakeLength > 6) updateSegment(seg5, 5);
  if (snakeLength > 7) updateSegment(seg6, 6);
  if (snakeLength > 8) updateSegment(seg7, 7);
  if (snakeLength > 9) updateSegment(seg8, 8);
  if (snakeLength > 10) updateSegment(seg9, 9);
};

// Initialize game
spawnFood();
move_obj(snakeHead, OFFSET_X + snakeX * GRID_SIZE + 1, OFFSET_Y + snakeY * GRID_SIZE + 1);
updateSegment(seg0, 0);
updateSegment(seg1, 1);

// Start game loop
create_timer("game_update", speed);

print("Snake Game ready! Watch the AI play.");
