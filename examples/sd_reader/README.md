# SD Reader

Browse the SD card root directory on screen without waiting for Wi-Fi.

## Usage

Four directory entries appear per page. Press the BOOT button to advance. The listing refreshes every 15 seconds; an unavailable or empty directory displays a status message.

## Behavior and Limits

Filenames are shortened to 48 bytes for display. The firmware limits `sd_list_dir()` output to 511 bytes, so this example can only paginate the returned entries; it does not recursively browse or open files.

See [Elk app development](../../docs/ELK_APPS.md) for installation, API constraints, and tests.
