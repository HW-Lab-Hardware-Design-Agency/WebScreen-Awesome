// Stock Ticker App for WebScreen
// Real-time stock prices and market information

// Screen dimensions
let screenWidth = 466;
let screenHeight = 466;

// Demo stock data
let stocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 178.52, change: 2.34, changePercent: 1.33 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.80, change: -0.95, changePercent: -0.67 },
    { symbol: "MSFT", name: "Microsoft", price: 378.91, change: 4.21, changePercent: 1.12 },
    { symbol: "AMZN", name: "Amazon", price: 178.25, change: 1.89, changePercent: 1.07 },
    { symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: -3.75, changePercent: -1.49 },
    { symbol: "NVDA", name: "NVIDIA", price: 495.22, change: 12.45, changePercent: 2.58 }
];

let currentIndex = 0;
let displayCount = 4;  // Number of stocks visible at once

// Create background
let bg = create_label(null);
let bgStyle = create_style();
style_set_bg_color(bgStyle, "#0d1117");
style_set_width(bgStyle, screenWidth);
style_set_height(bgStyle, screenHeight);
obj_add_style(bg, bgStyle, 0);

// Header
let headerLabel = create_label(null);
let headerStyle = create_style();
style_set_text_color(headerStyle, "#FFFFFF");
style_set_text_font(headerStyle, "montserrat_24");
style_set_bg_color(headerStyle, "#161b22");
style_set_bg_opa(headerStyle, 255);
style_set_pad_all(headerStyle, 12);
style_set_width(headerStyle, screenWidth);
obj_add_style(headerLabel, headerStyle, 0);
label_set_text(headerLabel, "STOCK TICKER");
move_obj(headerLabel, 0, 0);

// Market status
let marketLabel = create_label(null);
let marketStyle = create_style();
style_set_text_color(marketStyle, "#7ee787");
style_set_text_font(marketStyle, "montserrat_14");
obj_add_style(marketLabel, marketStyle, 0);
label_set_text(marketLabel, "Market Open");
move_obj(marketLabel, screenWidth - 120, 15);

// Create stock display labels (4 rows)
let stockLabels = [];
let priceLabels = [];
let changeLabels = [];

let i = 0;
while (i < displayCount) {
    let yPos = 70 + (i * 95);

    // Stock card background
    let cardBg = create_label(null);
    let cardBgStyle = create_style();
    style_set_bg_color(cardBgStyle, "#21262d");
    style_set_bg_opa(cardBgStyle, 255);
    style_set_radius(cardBgStyle, 8);
    style_set_width(cardBgStyle, screenWidth - 30);
    style_set_height(cardBgStyle, 85);
    obj_add_style(cardBg, cardBgStyle, 0);
    move_obj(cardBg, 15, yPos);

    // Symbol
    let symbolLabel = create_label(null);
    let symbolStyle = create_style();
    style_set_text_color(symbolStyle, "#58a6ff");
    style_set_text_font(symbolStyle, "montserrat_24");
    obj_add_style(symbolLabel, symbolStyle, 0);
    move_obj(symbolLabel, 30, yPos + 12);

    // Company name
    let nameLabel = create_label(null);
    let nameStyle = create_style();
    style_set_text_color(nameStyle, "#8b949e");
    style_set_text_font(nameStyle, "montserrat_14");
    obj_add_style(nameLabel, nameStyle, 0);
    move_obj(nameLabel, 30, yPos + 45);

    // Price
    let priceLabel = create_label(null);
    let priceStyle = create_style();
    style_set_text_color(priceStyle, "#FFFFFF");
    style_set_text_font(priceStyle, "montserrat_28");
    obj_add_style(priceLabel, priceStyle, 0);
    move_obj(priceLabel, screenWidth - 170, yPos + 12);

    // Change
    let changeLabel = create_label(null);
    let changeStyle = create_style();
    style_set_text_color(changeStyle, "#7ee787");
    style_set_text_font(changeStyle, "montserrat_16");
    obj_add_style(changeLabel, changeStyle, 0);
    move_obj(changeLabel, screenWidth - 170, yPos + 50);

    stockLabels[i] = { symbol: symbolLabel, name: nameLabel };
    priceLabels[i] = priceLabel;
    changeLabels[i] = changeLabel;

    i = i + 1;
}

// Last updated label
let updateLabel = create_label(null);
let updateStyle = create_style();
style_set_text_color(updateStyle, "#484f58");
style_set_text_font(updateStyle, "montserrat_12");
obj_add_style(updateLabel, updateStyle, 0);
move_obj(updateLabel, 15, screenHeight - 25);
label_set_text(updateLabel, "Demo data - Configure API for live prices");

// Update stock display
function updateStockDisplay() {
    let i = 0;
    while (i < displayCount) {
        let stockIndex = (currentIndex + i) % stocks.length;
        let stock = stocks[stockIndex];

        label_set_text(stockLabels[i].symbol, stock.symbol);
        label_set_text(stockLabels[i].name, stock.name);
        label_set_text(priceLabels[i], "$" + numberToString(stock.price));

        // Format change with sign
        let changeText = "";
        if (stock.change >= 0) {
            changeText = "+" + numberToString(stock.change) + " (+" + numberToString(stock.changePercent) + "%)";
        } else {
            changeText = numberToString(stock.change) + " (" + numberToString(stock.changePercent) + "%)";
        }
        label_set_text(changeLabels[i], changeText);

        i = i + 1;
    }
}

// Simulate price updates (in demo mode)
function simulatePriceUpdate() {
    let i = 0;
    while (i < stocks.length) {
        // Random price movement (-2% to +2%)
        let movement = (stocks[i].price * 0.02 * (Math.random ? Math.random() : 0.5)) - (stocks[i].price * 0.01);
        // Simplified random: alternate based on index and time
        let randomFactor = ((i + currentIndex) % 3) - 1;
        movement = stocks[i].price * 0.005 * randomFactor;

        stocks[i].price = stocks[i].price + movement;
        stocks[i].change = movement;
        stocks[i].changePercent = (movement / stocks[i].price) * 100;

        // Round values
        stocks[i].price = toNumber(numberToString(stocks[i].price * 100)) / 100;
        stocks[i].change = toNumber(numberToString(stocks[i].change * 100)) / 100;
        stocks[i].changePercent = toNumber(numberToString(stocks[i].changePercent * 100)) / 100;

        i = i + 1;
    }
}

// Fetch real stock data (requires API key)
function fetchStockData() {
    // Note: You would need to use a stock API like Alpha Vantage, Yahoo Finance, etc.
    // Example with Alpha Vantage (free tier):
    // let url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=YOUR_KEY";
    // let response = http_get(url);

    // For demo, use simulated data
    simulatePriceUpdate();
    updateStockDisplay();
}

// Initialize display
print("Stock Ticker starting...");
updateStockDisplay();

// Main loop
let refreshCounter = 0;
let scrollCounter = 0;

while (true) {
    delay(1000);
    refreshCounter = refreshCounter + 1;
    scrollCounter = scrollCounter + 1;

    // Scroll through stocks every 5 seconds
    if (scrollCounter >= 5) {
        scrollCounter = 0;
        currentIndex = (currentIndex + 1) % stocks.length;
        updateStockDisplay();
    }

    // Update prices every 30 seconds
    if (refreshCounter >= 30) {
        refreshCounter = 0;
        fetchStockData();
    }
}
