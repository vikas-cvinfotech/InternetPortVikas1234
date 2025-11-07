/**
 * Telephony Addon Configuration
 * Maps addon types to HostBill addon IDs for telephony services
 */

// Get telephony addon mappings from environment variables or fallback to hardcoded values
const getAddonMappings = () => {
  // Try to get individual environment variables first
  const newNumberId = parseInt(process.env.NEXT_PUBLIC_TELEPHONY_NEW_NUMBER_ADDON_ID, 10);
  const portNumberId = parseInt(process.env.NEXT_PUBLIC_TELEPHONY_PORT_NUMBER_ADDON_ID, 10);
  
  if (!isNaN(newNumberId) && !isNaN(portNumberId)) {
    return {
      newNumber: newNumberId,
      portNumber: portNumberId,
    };
  }

  // Try JSON mapping as fallback
  const envMappings = process.env.NEXT_PUBLIC_TELEPHONY_ADDON_MAPPINGS;
  if (envMappings) {
    try {
      return JSON.parse(envMappings);
    } catch (error) {
      console.warn('Failed to parse NEXT_PUBLIC_TELEPHONY_ADDON_MAPPINGS:', error);
    }
  }

  // Auto-detect environment and use appropriate mappings
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.HOSTBILL_API_ENDPOINT?.includes('portal.internetport.com');

  if (isProduction) {
    // Production HostBill addon IDs
    return {
      newNumber: 25, // New Number addon (production ID)
      portNumber: 49, // Port Number addon (production ID)
    };
  } else {
    // Development HostBill addon IDs
    return {
      newNumber: 17, // New Number addon (development ID)
      portNumber: 16, // Port Number addon (development ID)
    };
  }
};

// Addon type to HostBill addon ID mappings
export const telephonyAddonMappings = getAddonMappings();

/**
 * Get the HostBill addon ID for new number addon
 * @returns {number} The HostBill addon ID for new number
 */
export function getNewNumberAddonId() {
  return telephonyAddonMappings.newNumber;
}

/**
 * Get the HostBill addon ID for port number addon
 * @returns {number} The HostBill addon ID for port number
 */
export function getPortNumberAddonId() {
  return telephonyAddonMappings.portNumber;
}

/**
 * Get all telephony addon IDs for the current environment
 * @returns {Array} Array of all telephony addon IDs
 */
export function getAllTelephonyAddonIds() {
  return Object.values(telephonyAddonMappings);
}

/**
 * Determine if an addon ID is for new number
 * @param {number} addonId - The HostBill addon ID
 * @returns {boolean} True if it's a new number addon
 */
export function isNewNumberAddon(addonId) {
  return addonId === telephonyAddonMappings.newNumber;
}

/**
 * Determine if an addon ID is for port number
 * @param {number} addonId - The HostBill addon ID
 * @returns {boolean} True if it's a port number addon
 */
export function isPortNumberAddon(addonId) {
  return addonId === telephonyAddonMappings.portNumber;
}