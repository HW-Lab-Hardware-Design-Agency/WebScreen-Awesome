# SD Reader - File Browser

A WebScreen app that lists files on the SD card and shows network status.

## What it does
- Connects to WiFi and displays IP address
- Lists all files in the SD card root directory
- Shows file listing in serial console
- Demonstrates SD card API usage

## Files needed
- `sd_reader.js` - Main application script
- `webscreen.json` - Configuration with WiFi credentials

## Setup
1. Edit `webscreen.json` and add your WiFi credentials
2. Copy files to your SD card
3. Add any other files you want to see listed
4. Insert SD card into WebScreen
5. Check serial console for file listing

## Use Cases
- Debug SD card issues
- Verify files are properly copied
- Test SD card reading functionality
- Network connectivity testing

## Output
The app outputs to serial console:
- WiFi connection status
- Assigned IP address
- Complete file listing from SD card root