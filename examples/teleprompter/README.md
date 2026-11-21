# Teleprompter

Scroll text loaded from `/speech.txt` on the SD card. If the file is absent or empty, a built-in introduction is displayed.

## Usage

Use plain text, preferably ASCII, with line breaks for paragraphs. Press the BOOT button to pause/resume. Text wraps at spaces where possible and loops after the final line.

## Behavior and Limits

Five reusable rows avoid the firmware limit of 255 bytes per label. The app retains the first 32 KB of the file and shows a notice if truncated. Scrolling runs at 40 pixels/second and pauses during long system stalls so unread text is not skipped.

See [Elk app development](../../docs/ELK_APPS.md) for installation, API constraints, and tests.
