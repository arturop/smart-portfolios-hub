
// State management for Smart Portfolios Hub
// Can be used to store user preferences, last visited module, etc.

const AppState = {
    // Example: store user's preferred risk-free rate
    riskFreeRate: 2.0, // percent annual
    
    // Store last visited module timestamp
    lastVisit: null,
    
    // Initialize from localStorage
    init() {
        const saved = localStorage.getItem('smartPortfoliosState');
        if (saved) {
            try {
                Object.assign(this, JSON.parse(saved));
            } catch (e) {
                console.warn('Failed to parse state', e);
            }
        }
        this.lastVisit = Date.now();
        this.save();
    },
    
    // Save to localStorage
    save() {
        try {
            localStorage.setItem('smartPortfoliosState', JSON.stringify(this));
        } catch (e) {
            console.warn('Failed to save state', e);
        }
    },
    
    // Update a property and save
    update(key, value) {
        if (this.hasOwnProperty(key)) {
            this[key] = value;
            this.save();
        }
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    AppState.init();
}
