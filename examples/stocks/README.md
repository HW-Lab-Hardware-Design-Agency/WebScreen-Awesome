# Stock Ticker

Real-time stock prices and market information display for WebScreen.

## Features

- Display multiple stock symbols
- Price and percentage change
- Color-coded gains/losses (green/red)
- Auto-scrolling through watchlist
- Market status indicator

## Demo Mode

The app runs in demo mode with simulated data by default. Prices update with small random movements to demonstrate the display.

## Live Data Setup

To use real stock data, you'll need an API key from a stock data provider:

### Alpha Vantage (Free)
1. Get API key from https://www.alphavantage.co/support/#api-key
2. Modify the `fetchStockData()` function to use real API calls

### Yahoo Finance API
Alternative free option for stock data.

## Customization

Edit the `stocks` array to change which symbols are tracked:
```javascript
let stocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 0, change: 0, changePercent: 0 },
    // Add more...
];
```

## Display

- Shows 4 stocks at a time
- Auto-scrolls every 5 seconds
- Updates prices every 30 seconds
