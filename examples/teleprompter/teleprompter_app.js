// Teleprompter App for WebScreen
// Scrolling text display for presentations and speeches

// Configuration
let scrollSpeed = 2;        // Pixels per update
let scrollInterval = 50;    // Milliseconds between updates
let currentY = 0;
let textHeight = 0;
let isPaused = false;

// Sample speech text (can be loaded from SD card)
let speechText = "Welcome to WebScreen Teleprompter.\n\nThis is a sample speech text that will scroll automatically on your display.\n\nYou can customize the scroll speed and load your own text from the SD card.\n\nThe teleprompter is perfect for:\n- Presentations\n- Video recordings\n- Public speaking\n- Reading scripts\n\nTo load your own text, create a file called speech.txt on your SD card.\n\nThank you for using WebScreen!";

// Screen dimensions
let screenWidth = 466;
let screenHeight = 466;

// Create UI elements
let container = create_label(null);
let containerStyle = create_style();
style_set_bg_color(containerStyle, "#000000");
style_set_width(containerStyle, screenWidth);
style_set_height(containerStyle, screenHeight);
obj_add_style(container, containerStyle, 0);

// Title bar
let titleLabel = create_label(null);
let titleStyle = create_style();
style_set_text_color(titleStyle, "#00FF00");
style_set_text_font(titleStyle, "montserrat_20");
style_set_bg_color(titleStyle, "#1a1a1a");
style_set_bg_opa(titleStyle, 255);
style_set_pad_all(titleStyle, 8);
style_set_width(titleStyle, screenWidth);
obj_add_style(titleLabel, titleStyle, 0);
label_set_text(titleLabel, "TELEPROMPTER");
move_obj(titleLabel, 0, 0);

// Speed indicator
let speedLabel = create_label(null);
let speedStyle = create_style();
style_set_text_color(speedStyle, "#888888");
style_set_text_font(speedStyle, "montserrat_14");
obj_add_style(speedLabel, speedStyle, 0);
move_obj(speedLabel, screenWidth - 80, 10);

// Main text area
let textLabel = create_label(null);
let textStyle = create_style();
style_set_text_color(textStyle, "#FFFFFF");
style_set_text_font(textStyle, "montserrat_28");
style_set_width(textStyle, screenWidth - 40);
style_set_text_line_space(textStyle, 12);
style_set_pad_left(textStyle, 20);
style_set_pad_right(textStyle, 20);
obj_add_style(textLabel, textStyle, 0);

// Status bar at bottom
let statusLabel = create_label(null);
let statusStyle = create_style();
style_set_text_color(statusStyle, "#666666");
style_set_text_font(statusStyle, "montserrat_14");
style_set_bg_color(statusStyle, "#1a1a1a");
style_set_bg_opa(statusStyle, 200);
style_set_pad_all(statusStyle, 5);
style_set_width(statusStyle, screenWidth);
obj_add_style(statusLabel, statusStyle, 0);
move_obj(statusLabel, 0, screenHeight - 30);

// Try to load text from SD card
function loadTextFromSD() {
    let fileContent = sd_read_file("/speech.txt");
    if (fileContent && fileContent.length > 0) {
        speechText = fileContent;
        print("Loaded speech from SD card");
    } else {
        print("Using default speech text");
    }
}

// Initialize text
function initText() {
    loadTextFromSD();
    label_set_text(textLabel, speechText);
    // Start text below visible area
    currentY = screenHeight;
    move_obj(textLabel, 0, currentY);
    // Estimate text height (rough calculation)
    let lineCount = 1;
    let i = 0;
    while (i < speechText.length) {
        if (str_substring(speechText, i, 1) === "\n") {
            lineCount = lineCount + 1;
        }
        i = i + 1;
    }
    textHeight = lineCount * 40 + 200;
}

// Update scroll position
function updateScroll() {
    if (isPaused) {
        return;
    }

    currentY = currentY - scrollSpeed;
    move_obj(textLabel, 0, currentY);

    // Reset when text has scrolled past
    if (currentY < -textHeight) {
        currentY = screenHeight;
    }

    // Update status
    let progress = 0;
    if (textHeight > 0) {
        progress = ((screenHeight - currentY) * 100) / (textHeight + screenHeight);
        if (progress < 0) {
            progress = 0;
        }
        if (progress > 100) {
            progress = 100;
        }
    }
    label_set_text(statusLabel, "Progress: " + numberToString(progress) + "%  |  Tap to pause");
}

// Update speed display
function updateSpeedDisplay() {
    label_set_text(speedLabel, "Speed: " + numberToString(scrollSpeed));
}

// Control functions
function increaseSpeed() {
    if (scrollSpeed < 10) {
        scrollSpeed = scrollSpeed + 1;
        updateSpeedDisplay();
    }
}

function decreaseSpeed() {
    if (scrollSpeed > 1) {
        scrollSpeed = scrollSpeed - 1;
        updateSpeedDisplay();
    }
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        label_set_text(statusLabel, "PAUSED - Tap to resume");
    }
}

function resetPosition() {
    currentY = screenHeight;
    move_obj(textLabel, 0, currentY);
}

// Initialize
print("Teleprompter starting...");
initText();
updateSpeedDisplay();

// Main loop
let timer = create_timer();
let loopCount = 0;

while (true) {
    updateScroll();

    // Cycle through demo controls every 30 seconds
    loopCount = loopCount + 1;
    if (loopCount === 600) {  // 30 seconds at 50ms interval
        // Demo: change speed
        if (scrollSpeed < 4) {
            increaseSpeed();
        }
    }

    delay(scrollInterval);
}
