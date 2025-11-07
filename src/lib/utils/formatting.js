import { sanitizeText } from './sanitization';

/**
 * Formats an address object into a display-friendly string with XSS protection.
 * @param {object} addressDetails - The address object.
 * @returns {string} The formatted and sanitized address string.
 */
export function formatAddressForDisplay(addressDetails) {
  if (!addressDetails) return '';
  const { streetName, streetNumber, streetLittera, mduApartmentNumber, postalCode, city } =
    addressDetails;
  const addressParts = [];
  if (streetName) addressParts.push(sanitizeText(streetName));
  let numberAndLetter = '';
  if (streetNumber) numberAndLetter += sanitizeText(streetNumber);
  if (streetLittera) numberAndLetter += sanitizeText(streetLittera);
  if (numberAndLetter) addressParts.push(numberAndLetter);
  if (mduApartmentNumber) addressParts.push(`LGH ${sanitizeText(mduApartmentNumber).toUpperCase()}`);
  const firstLine = addressParts.join(' ').trim();
  const cityParts = [];
  if (postalCode) cityParts.push(sanitizeText(postalCode));
  if (city) cityParts.push(sanitizeText(city).toUpperCase());
  const secondLine = cityParts.join(' ').trim();
  if (firstLine && secondLine) return `${firstLine}, ${secondLine}`;
  return (firstLine || secondLine || '').trim();
}

/**
 * Extracts the leading number from a string, typically for sorting by speed.
 * @param {string} friendlyname - The string to parse.
 * @returns {number} The extracted speed or 0 if not found.
 */
export function extractSpeed(friendlyname) {
  if (typeof friendlyname !== 'string') return 0;
  const match = friendlyname.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Rounds a price to a whole number.
 * @param {number | string} price - The price to round.
 * @returns {number} The rounded price.
 */
export const roundedPrice = (price) => Number(Math.round(price));

/**
 * Parses a raw address input string and formats it into parameters suitable for an API call.
 *
 * Handles various address formats, including those with street, city, postal code, and apartment numbers (e.g., "lgh").
 * Also supports accessId-based queries if the input starts with a colon.
 *
 * @param {string} rawInputAddress - The raw address input string to parse.
 * @returns {Object} apiParams - The formatted parameters for the API call.
 * @returns {string} apiParams.call - The API method to call (always 'getAddresses').
 * @returns {string} [apiParams.streetName] - The parsed street name.
 * @returns {string} [apiParams.streetNumber] - The parsed street number.
 * @returns {string} [apiParams.streetLittera] - The parsed street letter/littera.
 * @returns {string} [apiParams.mduApartmentNumber] - The parsed apartment number (if present).
 * @returns {string} [apiParams.city] - The parsed city name.
 * @returns {string} [apiParams.postalCode] - The parsed postal code.
 * @returns {string} [apiParams.accessId] - The access ID if provided in the input.
 * @returns {number} apiParams.limit - The maximum number of results to return (default: 1000).
 * @returns {string} apiParams.order - The order of results (default: 'ASC').
 * @returns {string} apiParams.visibleOn - The visibility scope for the API (default: 'internal').
 */
export function parseAddressForApi(rawInputAddress) {
  const trimmedInput = rawInputAddress.trim();
  let streetPart = trimmedInput;
  let cityPart = '';

  if (trimmedInput.includes(',')) {
    const parts = trimmedInput.split(',');
    streetPart = parts[0].trim();
    if (parts.length > 1) {
      cityPart = parts[1].trim();
    }
  } else {
    const lastSpaceIndex = trimmedInput.lastIndexOf(' ');
    if (lastSpaceIndex > 0 && lastSpaceIndex < trimmedInput.length - 1) {
      const potentialStreet = trimmedInput.substring(0, lastSpaceIndex).trim();
      const potentialCity = trimmedInput.substring(lastSpaceIndex + 1).trim();
      if (/^[a-zA-ZÅÄÖåäö\s-]+$/i.test(potentialCity) && /\d/.test(potentialStreet)) {
        streetPart = potentialStreet;
        cityPart = potentialCity;
      }
    }
  }

  const streetNumberRegex = /[^0-9]/g;
  const streetRegex = /\s*\d+\s*[a-zA-Z]?\s*$/;
  const streetLitteraRegex = /[a-zA-ZÅÄÖåäö\-_ ]+[0-9 ]+/g;
  const postalCodeRegex = /[^0-9]/gi;
  const cityRegex = /[^-A-Za-zÅÄÖåäö\s]/gi;

  let mduNumber = '';
  if (streetPart.toLowerCase().includes('lgh')) {
    mduNumber = streetPart
      .toLowerCase()
      .replace(/ /gi, '')
      .replace(/^.+lgh/, '');
    const match = streetPart.match(/^(.*?)[\s,]*lgh/i);
    if (match && match[1]) {
      streetPart = match[1].trim();
    }
  }

  let streetName = streetPart.replace(streetRegex, '').trim();
  const streetNumber = streetPart.replace(streetNumberRegex, '').trim();
  const streetLetter = streetNumber ? streetPart.replace(streetLitteraRegex, '').trim() : '';

  let city = cityPart ? cityPart.replace(cityRegex, '').trim() : '';
  const postalCode = cityPart ? cityPart.replace(postalCodeRegex, '').trim() : '';

  if (
    !city &&
    !streetNumber &&
    /^[a-zA-ZÅÄÖåäö\s-]+$/i.test(streetName) &&
    streetName.split(' ').length <= 2
  ) {
    // Heuristic for when only city might be typed into streetPart.
  }

  let apiParams = {
    call: 'getAddresses',
    streetName: streetName,
    streetNumber: streetNumber,
    streetLittera: streetLetter,
    mduApartmentNumber: mduNumber,
    city: city,
    postalCode: postalCode,
    limit: 1000,
    order: 'ASC',
    visibleOn: 'internal',
  };

  const accessIdParts = trimmedInput.split(':');
  if (Array.isArray(accessIdParts) && accessIdParts.length > 1 && accessIdParts[0].trim() === '') {
    apiParams = {
      call: 'getAddresses',
      accessId: accessIdParts[1].trim(),
      visibleOn: 'internal',
      limit: 1000,
    };
  }
  return apiParams;
}

// Helper function to normalize Swedish Personal Numbers to digit-only format.
export const normalizeSwedishPersonalNumber = (pnr) => (pnr ? pnr.replace(/\D/g, '') : '');

/**
 * Slugifies a string for use in URLs
 * @param {string} text - The text to slugify
 * @returns {string} The slugified text
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[åä]/g, 'a')    // Replace Swedish å,ä with a
    .replace(/ö/g, 'o')       // Replace Swedish ö with o
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
}

/**
 * Generates a URL slug for a broadband address following the existing pattern
 * Example: kungsgatan-5-lgh-1101-66231-amal-15
 * @param {object} address - The address object containing address details
 * @returns {string} The generated slug for the address
 */
export function generateBroadbandAddressSlug(address) {
  if (!address) return '';
  
  const parts = [];
  
  // Add street name and number
  if (address.streetName) {
    parts.push(address.streetName);
  }
  if (address.streetNumber) {
    parts.push(address.streetNumber);
  }
  if (address.streetLittera) {
    parts.push(address.streetLittera);
  }
  
  // Add apartment number if present
  if (address.mduApartmentNumber) {
    parts.push('lgh', address.mduApartmentNumber);
  }
  
  // Add postal code and city
  if (address.postalCode) {
    parts.push(address.postalCode);
  }
  if (address.city) {
    parts.push(address.city);
  }
  
  // Add address ID at the end for uniqueness (this is what the existing system expects)
  if (address.id) {
    parts.push(address.id);
  }
  
  return slugify(parts.join(' '));
}
