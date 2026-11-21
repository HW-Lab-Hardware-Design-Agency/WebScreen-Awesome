[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) ![Issues](https://img.shields.io/github/issues/HW-Lab-Hardware-Design-Agency/WebScreen-Awesome) [![image](https://img.shields.io/badge/website-WebScreen.cc-D31027)](https://webscreen.cc) [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/HW-Lab-Hardware-Design-Agency/WebScreen-Awesome) [![image](https://img.shields.io/badge/view_on-CrowdSupply-099)](https://www.crowdsupply.com/hw-media-lab/webscreen)

# WebScreen Awesome

A collection of awesome apps, mods, and resources for WebScreen! Share your creative applications and discover what the community has built for the WebScreen IoT display device.

## 🚀 Quick Start

1. **Clone this repository**
   ```bash
   git clone https://github.com/HW-Lab-Hardware-Design-Agency/WebScreen-Awesome.git
   cd WebScreen-Awesome
   ```

2. **Create your app configuration** (`app.json`)
   ```json
   {
     "name": "My App",
     "description": "A cool WebScreen app",
     "version": "1.0.0",
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
     "display": {
       "brightness": 200
     },
     "script": "script.js"
   }
   ```

3. **Write your JavaScript app** (`script.js`)
   ```javascript
   "use strict";

   print("Hello WebScreen!");

   // Create and display a label
   let style = create_style();
   style_set_text_font(style, 32);
   style_set_text_color(style, 0xFFFFFF);

   let label = create_label(210, 100);
   obj_add_style(label, style, 0);
   label_set_text(label, "Hello World!");
   ```

4. **Copy files to SD card** and insert into WebScreen device

## 📂 Repository Structure

```
WebScreen-Awesome/
├── examples/               # Community WebScreen applications
│   ├── auctions/          # Auction bid tracker
│   ├── blink/             # Simple GIF animation display
│   ├── calculator/        # Basic calculator
│   ├── clock/             # Digital clock with themes
│   ├── dual_clock/        # Dual timezone display
│   ├── iot/               # IoT device monitor
│   ├── monitor/           # System performance monitor
│   ├── music/             # Music player interface
│   ├── notifications/     # Notification hub
│   ├── pomodoro/          # Pomodoro focus timer
│   ├── reminders/         # Personal reminder system
│   ├── rss/               # RSS feed reader
│   ├── mqtt_notifications/ # MQTT notification display
│   ├── ping/              # Network ping / connectivity tester
│   ├── sd_reader/         # SD card file browser
│   ├── snake/             # Snake game with AI
│   ├── social/            # Social media dashboard
│   ├── steam/             # Steam profile display
│   ├── stocks/            # Stock ticker
│   ├── teleprompter/      # Scrolling text display
│   ├── timeapi/           # Internet clock with animation
│   ├── timer/             # Countdown timer & stopwatch
│   └── weather/           # Weather display
├── LICENSE                # MIT License
└── README.md              # This file
```

## 🌟 Example Applications

### LVGL 9.5 Demos

**All five demos require firmware 4.0 (LVGL 9.5 compatible).** They run offline without extra assets. Find them in [WebScreen Admin](https://admin.webscreen.cc) by searching for `LVGL` or `firmware 4.0`. Click the BOOT button to cycle modes or pause. The power button powers the device off.

| App | What it demonstrates |
| --- | --- |
| [**LVGL Arc Text**](examples/lvgl95_arc_text/) | Two animated circular labels with different radii, fonts, and text directions. |
| [**LVGL Chart Gallery**](examples/lvgl95_charts/) | Curve, line, bar, and scatter charts with two live synthetic signals. |
| [**LVGL Gauge Dashboard**](examples/lvgl95_gauges/) | Three independent gauges with animated needles and colored progress arcs. Uses synthetic data. |
| [**LVGL Typography**](examples/lvgl95_typography/) | Font sizes, wrapped text, RGB color bars, and switchable dark and light themes. |
| [**LVGL Motion Lines**](examples/lvgl95_motion/) | Two independent animated line traces and a moving marker. |

### Productivity

| App | Description |
|-----|-------------|
| [**Pomodoro**](examples/pomodoro/) | Focus timer with work and break intervals for productivity |
| [**Timer**](examples/timer/) | Countdown timer and stopwatch for productivity |
| [**Reminders**](examples/reminders/) | Personal reminder system with notifications and alerts |
| [**Calculator**](examples/calculator/) | Simple calculator with basic math operations |
| [**Teleprompter**](examples/teleprompter/) | Scrolling text display for presentations and speeches |

### Time & Weather

| App | Description |
|-----|-------------|
| [**Clock**](examples/clock/) | Beautiful digital clock with customizable themes and timezone support |
| [**Dual Clock**](examples/dual_clock/) | Display two time zones simultaneously with automatic sync from timeapi.io |
| [**TimeAPI**](examples/timeapi/) | Internet clock that fetches time from an API with cute animation |
| [**Weather**](examples/weather/) | Display current weather conditions and forecast for your location |

### Information & News

| App | Description |
|-----|-------------|
| [**RSS Reader**](examples/rss/) | Display latest news and updates from RSS feeds |
| [**Stocks**](examples/stocks/) | Real-time stock prices and market information |
| [**Notifications**](examples/notifications/) | Centralized notification hub for displaying alerts and messages |

### Social & Gaming

| App | Description |
|-----|-------------|
| [**Steam**](examples/steam/) | Display Steam profile, friends online, and game activity |
| [**Social**](examples/social/) | Display your social media feeds and updates |
| [**Snake**](examples/snake/) | Classic snake game with AI auto-play demonstration |
| [**Auctions**](examples/auctions/) | Track auction bids and marketplace listings |

### IoT & System

| App | Description |
|-----|-------------|
| [**IoT Monitor**](examples/iot/) | Monitor and control IoT devices and sensors |
| [**MQTT Notifications**](examples/mqtt_notifications/) | Real-time MQTT notification display with local or public broker support |
| [**Monitor**](examples/monitor/) | Monitor system performance and resource usage |
| [**Music**](examples/music/) | Music player interface display |

### Networking & Utilities

| App | Description |
|-----|-------------|
| [**Network Ping**](examples/ping/) | HTTP ping with latency display, loss stats, and visual bar graph |
| [**Blink**](examples/blink/) | Simple GIF animation display |
| [**SD Reader**](examples/sd_reader/) | SD card file browser with network status |

---

## 🛠️ WebScreen JavaScript API

### Core Functions
```javascript
// System
print(message)              // Console output
delay(milliseconds)         // Blocking delay
get_millis()                // Milliseconds since boot (for timing)
toNumber(string)            // Convert string to number
numberToString(number)      // Convert number to string
mem_stats()                 // Print memory stats, returns free heap bytes

// Strings
str_length(string)          // Get string length
str_substring(string, start, length)  // Extract substring
str_index_of(haystack, needle)        // Find position of substring (-1 if not found)

// Display
set_brightness(value)       // Set display brightness (0-255)
get_brightness()            // Get current display brightness

// WiFi
wifi_status()               // Check connection status (returns 1 or 0)
wifi_get_ip()               // Get assigned IP address

// HTTP (supports custom ports)
http_get(url)               // GET request (http://host:port/path)
http_post(url, data)        // POST request with JSON data
http_delete(url)            // DELETE request
http_set_ca_cert_from_sd(path)  // Load SSL certificate
http_set_header(key, value) // Set custom HTTP header
http_clear_headers()        // Clear all custom headers

// JSON
parse_json_value(json, key)  // Extract value from JSON

// SD Card
sd_read_file(path)          // Read file contents as string
sd_write_file(path, data)   // Write string to file
sd_list_dir(path)           // List directory contents
sd_delete_file(path)        // Delete a file
show_gif_from_sd(filepath, x, y)  // Display animated GIF from SD card at position

// Time (requires NTP sync)
get_hours()                 // Current hour (0-23)
get_minutes()               // Current minute (0-59)
get_seconds()               // Current second (0-59)
get_year()                  // Current year
get_month()                 // Current month (1-12)
get_day()                   // Current day (1-31)
get_weekday()               // Day of week (0=Sun, 6=Sat)
get_epoch()                 // Unix epoch (seconds)
ntp_synced()                // Check if NTP time is available (returns true/false)

// MQTT (requires mqtt.enabled = true in config)
mqtt_init(broker, port)     // Initialize MQTT client
mqtt_connect(client_id)     // Connect to broker (returns 1/0)
mqtt_subscribe(topic)       // Subscribe to topic
mqtt_publish(topic, message) // Publish message to topic
mqtt_loop()                 // Process MQTT packets (call in timer)
mqtt_on_message(func_name)  // Legacy API; poll the message queue instead
mqtt_has_message()          // Check if a message is queued (returns 1/0)
mqtt_get_payload()          // Get queued message payload
mqtt_msg_clear()            // Clear queued message

// UI - Labels
create_label(x, y)          // Create text label at position
label_set_text(label, text) // Update label text
obj_add_style(obj, style, selector)  // Apply style
move_obj(obj, x, y)         // Move object to position

// UI - Drawing
draw_rect(x, y, w, h)       // Draw rectangle, returns handle
draw_rect(x, y, w, h, color) // Draw colored rectangle (0xRRGGBB)

// UI - Styling
create_style()              // Create new style object
style_set_text_font(style, size)  // Set font size (number)
style_set_text_color(style, color)  // Set text color (0xRRGGBB)
style_set_text_align(style, align)  // Set alignment (0=left, 1=center, 2=right)
style_set_bg_color(style, color)  // Set background color
style_set_bg_opa(style, opacity)  // Set background opacity (0-255)
style_set_pad_all(style, pixels)  // Set padding
style_set_radius(style, pixels)  // Set corner radius
style_set_width(style, pixels)  // Set width
style_set_height(style, pixels)  // Set height

// Timers
create_timer(function_name, interval_ms)  // Create periodic timer
```

### Available Font Sizes

Only these Montserrat font sizes are enabled:

| Size | Usage |
|------|-------|
| `14` | Default, small text |
| `20` | Body text |
| `28` | Subheadings |
| `34` | Medium headings |
| `40` | Large headings |
| `44` | Extra large |
| `48` | Display text |

```javascript
style_set_text_font(style, 48);  // Largest available
style_set_text_font(style, 14);  // Smallest available
```

**Note:** Sizes like 16, 24, 32 are NOT available.

### Enabled LVGL Widgets

| Widget | Available | Notes |
|--------|-----------|-------|
| Label | ✅ | Text display |
| Image | ✅ | PNG, GIF, SJPG |
| Arc | ✅ | Circular gauges |
| Line | ✅ | Line drawing |
| Button | LVGL only | No JavaScript touch-event binding |
| Chart | ✅ | Data visualization |
| Meter | ✅ | Speedometer/gauge |
| Span | ✅ | Rich text |

### Supported Image Formats

- **PNG**: ✅ Recommended for icons
- **GIF**: ✅ Animated (keep under 50KB)
- **SJPG**: ✅ Split JPG for large images
- **BMP**: ❌ Not supported

### Important Syntax Notes

```javascript
// Use "use strict" at the top
"use strict";

// Colors are hex integers, NOT strings
style_set_text_color(style, 0xFF0000);  // Correct
style_set_text_color(style, "#FF0000"); // Wrong!

// Fonts are numbers, NOT strings
style_set_text_font(style, 28);         // Correct
style_set_text_font(style, "28");       // Wrong!

// Function expressions, NOT declarations
let myFunc = function() { };            // Correct
function myFunc() { }                   // Wrong!

// Timer callbacks use function name as string
let update = function() { /* ... */ };
create_timer("update", 1000);           // Pass name as string

// Numeric flags work; native APIs may return true/false, so test truthiness
let isRunning = 1;                      // true
let isPaused = 0;                       // false

// Fixed-property objects are supported; arrays and computed access are not
let pos = { x: 10, y: 20 };
let x = pos.x;                         // Correct
// pos["x"] is not supported
```

## 📝 Configuration Reference

### app.json Format
```json
{
  "name": "App Name",
  "description": "What the app does",
  "version": "1.0.0",
  "author": "Your Name",
  "settings": {
    "wifi": {
      "ssid": "network_name",
      "pass": "password"
    },
    "mqtt": {
      "enabled": false
    }
  },
  "screen": {
    "background": "#000000",
    "foreground": "#FFFFFF"
  },
  "display": {
    "brightness": 200
  },
  "script": "script.js"
}
```

## 🛠️ Development Tools

### WebScreen Serial IDE
Use our web-based IDE for rapid development without SD card swapping:
- **Access**: [serial.webscreen.cc](https://serial.webscreen.cc)
- **Features**:
  - Live serial console with command history
  - JavaScript editor with syntax highlighting and WebScreen API autocomplete
  - File manager for uploading/downloading files
  - Direct code execution on device (F5 or Run button)
  - Dual theme support (Retro amber phosphor or VS Code-like Focus theme)
- **Browser Support**: Chrome, Edge, or Opera (requires Web Serial API)

## 🔧 Development Tips

1. **Always use strict mode**
   ```javascript
   "use strict";
   ```

2. **Use timers instead of while loops for updates**
   ```javascript
   let tick = function() {
     // Update logic here
   };
   create_timer("tick", 1000);
   ```

3. **File paths use forward slashes**
   ```javascript
   show_gif_from_sd("/animation.gif", 0, 0);
   ```

4. **Wait for WiFi before network operations**
   ```javascript
   // In init timer
   if (wifi_status()) {
     // Safe to make HTTP requests
   }
   ```

5. **HTTP with custom ports**
   ```javascript
   // Standard ports (80 for HTTP, 443 for HTTPS)
   http_get("http://api.example.com/data");
   http_get("https://api.example.com/data");

   // Custom ports
   http_get("http://192.168.1.20:2000/api");
   http_post("http://localhost:3000/api", '{"key":"value"}');
   ```

6. **Elk JS engine limitations** — WebScreen uses the Elk embedded JS engine, which is minimal:
   - **No `while` loops** — use `for` loops instead
   - **No arrays or computed property access** — use fixed-property objects or individual variables
   - **No `function` declarations** — use `let fn = function() {};`
   - **Use explicit returns** — use `return 0;` for an early exit. Inside loops, save the result, `break`, then return after the loop
   - **Check types before comparisons** — use `typeof value === "string"` before comparing a possibly missing value with `""`
   - **String functions**: `str_length()`, `str_substring()`, `str_index_of()` are C functions, not methods on strings

7. **Measure time with `get_millis()`**
   ```javascript
   let t1 = get_millis();
   let resp = http_get("http://example.com");
   let elapsed = get_millis() - t1;
   print("Request took " + numberToString(elapsed) + " ms");
   ```

## 📚 Resources

- **WebScreen Software**: [GitHub Repository](https://github.com/HW-Lab-Hardware-Design-Agency/WebScreen-Software)
- **Documentation**: [WebScreen.cc](https://webscreen.cc)
- **Hardware**: [CrowdSupply](https://www.crowdsupply.com/hw-media-lab/webscreen)
- **Web Flasher**: [flash.webscreen.cc](https://flash.webscreen.cc)

## 🤝 Contributing

**Share your awesome WebScreen apps with the community!**

We welcome contributions of:
- 🎮 **Your Apps**: Share your creative WebScreen applications
- 🛠️ **Mods & Hacks**: Hardware modifications, custom cases, integrations
- 📚 **Tutorials**: How-to guides and learning resources
- 🎨 **Themes & Assets**: Custom graphics, animations, and UI themes
- 🔧 **Tools & Utilities**: Development tools and helper scripts
- 📖 **Documentation**: API improvements and examples

### How to Contribute Your App
1. Fork this repository
2. Create a folder in `examples/` with your app name
3. Include the standard files:
   - `app.json` - App configuration
   - `script.js` - Main application code
   - `README.md` - Description, screenshots, setup instructions
4. Submit a pull request with your awesome creation!

### Submission Guidelines
- Include all necessary files (`script.js`, `app.json`, assets)
- Add clear documentation and comments
- Test your app on actual WebScreen hardware
- Include attribution/credits where appropriate

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- **Discord Community**: [Join our Discord](https://discord.gg/ZzmX4huq) - Get help with your apps and connect with other developers
- **Issues**: [GitHub Issues](https://github.com/HW-Lab-Hardware-Design-Agency/WebScreen-Awesome/issues)
- **Discussions**: [GitHub Discussions](https://github.com/HW-Lab-Hardware-Design-Agency/WebScreen-Awesome/discussions)
- **Website**: [WebScreen.cc](https://webscreen.cc)

## Elk Compatibility and Testing

See [Elk app development](docs/ELK_APPS.md) for the supported syntax, installation steps, and tests using the real engine. Each app README states which data is live and which examples are UI demos.
