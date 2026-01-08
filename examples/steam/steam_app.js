// Steam Connect App for WebScreen
// Display Steam profile, friends online, and game activity

// Configuration - Set your Steam API key and Steam ID
let STEAM_API_KEY = "YOUR_STEAM_API_KEY";  // Get from https://steamcommunity.com/dev/apikey
let STEAM_ID = "YOUR_STEAM_ID";            // Your 64-bit Steam ID

// Screen dimensions
let screenWidth = 466;
let screenHeight = 466;

// Demo data (used when no API key configured)
let demoMode = true;
let demoProfile = {
    name: "WebScreen Gamer",
    status: "Online",
    game: "Counter-Strike 2",
    friendsOnline: 12,
    friendsTotal: 156,
    level: 42
};

// Create UI elements

// Background
let bg = create_label(null);
let bgStyle = create_style();
style_set_bg_color(bgStyle, "#1b2838");  // Steam dark blue
style_set_width(bgStyle, screenWidth);
style_set_height(bgStyle, screenHeight);
obj_add_style(bg, bgStyle, 0);

// Steam logo/title
let titleLabel = create_label(null);
let titleStyle = create_style();
style_set_text_color(titleStyle, "#66c0f4");  // Steam blue
style_set_text_font(titleStyle, "montserrat_28");
style_set_bg_color(titleStyle, "#171a21");
style_set_bg_opa(titleStyle, 255);
style_set_pad_all(titleStyle, 12);
style_set_width(titleStyle, screenWidth);
obj_add_style(titleLabel, titleStyle, 0);
label_set_text(titleLabel, "STEAM");
move_obj(titleLabel, 0, 0);

// Profile section
let profileCard = create_label(null);
let cardStyle = create_style();
style_set_bg_color(cardStyle, "#2a475e");
style_set_bg_opa(cardStyle, 255);
style_set_radius(cardStyle, 8);
style_set_width(cardStyle, screenWidth - 40);
style_set_height(cardStyle, 120);
style_set_pad_all(cardStyle, 15);
obj_add_style(profileCard, cardStyle, 0);
move_obj(profileCard, 20, 70);

// Username
let usernameLabel = create_label(null);
let usernameStyle = create_style();
style_set_text_color(usernameStyle, "#FFFFFF");
style_set_text_font(usernameStyle, "montserrat_24");
obj_add_style(usernameLabel, usernameStyle, 0);
move_obj(usernameLabel, 35, 85);

// Status indicator
let statusLabel = create_label(null);
let statusStyle = create_style();
style_set_text_color(statusStyle, "#57cbde");  // Online color
style_set_text_font(statusStyle, "montserrat_16");
obj_add_style(statusLabel, statusStyle, 0);
move_obj(statusLabel, 35, 120);

// Level badge
let levelLabel = create_label(null);
let levelStyle = create_style();
style_set_text_color(levelStyle, "#c7d5e0");
style_set_text_font(levelStyle, "montserrat_14");
style_set_bg_color(levelStyle, "#1b2838");
style_set_bg_opa(levelStyle, 255);
style_set_radius(levelStyle, 4);
style_set_pad_all(levelStyle, 5);
obj_add_style(levelLabel, levelStyle, 0);
move_obj(levelLabel, 35, 150);

// Currently Playing section
let playingHeader = create_label(null);
let headerStyle = create_style();
style_set_text_color(headerStyle, "#8f98a0");
style_set_text_font(headerStyle, "montserrat_14");
obj_add_style(playingHeader, headerStyle, 0);
label_set_text(playingHeader, "CURRENTLY PLAYING");
move_obj(playingHeader, 20, 210);

let gameLabel = create_label(null);
let gameStyle = create_style();
style_set_text_color(gameStyle, "#a3cf06");  // Steam green for playing
style_set_text_font(gameStyle, "montserrat_20");
style_set_bg_color(gameStyle, "#2a475e");
style_set_bg_opa(gameStyle, 255);
style_set_radius(gameStyle, 6);
style_set_pad_all(gameStyle, 12);
style_set_width(gameStyle, screenWidth - 40);
obj_add_style(gameLabel, gameStyle, 0);
move_obj(gameLabel, 20, 235);

// Friends section
let friendsHeader = create_label(null);
obj_add_style(friendsHeader, headerStyle, 0);
label_set_text(friendsHeader, "FRIENDS");
move_obj(friendsHeader, 20, 310);

let friendsCard = create_label(null);
let friendsCardStyle = create_style();
style_set_bg_color(friendsCardStyle, "#2a475e");
style_set_bg_opa(friendsCardStyle, 255);
style_set_radius(friendsCardStyle, 6);
style_set_width(friendsCardStyle, screenWidth - 40);
style_set_height(friendsCardStyle, 80);
style_set_pad_all(friendsCardStyle, 12);
obj_add_style(friendsCard, friendsCardStyle, 0);
move_obj(friendsCard, 20, 335);

let friendsOnlineLabel = create_label(null);
let friendsOnlineStyle = create_style();
style_set_text_color(friendsOnlineStyle, "#57cbde");
style_set_text_font(friendsOnlineStyle, "montserrat_32");
obj_add_style(friendsOnlineLabel, friendsOnlineStyle, 0);
move_obj(friendsOnlineLabel, 35, 350);

let friendsTotalLabel = create_label(null);
let friendsTotalStyle = create_style();
style_set_text_color(friendsTotalStyle, "#8f98a0");
style_set_text_font(friendsTotalStyle, "montserrat_14");
obj_add_style(friendsTotalLabel, friendsTotalStyle, 0);
move_obj(friendsTotalLabel, 35, 390);

// Last updated
let updateLabel = create_label(null);
let updateStyle = create_style();
style_set_text_color(updateStyle, "#4a5568");
style_set_text_font(updateStyle, "montserrat_12");
obj_add_style(updateLabel, updateStyle, 0);
move_obj(updateLabel, 20, screenHeight - 25);

// Fetch Steam data
function fetchSteamData() {
    if (demoMode || STEAM_API_KEY === "YOUR_STEAM_API_KEY") {
        // Use demo data
        updateDisplay(demoProfile);
        return;
    }

    // Fetch player summary
    let url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=" + STEAM_API_KEY + "&steamids=" + STEAM_ID;
    let response = http_get(url);

    if (response && response.length > 0) {
        let personaname = parse_json_value(response, "personaname");
        let personastate = parse_json_value(response, "personastate");
        let gameid = parse_json_value(response, "gameid");
        let gameextrainfo = parse_json_value(response, "gameextrainfo");

        let profile = {
            name: personaname || "Unknown",
            status: getStatusText(personastate),
            game: gameextrainfo || "Not in game",
            friendsOnline: 0,
            friendsTotal: 0,
            level: 0
        };

        // Fetch friends list
        fetchFriends(profile);
    } else {
        print("Failed to fetch Steam data");
        updateDisplay(demoProfile);
    }
}

function fetchFriends(profile) {
    let url = "https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=" + STEAM_API_KEY + "&steamid=" + STEAM_ID;
    let response = http_get(url);

    if (response && response.length > 0) {
        // Count friends (simplified)
        let friendCount = 0;
        let i = 0;
        while (i < response.length) {
            if (str_index_of(str_substring(response, i, 20), "steamid") >= 0) {
                friendCount = friendCount + 1;
            }
            i = i + 100;
        }
        profile.friendsTotal = friendCount;
        profile.friendsOnline = friendCount / 10;  // Estimate
    }

    updateDisplay(profile);
}

function getStatusText(state) {
    if (state === "0") {
        return "Offline";
    }
    if (state === "1") {
        return "Online";
    }
    if (state === "2") {
        return "Busy";
    }
    if (state === "3") {
        return "Away";
    }
    if (state === "4") {
        return "Snooze";
    }
    return "Online";
}

function updateDisplay(profile) {
    label_set_text(usernameLabel, profile.name);

    // Update status with color
    label_set_text(statusLabel, profile.status);
    if (profile.status === "Online") {
        style_set_text_color(statusStyle, "#57cbde");
    } else if (profile.status === "Offline") {
        style_set_text_color(statusStyle, "#898989");
    } else {
        style_set_text_color(statusStyle, "#57cbde");
    }

    label_set_text(levelLabel, "Level " + numberToString(profile.level));

    // Game status
    if (profile.game && profile.game !== "Not in game") {
        label_set_text(gameLabel, profile.game);
        style_set_text_color(gameStyle, "#a3cf06");
    } else {
        label_set_text(gameLabel, "Not playing");
        style_set_text_color(gameStyle, "#8f98a0");
    }

    // Friends
    label_set_text(friendsOnlineLabel, numberToString(profile.friendsOnline) + " Online");
    label_set_text(friendsTotalLabel, numberToString(profile.friendsTotal) + " friends total");

    label_set_text(updateLabel, "Demo Mode - Configure API key for live data");
}

// Initialize
print("Steam Connect starting...");

// Check WiFi and fetch data
if (wifi_status()) {
    fetchSteamData();
} else {
    print("WiFi not connected, using demo data");
    updateDisplay(demoProfile);
}

// Main loop - refresh every 60 seconds
let refreshCounter = 0;
while (true) {
    delay(1000);
    refreshCounter = refreshCounter + 1;

    if (refreshCounter >= 60) {
        refreshCounter = 0;
        if (wifi_status()) {
            fetchSteamData();
        }
    }
}
