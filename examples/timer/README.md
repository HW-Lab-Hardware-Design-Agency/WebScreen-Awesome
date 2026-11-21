# Countdown Timer

Offline countdown with pause/resume and restart.

## Usage

The default is five minutes. Set the top-level `duration_seconds` in `/webscreen.json` to an integer from 1 to 86400. Press the BOOT button to pause/resume; when finished, press to restart.

## Behavior and Limits

The initial display includes the full configured duration. Elapsed milliseconds, rather than callback counts, keep the countdown accurate across delayed callbacks and clock wraparound. Pausing preserves fractional seconds. No stopwatch or lap mode is implemented.

See [Elk app development](../../docs/ELK_APPS.md) for installation, API constraints, and tests.
