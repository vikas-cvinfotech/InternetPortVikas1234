/**
 * Telephony Product Configuration
 * Maps product types to HostBill product IDs for telephony services
 */

// Get telephony product mappings from environment variables or fallback to hardcoded values
const getProductMappings = () => {
  // Try to get individual environment variables first
  const standardServiceId = parseInt(process.env.NEXT_PUBLIC_TELEPHONY_STANDARD_SERVICE_ID, 10);
  const retailServiceId = parseInt(process.env.NEXT_PUBLIC_TELEPHONY_RETAIL_SERVICE_ID, 10);
  const gigasetHardwareId = parseInt(process.env.NEXT_PUBLIC_TELEPHONY_GIGASET_HARDWARE_ID, 10);
  const grandstreamHardwareId = parseInt(process.env.NEXT_PUBLIC_TELEPHONY_GRANDSTREAM_HARDWARE_ID, 10);
  
  // Get monthly bound hardware IDs
  const monthlyBoundHardwareIds = (process.env.NEXT_PUBLIC_TELEPHONY_MONTHLY_BOUND_HARDWARE_IDS || '')
    .split(',')
    .map(id => parseInt(id.trim(), 10))
    .filter(id => !isNaN(id));
  
  if (!isNaN(standardServiceId) && !isNaN(retailServiceId) && !isNaN(gigasetHardwareId) && !isNaN(grandstreamHardwareId)) {
    return {
      services: {
        standard: standardServiceId,
        retail: retailServiceId,
      },
      hardware: {
        gigaset: gigasetHardwareId,
        grandstream: grandstreamHardwareId,
        // Add monthly bound hardware IDs dynamically
        ...monthlyBoundHardwareIds.reduce((acc, id, index) => {
          acc[`monthlyBound${index + 1}`] = id;
          return acc;
        }, {}),
      },
    };
  }

  // Try JSON mapping as fallback
  const envMappings = process.env.NEXT_PUBLIC_TELEPHONY_PRODUCT_MAPPINGS;
  if (envMappings) {
    try {
      return JSON.parse(envMappings);
    } catch (error) {
      console.warn('Failed to parse NEXT_PUBLIC_TELEPHONY_PRODUCT_MAPPINGS:', error);
    }
  }

  // Auto-detect environment and use appropriate mappings as last resort
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.HOSTBILL_API_ENDPOINT?.includes('portal.internetport.com');

  // Fallback configuration when individual env variables aren't available
  // These should still use env variables if possible
  const fallbackStandardId = standardServiceId || 6;
  const fallbackRetailId = retailServiceId || 47;
  const fallbackGigasetId = gigasetHardwareId || 32;
  const fallbackGrandstreamId = grandstreamHardwareId || 48;
  
  if (isProduction) {
    // Production HostBill product IDs (uses env variables or fallbacks)
    return {
      services: {
        standard: fallbackStandardId,
        retail: fallbackRetailId,
      },
      hardware: {
        gigaset: fallbackGigasetId,
        grandstream: fallbackGrandstreamId,
        // Add monthly bound hardware IDs dynamically from env
        ...monthlyBoundHardwareIds.reduce((acc, id, index) => {
          acc[`monthlyBound${index + 1}`] = id;
          return acc;
        }, {}),
      },
    };
  } else {
    // Development HostBill product IDs (uses env variables or fallbacks)
    return {
      services: {
        standard: fallbackStandardId,
        retail: fallbackRetailId,
      },
      hardware: {
        gigaset: fallbackGigasetId,
        grandstream: fallbackGrandstreamId,
        // Add monthly bound hardware IDs dynamically from env
        ...monthlyBoundHardwareIds.reduce((acc, id, index) => {
          acc[`monthlyBound${index + 1}`] = id;
          return acc;
        }, {}),
      },
    };
  }
};

// Service type to HostBill product ID mappings
export const telephonyProductMappings = getProductMappings();

// Available telephony service types
export const telephonyServiceTypes = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Only through telephone box',
    productId: telephonyProductMappings.services.standard,
    requiresEquipment: true,
  },
  {
    id: 'retail',
    name: 'Retail',
    description: 'Both telephone box and mobile app',
    productId: telephonyProductMappings.services.retail,
    requiresEquipment: false,
  },
];

// Available telephony hardware options
export const telephonyHardwareOptions = [
  {
    id: 'gigaset',
    name: 'Gigaset A690 IP',
    productId: telephonyProductMappings.hardware.gigaset,
    description: 'Professional IP telephone with display',
  },
  {
    id: 'grandstream',
    name: 'Grandstream HT801 ATA-box',
    productId: telephonyProductMappings.hardware.grandstream,
    description: 'Connect regular telephone to IP network',
  },
];

// Phone number options
export const phoneNumberOptions = [
  {
    id: 'keep',
    label: 'Keep my existing number',
    requiresPhoneNumber: true,
    requiresAreaCode: false,
  },
  {
    id: 'new',
    label: 'Get a new number',
    requiresPhoneNumber: false,
    requiresAreaCode: true,
  },
];

// Swedish area codes
export const swedishAreaCodes = [
  { value: '08', label: '08 - Stockholm' },
  { value: '031', label: '031 - Göteborg' },
  { value: '040', label: '040 - Malmö' },
  { value: '013', label: '013 - Linköping' },
  { value: '019', label: '019 - Örebro' },
  { value: '021', label: '021 - Västerås' },
  { value: '023', label: '023 - Falun' },
  { value: '026', label: '026 - Gävle' },
  { value: '033', label: '033 - Borås' },
  { value: '035', label: '035 - Halmstad' },
  { value: '036', label: '036 - Jönköping' },
  { value: '042', label: '042 - Helsingborg' },
  { value: '044', label: '044 - Kristianstad' },
  { value: '046', label: '046 - Lund' },
  { value: '054', label: '054 - Karlstad' },
  { value: '060', label: '060 - Sundsvall' },
  { value: '063', label: '063 - Östersund' },
  { value: '090', label: '090 - Umeå' },
  { value: '0920', label: '0920 - Kiruna' },
];

/**
 * Get the HostBill product ID for a telephony service type
 * @param {string} serviceType - 'standard' or 'retail'
 * @returns {number|null} The HostBill product ID or null if not found
 */
export function getTelephonyServiceId(serviceType) {
  return telephonyProductMappings.services[serviceType] || null;
}

/**
 * Get the HostBill product ID for telephony hardware
 * @param {string} hardwareType - 'gigaset' or 'grandstream'
 * @returns {number|null} The HostBill product ID or null if not found
 */
export function getTelephonyHardwareId(hardwareType) {
  return telephonyProductMappings.hardware[hardwareType] || null;
}

/**
 * Get all telephony service product IDs for the current environment
 * @returns {Array} Array of all telephony service product IDs
 */
export function getAllTelephonyServiceProductIds() {
  return Object.values(telephonyProductMappings.services);
}

/**
 * Get all telephony hardware product IDs for the current environment
 * @returns {Array} Array of all telephony hardware product IDs
 */
export function getAllTelephonyHardwareProductIds() {
  return Object.values(telephonyProductMappings.hardware);
}

/**
 * Determine if a product ID is a telephony service
 * @param {number} productId - The HostBill product ID
 * @returns {boolean} True if it's a telephony service
 */
export function isTelephonyService(productId) {
  return getAllTelephonyServiceProductIds().includes(productId);
}

/**
 * Determine if a product ID is telephony hardware
 * @param {number} productId - The HostBill product ID
 * @returns {boolean} True if it's telephony hardware
 */
export function isTelephonyHardware(productId) {
  return getAllTelephonyHardwareProductIds().includes(productId);
}

/**
 * Determine if a product ID is monthly bound telephony hardware
 * @param {number} productId - The HostBill product ID
 * @returns {boolean} True if it's monthly bound telephony hardware
 */
export function isTelephonyMonthlyBoundHardware(productId) {
  const monthlyBoundHardwareIds = (process.env.NEXT_PUBLIC_TELEPHONY_MONTHLY_BOUND_HARDWARE_IDS || '')
    .split(',')
    .map(id => parseInt(id.trim(), 10))
    .filter(id => !isNaN(id));
  
  return monthlyBoundHardwareIds.includes(productId);
}
