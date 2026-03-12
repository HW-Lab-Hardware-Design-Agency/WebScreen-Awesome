# MQTT Notifications

Display real-time notifications on your WebScreen from any MQTT-enabled device or service.

## Quick Start

1. Copy `script.js` to your WebScreen's SD card (rename to `mqtt.js` or whatever name you set in `webscreen.json`).
2. Edit `webscreen.json` on the SD card with your WiFi credentials, MQTT broker, and script name.
3. Reboot the device.

## Requirements

- WebScreen with firmware **v68.1.6** or later (MQTT support required)
- WiFi network accessible from the WebScreen
- An MQTT broker (local or public)
- `mosquitto-clients` package on your computer for sending notifications

### Installing Mosquitto Clients

You only need the **clients** package (`mosquitto_pub` / `mosquitto_sub`) to send and monitor messages. If you also want to run your own broker, install the full `mosquitto` package.

**Fedora:**
```bash
# Clients only (for sending notifications)
sudo dnf install mosquitto

# The mosquitto package includes both the broker and clients on Fedora
```

**Ubuntu / Debian:**
```bash
# Clients only
sudo apt install mosquitto-clients

# Broker + clients
sudo apt install mosquitto mosquitto-clients
```

**macOS:**
```bash
brew install mosquitto
```

**Windows:**
Download the installer from [mosquitto.org/download](https://mosquitto.org/download/). The installer includes both broker and clients. Add the install directory to your PATH.

## Configuration

### webscreen.json

The app reads MQTT settings as top-level keys from `webscreen.json`:

| Key | Default | Description |
|---|---|---|
| `mqtt_broker` | `broker.hivemq.com` | MQTT broker hostname or IP |
| `mqtt_port` | `1883` | MQTT broker port |
| `mqtt_topic` | `webscreen/notifications` | Topic to subscribe to |
| `mqtt_client_id` | `webscreen01` | Client ID for the connection |

MQTT must also be enabled in the `settings.mqtt` section.

### Option 1: Local Broker (recommended)

Running Mosquitto on your own machine is the most reliable setup. No internet dependency, no random messages from other users, and lowest latency.

**Step 1 - Install and start the broker:**
```bash
# Fedora
sudo dnf install mosquitto
sudo systemctl enable --now mosquitto

# Ubuntu/Debian
sudo apt install mosquitto mosquitto-clients
sudo systemctl enable --now mosquitto
```

**Step 2 - Configure it to accept LAN connections:**

By default, Mosquitto only listens on localhost. To let the WebScreen connect over WiFi:

```bash
sudo mkdir -p /etc/mosquitto/conf.d
echo -e "listener 1883 0.0.0.0\nallow_anonymous true" | sudo tee /etc/mosquitto/conf.d/local.conf
```

Make sure the main config includes the conf.d directory (check if this line already exists first):
```bash
grep -q "include_dir /etc/mosquitto/conf.d" /etc/mosquitto/mosquitto.conf || \
  echo "include_dir /etc/mosquitto/conf.d" | sudo tee -a /etc/mosquitto/mosquitto.conf
```

Restart the broker:
```bash
sudo systemctl restart mosquitto
```

**Step 3 - Open the firewall (Fedora / RHEL):**
```bash
sudo firewall-cmd --add-port=1883/tcp --permanent
sudo firewall-cmd --reload
```

On Ubuntu with ufw:
```bash
sudo ufw allow 1883/tcp
```

**Step 4 - Find your machine's local IP:**
```bash
# Linux
hostname -I | awk '{print $1}'

# macOS
ipconfig getifaddr en0
```

**Step 5 - Configure webscreen.json:**
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
  "script": "mqtt.js"
}
```

Replace `192.168.1.100` with your machine's local IP from Step 4.

**Step 6 - Test it:**
```bash
# Send a notification
mosquitto_pub -h localhost -t "webscreen/notifications" \
  -m '{"title":"Hello","message":"Local broker works!","source":"Test"}'
```

### Option 2: HiveMQ Public Broker (no setup)

Free public broker, no account needed. Good for quick testing but has limitations (see [Known Issues with Public Brokers](#known-issues-with-public-brokers)).

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
  "script": "mqtt.js"
}
```

```bash
mosquitto_pub -h broker.hivemq.com -t "webscreen/notifications" \
  -m '{"title":"Hello","message":"HiveMQ works!","source":"Test"}'
```

### Option 3: Mosquitto Public Test Broker

Another free public broker at `test.mosquitto.org`. Same limitations as HiveMQ.

```json
"mqtt_broker": "test.mosquitto.org",
"mqtt_port": 1883
```

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

### JSON Format (recommended)

```bash
mosquitto_pub -h <broker> -t "webscreen/notifications" \
  -m '{"title":"Door Open","message":"Front door opened","source":"Security"}'
```

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Notification title (displayed large) |
| `message` | No | Notification body text |
| `source` | No | Category label shown above the title (defaults to "MQTT") |

### Plain Text

Non-JSON messages are displayed with the title "New Message":

```bash
mosquitto_pub -h <broker> -t "webscreen/notifications" \
  -m "Hello from MQTT!"
```

### Listening to Messages (debugging)

Open a subscriber in a separate terminal to see what the WebScreen receives:

```bash
mosquitto_sub -h <broker> -t "webscreen/notifications" -v
```

### Sending from Code

**Python (paho-mqtt):**
```python
import paho.mqtt.publish as publish
import json

publish.single(
    "webscreen/notifications",
    json.dumps({"title": "Alert", "message": "Sensor triggered", "source": "IoT"}),
    hostname="192.168.1.100"
)
```

**Node.js (mqtt):**
```javascript
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://192.168.1.100');

client.on('connect', () => {
  client.publish('webscreen/notifications', JSON.stringify({
    title: 'Deploy', message: 'Build #42 passed', source: 'CI/CD'
  }));
  client.end();
});
```

**curl + Mosquitto (from a script or cron job):**
```bash
mosquitto_pub -h 192.168.1.100 -t "webscreen/notifications" \
  -m "{\"title\":\"Backup\",\"message\":\"Completed at $(date +%H:%M)\",\"source\":\"Cron\"}"
```

## Features

- Stores the last 5 notifications with auto-pagination
- Auto-cycles through notifications every 6 seconds
- Shows connection status (Connecting / Connected / MQTT failed)
- Accepts JSON messages with `title`, `message`, and `source` fields
- Falls back to plain text display for non-JSON messages
- Dark theme UI with card-based notification display

## Known Issues with Public Brokers

Public MQTT brokers (HiveMQ, test.mosquitto.org, etc.) have several issues that can affect reliability:

### Unsolicited Messages

Public brokers are shared by everyone. If you use a common topic like `webscreen/notifications`, other users or bots may publish messages to the same topic. These messages may:
- Be truncated or malformed
- Not be valid JSON (causing `parse_json_value: InvalidInput` errors in the serial log)
- Appear as unexpected notifications on your screen

**Fix:** Use a unique topic name (e.g., `myname-abc123/webscreen/notifications`) or switch to a local broker.

### Connection Failures

| Error | Meaning |
|---|---|
| `rc=-2` | TCP connection refused. The broker rejected the connection or port 1883 is blocked by your network/ISP. |
| `rc=-4` | Connection timeout. The broker is unreachable or too slow. |

Public brokers can be overloaded or temporarily down. The WebScreen will show "MQTT failed" on screen if the initial connection fails. A reboot is required to retry.

**Fix:** Use a local Mosquitto broker for consistent connectivity.

### Port Blocking

Some ISPs, corporate networks, and public WiFi hotspots block port 1883 (the standard MQTT port). You can verify this from your computer:

```bash
# Test if port 1883 is reachable
nc -zv broker.hivemq.com 1883

# Or with telnet
telnet broker.hivemq.com 1883
```

If the connection is refused or times out, port 1883 is blocked on your network.

**Fix:** Use a local broker on your LAN, which avoids external port restrictions entirely.

### No TLS Support

The WebScreen MQTT client currently uses unencrypted connections (port 1883). Some brokers require TLS (port 8883) and will reject plain connections.

**Fix:** Use brokers that accept unencrypted connections on port 1883. All options listed in this README support port 1883.

## Troubleshooting

### Device Won't Connect to Broker

| Symptom | Cause | Fix |
|---|---|---|
| Status stays "Connecting..." | WiFi not connected | Check SSID and password in `webscreen.json` |
| "MQTT failed" on screen | Broker unreachable | Check broker address, port, firewall |
| Serial log: `rc=-2` | TCP connection refused | Check firewall, AP isolation, try local broker |
| Serial log: `rc=-4` | Connection timeout | Broker too slow or unreachable |

### AP Isolation

Many routers have **AP isolation** (also called "Client Isolation" or "WiFi Isolation") enabled by default. This prevents WiFi devices from communicating with each other on the same network, which blocks the WebScreen from reaching a local broker.

**Fix:** Disable AP isolation in your router's WiFi settings (usually under Advanced > Wireless).

### Messages Not Appearing

1. **Verify the broker receives your message** by subscribing in a terminal:
   ```bash
   mosquitto_sub -h <broker> -t "webscreen/notifications" -v
   ```
   Then send a test message from another terminal. If the subscriber doesn't see it, the issue is on the publishing side.

2. **Check the serial log** for errors. Connect via USB and look for:
   - `[MQTT] Message arrived` - Message was received by the device
   - `parse_json_value: JSON parse failed` - Message isn't valid JSON (falls back to plain text display)
   - `Notification: ...` - Message was processed and displayed successfully

3. **Confirm the topic matches** between your `webscreen.json` and the `mosquitto_pub` command.

### Serial Log Reference

Normal successful flow:
```
[MQTT] Connecting as 'webscreen01' to 192.168.1.100...
[MQTT] Connected successfully
[MQTT] Subscribed to 'webscreen/notifications'? => OK
[MQTT] Message arrived on topic 'webscreen/notifications'
[MQTT] Message ready for JS (58 bytes)
Notification: Hello - Local broker works!
```
