# Music Player

A music player interface display for WebScreen.

## Features

- Now Playing display with track and artist info
- Progress bar with elapsed/total time
- Play/Pause status indicator
- Previous/Next track controls (visual)
- Album art placeholder
- Demo playlist with 5 tracks

## Display Elements

- **Album art**: Circular placeholder on the left
- **Track info**: Song title and artist name
- **Progress bar**: Visual playback progress
- **Controls**: Previous, Play/Pause, Next buttons

## Demo Mode

This app runs in demo mode, automatically cycling through a sample playlist to demonstrate the interface. In a real implementation, this could be connected to:

- MQTT for remote control
- BLE for smartphone integration
- External music service APIs

## Customization

The demo playlist can be modified by editing the `tracks`, `artists`, and `durations` variables in the script.

## Requirements

- No WiFi required for demo mode
- MQTT connection optional for remote control
