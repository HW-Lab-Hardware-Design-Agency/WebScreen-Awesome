# Bid Watcher

Track auction bids and marketplace listings on WebScreen.

## Features

- Monitor multiple auctions simultaneously
- Real-time countdown timers
- Winning/Outbid status indicators
- Bid count tracking
- Summary stats (winning vs outbid)

## Status Indicators

- **WINNING** (Green): Your bid is currently the highest
- **OUTBID** (Red): Someone has outbid you
- **WATCHING** (Gray): Items you're monitoring but haven't bid on

## Demo Mode

The app runs in demo mode with simulated auction data. Prices and times update automatically to demonstrate the display.

## Customization

Edit the `auctions` array to track your items:

```javascript
let auctions = [
    {
        title: "Item Name",
        currentBid: 45.00,
        yourBid: 42.00,      // Your max bid (0 if watching)
        endTime: 3600,       // Seconds remaining
        bids: 12,
        status: "outbid"     // "winning", "outbid", or "watching"
    }
];
```

## API Integration

To connect to actual auction sites (eBay, etc.), you would need to:
1. Obtain API credentials
2. Implement fetch functions for your platform
3. Update auction data in the main loop

## Display

- Shows 3 auctions at a time
- Auto-scrolls through watchlist
- Color-coded status badges
- Real-time countdown timers
