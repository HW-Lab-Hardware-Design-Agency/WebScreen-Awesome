"use strict";

print("Starting JavaScript execution...");

/************************************************************
 * CA CERT
 ************************************************************/
let certOk = http_set_ca_cert_from_sd("/dualclock.pem");
if (!certOk) {
  print("Could not load CA from /dualclock.pem. Using insecure fallback.");
}

/************************************************************
 * CONFIGURATION
 * Read timezone settings from webscreen.json
 * Defaults: Tokyo and Buenos Aires
 ************************************************************/
let config = sd_read_file("/webscreen.json");

let timezone1 = "Asia/Tokyo";
let timezone2 = "America/Argentina/Buenos_Aires";
let cityPretty1 = "Tokyo";
let cityPretty2 = "Bs As";

if (config !== "") {
  let tz1 = parse_json_value(config, "timezone1");
  let tz2 = parse_json_value(config, "timezone2");
  let c1 = parse_json_value(config, "city1");
  let c2 = parse_json_value(config, "city2");

  if (tz1 !== "") timezone1 = tz1;
  if (tz2 !== "") timezone2 = tz2;
  if (c1 !== "") cityPretty1 = c1;
  if (c2 !== "") cityPretty2 = c2;

  print("Config loaded - Zone 1: " + cityPretty1 + " (" + timezone1 + ")");
  print("Config loaded - Zone 2: " + cityPretty2 + " (" + timezone2 + ")");
} else {
  print("No config found, using defaults");
}

/************************************************************
 * WIFI WAIT
 ************************************************************/
for (;;) {
  if (wifi_status()) break;
  delay(500);
  print("Waiting for Wi-Fi...");
}
print("Connected! IP: " + wifi_get_ip());

/************************************************************
 * INITIAL FETCH - ZONE 1
 ************************************************************/
let apiUrl1 = "https://timeapi.io/api/time/current/zone?timeZone=" + timezone1;
let jsonResponse1 = http_get(apiUrl1);
if (jsonResponse1 === "") {
  print("HTTP GET failed for " + cityPretty1 + ". Abort.");
  return;
}

let dateVal1  = parse_json_value(jsonResponse1, "date");
let hour1     = toNumber(parse_json_value(jsonResponse1, "hour"));
let minute1   = toNumber(parse_json_value(jsonResponse1, "minute"));
let seconds1  = toNumber(parse_json_value(jsonResponse1, "seconds"));

/************************************************************
 * INITIAL FETCH - ZONE 2
 ************************************************************/
let apiUrl2 = "https://timeapi.io/api/time/current/zone?timeZone=" + timezone2;
let jsonResponse2 = http_get(apiUrl2);

let dateVal2  = "N/A";
let hour2     = 0;
let minute2   = 0;
let seconds2  = 0;

if (jsonResponse2 !== "") {
  dateVal2  = parse_json_value(jsonResponse2, "date");
  hour2     = toNumber(parse_json_value(jsonResponse2, "hour"));
  minute2   = toNumber(parse_json_value(jsonResponse2, "minute"));
  seconds2  = toNumber(parse_json_value(jsonResponse2, "seconds"));
} else {
  print("Warning: HTTP GET failed for " + cityPretty2 + ". Using defaults.");
}

/************************************************************
 * STYLES
 * Reduced from 6 to 4 styles by reusing small styles for city/date
 * - Large (48pt): time display
 * - Small (34pt): city name and date
 * - Alignment: 0=left, 1=center
 ************************************************************/
let largeStyleCenter = create_style();
style_set_text_font(largeStyleCenter, 48);
style_set_text_color(largeStyleCenter, 0xFFFFFF);
style_set_pad_all(largeStyleCenter, 5);
style_set_text_align(largeStyleCenter, 1);

let largeStyleLeft = create_style();
style_set_text_font(largeStyleLeft, 48);
style_set_text_color(largeStyleLeft, 0xFFFFFF);
style_set_pad_all(largeStyleLeft, 5);
style_set_text_align(largeStyleLeft, 0);

let smallStyleCenter = create_style();
style_set_text_font(smallStyleCenter, 34);
style_set_text_color(smallStyleCenter, 0xFFFFFF);
style_set_pad_all(smallStyleCenter, 5);
style_set_text_align(smallStyleCenter, 1);

let smallStyleLeft = create_style();
style_set_text_font(smallStyleLeft, 34);
style_set_text_color(smallStyleLeft, 0xFFFFFF);
style_set_pad_all(smallStyleLeft, 5);
style_set_text_align(smallStyleLeft, 0);

/************************************************************
 * LABELS
 * Layout: Screen is ~536x240px
 * - Left zone (Buenos Aires): x=10, labels left-aligned
 * - Right zone (Tokyo): x=268 (center of screen), labels centered
 * - Vertical positions: time=40, city=100, date=155
 ************************************************************/

// Right zone - Tokyo (centered)
let timeLabel1 = create_label(268, 40);
obj_add_style(timeLabel1, largeStyleCenter, 0);

let cityLabel1 = create_label(310, 100);
obj_add_style(cityLabel1, smallStyleCenter, 0);
label_set_text(cityLabel1, cityPretty1);

let dateLabel1 = create_label(268, 155);
obj_add_style(dateLabel1, smallStyleCenter, 0);
label_set_text(dateLabel1, dateVal1);

// Left zone - Buenos Aires (left-aligned)
let timeLabel2 = create_label(10, 40);
obj_add_style(timeLabel2, largeStyleLeft, 0);

let cityLabel2 = create_label(50, 100);
obj_add_style(cityLabel2, smallStyleLeft, 0);
label_set_text(cityLabel2, cityPretty2);

let dateLabel2 = create_label(10, 155);
obj_add_style(dateLabel2, smallStyleLeft, 0);
label_set_text(dateLabel2, dateVal2);

/************************************************************
 * ICONS
 ************************************************************/
show_gif_from_sd("/point.gif", 268, 100);
show_gif_from_sd("/point.gif", 10, 100);

/************************************************************
 * RESYNC CONFIG
 ************************************************************/
let RESYNC_PERIOD_MS = 10 * 60 * 1000;
let RESYNC_RETRY_MS  = 30 * 1000;
let resyncElapsedMs = 0;
let nextResyncMs    = RESYNC_PERIOD_MS;

/************************************************************
 * RESYNC HELPERS
 ************************************************************/
let fetch_zone = function (tz) {
  let js = http_get(
    "https://timeapi.io/api/time/current/zone?timeZone=" + tz
  );
  if (js === "") return null;

  return {
    hour:    toNumber(parse_json_value(js, "hour")),
    minute:  toNumber(parse_json_value(js, "minute")),
    seconds: toNumber(parse_json_value(js, "seconds")),
    date:    parse_json_value(js, "date")
  };
};

let try_resync = function () {
  if (!wifi_status()) {
    print("Resync skipped: WiFi not connected");
    nextResyncMs = RESYNC_RETRY_MS;
    return;
  }

  print("Resyncing time from API...");
  let z1 = fetch_zone(timezone1);
  let z2 = fetch_zone(timezone2);

  if (z1) {
    hour1 = z1.hour;
    minute1 = z1.minute;
    seconds1 = z1.seconds;
    dateVal1 = z1.date;
    label_set_text(dateLabel1, dateVal1);
    print(cityPretty1 + " resynced: " + z1.date);
  }

  if (z2) {
    hour2 = z2.hour;
    minute2 = z2.minute;
    seconds2 = z2.seconds;
    dateVal2 = z2.date;
    label_set_text(dateLabel2, dateVal2);
    print(cityPretty2 + " resynced: " + z2.date);
  }

  nextResyncMs = (z1 || z2) ? RESYNC_PERIOD_MS : RESYNC_RETRY_MS;
};

/************************************************************
 * FORMAT HELPERS
 ************************************************************/
let padZero = function (num) {
  if (num < 10) return "0" + numberToString(num);
  return numberToString(num);
};

/************************************************************
 * CLOCK LOGIC
 ************************************************************/
let update_clock = function () {

  // periodic internet resync
  resyncElapsedMs += 1000;
  if (resyncElapsedMs >= nextResyncMs) {
    resyncElapsedMs = 0;
    try_resync();
  }

  // local tick
  seconds1++; seconds2++;

  if (seconds1 >= 60) { seconds1 = 0; minute1++; }
  if (seconds2 >= 60) { seconds2 = 0; minute2++; }

  if (minute1 >= 60) { minute1 = 0; hour1++; }
  if (minute2 >= 60) { minute2 = 0; hour2++; }

  if (hour1 >= 24) hour1 = 0;
  if (hour2 >= 24) hour2 = 0;

  // 12h format
  let h1 = hour1 % 12; if (h1 === 0) h1 = 12;
  let h2 = hour2 % 12; if (h2 === 0) h2 = 12;
  let ap1 = (hour1 >= 12) ? "PM" : "AM";
  let ap2 = (hour2 >= 12) ? "PM" : "AM";

  let s1 = padZero(h1) + ":" + padZero(minute1) + " " + ap1;
  let s2 = padZero(h2) + ":" + padZero(minute2) + " " + ap2;

  label_set_text(timeLabel1, s1);
  label_set_text(timeLabel2, s2);
};

/************************************************************
 * START
 ************************************************************/
print("Clock running with periodic internet resync");
update_clock();
create_timer("update_clock", 1000);
