/**
 * Configuration for Real-Time Data Integration
 * API keys and settings
 */

const CONFIG = {
    // API Configuration
    apis: {
        // Free APIs that work without CORS issues
        crypto: {
            enabled: true,
            endpoint: 'https://api.coingecko.com/api/v3/simple/price',
            // No API key needed for CoinGecko
        },
        
        weather: {
            enabled: true,
            endpoint: 'https://api.open-meteo.com/v1/forecast',
            // No API key needed for Open-Meteo
            defaultLocation: {
                lat: 40.7128,  // New York
                lon: -74.0060
            }
        },
        
        // These would require API keys and CORS proxy
        news: {
            enabled: false,
            apiKey: 'YOUR_NEWSAPI_KEY_HERE',
            endpoint: 'https://newsapi.org/v2/top-headlines',
            corsProxy: 'https://cors-anywhere.herokuapp.com/'
        },
        
        images: {
            enabled: true,
            // Using Unsplash Source (no key needed for simple usage)
            endpoint: 'https://source.unsplash.com/',
            themes: ['cyberpunk', 'technology', 'abstract', 'city', 'neon', 'computer']
        }
    },
    
    // Update intervals (milliseconds)
    updateIntervals: {
        crypto: 30000,      // 30 seconds
        weather: 300000,    // 5 minutes
        news: 600000,       // 10 minutes
        images: 120000,     // 2 minutes
        sentiment: 10000    // 10 seconds
    },
    
    // Monitor content distribution
    contentDistribution: {
        // Percentage of monitors showing each content type
        static: 10,         // Original static
        eye: 10,           // Original eye
        protocol: 15,      // Original protocol text
        p7: 10,           // Original p7 logo
        binary: 10,       // Original binary rain
        crypto: 15,       // New: crypto prices
        weather: 10,      // New: weather data
        news: 10,         // New: news headlines
        images: 5,        // New: live images
        sentiment: 5      // New: sentiment gauge
    },
    
    // Visual settings
    visuals: {
        // CRT effect intensity
        scanlineOpacity: 0.1,
        curveAmount: 0.3,
        glitchFrequency: 0.02,
        
        // Color scheme
        colors: {
            primary: '#02C2CC',
            secondary: '#4A8FBD',
            success: '#00FF00',
            warning: '#FFFF00',
            danger: '#FF0000',
            purple: '#8941AD'
        }
    },
    
    // Performance settings
    performance: {
        maxConcurrentRequests: 3,
        requestTimeout: 5000,
        cacheEnabled: true,
        throttleUpdates: true
    },
    
    // Debug settings
    debug: {
        enabled: true,
        logApiCalls: true,
        showCacheStatus: true,
        showFPS: false
    }
};

// Content type mapping
const CONTENT_TYPES = {
    STATIC: 0,
    EYE: 1,
    PROTOCOL: 2,
    P7_LOGO: 3,
    BINARY: 4,
    CRYPTO: 5,      // New
    WEATHER: 6,     // New
    NEWS: 7,        // New
    IMAGES: 8,      // New
    SENTIMENT: 9    // New
};

// Helper function to get weighted random content type
function getRandomContentType() {
    const weights = [];
    const types = [];
    
    for (const [type, percentage] of Object.entries(CONFIG.contentDistribution)) {
        const typeId = CONTENT_TYPES[type.toUpperCase()];
        if (typeId !== undefined) {
            weights.push(percentage);
            types.push(typeId);
        }
    }
    
    // Calculate cumulative weights
    const cumulative = [];
    let sum = 0;
    for (const weight of weights) {
        sum += weight;
        cumulative.push(sum);
    }
    
    // Random selection
    const random = Math.random() * sum;
    for (let i = 0; i < cumulative.length; i++) {
        if (random < cumulative[i]) {
            return types[i];
        }
    }
    
    return 0; // Default to static
}