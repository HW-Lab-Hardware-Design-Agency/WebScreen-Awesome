"use strict";

print("Starting JavaScript execution...");

// Simple GIF display - show_gif_from_sd(filepath, x, y)
// Screen is 536x240, center is (268, 120)
// Adjust x,y based on your GIF dimensions: x = (536 - gif_width) / 2, y = (240 - gif_height) / 2
show_gif_from_sd("/blink.gif", 268, 120);
