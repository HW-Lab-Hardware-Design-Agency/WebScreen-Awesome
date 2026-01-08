# Reminders

Personal reminder system with notifications and alerts for WebScreen.

## Features

- Daily reminder list
- Time-based scheduling
- Priority levels (high/medium/low)
- Category tags (work/health/personal)
- Progress tracking (pending/done)
- Visual status indicators

## Display

- Shows 4 reminders at a time
- Auto-scrolls through list
- Color-coded priority borders:
  - Red: High priority
  - Orange: Medium priority
  - Green: Low priority
- Time badges turn red when due/overdue

## Demo Mode

The app runs in demo mode with simulated reminders and auto-advancing time to show how reminders are completed throughout the day.

## Customization

Edit the `reminders` array to add your tasks:

```javascript
let reminders = [
    {
        text: "Task description",
        time: "09:00",
        category: "work",    // "work", "health", "personal"
        done: false,
        priority: "high"     // "high", "medium", "low"
    }
];
```

## Data Storage

Place a `reminders.json` file on your SD card to load custom reminders at startup.

## Future Enhancements

- Sync with calendar services
- Recurring reminders
- Voice/sound alerts
- Touch to mark complete
