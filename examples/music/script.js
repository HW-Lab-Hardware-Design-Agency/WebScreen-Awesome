"use strict";

print("Starting Music Player...");

// Music state
let isPlaying = 0;
let currentTrack = 0;
let progress = 0;
let trackDuration = 180; // 3 minutes in seconds

// Demo playlist
let tracks = "Sunset Dreams,Electric Nights,Ocean Waves,City Lights,Mountain Echo";
let artists = "The Dreamers,Neon Band,Calm Waters,Urban Sound,Alpine Beats";
let durations = "180,210,240,195,225";

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

// Create styles
let titleStyle = create_style();
style_set_text_font(titleStyle, 14);
style_set_text_color(titleStyle, 0x888888);
style_set_text_align(titleStyle, 1);

let trackStyle = create_style();
style_set_text_font(trackStyle, 28);
style_set_text_color(trackStyle, 0xFFFFFF);
style_set_text_align(trackStyle, 1);

let artistStyle = create_style();
style_set_text_font(artistStyle, 20);
style_set_text_color(artistStyle, 0x00BFFF);
style_set_text_align(artistStyle, 1);

let timeStyle = create_style();
style_set_text_font(timeStyle, 14);
style_set_text_color(timeStyle, 0xAAAAAA);
style_set_text_align(timeStyle, 0);

let controlStyle = create_style();
style_set_text_font(controlStyle, 34);
style_set_text_color(controlStyle, 0xFFFFFF);
style_set_text_align(controlStyle, 1);

let statusStyle = create_style();
style_set_text_font(statusStyle, 20);
style_set_text_color(statusStyle, 0x00FF00);
style_set_text_align(statusStyle, 1);

// Album art placeholder (circle)
let albumStyle = create_style();
style_set_bg_color(albumStyle, 0x333366);
style_set_bg_opa(albumStyle, 255);
style_set_radius(albumStyle, 50);

let albumArt = create_label(80, 50);
obj_add_style(albumArt, albumStyle, 0);
obj_set_size(albumArt, 100, 100);
label_set_text(albumArt, "");

// Album icon (music note symbol using text)
let iconStyle = create_style();
style_set_text_font(iconStyle, 34);
style_set_text_color(iconStyle, 0x6666AA);
style_set_text_align(iconStyle, 1);

let albumIcon = create_label(110, 85);
obj_add_style(albumIcon, iconStyle, 0);
label_set_text(albumIcon, "#");

// Now Playing label
let nowPlayingLabel = create_label(350, 35);
obj_add_style(nowPlayingLabel, titleStyle, 0);
label_set_text(nowPlayingLabel, "NOW PLAYING");

// Track title
let trackLabel = create_label(350, 60);
obj_add_style(trackLabel, trackStyle, 0);
label_set_text(trackLabel, getItem(tracks, 0));

// Artist name
let artistLabel = create_label(350, 95);
obj_add_style(artistLabel, artistStyle, 0);
label_set_text(artistLabel, getItem(artists, 0));

// Progress bar background
let progressBgStyle = create_style();
style_set_bg_color(progressBgStyle, 0x333333);
style_set_bg_opa(progressBgStyle, 255);
style_set_radius(progressBgStyle, 4);

let progressBg = create_label(80, 165);
obj_add_style(progressBg, progressBgStyle, 0);
obj_set_size(progressBg, 376, 8);
label_set_text(progressBg, "");

// Progress bar fill
let progressFillStyle = create_style();
style_set_bg_color(progressFillStyle, 0x00BFFF);
style_set_bg_opa(progressFillStyle, 255);
style_set_radius(progressFillStyle, 4);

let progressFill = create_label(80, 165);
obj_add_style(progressFill, progressFillStyle, 0);
obj_set_size(progressFill, 1, 8);
label_set_text(progressFill, "");

// Time labels
let currentTimeLabel = create_label(80, 180);
obj_add_style(currentTimeLabel, timeStyle, 0);
label_set_text(currentTimeLabel, "0:00");

let totalTimeLabel = create_label(420, 180);
obj_add_style(totalTimeLabel, timeStyle, 0);
label_set_text(totalTimeLabel, "3:00");

// Control buttons (using text symbols)
let prevLabel = create_label(180, 205);
obj_add_style(prevLabel, controlStyle, 0);
label_set_text(prevLabel, "<<");

let playLabel = create_label(268, 205);
obj_add_style(playLabel, controlStyle, 0);
label_set_text(playLabel, ">");

let nextLabel = create_label(356, 205);
obj_add_style(nextLabel, controlStyle, 0);
label_set_text(nextLabel, ">>");

// Status indicator
let statusLabel = create_label(268, 10);
obj_add_style(statusLabel, statusStyle, 0);
label_set_text(statusLabel, "PAUSED");

// Helper functions
let padZero = function(num) {
  if (num < 10) {
    return "0" + numberToString(num);
  }
  return numberToString(num);
};

let formatTime = function(secs) {
  let mins = secs / 60;
  mins = mins - (mins % 1);
  let s = secs - (mins * 60);
  return numberToString(mins) + ":" + padZero(s);
};

// Update display
let updateTrackDisplay = function() {
  let title = getItem(tracks, currentTrack);
  let artist = getItem(artists, currentTrack);
  let dur = toNumber(getItem(durations, currentTrack));

  label_set_text(trackLabel, title);
  label_set_text(artistLabel, artist);
  trackDuration = dur;
  label_set_text(totalTimeLabel, formatTime(dur));
  progress = 0;
  label_set_text(currentTimeLabel, "0:00");

  // Reset progress bar to minimum width
  obj_set_size(progressFill, 1, 8);
};

// Simulate playback
let updatePlayback = function() {
  if (isPlaying === 0) return;

  progress++;
  if (progress >= trackDuration) {
    // Next track
    currentTrack++;
    if (currentTrack > 4) currentTrack = 0;
    updateTrackDisplay();
    return;
  }

  // Update time display
  label_set_text(currentTimeLabel, formatTime(progress));

  // Update progress bar (376 pixels max width)
  let barWidth = (progress * 376) / trackDuration;
  barWidth = barWidth - (barWidth % 1);
  if (barWidth < 1) barWidth = 1;
  obj_set_size(progressFill, barWidth, 8);
};

// Auto-play simulation toggle
let toggleCounter = 0;

let auto_toggle = function() {
  toggleCounter++;

  // Toggle play/pause every 5 seconds for demo
  if (toggleCounter >= 5) {
    toggleCounter = 0;
    isPlaying = 1 - isPlaying;

    if (isPlaying) {
      label_set_text(playLabel, "||");
      label_set_text(statusLabel, "PLAYING");
      style_set_text_color(statusStyle, 0x00FF00);
    } else {
      label_set_text(playLabel, ">");
      label_set_text(statusLabel, "PAUSED");
      style_set_text_color(statusStyle, 0xFFAA00);
    }
  }

  // Simulate track change every 20 seconds
  if (toggleCounter === 3 && isPlaying === 0) {
    currentTrack++;
    if (currentTrack > 4) currentTrack = 0;
    updateTrackDisplay();
  }
};

// Initialize
updateTrackDisplay();
isPlaying = 1;
label_set_text(playLabel, "||");
label_set_text(statusLabel, "PLAYING");

// Start timers
create_timer("updatePlayback", 1000);
create_timer("auto_toggle", 1000);

print("Music Player ready!");
