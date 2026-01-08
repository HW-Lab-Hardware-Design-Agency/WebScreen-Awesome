// Bid Watcher App for WebScreen
// Track auction bids and marketplace listings

// Screen dimensions
let screenWidth = 466;
let screenHeight = 466;

// Demo auction items
let auctions = [
    { title: "Vintage ESP32 Dev Board", currentBid: 45.00, yourBid: 42.00, endTime: 3600, bids: 12, status: "outbid" },
    { title: "AMOLED Display Module", currentBid: 28.50, yourBid: 28.50, endTime: 7200, bids: 8, status: "winning" },
    { title: "Soldering Station Kit", currentBid: 89.99, yourBid: 0, endTime: 1800, bids: 23, status: "watching" },
    { title: "Arduino Sensor Bundle", currentBid: 34.00, yourBid: 35.00, endTime: 86400, bids: 5, status: "winning" }
];

let currentIndex = 0;
let displayCount = 3;

// Create UI elements

// Background
let bg = create_label(null);
let bgStyle = create_style();
style_set_bg_color(bgStyle, "#fef3c7");
style_set_width(bgStyle, screenWidth);
style_set_height(bgStyle, screenHeight);
obj_add_style(bg, bgStyle, 0);

// Header
let headerBg = create_label(null);
let headerBgStyle = create_style();
style_set_bg_color(headerBgStyle, "#d97706");
style_set_bg_opa(headerBgStyle, 255);
style_set_width(headerBgStyle, screenWidth);
style_set_height(headerBgStyle, 60);
obj_add_style(headerBg, headerBgStyle, 0);
move_obj(headerBg, 0, 0);

let headerLabel = create_label(null);
let headerStyle = create_style();
style_set_text_color(headerStyle, "#FFFFFF");
style_set_text_font(headerStyle, "montserrat_24");
obj_add_style(headerLabel, headerStyle, 0);
label_set_text(headerLabel, "BID WATCHER");
move_obj(headerLabel, 20, 18);

// Summary stats
let statsLabel = create_label(null);
let statsStyle = create_style();
style_set_text_color(statsStyle, "#FFFFFF");
style_set_text_font(statsStyle, "montserrat_12");
obj_add_style(statsLabel, statsStyle, 0);
move_obj(statsLabel, screenWidth - 140, 22);

// Create auction item cards
let itemCards = [];

let i = 0;
while (i < displayCount) {
    let yPos = 75 + (i * 125);

    // Card background
    let card = create_label(null);
    let cardStyle = create_style();
    style_set_bg_color(cardStyle, "#FFFFFF");
    style_set_bg_opa(cardStyle, 255);
    style_set_radius(cardStyle, 10);
    style_set_width(cardStyle, screenWidth - 30);
    style_set_height(cardStyle, 115);
    style_set_shadow_width(cardStyle, 6);
    style_set_shadow_color(cardStyle, "#00000015");
    style_set_shadow_ofs_y(cardStyle, 3);
    obj_add_style(card, cardStyle, 0);
    move_obj(card, 15, yPos);

    // Status badge
    let statusLabel = create_label(null);
    let statusBadgeStyle = create_style();
    style_set_text_color(statusBadgeStyle, "#FFFFFF");
    style_set_text_font(statusBadgeStyle, "montserrat_12");
    style_set_radius(statusBadgeStyle, 4);
    style_set_pad_all(statusBadgeStyle, 4);
    obj_add_style(statusLabel, statusBadgeStyle, 0);
    move_obj(statusLabel, screenWidth - 100, yPos + 10);

    // Title
    let titleLabel = create_label(null);
    let titleStyle = create_style();
    style_set_text_color(titleStyle, "#1f2937");
    style_set_text_font(titleStyle, "montserrat_16");
    style_set_width(titleStyle, screenWidth - 120);
    obj_add_style(titleLabel, titleStyle, 0);
    move_obj(titleLabel, 25, yPos + 12);

    // Current bid
    let bidLabel = create_label(null);
    let bidStyle = create_style();
    style_set_text_color(bidStyle, "#059669");
    style_set_text_font(bidStyle, "montserrat_24");
    obj_add_style(bidLabel, bidStyle, 0);
    move_obj(bidLabel, 25, yPos + 45);

    // Bid count
    let countLabel = create_label(null);
    let countStyle = create_style();
    style_set_text_color(countStyle, "#6b7280");
    style_set_text_font(countStyle, "montserrat_12");
    obj_add_style(countLabel, countStyle, 0);
    move_obj(countLabel, 25, yPos + 80);

    // Time remaining
    let timeLabel = create_label(null);
    let timeStyle = create_style();
    style_set_text_color(timeStyle, "#dc2626");
    style_set_text_font(timeStyle, "montserrat_14");
    obj_add_style(timeLabel, timeStyle, 0);
    move_obj(timeLabel, screenWidth - 130, yPos + 80);

    itemCards[i] = {
        status: { label: statusLabel, style: statusBadgeStyle },
        title: titleLabel,
        bid: bidLabel,
        count: countLabel,
        time: timeLabel
    };

    i = i + 1;
}

// Navigation
let navLabel = create_label(null);
let navStyle = create_style();
style_set_text_color(navStyle, "#92400e");
style_set_text_font(navStyle, "montserrat_14");
obj_add_style(navLabel, navStyle, 0);
move_obj(navLabel, screenWidth / 2 - 30, screenHeight - 30);

// Format time remaining
function formatTimeRemaining(seconds) {
    if (seconds <= 0) {
        return "Ended";
    }

    let days = seconds / 86400;
    days = days - (days % 1);
    let hours = (seconds % 86400) / 3600;
    hours = hours - (hours % 1);
    let mins = (seconds % 3600) / 60;
    mins = mins - (mins % 1);

    if (days > 0) {
        return numberToString(days) + "d " + numberToString(hours) + "h";
    }
    if (hours > 0) {
        return numberToString(hours) + "h " + numberToString(mins) + "m";
    }
    return numberToString(mins) + "m";
}

// Get status badge color
function getStatusColor(status) {
    if (status === "winning") {
        return "#059669";  // Green
    }
    if (status === "outbid") {
        return "#dc2626";  // Red
    }
    return "#6b7280";  // Gray for watching
}

// Update display
function updateDisplay() {
    // Calculate summary stats
    let winning = 0;
    let outbid = 0;
    let j = 0;
    while (j < auctions.length) {
        if (auctions[j].status === "winning") {
            winning = winning + 1;
        }
        if (auctions[j].status === "outbid") {
            outbid = outbid + 1;
        }
        j = j + 1;
    }
    label_set_text(statsLabel, "Win: " + numberToString(winning) + " | Outbid: " + numberToString(outbid));

    // Update cards
    let k = 0;
    while (k < displayCount) {
        let idx = (currentIndex + k) % auctions.length;
        let auction = auctions[idx];
        let card = itemCards[k];

        // Status badge
        label_set_text(card.status.label, auction.status.toUpperCase ? auction.status : auction.status);
        style_set_bg_color(card.status.style, getStatusColor(auction.status));
        style_set_bg_opa(card.status.style, 255);

        // Title (truncate if needed)
        let title = auction.title;
        if (title.length > 28) {
            title = str_substring(title, 0, 25) + "...";
        }
        label_set_text(card.title, title);

        // Current bid
        label_set_text(card.bid, "$" + numberToString(auction.currentBid));

        // Bid count
        label_set_text(card.count, numberToString(auction.bids) + " bids");

        // Time remaining
        label_set_text(card.time, formatTimeRemaining(auction.endTime));

        k = k + 1;
    }

    // Navigation
    let page = (currentIndex / displayCount) + 1;
    page = page - (page % 1);
    let total = (auctions.length / displayCount);
    total = total - (total % 1) + 1;
    label_set_text(navLabel, numberToString(page) + " / " + numberToString(total));
}

// Simulate auction updates
function simulateAuctions() {
    let m = 0;
    while (m < auctions.length) {
        // Decrease time
        if (auctions[m].endTime > 0) {
            auctions[m].endTime = auctions[m].endTime - 1;
        }

        // Random bid increases
        if (auctions[m].endTime > 0 && (m + currentIndex) % 20 === 0) {
            auctions[m].currentBid = auctions[m].currentBid + 0.50;
            auctions[m].currentBid = toNumber(numberToString(auctions[m].currentBid * 100)) / 100;
            auctions[m].bids = auctions[m].bids + 1;

            // Check if outbid
            if (auctions[m].yourBid > 0 && auctions[m].currentBid > auctions[m].yourBid) {
                auctions[m].status = "outbid";
            }
        }

        m = m + 1;
    }
}

// Initialize
print("Bid Watcher starting...");
updateDisplay();

// Main loop
let scrollTimer = 0;

while (true) {
    delay(1000);

    // Update auction timers and simulate bids
    simulateAuctions();
    updateDisplay();

    // Scroll every 10 seconds
    scrollTimer = scrollTimer + 1;
    if (scrollTimer >= 10) {
        scrollTimer = 0;
        currentIndex = (currentIndex + displayCount) % auctions.length;
    }
}
