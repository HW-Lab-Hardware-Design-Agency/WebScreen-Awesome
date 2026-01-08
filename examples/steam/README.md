# Steam Connect

Display your Steam profile, friends online, and current game activity on WebScreen.

## Features

- Profile display with username and level
- Online status indicator
- Currently playing game
- Friends online count
- Auto-refresh every 60 seconds

## Setup

1. Get your Steam API key from https://steamcommunity.com/dev/apikey
2. Find your 64-bit Steam ID
3. Edit `steam_app.js` and set:
   - `STEAM_API_KEY` - Your Steam Web API key
   - `STEAM_ID` - Your 64-bit Steam ID

## Demo Mode

Without API credentials, the app runs in demo mode with sample data.

## API Endpoints Used

- GetPlayerSummaries - Profile info and current game
- GetFriendList - Friends count

## Requirements

- WiFi connection
- Steam Web API key
- Public Steam profile
