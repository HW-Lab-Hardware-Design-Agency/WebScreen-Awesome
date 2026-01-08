# Dual Clock – WebScreen App

**Dual Clock** is a WebScreen application that displays **two time zones simultaneously** on screen, built using the **WebScreen JavaScript framework** and the **LVGL (Light and Versatile Graphics Library)**.

The app is designed to be **lightweight, stable, and highly readable**, prioritizing low memory usage and reliability on ESP32-based hardware.

---

## Key Features

- Simultaneous display of **two time zones**
- **Configurable cities and timezones** via `app.json`
- Automatic time synchronization using **timeapi.io**
- Periodic resync every 10 minutes to prevent drift
- Rendering based on **LVGL labels**
- **12-hour format** with AM/PM
- Layout optimized for the WebScreen resolution

---

## Configuration

Customize the displayed cities by editing `app.json`:

```json
{
  "name": "Dual Clock",
  "description": "Display two time zones simultaneously",
  "version": "1.0.0",
  "author": "WebScreen",
  "settings": {
    "wifi": {
      "ssid": "your_network",
      "pass": "your_password"
    },
    "mqtt": {
      "enabled": false
    }
  },
  "screen": {
    "background": "#000000",
    "foreground": "#FFFFFF"
  },
  "script": "script.js",
  "timezone1": "Asia/Tokyo",
  "city1": "Tokyo",
  "timezone2": "America/Argentina/Buenos_Aires",
  "city2": "Buenos Aires"
}
```

### Configuration Options

| Field | Description | Example |
|-------|-------------|---------|
| `timezone1` | IANA timezone for right side | `"Europe/London"` |
| `city1` | Display name for right side | `"London"` |
| `timezone2` | IANA timezone for left side | `"America/New_York"` |
| `city2` | Display name for left side | `"NYC"` |

> Find valid timezone names at [timeapi.io](https://timeapi.io/api/timezone/availabletimezones)

### Default Time Zones

If no configuration is provided, the app defaults to:

| Zone | Location | Screen Position |
|-----|----------|-----------------|
| Zone 1 | Asia / Tokyo | Right |
| Zone 2 | America / Argentina / Buenos Aires | Left |

---

## Screen Layout

- **Time**
  - Font size: 48
  - Color: white
  - 12-hour format with AM/PM
- **City**
  - Font size: 24
  - Color: cyan
- **Date**
  - Font size: 16
  - Shown below each time

---

## Required Files on SD Card

The following files must be present in the SD card root:

| File | Description |
|------|-------------|
| `app.json` | App configuration with timezone settings |
| `script.js` | Main application script |
| `dualclock.pem` | (Optional) CA certificate for HTTPS |

---

## How It Works

1. App starts and waits for WiFi connection
2. Fetches current time for both timezones from timeapi.io
3. Displays both times side by side
4. Updates every second using local increment
5. Re-syncs with timeapi.io every 10 minutes to prevent drift
