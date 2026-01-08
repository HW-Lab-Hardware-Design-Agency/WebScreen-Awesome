// RSS Reader App for WebScreen
// Display latest news and updates from RSS feeds

// Screen dimensions
let screenWidth = 466;
let screenHeight = 466;

// Demo news items (used when feeds can't be fetched)
let newsItems = [
    { title: "WebScreen 2.0 Released with New Features", source: "WebScreen Blog", time: "2 hours ago" },
    { title: "ESP32-S3 Performance Tips and Tricks", source: "Tech News", time: "4 hours ago" },
    { title: "Building IoT Projects with LVGL", source: "Maker Weekly", time: "6 hours ago" },
    { title: "Open Source Hardware Movement Growing", source: "OSH News", time: "8 hours ago" },
    { title: "New JavaScript Engine for Embedded Systems", source: "Dev Daily", time: "12 hours ago" },
    { title: "Smart Display Projects for Beginners", source: "DIY Tech", time: "1 day ago" }
];

let currentIndex = 0;
let displayCount = 4;

// RSS Feed URLs (examples - modify as needed)
let RSS_FEEDS = [
    "https://news.ycombinator.com/rss"
];

// Create UI elements

// Background
let bg = create_label(null);
let bgStyle = create_style();
style_set_bg_color(bgStyle, "#fafafa");
style_set_width(bgStyle, screenWidth);
style_set_height(bgStyle, screenHeight);
obj_add_style(bg, bgStyle, 0);

// Header
let headerBg = create_label(null);
let headerBgStyle = create_style();
style_set_bg_color(headerBgStyle, "#ff6600");
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
label_set_text(headerLabel, "RSS READER");
move_obj(headerLabel, 20, 18);

// Feed indicator
let feedLabel = create_label(null);
let feedStyle = create_style();
style_set_text_color(feedStyle, "#FFFFFF");
style_set_text_font(feedStyle, "montserrat_12");
obj_add_style(feedLabel, feedStyle, 0);
label_set_text(feedLabel, "Demo Feed");
move_obj(feedLabel, screenWidth - 90, 22);

// News items container
let itemLabels = [];
let sourceLabels = [];
let timeLabels = [];

let i = 0;
while (i < displayCount) {
    let yPos = 75 + (i * 95);

    // Item card
    let cardBg = create_label(null);
    let cardStyle = create_style();
    style_set_bg_color(cardStyle, "#FFFFFF");
    style_set_bg_opa(cardStyle, 255);
    style_set_radius(cardStyle, 8);
    style_set_width(cardStyle, screenWidth - 30);
    style_set_height(cardStyle, 85);
    style_set_shadow_width(cardStyle, 4);
    style_set_shadow_color(cardStyle, "#00000020");
    style_set_shadow_ofs_y(cardStyle, 2);
    obj_add_style(cardBg, cardStyle, 0);
    move_obj(cardBg, 15, yPos);

    // Title
    let titleLabel = create_label(null);
    let titleStyle = create_style();
    style_set_text_color(titleStyle, "#1a1a1a");
    style_set_text_font(titleStyle, "montserrat_16");
    style_set_width(titleStyle, screenWidth - 60);
    obj_add_style(titleLabel, titleStyle, 0);
    move_obj(titleLabel, 25, yPos + 12);

    // Source
    let sourceLabel = create_label(null);
    let srcStyle = create_style();
    style_set_text_color(srcStyle, "#ff6600");
    style_set_text_font(srcStyle, "montserrat_12");
    obj_add_style(sourceLabel, srcStyle, 0);
    move_obj(sourceLabel, 25, yPos + 55);

    // Time
    let timeLabel = create_label(null);
    let tmStyle = create_style();
    style_set_text_color(tmStyle, "#888888");
    style_set_text_font(tmStyle, "montserrat_12");
    obj_add_style(timeLabel, tmStyle, 0);
    move_obj(timeLabel, screenWidth - 120, yPos + 55);

    itemLabels[i] = titleLabel;
    sourceLabels[i] = sourceLabel;
    timeLabels[i] = timeLabel;

    i = i + 1;
}

// Navigation indicator
let navLabel = create_label(null);
let navStyle = create_style();
style_set_text_color(navStyle, "#888888");
style_set_text_font(navStyle, "montserrat_14");
obj_add_style(navLabel, navStyle, 0);
move_obj(navLabel, screenWidth / 2 - 30, screenHeight - 30);

// Parse RSS feed (simplified XML parsing)
function parseRSSItem(xml, startPos) {
    let titleStart = str_index_of(str_substring(xml, startPos, 1000), "<title>");
    if (titleStart < 0) {
        return null;
    }
    titleStart = startPos + titleStart + 7;

    let titleEnd = str_index_of(str_substring(xml, titleStart, 500), "</title>");
    if (titleEnd < 0) {
        return null;
    }

    let title = str_substring(xml, titleStart, titleEnd);

    return {
        title: title,
        source: "RSS Feed",
        time: "Recent"
    };
}

// Fetch RSS feed
function fetchRSSFeed() {
    if (!wifi_status()) {
        print("WiFi not connected, using demo data");
        return;
    }

    let i = 0;
    while (i < RSS_FEEDS.length) {
        let response = http_get(RSS_FEEDS[i]);
        if (response && response.length > 0) {
            // Parse RSS items
            let items = [];
            let searchPos = 0;
            let itemCount = 0;

            while (itemCount < 10) {
                let itemStart = str_index_of(str_substring(response, searchPos, 5000), "<item>");
                if (itemStart < 0) {
                    break;
                }
                searchPos = searchPos + itemStart + 6;

                let item = parseRSSItem(response, searchPos);
                if (item) {
                    items[itemCount] = item;
                    itemCount = itemCount + 1;
                }
            }

            if (itemCount > 0) {
                newsItems = items;
                print("Fetched " + numberToString(itemCount) + " items");
            }
        }
        i = i + 1;
    }
}

// Update display
function updateDisplay() {
    let i = 0;
    while (i < displayCount) {
        let itemIndex = (currentIndex + i) % newsItems.length;
        let item = newsItems[itemIndex];

        // Truncate long titles
        let title = item.title;
        if (title.length > 50) {
            title = str_substring(title, 0, 47) + "...";
        }

        label_set_text(itemLabels[i], title);
        label_set_text(sourceLabels[i], item.source);
        label_set_text(timeLabels[i], item.time);

        i = i + 1;
    }

    // Update nav indicator
    let page = (currentIndex / displayCount) + 1;
    page = page - (page % 1);  // Floor
    let totalPages = (newsItems.length / displayCount);
    totalPages = totalPages - (totalPages % 1) + 1;
    label_set_text(navLabel, numberToString(page) + " / " + numberToString(totalPages));
}

// Initialize
print("RSS Reader starting...");

// Try to fetch RSS feed
fetchRSSFeed();
updateDisplay();

// Main loop
let scrollTimer = 0;
let refreshTimer = 0;

while (true) {
    delay(1000);
    scrollTimer = scrollTimer + 1;
    refreshTimer = refreshTimer + 1;

    // Scroll every 8 seconds
    if (scrollTimer >= 8) {
        scrollTimer = 0;
        currentIndex = (currentIndex + displayCount) % newsItems.length;
        updateDisplay();
    }

    // Refresh feed every 5 minutes
    if (refreshTimer >= 300) {
        refreshTimer = 0;
        fetchRSSFeed();
        updateDisplay();
    }
}
