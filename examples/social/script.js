"use strict";

print("Starting Social Feed...");

// Current post index
let currentPost = 0;
let totalPosts = 6;

// Demo posts data
let usernames = "@techguru,@naturelover,@devlife,@foodie_adventures,@travelbug,@fitness_daily";
let posts = "Just shipped a new feature! The team worked so hard on this one.,Caught this amazing sunset at the beach today. Nature never disappoints!,Debugging at 2am... found it was a missing semicolon. Classic.,This homemade pasta turned out perfect! Recipe in bio.,Exploring the streets of Tokyo. Every corner is a new adventure!,Morning workout done! 5am club checking in.";
let times = "2m ago,15m ago,1h ago,3h ago,5h ago,8h ago";
let likes = "142,89,256,312,178,423";
let comments = "23,12,45,67,34,89";

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
let headerStyle = create_style();
style_set_text_font(headerStyle, 20);
style_set_text_color(headerStyle, 0xFFFFFF);
style_set_text_align(headerStyle, 0);

let usernameStyle = create_style();
style_set_text_font(usernameStyle, 20);
style_set_text_color(usernameStyle, 0x00BFFF);
style_set_text_align(usernameStyle, 0);

let timeStyle = create_style();
style_set_text_font(timeStyle, 14);
style_set_text_color(timeStyle, 0x666666);
style_set_text_align(timeStyle, 0);

let postStyle = create_style();
style_set_text_font(postStyle, 20);
style_set_text_color(postStyle, 0xFFFFFF);
style_set_text_align(postStyle, 0);

let statsStyle = create_style();
style_set_text_font(statsStyle, 14);
style_set_text_color(statsStyle, 0x888888);
style_set_text_align(statsStyle, 0);

let navStyle = create_style();
style_set_text_font(navStyle, 28);
style_set_text_color(navStyle, 0x444444);
style_set_text_align(navStyle, 1);

let activeNavStyle = create_style();
style_set_text_font(activeNavStyle, 28);
style_set_text_color(activeNavStyle, 0x00BFFF);
style_set_text_align(activeNavStyle, 1);

let counterStyle = create_style();
style_set_text_font(counterStyle, 14);
style_set_text_color(counterStyle, 0x666666);
style_set_text_align(counterStyle, 1);

// Header
let headerLabel = create_label(20, 12);
obj_add_style(headerLabel, headerStyle, 0);
label_set_text(headerLabel, "Social Feed");

let refreshLabel = create_label(480, 12);
let refreshStyle = create_style();
style_set_text_font(refreshStyle, 14);
style_set_text_color(refreshStyle, 0x00BFFF);
style_set_text_align(refreshStyle, 2);
obj_add_style(refreshLabel, refreshStyle, 0);
label_set_text(refreshLabel, "Refresh");

// Divider line
let divider = create_label(20, 38);
let dividerStyle = create_style();
style_set_bg_color(dividerStyle, 0x333333);
style_set_bg_opa(dividerStyle, 255);
style_set_width(dividerStyle, 496);
style_set_height(dividerStyle, 1);
obj_add_style(divider, dividerStyle, 0);
label_set_text(divider, "");

// Avatar placeholder
let avatar = create_label(25, 55);
let avatarStyle = create_style();
style_set_bg_color(avatarStyle, 0x333366);
style_set_bg_opa(avatarStyle, 255);
style_set_width(avatarStyle, 44);
style_set_height(avatarStyle, 44);
style_set_radius(avatarStyle, 22);
obj_add_style(avatar, avatarStyle, 0);
label_set_text(avatar, "");

// Avatar initial
let avatarText = create_label(40, 65);
let avatarTextStyle = create_style();
style_set_text_font(avatarTextStyle, 20);
style_set_text_color(avatarTextStyle, 0xFFFFFF);
style_set_text_align(avatarTextStyle, 1);
obj_add_style(avatarText, avatarTextStyle, 0);
label_set_text(avatarText, "T");

// Username
let usernameLabel = create_label(80, 55);
obj_add_style(usernameLabel, usernameStyle, 0);
label_set_text(usernameLabel, "@techguru");

// Time
let postTimeLabel = create_label(80, 78);
obj_add_style(postTimeLabel, timeStyle, 0);
label_set_text(postTimeLabel, "2m ago");

// Post content (2 lines)
let postLine1 = create_label(25, 110);
obj_add_style(postLine1, postStyle, 0);
label_set_text(postLine1, "");

let postLine2 = create_label(25, 132);
obj_add_style(postLine2, postStyle, 0);
label_set_text(postLine2, "");

// Stats (likes, comments)
let likesLabel = create_label(25, 165);
obj_add_style(likesLabel, statsStyle, 0);
label_set_text(likesLabel, "");

let commentsLabel = create_label(120, 165);
obj_add_style(commentsLabel, statsStyle, 0);
label_set_text(commentsLabel, "");

// Navigation dots
let dot0 = create_label(238, 200);
let dot1 = create_label(258, 200);
let dot2 = create_label(278, 200);
let dot3 = create_label(298, 200);
let dot4 = create_label(318, 200);
let dot5 = create_label(338, 200);

obj_add_style(dot0, activeNavStyle, 0); label_set_text(dot0, "o");
obj_add_style(dot1, navStyle, 0); label_set_text(dot1, "o");
obj_add_style(dot2, navStyle, 0); label_set_text(dot2, "o");
obj_add_style(dot3, navStyle, 0); label_set_text(dot3, "o");
obj_add_style(dot4, navStyle, 0); label_set_text(dot4, "o");
obj_add_style(dot5, navStyle, 0); label_set_text(dot5, "o");

// Post counter
let counterLabel = create_label(268, 220);
obj_add_style(counterLabel, counterStyle, 0);
label_set_text(counterLabel, "1 of 6");

// Split post text into 2 lines (max ~45 chars per line)
let splitPost = function(text) {
  let len = str_length(text);

  if (len <= 45) {
    label_set_text(postLine1, text);
    label_set_text(postLine2, "");
    return;
  }

  // Find space near position 45
  let splitPos = 45;
  let i = 45;
  while (i >= 30) {
    let c = str_substring(text, i, 1);
    if (c === " ") {
      splitPos = i;
      break;
    }
    i--;
  }

  let line1 = str_substring(text, 0, splitPos);
  let line2 = str_substring(text, splitPos + 1, 100);
  label_set_text(postLine1, line1);
  label_set_text(postLine2, line2);
};

// Update dot styles based on current post
let updateDots = function() {
  if (currentPost === 0) {
    obj_add_style(dot0, activeNavStyle, 0);
  } else {
    obj_add_style(dot0, navStyle, 0);
  }
  if (currentPost === 1) {
    obj_add_style(dot1, activeNavStyle, 0);
  } else {
    obj_add_style(dot1, navStyle, 0);
  }
  if (currentPost === 2) {
    obj_add_style(dot2, activeNavStyle, 0);
  } else {
    obj_add_style(dot2, navStyle, 0);
  }
  if (currentPost === 3) {
    obj_add_style(dot3, activeNavStyle, 0);
  } else {
    obj_add_style(dot3, navStyle, 0);
  }
  if (currentPost === 4) {
    obj_add_style(dot4, activeNavStyle, 0);
  } else {
    obj_add_style(dot4, navStyle, 0);
  }
  if (currentPost === 5) {
    obj_add_style(dot5, activeNavStyle, 0);
  } else {
    obj_add_style(dot5, navStyle, 0);
  }
};

// Update display with current post
let updatePost = function() {
  let username = getItem(usernames, currentPost);
  let post = getItem(posts, currentPost);
  let time = getItem(times, currentPost);
  let likeCount = getItem(likes, currentPost);
  let commentCount = getItem(comments, currentPost);

  label_set_text(usernameLabel, username);
  label_set_text(postTimeLabel, time);
  splitPost(post);
  label_set_text(likesLabel, likeCount + " likes");
  label_set_text(commentsLabel, commentCount + " comments");

  // Update avatar initial (second character after @)
  let initial = str_substring(username, 1, 1);
  // Convert to uppercase manually for common letters
  if (initial === "t") initial = "T";
  if (initial === "n") initial = "N";
  if (initial === "d") initial = "D";
  if (initial === "f") initial = "F";
  label_set_text(avatarText, initial);

  // Update counter
  label_set_text(counterLabel, numberToString(currentPost + 1) + " of " + numberToString(totalPosts));

  updateDots();
};

// Cycle through posts
let cycle_posts = function() {
  currentPost++;
  if (currentPost >= totalPosts) {
    currentPost = 0;
  }
  updatePost();
  print("Showing post " + numberToString(currentPost + 1));
};

// Initialize display
updatePost();

// Cycle every 5 seconds
create_timer("cycle_posts", 5000);

print("Social Feed ready!");
