# Notification Center Demo

Offline notification display with five retained entries, newest first.

## Usage

Sample notifications arrive every eight seconds and pages cycle every five seconds. Press the BOOT button to browse immediately. To inject an entry, use `/eval addNotification("Hello", "Message, with commas", "Serial");`.

## Behavior and Limits

Fixed-property objects keep commas and empty fields intact. Ages use elapsed time. This example generates sample data; use MQTT Notifications to receive external events.

See [Elk app development](../../docs/ELK_APPS.md) for installation, API constraints, and tests.
