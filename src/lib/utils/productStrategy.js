/**
 * Product Strategy Selection Utility
 * 
 * This utility determines which product strategy to use based on:
 * 1. Category type
 * 2. Product ID (for router detection)
 * 3. Product data characteristics
 */

// Router product IDs from environment variable
const getRouterProductIds = () => {
  return new Set(
    (process.env.NEXT_PUBLIC_ROUTER_PRODUCT_IDS || '')
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id))
  );
};

// TV box product IDs from environment variable
const getTvBoxProductIds = () => {
  return new Set(
    (process.env.NEXT_PUBLIC_TV_BOXES_IDS || '')
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id))
  );
};

/**
 * Extract product ID from various slug formats
 * @param {string} productSlugWithId - The product slug with ID (e.g., "product-name-123", "router-15", or "address-456")
 * @returns {number|null} - The extracted product ID or null if not found
 */
export function extractProductIdFromSlug(productSlugWithId) {
  if (!productSlugWithId) return null;
  
  const parts = productSlugWithId.split('-');
  const lastPart = parts[parts.length - 1];
  const id = parseInt(lastPart, 10);
  
  return isNaN(id) ? null : id;
}

/**
 * Determine if a slug explicitly indicates a router product
 * @param {string} productSlugWithId - The product slug with ID
 * @returns {boolean} - True if the slug pattern indicates a router
 */
export function isExplicitRouterSlug(productSlugWithId) {
  if (!productSlugWithId) return false;
  
  // Check for explicit router patterns like "router-15", "wifi-router-15", "internetport-router-15", etc.
  const lowerSlug = productSlugWithId.toLowerCase();
  return lowerSlug.includes('router-') || lowerSlug.startsWith('router-');
}

/**
 * Determine if a slug explicitly indicates an address-based service
 * @param {string} productSlugWithId - The product slug with ID
 * @returns {boolean} - True if the slug pattern indicates an address service
 */
export function isExplicitAddressSlug(productSlugWithId) {
  if (!productSlugWithId) return false;
  
  // For the clean approach, we don't use address prefixes
  // Address detection is handled by exclusion (not router = address)
  return false;
}

/**
 * Determine if a product is a router based on product ID
 * @param {number} productId - The product ID to check
 * @returns {boolean} - True if the product is a router
 */
export function isRouterProduct(productId) {
  if (!productId) return false;
  const routerProductIds = getRouterProductIds();
  return routerProductIds.has(productId);
}

/**
 * Determine if a product is a TV box based on product ID
 * @param {number} productId - The product ID to check
 * @returns {boolean} - True if the product is a TV box
 */
export function isTvBoxProduct(productId) {
  if (!productId) return false;
  const tvBoxProductIds = getTvBoxProductIds();
  return tvBoxProductIds.has(productId);
}

/**
 * Determine if a slug represents an address-based broadband service
 * @param {string} productSlugWithId - The product slug with ID
 * @returns {boolean} - True if this appears to be an address-based service
 */
export function isAddressBasedBroadbandService(productSlugWithId) {
  if (!productSlugWithId) return false;
  
  // Address-based services typically have longer slugs with address information
  // and the ID at the end represents an address ID, not a product ID
  const productId = extractProductIdFromSlug(productSlugWithId);
  
  // If we can't extract a valid product ID, or if it's not in our router list,
  // and we're in the broadband category, it's likely an address-based service
  return productId !== null && !isRouterProduct(productId);
}

/**
 * Determine the appropriate product strategy type
 * @param {string} categorySlug - The category slug (e.g., 'bredband', 'vpn', etc.)
 * @param {string} productSlugWithId - The product slug with ID
 * @param {object} productData - Optional product data for additional context
 * @returns {string} - The strategy type ('standard', 'broadband-service', 'tv', 'telephony')
 */
export function determineProductStrategy(categorySlug, productSlugWithId, productData = null) {
  // Handle broadband category with two scenarios
  if (categorySlug === 'bredband') {
    // Priority 1: Check for router prefix (only way to access router products)
    if (isExplicitRouterSlug(productSlugWithId)) {
      return 'standard'; // router-15, router-16, router-26
    }
    
    // Priority 2: Everything else = broadband service (millions of addresses)
    // This includes any URL that doesn't have the router- prefix
    return 'broadband-service';
  }
  
  // Handle TV category with hardware/service distinction
  if (categorySlug === 'tv') {
    const productId = extractProductIdFromSlug(productSlugWithId);
    if (productId && isTvBoxProduct(productId)) {
      return 'standard'; // TV boxes are standard products
    }
    return 'tv-service'; // TV services need special stadsnät handling
  }
  
  // Handle telephony category with service/hardware distinction  
  if (categorySlug === 'telefoni') {
    // Check if this is the special IP telephony service URL
    if (productSlugWithId === 'ip-telefoni') {
      return 'telephony';
    }
    // Otherwise, it's telephony hardware (standard product)
    return 'standard';
  }
  
  // Handle other categories
  switch (categorySlug) {
    case 'vpn':
    case 'natverksprodukter':
    default:
      return 'standard';
  }
}

/**
 * Check if a product requires address-based data loading
 * @param {string} strategyType - The determined strategy type
 * @returns {boolean} - True if address data is needed
 */
export function requiresAddressData(strategyType) {
  return strategyType === 'broadband-service';
}