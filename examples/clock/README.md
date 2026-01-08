# Digital Clock

Beautiful digital clock with customizable themes and timezone support.

## Features

- Large, easy-to-read time display
- 12-hour format with AM/PM indicator
- Date and day of week display
- Multiple color themes
- Configurable timezone
- Auto-sync every 10 minutes

## Configuration

Edit `webscreen.json` to customize:

```json
{
  "timezone": "America/New_York",
  "theme": 0
}
```

### Available Themes

- `0` - Dark (white on black)
- `1` - Light (black on white)
- `2` - Blue (cyan on dark blue)
- `3` - Green (green on dark green)

### Timezone Examples

- `America/New_York`
- `America/Los_Angeles`
- `Europe/London`
- `Europe/Paris`
- `Asia/Tokyo`
- `Australia/Sydney`

## Requirements

- WiFi connection required
- Uses timeapi.io for time sync
- Optional: clock.pem certificate for HTTPS
