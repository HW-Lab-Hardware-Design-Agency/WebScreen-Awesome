// script.js

// Enable strict mode
"use strict";

// Print a message
print("Hello from Elk JavaScript!");

// Wait until connected
for (; ;) {
  if (wifi_status()) break;
  delay(500);
  print("Waiting for Wi-Fi...");
}
print("Connected! IP: " + wifi_get_ip());

print("Before listing directory");

// List files in the root directory
fileList = sd_list_dir("/");
print("After sd_list_dir call");

print("fileList is:");
print(fileList);

if (fileList) {
  print("Directory contents:");
  print(fileList);
} else {
  print("Failed to list directory");
}

print("After listing directory");

// Optionally, proceed with other operations.
print("Script execution completed");
