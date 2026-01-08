// Reminders App for WebScreen
// Personal reminder system with notifications and alerts

// Screen dimensions
let screenWidth = 466;
let screenHeight = 466;

// Reminders data
let reminders = [
    { text: "Team standup meeting", time: "09:00", category: "work", done: false, priority: "high" },
    { text: "Review pull requests", time: "10:30", category: "work", done: false, priority: "medium" },
    { text: "Lunch break", time: "12:00", category: "personal", done: false, priority: "low" },
    { text: "Call with client", time: "14:00", category: "work", done: false, priority: "high" },
    { text: "Gym workout", time: "17:30", category: "health", done: false, priority: "medium" },
    { text: "Prepare dinner", time: "19:00", category: "personal", done: false, priority: "low" },
    { text: "Read for 30 minutes", time: "21:00", category: "personal", done: false, priority: "low" }
];

let currentIndex = 0;
let displayCount = 4;
let currentTime = "08:45";  // Simulated current time

// Create UI elements

// Background
let bg = create_label(null);
let bgStyle = create_style();
style_set_bg_color(bgStyle, "#f0fdf4");
style_set_width(bgStyle, screenWidth);
style_set_height(bgStyle, screenHeight);
obj_add_style(bg, bgStyle, 0);

// Header
let headerBg = create_label(null);
let headerBgStyle = create_style();
style_set_bg_color(headerBgStyle, "#16a34a");
style_set_bg_opa(headerBgStyle, 255);
style_set_width(headerBgStyle, screenWidth);
style_set_height(headerBgStyle, 70);
obj_add_style(headerBg, headerBgStyle, 0);
move_obj(headerBg, 0, 0);

let headerLabel = create_label(null);
let headerStyle = create_style();
style_set_text_color(headerStyle, "#FFFFFF");
style_set_text_font(headerStyle, "montserrat_24");
obj_add_style(headerLabel, headerStyle, 0);
label_set_text(headerLabel, "REMINDERS");
move_obj(headerLabel, 20, 12);

// Current time display
let timeLabel = create_label(null);
let timeStyle = create_style();
style_set_text_color(timeStyle, "#FFFFFF");
style_set_text_font(timeStyle, "montserrat_20");
obj_add_style(timeLabel, timeStyle, 0);
move_obj(timeLabel, screenWidth - 80, 15);

// Stats bar
let statsLabel = create_label(null);
let statsBarStyle = create_style();
style_set_text_color(statsBarStyle, "#dcfce7");
style_set_text_font(statsBarStyle, "montserrat_12");
obj_add_style(statsLabel, statsBarStyle, 0);
move_obj(statsLabel, 20, 45);

// Create reminder item cards
let itemCards = [];

let i = 0;
while (i < displayCount) {
    let yPos = 85 + (i * 90);

    // Card background
    let card = create_label(null);
    let cardStyle = create_style();
    style_set_bg_color(cardStyle, "#FFFFFF");
    style_set_bg_opa(cardStyle, 255);
    style_set_radius(cardStyle, 10);
    style_set_width(cardStyle, screenWidth - 30);
    style_set_height(cardStyle, 80);
    style_set_border_width(cardStyle, 3);
    style_set_border_side(cardStyle, 1);  // Left border only
    obj_add_style(card, cardStyle, 0);
    move_obj(card, 15, yPos);

    // Priority indicator (left border color set via card style)

    // Time badge
    let timeBadge = create_label(null);
    let timeBadgeStyle = create_style();
    style_set_text_color(timeBadgeStyle, "#FFFFFF");
    style_set_text_font(timeBadgeStyle, "montserrat_14");
    style_set_bg_color(timeBadgeStyle, "#16a34a");
    style_set_bg_opa(timeBadgeStyle, 255);
    style_set_radius(timeBadgeStyle, 6);
    style_set_pad_all(timeBadgeStyle, 6);
    obj_add_style(timeBadge, timeBadgeStyle, 0);
    move_obj(timeBadge, 25, yPos + 10);

    // Reminder text
    let textLabel = create_label(null);
    let textStyle = create_style();
    style_set_text_color(textStyle, "#1f2937");
    style_set_text_font(textStyle, "montserrat_16");
    style_set_width(textStyle, screenWidth - 120);
    obj_add_style(textLabel, textStyle, 0);
    move_obj(textLabel, 100, yPos + 15);

    // Category tag
    let catLabel = create_label(null);
    let catStyle = create_style();
    style_set_text_color(catStyle, "#6b7280");
    style_set_text_font(catStyle, "montserrat_12");
    obj_add_style(catLabel, catStyle, 0);
    move_obj(catLabel, 100, yPos + 50);

    // Checkbox indicator
    let checkLabel = create_label(null);
    let checkStyle = create_style();
    style_set_text_font(checkStyle, "montserrat_20");
    obj_add_style(checkLabel, checkStyle, 0);
    move_obj(checkLabel, screenWidth - 55, yPos + 25);

    itemCards[i] = {
        card: card,
        cardStyle: cardStyle,
        time: { label: timeBadge, style: timeBadgeStyle },
        text: { label: textLabel, style: textStyle },
        category: catLabel,
        check: { label: checkLabel, style: checkStyle }
    };

    i = i + 1;
}

// Navigation dots
let navLabel = create_label(null);
let navStyle = create_style();
style_set_text_color(navStyle, "#16a34a");
style_set_text_font(navStyle, "montserrat_14");
obj_add_style(navLabel, navStyle, 0);
move_obj(navLabel, screenWidth / 2 - 30, screenHeight - 30);

// Get priority color
function getPriorityColor(priority) {
    if (priority === "high") {
        return "#dc2626";  // Red
    }
    if (priority === "medium") {
        return "#f59e0b";  // Orange
    }
    return "#22c55e";  // Green for low
}

// Get category icon
function getCategoryIcon(category) {
    if (category === "work") {
        return "WORK";
    }
    if (category === "health") {
        return "HEALTH";
    }
    return "LIFE";
}

// Update display
function updateDisplay() {
    // Update current time
    label_set_text(timeLabel, currentTime);

    // Calculate stats
    let total = reminders.length;
    let done = 0;
    let upcoming = 0;
    let j = 0;
    while (j < reminders.length) {
        if (reminders[j].done) {
            done = done + 1;
        } else {
            upcoming = upcoming + 1;
        }
        j = j + 1;
    }
    label_set_text(statsLabel, "Today: " + numberToString(upcoming) + " pending | " + numberToString(done) + " done");

    // Update cards
    let k = 0;
    while (k < displayCount) {
        let idx = (currentIndex + k) % reminders.length;
        let reminder = reminders[idx];
        let card = itemCards[k];

        // Priority border color
        style_set_border_color(card.cardStyle, getPriorityColor(reminder.priority));

        // Time badge
        label_set_text(card.time.label, reminder.time);

        // If time has passed or is current, highlight
        if (reminder.time <= currentTime && !reminder.done) {
            style_set_bg_color(card.time.style, "#dc2626");  // Red for due/overdue
        } else {
            style_set_bg_color(card.time.style, "#16a34a");  // Green for upcoming
        }

        // Reminder text
        label_set_text(card.text.label, reminder.text);

        // Strikethrough style for done items
        if (reminder.done) {
            style_set_text_color(card.text.style, "#9ca3af");
            style_set_text_decor(card.text.style, 1);  // Strikethrough
        } else {
            style_set_text_color(card.text.style, "#1f2937");
            style_set_text_decor(card.text.style, 0);  // None
        }

        // Category
        label_set_text(card.category, getCategoryIcon(reminder.category));

        // Checkbox
        if (reminder.done) {
            label_set_text(card.check.label, "[X]");
            style_set_text_color(card.check.style, "#16a34a");
        } else {
            label_set_text(card.check.label, "[ ]");
            style_set_text_color(card.check.style, "#d1d5db");
        }

        k = k + 1;
    }

    // Navigation
    let page = (currentIndex / displayCount) + 1;
    page = page - (page % 1);
    let total_pages = (reminders.length / displayCount);
    total_pages = total_pages - (total_pages % 1) + 1;
    label_set_text(navLabel, numberToString(page) + " / " + numberToString(total_pages));
}

// Simulate time passing and completing tasks
function simulateProgress() {
    // Advance time by 15 minutes every 10 seconds of real time
    let hourStr = str_substring(currentTime, 0, 2);
    let minStr = str_substring(currentTime, 3, 2);

    let hour = toNumber(hourStr);
    let min = toNumber(minStr);

    min = min + 15;
    if (min >= 60) {
        min = min - 60;
        hour = hour + 1;
        if (hour >= 24) {
            hour = 0;
        }
    }

    let newHour = numberToString(hour);
    let newMin = numberToString(min);
    if (hour < 10) {
        newHour = "0" + newHour;
    }
    if (min < 10) {
        newMin = "0" + newMin;
    }
    currentTime = newHour + ":" + newMin;

    // Auto-complete past reminders (demo)
    let m = 0;
    while (m < reminders.length) {
        if (!reminders[m].done && reminders[m].time < currentTime) {
            reminders[m].done = true;
        }
        m = m + 1;
    }
}

// Load reminders from SD card
function loadReminders() {
    let data = sd_read_file("/reminders.json");
    if (data && data.length > 0) {
        print("Loaded reminders from SD card");
        // In production, would parse JSON here
    }
}

// Initialize
print("Reminders starting...");
loadReminders();
updateDisplay();

// Main loop
let scrollTimer = 0;
let simTimer = 0;

while (true) {
    delay(1000);
    scrollTimer = scrollTimer + 1;
    simTimer = simTimer + 1;

    // Scroll every 8 seconds
    if (scrollTimer >= 8) {
        scrollTimer = 0;
        currentIndex = (currentIndex + displayCount) % reminders.length;
        updateDisplay();
    }

    // Simulate time progress every 10 seconds
    if (simTimer >= 10) {
        simTimer = 0;
        simulateProgress();
        updateDisplay();
    }
}
