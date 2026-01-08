// Pomodoro Timer App for WebScreen
// Focus timer with work and break intervals for productivity

// Screen dimensions
let screenWidth = 466;
let screenHeight = 466;

// Timer configuration (in seconds)
let WORK_TIME = 25 * 60;      // 25 minutes
let SHORT_BREAK = 5 * 60;     // 5 minutes
let LONG_BREAK = 15 * 60;     // 15 minutes
let SESSIONS_BEFORE_LONG = 4; // Long break after 4 work sessions

// State
let timeRemaining = WORK_TIME;
let isRunning = false;
let isWorkSession = true;
let completedSessions = 0;
let totalWorkTime = 0;

// Create UI elements

// Background
let bg = create_label(null);
let bgStyle = create_style();
style_set_bg_color(bgStyle, "#1a1a2e");
style_set_width(bgStyle, screenWidth);
style_set_height(bgStyle, screenHeight);
obj_add_style(bg, bgStyle, 0);

// Title
let titleLabel = create_label(null);
let titleStyle = create_style();
style_set_text_color(titleStyle, "#eee2dc");
style_set_text_font(titleStyle, "montserrat_24");
obj_add_style(titleLabel, titleStyle, 0);
label_set_text(titleLabel, "POMODORO");
move_obj(titleLabel, screenWidth / 2 - 70, 30);

// Session type indicator
let sessionLabel = create_label(null);
let sessionStyle = create_style();
style_set_text_color(sessionStyle, "#e94560");
style_set_text_font(sessionStyle, "montserrat_20");
obj_add_style(sessionLabel, sessionStyle, 0);
move_obj(sessionLabel, screenWidth / 2 - 50, 70);

// Timer circle background
let circleBg = create_label(null);
let circleBgStyle = create_style();
style_set_bg_color(circleBgStyle, "#16213e");
style_set_bg_opa(circleBgStyle, 255);
style_set_radius(circleBgStyle, 120);
style_set_width(circleBgStyle, 240);
style_set_height(circleBgStyle, 240);
obj_add_style(circleBg, circleBgStyle, 0);
move_obj(circleBg, screenWidth / 2 - 120, 110);

// Timer display
let timerLabel = create_label(null);
let timerStyle = create_style();
style_set_text_color(timerStyle, "#FFFFFF");
style_set_text_font(timerStyle, "montserrat_48");
obj_add_style(timerLabel, timerStyle, 0);
move_obj(timerLabel, screenWidth / 2 - 80, 195);

// Progress indicator
let progressLabel = create_label(null);
let progressStyle = create_style();
style_set_text_color(progressStyle, "#0f3460");
style_set_text_font(progressStyle, "montserrat_14");
obj_add_style(progressLabel, progressStyle, 0);
move_obj(progressLabel, screenWidth / 2 - 40, 270);

// Status text
let statusLabel = create_label(null);
let statusStyle = create_style();
style_set_text_color(statusStyle, "#94a3b8");
style_set_text_font(statusStyle, "montserrat_16");
obj_add_style(statusLabel, statusStyle, 0);
move_obj(statusLabel, screenWidth / 2 - 60, 370);

// Session counter dots
let dotLabels = [];
let j = 0;
while (j < 4) {
    let dot = create_label(null);
    let dotStyle = create_style();
    style_set_bg_color(dotStyle, "#0f3460");
    style_set_bg_opa(dotStyle, 255);
    style_set_radius(dotStyle, 8);
    style_set_width(dotStyle, 16);
    style_set_height(dotStyle, 16);
    obj_add_style(dot, dotStyle, 0);
    move_obj(dot, screenWidth / 2 - 50 + (j * 30), 410);
    dotLabels[j] = { label: dot, style: dotStyle };
    j = j + 1;
}

// Stats display
let statsLabel = create_label(null);
let statsStyle = create_style();
style_set_text_color(statsStyle, "#64748b");
style_set_text_font(statsStyle, "montserrat_12");
obj_add_style(statsLabel, statsStyle, 0);
move_obj(statsLabel, 20, screenHeight - 25);

// Format time as MM:SS
function formatTime(seconds) {
    let mins = seconds / 60;
    mins = mins - (mins % 1);  // Floor
    let secs = seconds % 60;

    let minStr = numberToString(mins);
    let secStr = numberToString(secs);

    if (mins < 10) {
        minStr = "0" + minStr;
    }
    if (secs < 10) {
        secStr = "0" + secStr;
    }

    return minStr + ":" + secStr;
}

// Update display
function updateDisplay() {
    // Timer
    label_set_text(timerLabel, formatTime(timeRemaining));

    // Session type
    if (isWorkSession) {
        label_set_text(sessionLabel, "FOCUS");
        style_set_text_color(sessionStyle, "#e94560");
        style_set_bg_color(circleBgStyle, "#16213e");
    } else {
        label_set_text(sessionLabel, "BREAK");
        style_set_text_color(sessionStyle, "#22c55e");
        style_set_bg_color(circleBgStyle, "#0f3460");
    }

    // Progress
    let totalTime = isWorkSession ? WORK_TIME : (completedSessions % SESSIONS_BEFORE_LONG === 0 ? LONG_BREAK : SHORT_BREAK);
    let progress = ((totalTime - timeRemaining) * 100) / totalTime;
    label_set_text(progressLabel, numberToString(progress) + "%");

    // Status
    if (isRunning) {
        label_set_text(statusLabel, isWorkSession ? "Stay focused!" : "Take a break");
    } else {
        label_set_text(statusLabel, "Tap to start");
    }

    // Update session dots
    let k = 0;
    while (k < 4) {
        if (k < (completedSessions % SESSIONS_BEFORE_LONG)) {
            style_set_bg_color(dotLabels[k].style, "#e94560");
        } else {
            style_set_bg_color(dotLabels[k].style, "#0f3460");
        }
        k = k + 1;
    }

    // Stats
    let totalMins = totalWorkTime / 60;
    totalMins = totalMins - (totalMins % 1);
    label_set_text(statsLabel, "Sessions: " + numberToString(completedSessions) + " | Focus time: " + numberToString(totalMins) + " min");
}

// Handle session completion
function completeSession() {
    if (isWorkSession) {
        completedSessions = completedSessions + 1;
        totalWorkTime = totalWorkTime + WORK_TIME;

        // Start break
        isWorkSession = false;
        if (completedSessions % SESSIONS_BEFORE_LONG === 0) {
            timeRemaining = LONG_BREAK;
            print("Long break started!");
        } else {
            timeRemaining = SHORT_BREAK;
            print("Short break started!");
        }
    } else {
        // Start work session
        isWorkSession = true;
        timeRemaining = WORK_TIME;
        print("Work session started!");
    }
}

// Start timer
function startTimer() {
    isRunning = true;
    print("Timer started");
}

// Pause timer
function pauseTimer() {
    isRunning = false;
    print("Timer paused");
}

// Reset timer
function resetTimer() {
    isRunning = false;
    timeRemaining = WORK_TIME;
    isWorkSession = true;
    print("Timer reset");
}

// Initialize
print("Pomodoro Timer starting...");
updateDisplay();

// Auto-start for demo
startTimer();

// Main loop
while (true) {
    if (isRunning && timeRemaining > 0) {
        timeRemaining = timeRemaining - 1;

        if (timeRemaining <= 0) {
            completeSession();
        }
    }

    updateDisplay();
    delay(1000);
}
