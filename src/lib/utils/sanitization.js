/**
 * XSS Protection and Input Sanitization Utilities
 * Provides safe methods for handling user input and preventing XSS attacks
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize plain text input for safe display
 * Escapes HTML entities to prevent XSS
 * @param {string} input - User input to sanitize
 * @returns {string} Safe string for display
 */
export function sanitizeText(input) {
  if (!input) return '';
  
  // Convert to string if not already
  const str = String(input);
  
  // HTML entity encoding for safe text display
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize HTML content (for rich text that needs formatting)
 * Uses DOMPurify with strict settings
 * @param {string} html - HTML content to sanitize
 * @param {object} options - DOMPurify options
 * @returns {string} Safe HTML for rendering
 */
export function sanitizeHTML(html, options = {}) {
  if (!html) return '';
  
  // Default safe configuration
  const defaultConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'ol', 'li', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    USE_PROFILES: { html: true }
  };
  
  // Only allow HTTPS URLs in href
  const config = {
    ...defaultConfig,
    ...options,
    ALLOWED_URI_REGEXP: /^https?:\/\//i
  };
  
  return DOMPurify.sanitize(html, config);
}

/**
 * Sanitize and encode URL parameters
 * @param {string} value - Value to encode for URL
 * @returns {string} URL-safe encoded string
 */
export function sanitizeURLParam(value) {
  if (!value) return '';
  
  // First sanitize the text, then URL encode
  const sanitized = sanitizeText(value);
  return encodeURIComponent(sanitized);
}

/**
 * Sanitize Swedish personal numbers (remove any non-digits)
 * @param {string} personalNumber - Personal number to sanitize
 * @returns {string} Sanitized personal number
 */
export function sanitizePersonalNumber(personalNumber) {
  if (!personalNumber) return '';
  
  // Remove all non-digits and limit length
  return personalNumber.replace(/\D/g, '').slice(0, 12);
}

/**
 * Sanitize form input (general purpose)
 * Removes dangerous characters while preserving legitimate input
 * @param {string} input - Form input to sanitize
 * @param {object} options - Sanitization options
 * @returns {string} Sanitized input
 */
export function sanitizeFormInput(input, options = {}) {
  if (!input) return '';
  
  const {
    maxLength = 255,
    allowNumbers = true,
    allowLetters = true,
    allowSpaces = true,
    allowSpecialChars = '.-,',
    trim = true
  } = options;
  
  let sanitized = String(input);
  
  // Trim if specified
  if (trim) {
    sanitized = sanitized.trim();
  }
  
  // Build allowed characters pattern
  let pattern = '';
  if (allowLetters) pattern += 'a-zA-ZåäöÅÄÖ';
  if (allowNumbers) pattern += '0-9';
  if (allowSpaces) pattern += ' ';
  if (allowSpecialChars) {
    // Escape special regex characters
    const escaped = allowSpecialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    pattern += escaped;
  }
  
  // Remove disallowed characters
  const regex = new RegExp(`[^${pattern}]`, 'g');
  sanitized = sanitized.replace(regex, '');
  
  // Limit length
  return sanitized.slice(0, maxLength);
}

/**
 * Sanitize email addresses
 * @param {string} email - Email to sanitize
 * @returns {string} Sanitized email
 */
export function sanitizeEmail(email) {
  if (!email) return '';
  
  // Basic email sanitization - remove dangerous characters
  return email
    .toLowerCase()
    .trim()
    .replace(/[<>"/\\`']/g, '')
    .slice(0, 254); // Max email length per RFC
}

/**
 * Sanitize phone numbers
 * @param {string} phone - Phone number to sanitize
 * @returns {string} Sanitized phone number
 */
export function sanitizePhoneNumber(phone) {
  if (!phone) return '';
  
  // Allow digits, spaces, +, -, and parentheses
  return phone
    .replace(/[^0-9\s+\-()]/g, '')
    .slice(0, 20);
}

/**
 * Create a safe component for displaying user input
 * Returns an object safe for React rendering
 * @param {string} input - User input to display
 * @returns {object} React-safe render object
 */
export function SafeText({ children }) {
  return sanitizeText(children);
}