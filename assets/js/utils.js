
// Utility functions for Smart Portfolios Hub

/**
 * Format a number as currency (euros)
 * @param {number} amount - Amount in euros
 * @param {boolean} showSymbol - Whether to show € symbol
 * @returns {string} Formatted string
 */
function formatCurrency(amount, showSymbol = true) {
    const symbol = showSymbol ? '€' : '';
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
}

/**
 * Format a number as percentage
 * @param {number} value - Value as decimal (0.05 for 5%)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
function formatPercentage(value, decimals = 2) {
    return `${(parseFloat(value) * 100).toFixed(decimals)}%`;
}

/**
 * Parse a return string that might be in decimal or percentage format
 * @param {string} str - Input string (e.g., "1.5%", "0.015", or "-2.3")
 * @returns {number} Parsed value as decimal
 */
function parseReturn(str) {
    if (typeof str !== 'string') return parseFloat(str) || 0;
    const cleaned = str.trim();
    if (cleaned.endsWith('%') || cleaned.endsWith(' %') || cleaned.endsWith(' %')) {
        const num = parseFloat(cleaned.replace(/[^\d.-]/g, ''));
        return isNaN(num) ? 0 : num / 100;
    }
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
}

/**
 * Calculate annualized return from monthly return
 * @param {number} monthlyReturn - Monthly return as decimal (0.01 for 1%)
 * @returns {number} Annualized return as decimal
 */
function annualizeReturn(monthlyReturn) {
    return Math.pow(1 + monthlyReturn, 12) - 1;
}

/**
 * Calculate monthly return from annualized return
 * @param {number} annualReturn - Annual return as decimal
 * @returns {number} Monthly return as decimal
 */
function monthlyizeReturn(annualReturn) {
    return Math.pow(1 + annualReturn, 1/12) - 1;
}

// Export for use in modules (if using bundlers)
// In plain browser, attach to window
if (typeof window !== 'undefined') {
    window.utils = {
        formatCurrency,
        formatPercentage,
        parseReturn,
        annualizeReturn,
        monthlyizeReturn
    };
}
