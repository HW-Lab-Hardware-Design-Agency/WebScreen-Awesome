"use strict";

print("Starting Dual Clock...");

// Configuration - edit these for your preferred cities
let timezone1 = "Asia/Tokyo";
let city1 = "Tokyo";
let timezone2 = "America/Argentina/Buenos_Aires";
let city2 = "Buenos Aires";

// Time data for both zones
let hour1 = 0;
let minute1 = 0;
let seconds1 = 0;
let date1 = "";

let hour2 = 0;
let minute2 = 0;
let seconds2 = 0;
let date2 = "";

let syncCounter = 0;
let isInitialized = 0;

// Colors
let COLOR_WHITE = 0xFFFFFF;
let COLOR_CYAN = 0x00BFFF;
let COLOR_GRAY = 0x888888;
let COLOR_DIM = 0x444444;

// Styles
let timeStyle = create_style();
style_set_text_font(timeStyle, 48);
style_set_text_color(timeStyle, COLOR_WHITE);
style_set_text_align(timeStyle, 1);

let cityStyle = create_style();
style_set_text_font(cityStyle, 24);
style_set_text_color(cityStyle, COLOR_CYAN);
style_set_text_align(cityStyle, 1);

let dateStyle = create_style();
style_set_text_font(dateStyle, 16);
style_set_text_color(dateStyle, COLOR_GRAY);
style_set_text_align(dateStyle, 1);

let dividerStyle = create_style();
style_set_text_font(dividerStyle, 14);
style_set_text_color(dividerStyle, COLOR_DIM);
style_set_text_align(dividerStyle, 1);

let statusStyle = create_style();
style_set_text_font(statusStyle, 12);
style_set_text_color(statusStyle, COLOR_DIM);
style_set_text_align(statusStyle, 1);

// UI Elements - Left side (Zone 2)
let city2Label = create_label(116, 30);
obj_add_style(city2Label, cityStyle, 0);
label_set_text(city2Label, city2);

let time2Label = create_label(116, 70);
obj_add_style(time2Label, timeStyle, 0);
label_set_text(time2Label, "--:--:--");

let date2Label = create_label(116, 135);
obj_add_style(date2Label, dateStyle, 0);
label_set_text(date2Label, "----/--/--");

// Divider
let dividerLabel = create_label(233, 80);
obj_add_style(dividerLabel, dividerStyle, 0);
label_set_text(dividerLabel, "|");

// UI Elements - Right side (Zone 1)
let city1Label = create_label(350, 30);
obj_add_style(city1Label, cityStyle, 0);
label_set_text(city1Label, city1);

let time1Label = create_label(350, 70);
obj_add_style(time1Label, timeStyle, 0);
label_set_text(time1Label, "--:--:--");

let date1Label = create_label(350, 135);
obj_add_style(date1Label, dateStyle, 0);
label_set_text(date1Label, "----/--/--");

// Status label
let statusLabel = create_label(233, 170);
obj_add_style(statusLabel, statusStyle, 0);
label_set_text(statusLabel, "Connecting...");

// Helper function to pad numbers
let padZero = function(num) {
    if (num < 10) {
        return "0" + numberToString(num);
    }
    return numberToString(num);
};

// Format time in 12-hour format
let formatTime = function(h, m, s) {
    let displayHour = h;
    let ampm = "AM";

    if (h === 0) {
        displayHour = 12;
    } else if (h === 12) {
        ampm = "PM";
    } else if (h > 12) {
        displayHour = h - 12;
        ampm = "PM";
    }

    return padZero(displayHour) + ":" + padZero(m) + ":" + padZero(s) + " " + ampm;
};

// Fetch time for a timezone
let fetchTime = function(timezone, zoneNum) {
    let url = "https://timeapi.io/api/time/current/zone?timeZone=" + timezone;
    let response = http_get(url);

    if (response === "") {
        print("Failed to fetch time for " + timezone);
        return 0;
    }

    let dateVal = parse_json_value(response, "date");
    let hourVal = toNumber(parse_json_value(response, "hour"));
    let minuteVal = toNumber(parse_json_value(response, "minute"));
    let secondsVal = toNumber(parse_json_value(response, "seconds"));

    if (zoneNum === 1) {
        hour1 = hourVal;
        minute1 = minuteVal;
        seconds1 = secondsVal;
        date1 = dateVal;
    } else {
        hour2 = hourVal;
        minute2 = minuteVal;
        seconds2 = secondsVal;
        date2 = dateVal;
    }

    return 1;
};

// Update display
let updateDisplay = function() {
    label_set_text(time1Label, formatTime(hour1, minute1, seconds1));
    label_set_text(date1Label, date1);
    label_set_text(time2Label, formatTime(hour2, minute2, seconds2));
    label_set_text(date2Label, date2);
};

// Increment time by 1 second
let incrementTime = function() {
    // Zone 1
    seconds1 = seconds1 + 1;
    if (seconds1 >= 60) {
        seconds1 = 0;
        minute1 = minute1 + 1;
        if (minute1 >= 60) {
            minute1 = 0;
            hour1 = hour1 + 1;
            if (hour1 >= 24) {
                hour1 = 0;
            }
        }
    }

    // Zone 2
    seconds2 = seconds2 + 1;
    if (seconds2 >= 60) {
        seconds2 = 0;
        minute2 = minute2 + 1;
        if (minute2 >= 60) {
            minute2 = 0;
            hour2 = hour2 + 1;
            if (hour2 >= 24) {
                hour2 = 0;
            }
        }
    }
};

// Sync time from API
let syncTime = function() {
    label_set_text(statusLabel, "Syncing...");

    let ok1 = fetchTime(timezone1, 1);
    let ok2 = fetchTime(timezone2, 2);

    if (ok1 && ok2) {
        label_set_text(statusLabel, "Synced");
        isInitialized = 1;
        updateDisplay();
        print("Time synced successfully");
    } else {
        label_set_text(statusLabel, "Sync failed");
        print("Failed to sync time");
    }
};

// Main tick function
let clock_tick = function() {
    if (isInitialized === 0) return;

    incrementTime();
    updateDisplay();

    // Resync every 10 minutes (600 seconds)
    syncCounter = syncCounter + 1;
    if (syncCounter >= 600) {
        syncCounter = 0;
        syncTime();
    }
};

// Initialize - wait for WiFi and sync
let initTimer = 0;

let init_tick = function() {
    initTimer = initTimer + 1;

    if (wifi_status()) {
        print("WiFi connected: " + wifi_get_ip());

        // Try to load CA cert
        let certOk = http_set_ca_cert_from_sd("/dualclock.pem");
        if (certOk === 0) {
            print("CA cert not found, using insecure mode");
        }

        // Initial sync
        syncTime();

        // Start clock timer
        create_timer("clock_tick", 1000);

        // Stop init timer by setting long interval
        print("Dual Clock ready!");
        return;
    }

    // Update status while waiting
    if (initTimer % 2 === 0) {
        label_set_text(statusLabel, "Connecting...");
    } else {
        label_set_text(statusLabel, "Waiting for WiFi");
    }

    if (initTimer > 60) {
        label_set_text(statusLabel, "WiFi timeout");
        print("WiFi connection timeout");
    }
};

print("Waiting for WiFi connection...");
create_timer("init_tick", 1000);
