# Pomodoro Timer

Offline focus timer alternating 25-minute work sessions and five-minute breaks.

## Usage

Press the BOOT button to pause/resume. The screen shows the current phase and number of completed focus sessions. Edit `WORK_TIME` and `BREAK_TIME` in seconds to change durations.

## Behavior and Limits

Elapsed milliseconds determine phase changes, including delayed callbacks and clock wraparound. This example does not implement long breaks, audio alerts, or persisted session history.

See [Elk app development](../../docs/ELK_APPS.md) for installation, API constraints, and tests.
