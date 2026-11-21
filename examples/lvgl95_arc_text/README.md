# LVGL Arc Text

**Requires WebScreen firmware 4.0 (LVGL 9.5 compatible).**

Two animated circular labels with different radii, fonts, and text directions. Designed for the 536 × 240 display; no Wi-Fi, external assets, or custom configuration needed.

![LVGL Arc Text running on WebScreen](preview.png)

## Install

In [WebScreen Admin](https://admin.webscreen.cc), open **Apps**, search for **LVGL Arc Text**, and install it. Admin saves `lvgl95_arc_text.js` and makes it the startup app.

To try it without changing your startup app, upload `script.js` as `lvgl95_arc_text.js` with the Serial IDE, then run:

```text
/load lvgl95_arc_text.js
```

Wait for `DEMO READY:` before sending another command. Keep your existing `webscreen.json`; `app.json` is the app manifest and is not a replacement for your device settings.

## Controls and checks

- **BOOT click:** Clockwise → counterclockwise → paused.
- **Power button:** powers the device off.
- **Press Button** in WebScreen Admin, or `/button` in the serial console, also advances the mode.

Check that both text rings stay readable and reverse independently. Use `/errors` and `/stats` to inspect runtime health; `/screenshot` captures the display. The animation uses one timer and reuses its objects and styles.
