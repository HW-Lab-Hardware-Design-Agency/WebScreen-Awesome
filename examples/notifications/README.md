# Notification Center

Centralized notification hub for displaying alerts and messages.

## Features

- Card-based notification display
- Source indicator with colored dot
- Title and message content
- Timestamp display
- Navigation between multiple notifications
- Auto-cycling through notifications
- Stores up to 5 notifications

## Display Elements

- **Header**: "Notifications" title with count
- **Card**: Main notification display area
- **Source**: App/service that sent the notification
- **Title**: Notification headline
- **Message**: Full notification content
- **Time**: When the notification was received
- **Navigation**: Previous/Next indicators with page counter

## Demo Mode

The app runs in demo mode, automatically generating sample notifications from various sources:
- Messages
- Calendar
- Weather
- System
- Email

## Integration

For real notifications, this app can be extended to:
- Subscribe to MQTT topics for push notifications
- Poll REST APIs for updates
- Receive BLE notifications from a smartphone

## Requirements

- No WiFi required for demo mode
- MQTT optional for real-time notifications
