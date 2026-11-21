# Music Player UI Demo

Offline player interface with a five-track sample playlist and elapsed-time progress bar.

## Usage

Press the BOOT button to pause/resume simulated playback. Use `/eval next_track();` to advance immediately. Playback automatically advances at the end of a track.

## Behavior and Limits

This is a display demo and produces no audio. The displayed previous/next symbols are not touch inputs. Track names, artists, and durations can be edited in the script; the CSV fields must not contain commas.

See [Elk app development](../../docs/ELK_APPS.md) for installation, API constraints, and tests.
