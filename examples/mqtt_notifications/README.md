# MQTT Notifications

Display real-time notifications on your WebScreen from any MQTT-enabled device or service.

## Setup

1. Copy `script.js` to the SD card.
2. Configure WiFi and MQTT broker in `webscreen.json` (see broker options below).
3. Reboot the device.

## Broker Configuration

The app reads these top-level keys from `webscreen.json`:

| Key | Default | Description |
|---|---|---|
| `mqtt_broker` | `broker.hivemq.com` | MQTT broker hostname or IP |
| `mqtt_port` | `1883` | MQTT broker port |
| `mqtt_topic` | `webscreen/notifications` | Topic to subscribe to |
| `mqtt_client_id` | `webscreen01` | Client ID for the connection |

### Option 1: Local Broker (recommended)

Run Mosquitto on your local machine for the most reliable setup.

**Install Mosquitto:**
```bash
# Fedora
sudo dnf install mosquitto

# Ubuntu/Debian
sudo apt install mosquitto mosquitto-clients

# macOS
brew install mosquitto
```

**Configure to accept LAN connections:**
```bash
sudo mkdir -p /etc/mosquitto/conf.d
echo -e "listener 1883 0.0.0.0\nallow_anonymous true" | sudo tee /etc/mosquitto/conf.d/local.conf
echo "include_dir /etc/mosquitto/conf.d" | sudo tee -a /etc/mosquitto/mosquitto.conf
sudo systemctl restart mosquitto
```

> **Note:** If your router has **AP isolation** enabled (blocks WiFi devices from communicating with each other), you'll need to disable it in your router settings. Also ensure port 1883 is allowed through your firewall (`sudo firewall-cmd --add-port=1883/tcp` on Fedora).

**webscreen.json:**
```json
{
  "settings": {
    "wifi": { "ssid": "MyNetwork", "pass": "MyPassword" },
    "mqtt": { "enabled": true }
  },
  "mqtt_broker": "192.168.1.100",
  "mqtt_port": 1883,
  "mqtt_topic": "webscreen/notifications",
  "mqtt_client_id": "webscreen01",
  "screen": { "background": "#0d1117", "foreground": "#FFFFFF" },
  "script": "script.js"
}
```

Replace `192.168.1.100` with your machine's local IP (`hostname -I` on Linux, `ipconfig` on Windows).

**Send a notification:**
```bash
mosquitto_pub -h localhost -t "webscreen/notifications" \
  -m '{"title":"Hello","message":"Local broker works!","source":"Test"}'
```

### Option 2: HiveMQ Public Broker (no setup)

Free public broker, no account needed. Can be unreliable and some networks block port 1883.

**webscreen.json:**
```json
{
  "settings": {
    "wifi": { "ssid": "MyNetwork", "pass": "MyPassword" },
    "mqtt": { "enabled": true }
  },
  "mqtt_broker": "broker.hivemq.com",
  "mqtt_port": 1883,
  "mqtt_topic": "webscreen/notifications",
  "mqtt_client_id": "webscreen01",
  "screen": { "background": "#0d1117", "foreground": "#FFFFFF" },
  "script": "script.js"
}
```

**Send a notification:**
```bash
mosquitto_pub -h broker.hivemq.com -t "webscreen/notifications" \
  -m '{"title":"Hello","message":"HiveMQ broker works!","source":"Test"}'
```

### Option 3: Mosquitto Public Test Broker

Another free public broker at `test.mosquitto.org`.

**webscreen.json:**
```json
{
  "settings": {
    "wifi": { "ssid": "MyNetwork", "pass": "MyPassword" },
    "mqtt": { "enabled": true }
  },
  "mqtt_broker": "test.mosquitto.org",
  "mqtt_port": 1883,
  "mqtt_topic": "webscreen/notifications",
  "mqtt_client_id": "webscreen01",
  "screen": { "background": "#0d1117", "foreground": "#FFFFFF" },
  "script": "script.js"
}
```

**Send a notification:**
```bash
mosquitto_pub -h test.mosquitto.org -t "webscreen/notifications" \
  -m '{"title":"Hello","message":"Mosquitto test broker works!","source":"Test"}'
```

### Option 4: Self-Hosted Cloud Broker

For remote access, run Mosquitto on a VPS or cloud server (e.g., AWS, DigitalOcean, Raspberry Pi with port forwarding).

```json
"mqtt_broker": "mqtt.yourserver.com",
"mqtt_port": 1883
```

## Sending Notifications

Publish messages to your configured topic. Supports two formats:

**JSON (recommended):**
```bash
mosquitto_pub -h <broker> -t "webscreen/notifications" \
  -m '{"title":"Door Open","message":"Front door opened","source":"Security"}'
```

**Plain text:**
```bash
mosquitto_pub -h <broker> -t "webscreen/notifications" \
  -m "Hello from MQTT!"
```

**Listen to messages (useful for debugging):**
```bash
mosquitto_sub -h <broker> -t "webscreen/notifications"
```

## JSON Message Format

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Notification title (displayed large) |
| `message` | No | Notification body text |
| `source` | No | Category label (defaults to "MQTT") |

## Features

- Stores the last 5 notifications with auto-pagination
- Auto-cycles through notifications every 6 seconds
- Shows connection status (Connecting / Connected / MQTT failed)
- Accepts JSON messages with `title`, `message`, and `source` fields
- Falls back to plain text display for non-JSON messages

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| `rc=-2` Connect failed | TCP connection to broker blocked | Check firewall, AP isolation, try different broker/port |
| `rc=-4` Connection timeout | Broker unreachable or slow network | Try a closer/local broker |
| Status stays "Connecting..." | WiFi not connected | Check WiFi credentials in `webscreen.json` |
| Ping works but MQTT fails | Port 1883 blocked by network | Use a local broker or ask ISP about port blocking |
| Local broker unreachable | AP isolation on router | Disable "Client Isolation" in router WiFi settings |
