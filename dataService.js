/**
 * Data Service Module - Handles all real-time data fetching
 * Singleton pattern for centralized data management
 */

class DataService {
    constructor() {
        // Singleton instance
        if (DataService.instance) {
            return DataService.instance;
        }
        
        // Initialize cache
        this.cache = new Map();
        
        // Cache timeouts (in milliseconds)
        this.cacheTimeouts = {
            crypto: 30000,      // 30 seconds
            weather: 300000,    // 5 minutes
            news: 600000,       // 10 minutes
            images: 120000,     // 2 minutes
            sentiment: 10000    // 10 seconds
        };
        
        // API endpoints
        this.endpoints = {
            crypto: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
            weather: 'https://api.open-meteo.com/v1/forecast',
            // News and images would require API keys and CORS proxy
            news: null,
            images: null
        };
        
        // Store instance
        DataService.instance = this;
    }
    
    /**
     * Check if cached data is still valid
     */
    isCacheValid(key) {
        const cached = this.cache.get(key);
        if (!cached) return false;
        
        const now = Date.now();
        const timeout = this.cacheTimeouts[key] || 60000;
        return (now - cached.timestamp) < timeout;
    }
    
    /**
     * Get data from cache or fetch fresh
     */
    async getCachedOrFetch(key, fetchFunction) {
        if (this.isCacheValid(key)) {
            return this.cache.get(key).data;
        }
        
        try {
            const data = await fetchFunction();
            this.cache.set(key, {
                data,
                timestamp: Date.now()
            });
            return data;
        } catch (error) {
            console.warn(`Error fetching ${key}:`, error);
            // Return cached data if available, even if expired
            const cached = this.cache.get(key);
            return cached ? cached.data : null;
        }
    }
    
    /**
     * Fetch cryptocurrency prices
     */
    async fetchCryptoPrices() {
        return this.getCachedOrFetch('crypto', async () => {
            const response = await fetch(this.endpoints.crypto);
            const data = await response.json();
            
            return {
                btc: {
                    price: data.bitcoin.usd,
                    change24h: data.bitcoin.usd_24h_change
                },
                eth: {
                    price: data.ethereum.usd,
                    change24h: data.ethereum.usd_24h_change
                }
            };
        });
    }
    
    /**
     * Fetch weather data
     */
    async fetchWeather(lat = 40.7128, lon = -74.0060) {
        return this.getCachedOrFetch('weather', async () => {
            const url = `${this.endpoints.weather}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m`;
            const response = await fetch(url);
            const data = await response.json();
            
            return {
                temperature: Math.round(data.current_weather.temperature),
                windspeed: data.current_weather.windspeed,
                humidity: data.hourly.relativehumidity_2m[0],
                conditions: this.getWeatherCondition(data.current_weather.weathercode)
            };
        });
    }
    
    /**
     * Calculate market sentiment
     */
    async calculateSentiment() {
        return this.getCachedOrFetch('sentiment', async () => {
            const crypto = await this.fetchCryptoPrices();
            
            if (!crypto) {
                return { score: 0, label: 'NEUTRAL', color: '#4A8FBD' };
            }
            
            // Weight BTC more heavily in sentiment
            const btcSentiment = (crypto.btc.change24h || 0) * 2;
            const ethSentiment = (crypto.eth.change24h || 0) * 1.5;
            
            // Calculate weighted average and normalize to -100 to +100
            let score = (btcSentiment + ethSentiment) / 2;
            score = Math.max(-100, Math.min(100, score * 5)); // Amplify for visibility
            
            let label, color;
            if (score > 50) {
                label = 'VERY BULLISH';
                color = '#00FF00';
            } else if (score > 20) {
                label = 'BULLISH';
                color = '#40FF40';
            } else if (score > -20) {
                label = 'NEUTRAL';
                color = '#4A8FBD';
            } else if (score > -50) {
                label = 'BEARISH';
                color = '#FF4040';
            } else {
                label = 'VERY BEARISH';
                color = '#FF0000';
            }
            
            return { score, label, color };
        });
    }
    
    /**
     * Get mock news headlines (would need API key for real data)
     */
    async fetchNews() {
        return this.getCachedOrFetch('news', async () => {
            // Mock news data for demonstration
            return [
                'PROTOCOL 7: New network nodes detected in sector 4',
                'LAYER:07: Quantum encryption protocols updated',
                'WIRED: Global connectivity reaches 97.3%',
                'SYSTEM: Neural interface bandwidth increased',
                'ALERT: Anomalous data patterns in eastern grid'
            ];
        });
    }
    
    /**
     * Get test image URL
     */
    async fetchImageUrl() {
        return this.getCachedOrFetch('images', async () => {
            // Return a placeholder image that works without CORS
            const themes = ['cyberpunk', 'technology', 'abstract', 'city', 'neon'];
            const theme = themes[Math.floor(Math.random() * themes.length)];
            return `https://source.unsplash.com/512x384/?${theme}`;
        });
    }
    
    /**
     * Convert weather code to condition string
     */
    getWeatherCondition(code) {
        const conditions = {
            0: 'CLEAR',
            1: 'MOSTLY CLEAR',
            2: 'PARTLY CLOUDY',
            3: 'OVERCAST',
            45: 'FOGGY',
            48: 'FOGGY',
            51: 'LIGHT DRIZZLE',
            61: 'LIGHT RAIN',
            63: 'MODERATE RAIN',
            65: 'HEAVY RAIN',
            71: 'LIGHT SNOW',
            73: 'MODERATE SNOW',
            75: 'HEAVY SNOW',
            95: 'THUNDERSTORM'
        };
        return conditions[code] || 'UNKNOWN';
    }
    
    /**
     * Clear all cached data
     */
    clearCache() {
        this.cache.clear();
    }
    
    /**
     * Get cache status for debugging
     */
    getCacheStatus() {
        const status = {};
        for (const [key, value] of this.cache.entries()) {
            const age = Date.now() - value.timestamp;
            const maxAge = this.cacheTimeouts[key] || 60000;
            status[key] = {
                age: Math.round(age / 1000) + 's',
                expired: age > maxAge,
                data: value.data
            };
        }
        return status;
    }
}

// Export for use in main application
const dataService = new DataService();