# Pomodoro Timer

A focus timer using the Pomodoro Technique for productivity on WebScreen.

## Features

- 25-minute work sessions
- 5-minute short breaks
- 15-minute long breaks (after 4 sessions)
- Session progress indicator
- Visual session counter (dots)
- Total focus time tracking

## The Pomodoro Technique

1. Work for 25 minutes (one "pomodoro")
2. Take a 5-minute break
3. After 4 pomodoros, take a 15-minute break
4. Repeat!

## Customization

Edit these variables in `pomodoro_app.js`:

```javascript
let WORK_TIME = 25 * 60;      // Work session (25 min)
let SHORT_BREAK = 5 * 60;     // Short break (5 min)
let LONG_BREAK = 15 * 60;     // Long break (15 min)
let SESSIONS_BEFORE_LONG = 4; // Sessions before long break
```

## Display

- Large timer display
- Color changes for work (red) vs break (green)
- Progress percentage
- Session dots (fill as you complete sessions)
- Running total of focus time
