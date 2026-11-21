# Calculator

Offline arithmetic calculator with a complete keypad display and an automatic calculation demo.

## Usage

Press the BOOT button to pause/resume the demo. Enter keys through the serial console, for example `/eval key("C"); key("1"); key("2"); key("+"); key("5"); key("=");`. Manual input pauses the demo.

## Behavior and Limits

Supported keys: digits, `.`, `+`, `-`, `x`, `/`, `=`, `C`, `%`, and `+/-`. Division by zero displays Error; oversized results display Overflow. Results are rounded to four decimal places. The on-screen keypad is visual; the firmware does not expose touch key events.

See [Elk app development](../../docs/ELK_APPS.md) for installation, API constraints, and tests.
