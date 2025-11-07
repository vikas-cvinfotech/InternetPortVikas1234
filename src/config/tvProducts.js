/**
 * TV Product Configuration
 * Maps stadsnät to HostBill product IDs for TV services
 */

// Get TV product mappings from environment variables or fallback to hardcoded values
const getProductMappings = () => {
  // Try to get from environment variables first
  const envMappings = process.env.NEXT_PUBLIC_TV_PRODUCT_MAPPINGS;
  if (envMappings) {
    try {
      return JSON.parse(envMappings);
    } catch (error) {
      console.warn('Failed to parse NEXT_PUBLIC_TV_PRODUCT_MAPPINGS:', error);
    }
  }

  // Auto-detect environment and use appropriate mappings
  const isProduction = process.env.NODE_ENV === 'production' || 
                      process.env.HOSTBILL_API_ENDPOINT?.includes('portal.internetport.com');
  
  if (isProduction) {
    // Production HostBill product IDs
    return {
      baspaket: {
        'GlobalConnect': 1491,    // TVPAKET1 Baspaket 1 - Globalconnect
        'OpenInfra': 1494,        // TVPAKET1 Baspaket 1 - OpenInfra, Zitius, TÖF
        'Zitius': 1494,           // TVPAKET1 Baspaket 1 - OpenInfra, Zitius, TÖF  
        'TÖF': 1494,              // TVPAKET1 Baspaket 1 - OpenInfra, Zitius, TÖF
        'Servanet': 1496,         // TVPAKET1 Baspaket 1 - Servanet
        'Default': 1489,          // TVPAKET1 Baspaket 1 - Övriga nät
      },
      'baspaket-plus': {
        'GlobalConnect': 1493,    // TVPAKET2 Baspaket 2 - Globalconnect
        'OpenInfra': 1495,        // TVPAKET2 Baspaket 2 - OpenInfra, Zitius, TÖF
        'Zitius': 1495,           // TVPAKET2 Baspaket 2 - OpenInfra, Zitius, TÖF
        'TÖF': 1495,              // TVPAKET2 Baspaket 2 - OpenInfra, Zitius, TÖF
        'Servanet': 1497,         // TVPAKET2 Baspaket 2 - Servanet
        'Default': 1490,          // TVPAKET2 Baspaket 2 - Övriga nät
      }
    };
  } else {
    // Development HostBill product IDs
    return {
      baspaket: {
        'GlobalConnect': 27,      // TVPAKET1 Baspaket 1 - Globalconnect
        'OpenInfra': 38,          // TVPAKET1 Baspaket 1 - OpenInfra, Zitius, TÖF
        'Zitius': 38,             // TVPAKET1 Baspaket 1 - OpenInfra, Zitius, TÖF  
        'TÖF': 38,                // TVPAKET1 Baspaket 1 - OpenInfra, Zitius, TÖF
        'Servanet': 40,           // TVPAKET1 Baspaket 1 - Servanet
        'Default': 34,            // TVPAKET1 Baspaket 1 - Övriga nät
      },
      'baspaket-plus': {
        'GlobalConnect': 37,      // TVPAKET2 Baspaket 2 - Globalconnect
        'OpenInfra': 39,          // TVPAKET2 Baspaket 2 - OpenInfra, Zitius, TÖF
        'Zitius': 39,             // TVPAKET2 Baspaket 2 - OpenInfra, Zitius, TÖF
        'TÖF': 39,                // TVPAKET2 Baspaket 2 - OpenInfra, Zitius, TÖF
        'Servanet': 41,           // TVPAKET2 Baspaket 2 - Servanet
        'Default': 35,            // TVPAKET2 Baspaket 2 - Övriga nät
      }
    };
  }
};

// Stadsnät to HostBill product ID mappings
export const tvProductMappings = getProductMappings();

// Available stadsnät options - based on actual HostBill product mappings
export const availableStadsnat = [
  { value: 'GlobalConnect', label: 'Global Connect' },
  { value: 'OpenInfra', label: 'Open Infra' },
  { value: 'Zitius', label: 'Zitius' },
  { value: 'TÖF', label: 'TÖF' },
  { value: 'Servanet', label: 'Servanet' },
  { value: 'Default', label: 'Övriga nät' },
];

// All stadsnät that fall under "Övriga nät" (Default)
export const ovrigaStadsnat = [
  { value: 'OpenUniverse', label: 'Open Universe' },
  { value: 'Fibra', label: 'Fibra' },
  { value: 'Fiberstaden', label: 'Fiberstaden' },
  { value: 'Kurbit', label: 'Kurbit' },
  { value: 'Utsikt Bredband', label: 'Utsikt Bredband' },
  { value: 'Citynätet i Nässjö', label: 'Citynätet i Nässjö' },
  { value: 'Gävle Energi - Gavlenet', label: 'Gävle Energi - Gavlenet' },
  { value: 'Lycksele stadsnät', label: 'Lycksele stadsnät' },
  { value: 'Malå stadsnät', label: 'Malå stadsnät' },
  { value: 'Mediateknik - Kramfors', label: 'Mediateknik - Kramfors' },
  { value: 'Marknet', label: 'Marknet' },
  { value: 'Mittnät - Åmål stadsnät', label: 'Mittnät - Åmål stadsnät' },
  { value: 'Mittnät - Forshaga stadsnät', label: 'Mittnät - Forshaga stadsnät' },
  { value: 'Mittnät - Karlstads stadsnät', label: 'Mittnät - Karlstad stadsnät' },
  { value: 'Mittnät - Kils stadsnät', label: 'Mittnät - Kil stadsnät' },
  { value: 'Mittnät - Munkfors stadsnät', label: 'Mittnät - Munkfors stadsnät' },
  { value: 'Njudung Energi - Vetlanda', label: 'Njudung Energi - Vetlanda' },
  { value: 'Norsjö stadsnät', label: 'Norsjö stadsnät' },
  { value: 'Openbit', label: 'Openbit' },
  { value: 'Sollefteå stadsnät', label: 'Sollefteå stadsnät' },
  { value: 'Splitvision - Borås', label: 'Splitvision - Borås' },
  { value: 'Storuman stadsnät', label: 'Storuman stadsnät' },
  { value: 'Sundbybergs stadsnät', label: 'Sundbyberg stadsnät' },
  { value: 'Trollhättan Energi', label: 'Trollhättan Energi' },
  { value: 'Umeo Energi - UmeNet', label: 'Umeo Energi - UmeNet' },
  { value: 'Varberg Energi', label: 'Varberg Energi' },
  { value: 'Wetternet', label: 'Wetternet' },
  { value: 'Wexnet', label: 'Wexnet' },
];

/**
 * Get the HostBill product ID for a specific TV service and stadsnät
 * @param {string} serviceType - 'baspaket' or 'baspaket-plus'
 * @param {string} stadsnat - The selected stadsnät
 * @returns {number|null} The HostBill product ID or null if not found
 */
export function getTvProductId(serviceType, stadsnat) {
  const mappings = tvProductMappings[serviceType];
  if (!mappings) return null;
  
  // Try exact match first
  if (mappings[stadsnat]) {
    return mappings[stadsnat];
  }
  
  // Check if this stadsnät is in the "Övriga nät" list
  const isOvrigaStadsnat = ovrigaStadsnat.some(option => option.value === stadsnat);
  if (isOvrigaStadsnat) {
    return mappings['Default'] || null;
  }
  
  // Fallback to default
  return mappings['Default'] || null;
}

/**
 * Determine TV service type from URL slug
 * @param {string} slug - The product slug from URL
 * @returns {string} 'baspaket' or 'baspaket-plus'
 */
export function getTvServiceType(slug) {
  const lowerSlug = slug.toLowerCase();
  
  if (lowerSlug.includes('baspaket-plus') || lowerSlug.includes('baspaket+')) {
    return 'baspaket-plus';
  }
  
  if (lowerSlug.includes('baspaket')) {
    return 'baspaket';
  }
  
  // Default to baspaket if unclear
  return 'baspaket';
}

/**
 * Get all TV service product IDs for the current environment
 * @returns {Array} Array of all TV service product IDs
 */
export function getAllTvServiceProductIds() {
  const mappings = tvProductMappings;
  const allIds = new Set();
  
  // Collect all product IDs from both baspaket and baspaket-plus
  Object.values(mappings.baspaket || {}).forEach(id => allIds.add(id));
  Object.values(mappings['baspaket-plus'] || {}).forEach(id => allIds.add(id));
  
  return Array.from(allIds);
}

/**
 * Determine service type from HostBill product ID
 * @param {number} productId - The HostBill product ID
 * @returns {string|null} 'baspaket', 'baspaket-plus', or null if not found
 */
export function getServiceTypeFromProductId(productId) {
  const mappings = tvProductMappings;
  
  // Check baspaket mappings
  for (const [_, id] of Object.entries(mappings.baspaket || {})) {
    if (id === productId) {
      return 'baspaket';
    }
  }
  
  // Check baspaket-plus mappings
  for (const [_, id] of Object.entries(mappings['baspaket-plus'] || {})) {
    if (id === productId) {
      return 'baspaket-plus';
    }
  }
  
  return null;
}