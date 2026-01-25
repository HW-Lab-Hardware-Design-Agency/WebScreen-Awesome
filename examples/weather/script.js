"use strict";

print("Starting Weather...");

for (;;) {
  if (wifi_status()) break;
  delay(500);
  print("Waiting for Wi-Fi...");
}
print("Connected! IP: " + wifi_get_ip());

let config = sd_read_file("/webscreen.json");
let location = "London";
if (config !== "") {
  let loc = parse_json_value(config, "location");
  if (loc !== "") location = loc;
}

let titleStyle = create_style();
style_set_text_font(titleStyle, 24);
style_set_text_color(titleStyle, 0xFFFFFF);
style_set_text_align(titleStyle, 1);

let tempStyle = create_style();
style_set_text_font(tempStyle, 48);
style_set_text_color(tempStyle, 0x00BFFF);
style_set_text_align(tempStyle, 1);

let descStyle = create_style();
style_set_text_font(descStyle, 20);
style_set_text_color(descStyle, 0xFFD700);
style_set_text_align(descStyle, 1);

let locLabel = create_label(268, 30);
obj_add_style(locLabel, titleStyle, 0);
label_set_text(locLabel, location);

let tempLabel = create_label(268, 80);
obj_add_style(tempLabel, tempStyle, 0);
label_set_text(tempLabel, "--C");

let descLabel = create_label(268, 150);
obj_add_style(descLabel, descStyle, 0);
label_set_text(descLabel, "Loading...");

let fetch_weather = function() {
  print("Fetching weather...");
  let url = "http://wttr.in/" + location + "?format=j1";
  let res = http_get(url);
  if (res === "") {
    label_set_text(descLabel, "Error");
    return;
  }
  let temp = parse_json_value(res, "current_condition.0.temp_C");
  let desc = parse_json_value(res, "current_condition.0.weatherDesc.0.value");
  if (temp !== "") label_set_text(tempLabel, temp + "C");
  if (desc !== "") label_set_text(descLabel, desc);
};

fetch_weather();
print("Weather ready!");
create_timer("fetch_weather", 600000);
