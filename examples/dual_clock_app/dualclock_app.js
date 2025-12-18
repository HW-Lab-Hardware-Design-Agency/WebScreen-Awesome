"use strict";

print("Starting JavaScript execution...");

/************************************************************
 * CA CERT
 ************************************************************/
let certOk = http_set_ca_cert_from_sd("/timeapi.pem");
if (!certOk) {
  print("Could not load CA from /timeapi.pem. Using insecure fallback.");
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
 * INITIAL FETCH - TOKYO
 ************************************************************/
let jsonResponse1 = http_get(
  "https://timeapi.io/api/time/current/zone?timeZone=Asia/Tokyo"
);
if (jsonResponse1 === "") {
  print("HTTP GET failed for Tokyo. Abort.");
  return;
}

let dateVal1    = parse_json_value(jsonResponse1, "date");
let hour1       = toNumber(parse_json_value(jsonResponse1, "hour"));
let minute1     = toNumber(parse_json_value(jsonResponse1, "minute"));
let seconds1    = toNumber(parse_json_value(jsonResponse1, "seconds"));
let timeZoneId1 = parse_json_value(jsonResponse1, "timeZone");

/************************************************************
 * INITIAL FETCH - BUENOS AIRES
 ************************************************************/
let jsonResponse2 = http_get(
  "https://timeapi.io/api/time/current/zone?timeZone=America/Argentina/Buenos_Aires"
);

let dateVal2    = "N/A";
let hour2       = 0;
let minute2     = 0;
let seconds2    = 0;
let timeZoneId2 = "America/Argentina/Buenos_Aires";

if (jsonResponse2 !== "") {
  dateVal2    = parse_json_value(jsonResponse2, "date");
  hour2       = toNumber(parse_json_value(jsonResponse2, "hour"));
  minute2     = toNumber(parse_json_value(jsonResponse2, "minute"));
  seconds2    = toNumber(parse_json_value(jsonResponse2, "seconds"));
  timeZoneId2 = parse_json_value(jsonResponse2, "timeZone");
}

/************************************************************
 * CITY NAMES
 ************************************************************/
let cityPretty1 = "Tokyo";
let cityPretty2 = "Bs As";

/************************************************************
 * STYLES
 ************************************************************/
let timeStyleCenter = create_style();
style_set_text_font(timeStyleCenter, 48);
style_set_text_color(timeStyleCenter, 0xFFFFFF);
style_set_pad_all(timeStyleCenter, 5);
style_set_text_align(timeStyleCenter, 1);

let timeStyleLeft = create_style();
style_set_text_font(timeStyleLeft, 48);
style_set_text_color(timeStyleLeft, 0xFFFFFF);
style_set_pad_all(timeStyleLeft, 5);
style_set_text_align(timeStyleLeft, 0);

let cityStyleCenter = create_style();
style_set_text_font(cityStyleCenter, 34);
style_set_text_color(cityStyleCenter, 0xFFFFFF);
style_set_pad_all(cityStyleCenter, 5);
style_set_text_align(cityStyleCenter, 1);

let cityStyleLeft = create_style();
style_set_text_font(cityStyleLeft, 34);
style_set_text_color(cityStyleLeft, 0xFFFFFF);
style_set_pad_all(cityStyleLeft, 5);
style_set_text_align(cityStyleLeft, 0);

let dateStyleCenter = create_style();
style_set_text_font(dateStyleCenter, 34);
style_set_text_color(dateStyleCenter, 0xFFFFFF);
style_set_pad_all(dateStyleCenter, 5);
style_set_text_align(dateStyleCenter, 1);

let dateStyleLeft = create_style();
style_set_text_font(dateStyleLeft, 34);
style_set_text_color(dateStyleLeft, 0xFFFFFF);
style_set_pad_all(dateStyleLeft, 5);
style_set_text_align(dateStyleLeft, 0);

/************************************************************
 * LABELS
 ************************************************************/
let timeLabel1 = create_label(268, 40);
obj_add_style(timeLabel1, timeStyleCenter, 0);

let cityLabel1 = create_label(310, 100);
obj_add_style(cityLabel1, cityStyleCenter, 0);
label_set_text(cityLabel1, cityPretty1);

let dateLabel1 = create_label(268, 155);
obj_add_style(dateLabel1, dateStyleCenter, 0);
label_set_text(dateLabel1, dateVal1);

let timeLabel2 = create_label(10, 40);
obj_add_style(timeLabel2, timeStyleLeft, 0);

let cityLabel2 = create_label(50, 100);
obj_add_style(cityLabel2, cityStyleLeft, 0);
label_set_text(cityLabel2, cityPretty2);

let dateLabel2 = create_label(10, 155);
obj_add_style(dateLabel2, dateStyleLeft, 0);
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
    nextResyncMs = RESYNC_RETRY_MS;
    return;
  }

  let z1 = fetch_zone("Asia/Tokyo");
  let z2 = fetch_zone("America/Argentina/Buenos_Aires");

  if (z1) {
    hour1 = z1.hour;
    minute1 = z1.minute;
    seconds1 = z1.seconds;
    dateVal1 = z1.date;
  }

  if (z2) {
    hour2 = z2.hour;
    minute2 = z2.minute;
    seconds2 = z2.seconds;
    dateVal2 = z2.date;
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
