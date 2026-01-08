# IoT Monitor

Monitor and control IoT devices and sensors via MQTT on WebScreen.

## Features

- 6-sensor dashboard (2x3 grid)
- Real-time MQTT updates
- Multiple sensor types support
- Color-coded status indicators
- Demo mode for testing

## Supported Sensor Types

- **Temperature**: Shows value in C/F with color coding
- **Humidity**: Percentage display
- **Motion**: Motion detected / Clear status
- **Contact**: Open / Closed (doors, windows)
- **Switch**: ON / OFF state

## MQTT Setup

Edit `iot_app.js` to configure your MQTT broker:

```javascript
let MQTT_BROKER = "your-broker.com";
let MQTT_PORT = 1883;
let MQTT_USER = "username";  // optional
let MQTT_PASS = "password";  // optional
```

## Topic Structure

The app subscribes to `home/sensors/#` and expects messages like:
- `home/sensors/temp_living` -> "22.5"
- `home/sensors/motion_hall` -> "1" or "0"

## Adding Sensors

Modify the `sensors` array to add your devices:

```javascript
let sensors = [
    { id: "temp_living", name: "Living Room", type: "temperature", value: 0, unit: "C", icon: "TEMP" },
    // Add more...
];
```

## Demo Mode

Runs automatically when MQTT is not configured, showing simulated sensor data with periodic updates.
