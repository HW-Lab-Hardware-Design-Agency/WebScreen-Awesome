[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) ![Issues](https://img.shields.io/github/issues/HW-Lab-Hardware-Design-Agency/WebScreen-Awesome) [![image](https://img.shields.io/badge/website-WebScreen.cc-D31027)](https://webscreen.cc) [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/HW-Lab-Hardware-Design-Agency/WebScreen-Awesome) [![image](https://img.shields.io/badge/view_on-CrowdSupply-099)](https://www.crowdsupply.com/hw-media-lab/webscreen)

# WebScreen Awesome

A collection of awesome apps, mods, and resources for WebScreen! Share your creative applications and discover what the community has built for the WebScreen IoT display device.

## 🚀 Quick Start

1. **Clone this repository**
   ```bash
   git clone https://github.com/HW-Lab-Hardware-Design-Agency/WebScreen-Awesome.git
   cd WebScreen-Awesome
   ```

2. **Create your app configuration** (`webscreen.json`)
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
     "script": "app.js"
   }
   ```

3. **Write your JavaScript app** (`app.js`)
   ```javascript
   "use strict";

   print("Hello WebScreen!");

   // Wait for WiFi connection
   while (!wifi_status()) {
     delay(500);
     print("Connecting to WiFi...");
   }
   print("Connected! IP: " + wifi_get_ip());

   // Create and display a label
   let label = create_label(210, 100);
   label_set_text(label, "Hello World!");
   ```

4. **Copy files to SD card** and insert into WebScreen device

## 📂 Repository Structure

```
WebScreen-Awesome/
├── examples/               # Community WebScreen applications
│   ├── blink/             # Simple GIF animation display
│   ├── timeapi_app/       # Time display with API integration
│   ├── sd_reader/         # SD card file listing
│   └── [your-app-here]/   # Submit your awesome app!
├── CLAUDE.md              # AI assistant documentation
├── LICENSE                # MIT License
└── README.md              # This file
```

## 🌟 Why "WebScreen Awesome"?

This repository is inspired by the "awesome" lists tradition on GitHub - a place where the community comes together to share the best resources, tools, and creations. We want this to be THE place to discover cool WebScreen apps, learn from others' code, and showcase your own creative projects!

## 💡 Example Applications

### 1. Blink - GIF Animation Display
Simple app that displays an animated GIF from the SD card.

**Files:**
- `examples/blink/blink.js` - Main application
- `examples/blink/webscreen.json` - Configuration
- `examples/blink/blink.gif` - Animation asset

### 2. TimeAPI App - Internet Clock
Fetches current time from an API and displays it with a clock widget.

**Features:**
- HTTPS API calls with certificate validation
- JSON parsing
- Dynamic UI updates with timer
- Custom styling for labels

**Files:**
- `examples/timeapi_app/timeapi_app.js` - Main application
- `examples/timeapi_app/webscreen.json` - Configuration
- `examples/timeapi_app/timeapi.pem` - SSL certificate
- `examples/timeapi_app/cat.gif` - Decorative animation

**Credits:** Based on the clock example by [@nishad2m8](https://github.com/nishad2m8/WebScreen/tree/main/01-Clock)

### 3. SD Reader - File Browser
Lists files on the SD card and displays WiFi connection status.

**Files:**
- `examples/sd_reader/sd_reader.js` - Main application
- `examples/sd_reader/webscreen.json` - Configuration

## 🛠️ WebScreen JavaScript API

### Core Functions
```javascript
// System
print(message)              // Console output
delay(milliseconds)          // Blocking delay
toNumber(string)            // Convert string to number
numberToString(number)      // Convert number to string

// WiFi
wifi_status()               // Check connection status
wifi_get_ip()              // Get assigned IP address

// HTTP
http_get(url)              // GET request
http_set_ca_cert_from_sd(path)  // Load SSL certificate

// JSON
parse_json_value(json, key)  // Extract value from JSON

// SD Card
sd_list_dir(path)          // List directory contents
show_gif_from_sd(path, x, y)  // Display GIF at position

// UI - Labels
create_label(x, y)         // Create text label
label_set_text(label, text)  // Update label text
obj_add_style(obj, style, selector)  // Apply style

// UI - Styling
create_style()             // Create new style object
style_set_text_font(style, size)  // Set font size
style_set_text_color(style, color)  // Set text color (0xRRGGBB)
style_set_pad_all(style, pixels)  // Set padding
style_set_text_align(style, align)  // Set alignment

// Timers
create_timer(function_name, interval_ms)  // Create periodic timer
```

## 📝 Configuration Reference

### webscreen.json Format
```json
{
  "settings": {
    "wifi": {
      "ssid": "network_name",    // WiFi network name
      "pass": "password"          // WiFi password
    },
    "mqtt": {
      "enabled": false            // Enable/disable MQTT
    }
  },
  "screen": {
    "background": "#000000",      // Background color (hex)
    "foreground": "#FFFFFF"       // Text color (hex)
  },
  "script": "app.js"              // JavaScript file to run
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

2. **Wait for WiFi before network operations**
   ```javascript
   while (!wifi_status()) {
     delay(500);
   }
   ```

3. **File paths use forward slashes**
   ```javascript
   show_gif_from_sd("/animation.gif");
   ```

4. **Timer callbacks use function name as string**
   ```javascript
   let update = function() { /* ... */ };
   create_timer("update", 1000);
   ```

5. **Colors use 0xRRGGBB format in styles**
   ```javascript
   style_set_text_color(style, 0xFF0000); // Red
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
2. Add your app to the `examples/` directory with its own folder
3. Include a README with description, screenshots/GIFs, and setup instructions
4. Submit a pull request with your awesome creation!

### Submission Guidelines
- Include all necessary files (`*.js`, `webscreen.json`, assets)
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