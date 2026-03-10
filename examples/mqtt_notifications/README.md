# MQTT Notifications

Display real-time notifications on your WebScreen from any MQTT-enabled device or service.

## Setup

1. Configure WiFi and MQTT in `webscreen.json`:

```json
{
  "settings": {
    "wifi": { "ssid": "MyNetwork", "pass": "MyPassword" },
    "mqtt": { "enabled": true }
  },
  "config": {
    "mqtt_broker": "broker.hivemq.com",
    "mqtt_port": 1883,
    "mqtt_topic": "webscreen/notifications",
    "client_id": "webscreen01"
  },
  "screen": {
    "background": "#0d1117",
    "foreground": "#FFFFFF"
  },
  "script": "script.js"
}
```

2. Copy `script.js` to the SD card.

## Sending Notifications

Publish messages to your configured topic. Supports two formats:

**JSON (recommended):**
```bash
mosquitto_pub -h broker.hivemq.com -t "webscreen/notifications" \
  -m '{"title":"Door Open","message":"Front door opened","source":"Security"}'
```

**Plain text:**
```bash
mosquitto_pub -h broker.hivemq.com -t "webscreen/notifications" \
  -m "Hello from MQTT!"
```

## Features

- Stores the last 5 notifications with auto-pagination
- Auto-cycles through notifications every 6 seconds
- Shows connection status (Connecting / Connected / MQTT failed)
- Accepts JSON messages with `title`, `message`, and `source` fields
- Falls back to plain text display for non-JSON messages

## JSON Message Format

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Notification title (displayed large) |
| `message` | No | Notification body text |
| `source` | No | Category label (defaults to "MQTT") |
