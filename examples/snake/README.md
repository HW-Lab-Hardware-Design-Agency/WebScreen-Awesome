# Snake AI

Offline Snake demo on a 30 by 12 grid, controlled by an automatic food-seeking player.

## Usage

The snake avoids walls and occupied body cells. Food appears on a free cell. Press the BOOT button to restart at any time, including after Game Over.

## Behavior and Limits

The snake grows to 11 visible segments. Objects are allocated once and moved each frame; fixed-field linked nodes replace repeated CSV rebuilding. The AI can trap itself and then ends the game. No touchscreen controls are required.

See [Elk app development](../../docs/ELK_APPS.md) for installation, API constraints, and tests.
