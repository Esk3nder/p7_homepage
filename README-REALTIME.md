# 🖥️ CRT Monitor Array - Real-Time Data Integration

Transform your cyberpunk monitor array into a living, breathing visualization of real-world data!

## 🚀 Features

### Real-Time Data Feeds
- **💰 Cryptocurrency Prices** - Live BTC/ETH prices with 24-hour changes
- **🌤️ Weather Data** - Current conditions, temperature, humidity
- **📰 News Headlines** - Scrolling news feeds (simulated)
- **🖼️ Dynamic Images** - Random images from Unsplash
- **📊 Market Sentiment** - Calculated from crypto performance

### Original Content Types
- **Static Noise** - Classic CRT static
- **Watching Eye** - Animated surveillance eye
- **Protocol Text** - Serial Experiments Lain inspired messages
- **P7 Logo** - Glitched project branding
- **Binary Rain** - Matrix-style data stream

## 🎮 Controls

### Keyboard
- **`1-9`** - Switch all monitors to specific content type
- **`0`** - Random content distribution
- **`S`** - Toggle status panel
- **`R`** - Refresh all data
- **`Drag`** - Rotate camera view
- **`Click`** - Network propagation effect

### UI Buttons
- Click mode buttons to switch all monitors
- Status panel shows API connection states

## 🔧 Setup Instructions

### 1. File Structure
```
p7_homepage/
├── index.html           # Original version
├── index-enhanced.html  # Real-time data version
├── config.js           # API configuration
├── dataService.js      # Data fetching service
├── test.html          # Test suite
├── test-specs.js      # Test specifications
└── pseudocode-design.js # System design
```

### 2. Configuration

The system works with free APIs that don't require keys:
- **CoinGecko** - Crypto prices (no key needed)
- **Open-Meteo** - Weather data (no key needed)
- **Unsplash Source** - Random images (no key needed)

For full features, you can add API keys in `config.js`:
```javascript
news: {
    enabled: true,
    apiKey: 'YOUR_NEWSAPI_KEY_HERE'
}
```

### 3. Running Locally

Start a local server:
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server -p 8000

# Or use VS Code Live Server
```

Then open: `http://localhost:8000/index-enhanced.html`

### 4. Testing

Run the test suite:
```bash
# Start test server
python3 -m http.server 8001

# Open in browser
http://localhost:8001/test.html
```

## 📊 Content Distribution

The system uses weighted random distribution:
- 15% Crypto prices
- 15% Protocol text
- 10% Each for other types
- 5% Live images
- 5% Sentiment gauge

You can modify these in `config.js`:
```javascript
contentDistribution: {
    crypto: 15,    // Percentage
    weather: 10,
    // ... etc
}
```

## 🔌 API Integration

### Adding New Data Sources

1. Add API config in `config.js`
2. Implement fetch method in `dataService.js`
3. Add new content type constant
4. Create render method in monitor class
5. Add UI button and keyboard mapping

Example:
```javascript
// In dataService.js
async fetchStockPrices() {
    return this.getCachedOrFetch('stocks', async () => {
        const response = await fetch(this.endpoints.stocks);
        return response.json();
    });
}

// In monitor class
case CONTENT_TYPES.STOCKS:
    await this.renderStocks();
    break;
```

## 🎨 Customization

### Visual Settings
Edit `config.js`:
```javascript
visuals: {
    scanlineOpacity: 0.1,
    curveAmount: 0.3,
    glitchFrequency: 0.02,
    colors: {
        primary: '#02C2CC',
        // ... etc
    }
}
```

### Update Intervals
Control how often data refreshes:
```javascript
updateIntervals: {
    crypto: 30000,      // 30 seconds
    weather: 300000,    // 5 minutes
    // ... etc
}
```

## 🐛 Troubleshooting

### CORS Issues
Some APIs require CORS proxies. Options:
1. Use included free APIs (recommended)
2. Set up your own CORS proxy
3. Use browser extensions for development

### Performance
- Reduce monitor count if needed
- Increase update intervals
- Disable image feeds
- Use `performance.throttleUpdates` setting

### API Limits
Free tiers have limits:
- CoinGecko: 50 calls/minute
- Open-Meteo: Unlimited
- Unsplash Source: Reasonable use

## 🔮 Future Enhancements

- WebSocket support for real-time updates
- Social media sentiment analysis
- Live webcam feeds
- Custom data source plugins
- Multi-monitor configurations
- VR mode support

## 📝 License

This project extends the original CRT monitor array with real-time capabilities.
Feel free to modify and expand!

## 🙏 Credits

- Original visualization inspired by Serial Experiments Lain
- Built with Three.js
- Data from CoinGecko, Open-Meteo, and Unsplash
- Developed following SPARC methodology with TDD

---

*"Close the world. Open the nExt."* - Layer:07