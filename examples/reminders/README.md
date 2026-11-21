# Daily Reminders

Four daily reminders driven by the firmware NTP clock.

## Usage

Configure Wi-Fi and the local timezone. Due reminders display `[!]`; press the BOOT button to acknowledge the earliest due, unfinished item. Acknowledged items show `[X]`.

## Behavior and Limits

Items reset each local day. Passing the due time does not automatically mark work complete. Edit the four reminder labels and their matching HHMM thresholds in the script together. Without synchronized time, the app shows a waiting status.

See [Elk app development](../../docs/ELK_APPS.md) for installation, API constraints, and tests.
