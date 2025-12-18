# Dual Time – WebScreen App

**Dual Time** is a WebScreen application that displays **two time zones simultaneously** on screen, built using the **WebScreen JavaScript framework** and the **LVGL (Light and Versatile Graphics Library)**.

The app is designed to be **lightweight, stable, and highly readable**, prioritizing low memory usage and reliability on ESP32-based hardware.

---

## Key Features

- Simultaneous display of **two time zones**
- Automatic time synchronization using **timeapi.io**
- Rendering based on **LVGL labels** (no animated GIFs in the update loop)
- Support for **static city icons** next to city names
- **12-hour format** with AM/PM
- Layout optimized for the WebScreen resolution (~536 × 240 px)

---

## Default Time Zones

| Zone | Location | Screen Position |
|-----|----------|-----------------|
| Zone 1 | Asia / Tokyo | Right |
| Zone 2 | America / Argentina / Buenos Aires | Left |

> Time data is fetched from `https://timeapi.io` and can be easily changed in the source code.

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
