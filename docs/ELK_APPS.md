# Developing Elk Apps

## Install and Run

Each example is self-contained. Copy its script and listed assets to the SD card. Merge app settings into `/webscreen.json`, preserving your Wi-Fi credentials, and set `script` to the uploaded filename. `app.json` is catalog metadata; scripts do not read it directly. Use `/load script.js` to reload through the serial console. The cat clock has an alternate script documented in its app README.

For Admin text uploads, keep each source line at most 254 UTF-8 bytes (256 including CRLF). Admin sends a whole line at once, and the default ESP32 USB receive queue can drop excess bytes while the firmware is busy. Split long strings into several short assignments. Re-upload existing SD scripts after updating an app.

## JavaScript Subset

WebScreen embeds [Elk](https://github.com/cesanta/elk), not a browser or Node.js. Use `let`, semicolons, fixed-property objects, and named function variables: `let tick = function() { ... };`. Arrays, computed property access, closures, `while`, `const`, `var`, arrow functions, and standard-library objects are unavailable.

The tested Elk checkouts also have control-flow quirks:

- Use `return 0;` instead of a bare `return;`.
- Inside a loop, save the result and `break`; return after the loop.
- Numeric equality in these checkouts truncates fractional values. Use truthiness to test zero and inequalities for decimal comparisons.
- Mixed-type equality can raise an error. Check `typeof value === "string"` before comparing a nullable SD/split result with a string.

Use firmware helpers such as `str_split`, `str_substring`, `format_number`, `pad_number`, and `get_millis`. `parse_json_value` reads a single top-level key and returns a string; dotted paths do not traverse objects or arrays. Missing keys produce an empty string. `sd_read_file` and out-of-range `str_split` can return null.

## Scheduling and Display

Return promptly from startup and callbacks. Register timers by name with `create_timer("tick", 1000)`; never wait in a loop for Wi-Fi or NTP. Compute countdowns from elapsed milliseconds and account for the 32-bit clock wrapping. Network calls are synchronous; schedule retries before calling them.

Allocate objects/styles once and update them. The current firmware exposes 32 style slots and 256 object handles. Labels accept at most 255 bytes. Enabled fonts are 14, 20, 28, 34, 40, 44, and 48. The display is 536 × 240. LVGL text alignment values are 0=auto, 1=left, 2=center, 3=right; set label widths for alignment to be visible.

`on_button("handler")` delivers each click of the BOOT button. The same press can be sent from a computer with **Press Button** in WebScreen Admin or the Serial IDE, or with the `/button` serial command. The power button cannot be used by apps: a press powers the device off until RST or a power cycle. Screen labels are not touch buttons. MQTT applications must enable `settings.mqtt.enabled` and poll `mqtt_has_message` / `mqtt_get_payload` / `mqtt_msg_clear`; `mqtt_on_message` is not a JS event dispatcher.

## Tests

With Python 3, a C compiler, and sibling checkouts:

```sh
python3 tests/run_apps.py
python3 tests/run_apps.py --elk ../elk
python3 tests/run_apps.py --app snake --steps 1000
```

Use `--firmware /path/to/WebScreen-Software` when the firmware is elsewhere. Tests compile the actual selected Elk C engine, discover the firmware's registered API names, and supply deterministic hardware/network doubles. They execute every script, repeated callbacks, button actions, offline/missing/error responses, and app-specific behavioral assertions. They also enforce source-line upload budgets and style/object/label limits. No network request or board upload occurs.

The `lvgl95_*` demos require the firmware 4.0 / LVGL 9.5 bindings. Point `--firmware` at a compatible firmware checkout when testing the full collection. Demo checks cycle every mode twice, verify pause/resume, check widget ownership and stable allocation counts, and run garbage collection. Their `app.json` manifests record `min_firmware` and `lvgl_version`; use the same fields in Admin's catalog for visible compatibility labels.

These tests cannot verify physical buttons, SD faults, GIF decoding, TLS/MQTT timing, or the deployed firmware. Also load affected apps on hardware and inspect `/errors` and `/stats`, including recovery after disconnecting Wi-Fi.
