# TimeAPI App - Internet Clock

A WebScreen clock that fetches time from the internet and displays it with a cute animation.

## What it does
- Connects to WiFi and fetches current time from timeapi.io
- Displays time in 12-hour format with AM/PM
- Shows current date
- Updates every second with local timekeeping
- Displays a decorative cat GIF animation

## Files needed
- `timeapi_app.js` - Main application script
- `webscreen.json` - Configuration with WiFi credentials
- `timeapi.pem` - SSL certificate for HTTPS
- `cat.gif` - Decorative animation (place on SD card root)

## Setup
1. Edit `webscreen.json` and add your WiFi credentials
2. Copy all files to your SD card root
3. Insert SD card into WebScreen
4. Clock will sync on startup and run locally

## Features
- Automatic time synchronization on startup
- Tokyo timezone (configurable in code)
- Green date display (#72F749)
- White time display
- Continues running even if network disconnects

## Credits
Based on the clock example by [@nishad2m8](https://github.com/nishad2m8/WebScreen/tree/main/01-Clock)