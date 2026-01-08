# Dual Time – WebScreen App

**Dual Time** is a WebScreen application that displays **two time zones simultaneously** on screen, built using the **WebScreen JavaScript framework** and the **LVGL (Light and Versatile Graphics Library)**.

The app is designed to be **lightweight, stable, and highly readable**, prioritizing low memory usage and reliability on ESP32-based hardware.

---

## Key Features

- Simultaneous display of **two time zones**
- **Configurable cities and timezones** via `webscreen.json`
- Automatic time synchronization using **timeapi.io**
- Periodic resync every 10 minutes to prevent drift
- Rendering based on **LVGL labels** (no animated GIFs in the update loop)
- Support for **static city icons** next to city names
- **12-hour format** with AM/PM
- Layout optimized for the WebScreen resolution (~536 × 240 px)

---

## Configuration

Customize the displayed cities by editing `webscreen.json`:

```json
{
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
  "script": "dualclock_app.js",
  "timezone1": "Asia/Tokyo",
  "city1": "Tokyo",
  "timezone2": "America/Argentina/Buenos_Aires",
  "city2": "Bs As"
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
  - Alignment:
    - Left zone → left-aligned
    - Right zone → centered
- **City**
  - Font size: 34
  - Displayed with a **40 × 62 px static icon**
- **Date**
  - Font size: 34
  - Shown below each city name

Key vertical positions (approx.):

- Time: `y = 40`
- City: `y = 100`
- Date: `y = 155`

---

## Required Files on SD Card

The following files must be present in the SD card root:
