# LVGL Gauge Dashboard

**Requires WebScreen firmware 4.0 (LVGL 9.5 compatible).**

Three independent gauges with animated needles and colored progress arcs. Uses synthetic data. Designed for the 536 × 240 display; no Wi-Fi, external assets, or custom configuration needed.

![LVGL Gauge Dashboard running on WebScreen](preview.png)

## Install

In [WebScreen Admin](https://admin.webscreen.cc), open **Apps**, search for **LVGL Gauge Dashboard**, and install it. Admin saves `lvgl95_gauges.js` and makes it the startup app.

To try it without changing your startup app, upload `script.js` as `lvgl95_gauges.js` with the Serial IDE, then run:

```text
/load lvgl95_gauges.js
```

Wait for `DEMO READY:` before sending another command. Keep your existing `webscreen.json`; `app.json` is the app manifest and is not a replacement for your device settings.

## Controls and checks

- **BOOT click:** Pause / resume.
- **Power button:** powers the device off.
- **Press Button** in WebScreen Admin, or `/button` in the serial console, also advances the mode.

Check the ramp, inverse, and smooth readings against their independent needles and arcs. Use `/errors` and `/stats` to inspect runtime health; `/screenshot` captures the display. The animation uses one timer and reuses its objects and styles.
