"use strict";

print("Starting Weather Display...");

for (;;) {
  if (wifi_status()) break;
  delay(500);
  print("Waiting for Wi-Fi...");
}
print("Connected! IP: " + wifi_get_ip());

let config = sd_read_file("/webscreen.json");
let location = "London";
let configLoc = parse_json_value(config, "location");
if (configLoc !== "") {
  location = configLoc;
}

let temperature = "--";
let condition = "Loading...";
let humidity = "--";
let wind = "--";

let titleStyle = create_style();
style_set_text_font(titleStyle, 28);
style_set_text_color(titleStyle, 0xFFFFFF);
style_set_text_align(titleStyle, 1);

let tempStyle = create_style();
style_set_text_font(tempStyle, 48);
style_set_text_color(tempStyle, 0x00BFFF);
style_set_text_align(tempStyle, 1);

let conditionStyle = create_style();
style_set_text_font(conditionStyle, 28);
style_set_text_color(conditionStyle, 0xFFD700);
style_set_text_align(conditionStyle, 1);

let detailStyle = create_style();
style_set_text_font(detailStyle, 20);
style_set_text_color(detailStyle, 0xAAAAAA);
style_set_text_align(detailStyle, 0);

let lastUpdateStyle = create_style();
style_set_text_font(lastUpdateStyle, 14);
style_set_text_color(lastUpdateStyle, 0x666666);
style_set_text_align(lastUpdateStyle, 1);

let locationLabel = create_label(268, 15);
obj_add_style(locationLabel, titleStyle, 0);
label_set_text(locationLabel, location);

let tempLabel = create_label(268, 70);
obj_add_style(tempLabel, tempStyle, 0);
label_set_text(tempLabel, "--C");

let conditionLabel = create_label(268, 150);
obj_add_style(conditionLabel, conditionStyle, 0);
label_set_text(conditionLabel, "Loading...");

let humidityLabel = create_label(80, 190);
obj_add_style(humidityLabel, detailStyle, 0);
label_set_text(humidityLabel, "Humidity: --%");

let windLabel = create_label(300, 190);
obj_add_style(windLabel, detailStyle, 0);
label_set_text(windLabel, "Wind: -- km/h");

let updateLabel = create_label(268, 220);
obj_add_style(updateLabel, lastUpdateStyle, 0);
label_set_text(updateLabel, "Updating...");

let fetch_weather = function() {
  print("Fetching weather for " + location + "...");

  let url = "http://wttr.in/" + location + "?format=j1";
  let response = http_get(url);

  if (response === "") {
    print("Weather fetch failed");
    label_set_text(conditionLabel, "Connection Error");
    return;
  }

  let temp = parse_json_value(response, "current_condition.0.temp_C");
  let desc = parse_json_value(response, "current_condition.0.weatherDesc.0.value");
  let hum = parse_json_value(response, "current_condition.0.humidity");
  let windSpeed = parse_json_value(response, "current_condition.0.windspeedKmph");

  if (temp !== "") {
    temperature = temp;
    label_set_text(tempLabel, temp + "C");
  }

  if (desc !== "") {
    condition = desc;
    label_set_text(conditionLabel, desc);
  }

  if (hum !== "") {
    humidity = hum;
    label_set_text(humidityLabel, "Humidity: " + hum + "%");
  }

  if (windSpeed !== "") {
    wind = windSpeed;
    label_set_text(windLabel, "Wind: " + windSpeed + " km/h");
  }

  label_set_text(updateLabel, "Updated just now");
  print("Weather updated: " + temp + "C, " + desc);
};

let updateMinutes = 0;
let updateStr = "";

let update_time_display = function() {
  updateMinutes++;
  if (updateMinutes === 1) {
    label_set_text(updateLabel, "Updated 1 min ago");
  } else {
    updateStr = "Updated " + numberToString(updateMinutes) + " mins ago";
    label_set_text(updateLabel, updateStr);
  }
};

let refresh_weather = function() {
  updateMinutes = 0;
  fetch_weather();
};

fetch_weather();

create_timer("update_time_display", 60000);

create_timer("refresh_weather", 600000);

print("Weather Display ready!");
