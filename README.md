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
│   ├── sd_reader/         # SD card file browser
│   ├── snake/             # Snake game with AI
│   ├── social/            # Social media dashboard
│   ├── steam/             # Steam profile display
│   ├── stocks/            # Stock ticker
│   ├── teleprompter/      # Scrolling text display
│   ├── timeapi/           # Internet clock with animation
│   ├── timer/             # Countdown timer & stopwatch
│   └── weather/           # Weather display
├── CLAUDE.md              # AI assistant documentation
├── LICENSE                # MIT License
└── README.md              # This file
```

## 🌟 Example Applications

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
| [**Monitor**](examples/monitor/) | Monitor system performance and resource usage |
| [**Music**](examples/music/) | Music player interface display |

### Utilities

| App | Description |
|-----|-------------|
| [**Blink**](examples/blink/) | Simple GIF animation display |
| [**SD Reader**](examples/sd_reader/) | SD card file browser with network status |

---

## 🛠️ WebScreen JavaScript API

### Core Functions
```javascript
// System
print(message)              // Console output
delay(milliseconds)         // Blocking delay
toNumber(string)            // Convert string to number
numberToString(number)      // Convert number to string
mem_stats()                 // Print memory stats, returns free heap bytes

// WiFi
wifi_status()               // Check connection status (returns 1 or 0)
wifi_get_ip()               // Get assigned IP address

// HTTP (supports custom ports)
http_get(url)               // GET request (http://host:port/path)
http_post(url, data)        // POST request with JSON data
http_delete(url)            // DELETE request
http_set_ca_cert_from_sd(path)  // Load SSL certificate

// JSON
parse_json_value(json, key)  // Extract value from JSON

// SD Card
sd_list_dir(path)           // List directory contents
show_gif_from_sd(filepath, x, y)  // Display animated GIF from SD card at position

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
| Button | ✅ | Clickable |
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
style_set_text_font(style, 24);         // Correct
style_set_text_font(style, "24");       // Wrong!

// Function expressions, NOT declarations
let myFunc = function() { };            // Correct
function myFunc() { }                   // Wrong!

// Timer callbacks use function name as string
let update = function() { /* ... */ };
create_timer("update", 1000);           // Pass name as string

// Use 1/0 for boolean values
let isRunning = 1;                      // true
let isPaused = 0;                       // false

// No object literals - use separate variables
let x = 10;                             // Correct
let y = 20;
let pos = { x: 10, y: 20 };            // Wrong!
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
