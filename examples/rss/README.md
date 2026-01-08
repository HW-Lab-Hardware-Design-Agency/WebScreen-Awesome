# RSS Reader

Display latest news and updates from RSS feeds on WebScreen.

## Features

- Multiple RSS feed support
- Auto-scrolling headlines
- Source and time display
- Automatic refresh every 5 minutes
- Demo mode when offline

## Setup

Edit `rss_app.js` to add your favorite RSS feeds:

```javascript
let RSS_FEEDS = [
    "https://news.ycombinator.com/rss",
    "https://example.com/feed.xml"
];
```

## Popular RSS Feeds

- Hacker News: `https://news.ycombinator.com/rss`
- Reddit: `https://www.reddit.com/r/programming/.rss`
- BBC News: `http://feeds.bbci.co.uk/news/rss.xml`
- TechCrunch: `https://techcrunch.com/feed/`

## Display

- Shows 4 headlines at a time
- Auto-scrolls every 8 seconds
- Source name highlighted in orange
- Time since publication

## Requirements

- WiFi connection for live feeds
- Falls back to demo data when offline
