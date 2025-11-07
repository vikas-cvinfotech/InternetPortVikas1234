import fs from 'fs/promises';
import path from 'path';

// File paths
const EN_RATES_PATH = path.join(process.cwd(), 'src', 'config', 'internationalRates-en.json');
const SV_RATES_PATH = path.join(process.cwd(), 'src', 'config', 'internationalRates-sv.json');

// Fallback empty rates if files don't exist
const EMPTY_RATES = [];

/**
 * Check if rate files exist
 */
async function rateFilesExist() {
  try {
    await fs.access(EN_RATES_PATH);
    await fs.access(SV_RATES_PATH);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load international rates for a specific locale
 * @param {string} locale - 'en' or 'sv'
 * @returns {Promise<Array>} Array of rate objects
 */
export async function loadInternationalRates(locale = 'sv') {
  try {
    const filePath = locale === 'sv' ? SV_RATES_PATH : EN_RATES_PATH;
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading international rates for locale ${locale}:`, error);
    return EMPTY_RATES;
  }
}

/**
 * Trigger rate sync from MOR API if files don't exist
 * This should be called once on app initialization
 */
export async function ensureRatesExist() {
  const filesExist = await rateFilesExist();

  if (!filesExist) {
    console.log('International rate files not found, triggering sync...');

    try {
      // Build the full URL based on environment
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                     (process.env.NODE_ENV === 'production'
                       ? 'https://internetport.se'
                       : 'http://localhost:3000');

      const response = await fetch(`${baseUrl}/api/mor/sync-rates`);
      const data = await response.json();

      if (data.success) {
        console.log('International rates synced successfully');
        return true;
      } else {
        console.error('Failed to sync international rates:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error triggering rate sync:', error);
      return false;
    }
  }

  return true;
}
