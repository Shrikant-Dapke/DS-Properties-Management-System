/**
 * DS Properties — Utility Functions (Formatters)
 */

/**
 * Format a number as Indian Rupees (₹)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string e.g., "₹15,00,000.50"
 */
export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Alias for formatCurrency — explicit INR formatter (Task 04 spec)
 */
export const formatINR = formatCurrency;

/**
 * Format a number with Indian comma grouping (no currency symbol)
 * @param {number} amount
 * @returns {string} e.g., "15,00,000.50"
 */
export function formatNumber(amount) {
  if (amount == null || isNaN(amount)) return '0';
  return new Intl.NumberFormat('en-IN').format(amount);
}

/**
 * Format a date string to display format
 * @param {string|Date} date
 * @param {'short'|'long'|'full'} format
 * @returns {string}
 */
export function formatDate(date, format = 'short') {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const options = {
    short: { day: '2-digit', month: 'short', year: 'numeric' },       // 19 Jun 2026
    long: { day: '2-digit', month: 'long', year: 'numeric' },          // 19 June 2026
    full: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }, // Thursday, 19 June 2026
  };

  return d.toLocaleDateString('en-IN', options[format] || options.short);
}

/**
 * Format a date for input fields (YYYY-MM-DD)
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateInput(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

/**
 * Format a timestamp to time string
 * @param {string|Date} timestamp
 * @returns {string} e.g., "2:30 PM"
 */
export function formatTime(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} timestamp
 * @returns {string}
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp) return '';
  const now = new Date();
  const d = new Date(timestamp);
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(timestamp, 'short');
}

/**
 * Capitalize first letter of a string
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format payment mode for display
 * @param {string} mode
 * @returns {string}
 */
export function formatPaymentMode(mode) {
  const labels = {
    cash: 'Cash',
    cheque: 'Cheque',
    upi: 'UPI',
    bank_transfer: 'Bank Transfer',
  };
  return labels[mode] || capitalize(mode);
}
