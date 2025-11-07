// HostBill API Service Layer
import redis from './redis.js';

const HOSTBILL_CONFIG = {
  baseUrl:
    process.env.HOSTBILL_API_ENDPOINT ||
    process.env.HOSTBILL_API_URL ||
    'https://devs.internetport.com/admin/api.php',
  apiId: process.env.HOSTBILL_API_ID,
  apiKey: process.env.HOSTBILL_API_KEY,
};

// Cache configuration using environment variable for consistency
const getCurrentTTL = () => {
  return parseInt(process.env.CACHE_VALIDITY_SECONDS, 10) || 3600;
};

/**
 * Cache wrapper for API responses
 */
async function withCache(key, fetchFn, ttl = getCurrentTTL()) {
  try {
    // Check if Redis is available before trying to use it
    if (!redis || redis.status !== 'ready') {
      return await fetchFn();
    }

    // Try to get from cache first
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    // If not in cache, fetch the data
    const data = await fetchFn();

    // Store in cache
    await redis.setex(key, ttl, JSON.stringify(data));

    return data;
  } catch (error) {
    // Silently fall back to direct fetch if cache fails
    return await fetchFn();
  }
}

/**
 * Make authenticated request to HostBill API
 */
export async function hostBillRequest(call, params = {}) {
  try {
    const formData = new FormData();
    formData.append('api_id', HOSTBILL_CONFIG.apiId);
    formData.append('api_key', HOSTBILL_CONFIG.apiKey);
    formData.append('call', call);

    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // PERFORMANCE FIX: Add 10-second timeout to prevent 17+ second LCP delays
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), 10000); // 10 second timeout

    const cacheValiditySeconds = parseInt(process.env.CACHE_VALIDITY_SECONDS, 10) || 3600;

    const response = await fetch(HOSTBILL_CONFIG.baseUrl, {
      method: 'POST',
      body: formData,
      signal: timeoutController.signal,
      next: { revalidate: cacheValiditySeconds },
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!data.success) {
      // Construct a more informative error message
      let errorMessage = 'Unknown error';
      if (Array.isArray(data.error)) {
        errorMessage = data.error.join(', ');
      } else if (typeof data.error === 'string') {
        errorMessage = data.error;
      } else if (typeof data.error === 'object' && data.error !== null) {
        errorMessage = JSON.stringify(data.error);
      }

      throw new Error(`HostBill API Error: ${errorMessage}`);
    }

    return data;
  } catch (error) {
    // PERFORMANCE FIX: Handle timeout errors specifically
    if (error.name === 'AbortError') {
      console.error('HostBill API Request Timeout (>10s):', call, params);
      throw new Error(`HostBill API timeout: Request took longer than 10 seconds`);
    }
    
    console.error('HostBill API Request Failed:', error);
    throw error;
  }
}

/**
 * Extract custom field value from HostBill product configoptions
 */
function getCustomFieldValue(product, fieldName) {
  if (!product.configoptions) {
    return null;
  }

  try {
    // Find field by name since IDs are auto-generated
    const field = Object.values(product.configoptions).find((option) => option.name === fieldName);

    if (!field || !field.config || !field.config.initialval) {
      return null;
    }

    // Parse JSON string to actual data
    return JSON.parse(field.config.initialval);
  } catch (error) {
    console.error(`❌ Failed to parse custom field "${fieldName}":`, error);
    console.error('Raw initialval:', field?.config?.initialval);
    return null;
  }
}

/**
 * Transform HostBill product to our component format
 */
function transformProduct(hostBillProduct) {
  const product = hostBillProduct.product || hostBillProduct;

  // Extract pricing options (Monthly and Quarterly)
  const pricingOptions = [];

  // Monthly pricing
  if (product.m && parseFloat(product.m) > 0) {
    pricingOptions.push({
      period: 'monthly',
      labelKey: 'pricing.monthly',
      price: parseFloat(product.m),
      setupFee: product.m_setup ? parseFloat(product.m_setup) : 0,
    });
  }

  // Quarterly pricing
  if (product.q && parseFloat(product.q) > 0) {
    pricingOptions.push({
      period: 'quarterly',
      labelKey: 'pricing.quarterly',
      price: parseFloat(product.q),
      setupFee: product.q_setup ? parseFloat(product.q_setup) : 0,
    });
  }

  // Fallback pricing logic for display (prefer monthly)
  let price = null;
  let ctaLabelKey = 'cta.contactUs';

  if (pricingOptions.length > 0) {
    const defaultOption =
      pricingOptions.find((opt) => opt.period === 'monthly') || pricingOptions[0];
    price = defaultOption.price;
    ctaLabelKey = 'cta.addToCart';
  } else if (product.a && parseFloat(product.a) > 0) {
    price = parseFloat(product.a);
    ctaLabelKey = 'cta.addToCart';
  } else if (product.m_setup && parseFloat(product.m_setup) > 0) {
    pricingOptions.push({
      period: 'monthly',
      labelKey: 'pricing.oneTimeFee',
      price: 0,
      setupFee: parseFloat(product.m_setup),
    });

    price = parseFloat(product.m_setup);
    ctaLabelKey = 'cta.addToCart';
  }

  // Extract custom field data
  const customImages = getCustomFieldValue(product, 'imageUrlArray');
  const customFeatures = getCustomFieldValue(product, 'featuresArray');
  const customPhoneOptions = getCustomFieldValue(product, 'phoneOptionsArray');

  // Transform images from custom field
  const images =
    customImages && Array.isArray(customImages)
      ? customImages.map((url, index) => ({
          id: index + 1,
          src: url,
          alt: `${product.name} image ${index + 1}`,
        }))
      : []; // Empty array if no custom images

  // Transform features from custom field
  const bullets =
    customFeatures && Array.isArray(customFeatures)
      ? customFeatures.filter((feature) => feature && feature.trim()) // Remove empty features
      : []; // Empty array if no custom features

  // Transform phone options from custom field
  // Expected structure in HostBill custom field 'phoneOptionsArray':
  // [
  //   {
  //     "value": "keep-current",
  //     "label": "Behåll befintligt nummer",
  //     "setupFee": 295,
  //     "monthlyFee": 0,
  //     "requiresInput": true,
  //     "inputPlaceholder": "Ange ditt nuvarande nummer"
  //   },
  //   {
  //     "value": "new-number",
  //     "label": "Nytt nummer",
  //     "setupFee": 0,
  //     "monthlyFee": 29,
  //     "requiresInput": false
  //   }
  // ]
  let phoneOptions =
    customPhoneOptions && Array.isArray(customPhoneOptions)
      ? customPhoneOptions.filter((option) => option && option.value && option.label) // Remove invalid options
      : []; // Empty array if no phone options

  // Determine image type based on file extension
  const firstImage = images[0];
  const imageType = firstImage && firstImage.src.includes('.svg') ? 'logo' : 'photo';

  const description = product.description || '';

  // Basic transformation
  const transformed = {
    id: product.id,
    name: product.name,
    price: price,
    description: description,
    categorySlug: product.slug,
    categoryName: product.category_name,
    ctaLabelKey: ctaLabelKey,

    // Add pricing options
    pricingOptions: pricingOptions,

    // Use custom field data
    images: images,
    bullets: bullets,
    phoneOptions: phoneOptions,

    // Handle setup fees
    setupFee:
      product.m_setup && parseFloat(product.m_setup) > 0
        ? `${parseFloat(product.m_setup)} kr setup`
        : null,

    // Add imageType based on file extension (SVG = logo, others = photo)
    imageType: imageType,

    // Add flag to indicate if using custom fields
    hasRealContent: images.length > 0 || bullets.length > 0,

    // Preserve campaign pricing fields for enhanced display
    m_price: product.m,
    m_campaign_price: product.m_campaign_price,
    m_campaign_length: product.m_campaign_length,
    s_price: product.s,
    s_campaign_price: product.s_campaign_price,
    
    // Preserve setup pricing fields for one-time products
    m_setup: product.m_setup,
    s_setup: product.s_setup,
    
    // Preserve payment type for pricing logic
    paytype: product.paytype,
  };

  return transformed;
}

/**
 * Get single product details
 */
export async function getProduct(productId, languageId = null) {
  const cacheKey = `product:${productId}:${languageId || 'default'}`;

  return await withCache(cacheKey, async () => {
    const params = { id: productId };
    if (languageId) {
      params.language_id = languageId;
    }

    const response = await hostBillRequest('getProductDetails', params);

    // Check if we got a valid product response
    if (!response || !response.product) {
      throw new Error(`Product ${productId} not found or invalid response structure`);
    }

    // Merge product with config for transformation
    const productWithConfig = {
      ...response.product,
      configoptions: response.config || {},
    };

    return transformProduct(productWithConfig);
  });
}

/**
 * Get multiple products by their IDs (optimized for product listings)
 * PERFORMANCE: Fetches only specified products instead of entire category
 *
 * @param {Array<number|string>} productIds - Array of product IDs to fetch
 * @param {string|null} languageId - Language ID for translations
 * @param {string} categorySlug - Category slug for enrichment
 * @returns {Promise<Array>} Array of transformed products
 */
export async function getProductsByIds(productIds, languageId = null, categorySlug = null) {
  // Create cache key based on sorted IDs to ensure consistent caching
  const sortedIds = [...productIds].sort().join(',');
  const cacheKey = `products:ids:${sortedIds}:${languageId || 'default'}`;

  return await withCache(cacheKey, async () => {
    try {
      // Fetch all products in parallel using Promise.all
      const productDetailsPromises = productIds.map(async (productId) => {
        try {
          const params = { id: productId.toString() };
          if (languageId) {
            params.language_id = languageId;
          }

          const detailResponse = await hostBillRequest('getProductDetails', params);

          if (!detailResponse || !detailResponse.product) {
            console.warn(`Product ${productId} not found or invalid response`);
            return null;
          }

          // Merge product with config for transformation
          const productWithConfig = {
            ...detailResponse.product,
            configoptions: detailResponse.config || {},
          };

          // Enrich with category info if provided
          if (categorySlug) {
            productWithConfig.category_name = getCategoryName(categorySlug);
            productWithConfig.slug = categorySlug;
          }

          return transformProduct(productWithConfig);
        } catch (error) {
          console.error(`Failed to fetch product ${productId}:`, error);
          return null; // Return null for failed fetches, filter out later
        }
      });

      // Wait for all products to be fetched
      const products = await Promise.all(productDetailsPromises);

      // Filter out null results (failed fetches)
      return products.filter(Boolean);
    } catch (error) {
      console.error('Failed to fetch products by IDs:', error);
      return [];
    }
  });
}

// Orderpage ID mapping for categories using environment variables
const ORDERPAGE_MAPPING = {
  vpn: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_SECURITY, 10), // VPN = säkerhet category
  natverksprodukter: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_BROADBAND, 10),
  telefoni: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_TELEPHONY, 10),
  // New categories from products listing feature
  sakerhet: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_SECURITY, 10), // Security category (same as VPN)
  bredband: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_BROADBAND, 10),
  tv: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_TV, 10),
  hosting: 0,    // Hosting category (might redirect externally)
};

/**
 * Get products by category using orderpage IDs
 */
export async function getProductsByCategory(categorySlug, languageId = null) {
  const cacheKey = `products:${categorySlug}:${languageId || 'default'}`;

  return await withCache(cacheKey, async () => {
    const orderpageId = ORDERPAGE_MAPPING[categorySlug];

    if (!orderpageId) {
      console.warn(`No orderpage mapping found for category: ${categorySlug}`);
      return [];
    }

    try {
      const params = {
        id: orderpageId,
        visible: 1, // Only visible products
      };

      if (languageId) {
        params.language_id = languageId;
      }

      const response = await hostBillRequest('getProducts', params);

      // Transform HostBill products to our format
      const products = response.products || {};
      const transformedProducts = [];

      // Fetch detailed product information for each product to get config options
      const productDetailsPromises = Object.values(products).map(async (product) => {
        try {
          // Get detailed product info including config options
          const detailsParams = { id: product.id };
          if (languageId) {
            detailsParams.language_id = languageId;
          }
          const detailResponse = await hostBillRequest('getProductDetails', detailsParams);

          // Merge the basic product info with detailed config options
          const productWithConfig = {
            ...product,
            ...detailResponse.product,
            configoptions: detailResponse.config || {},
          };

          // Enrich product with category info
          const enrichedProduct = {
            ...productWithConfig,
            category_name: getCategoryName(categorySlug),
            slug: categorySlug,
          };

          return transformProduct(enrichedProduct);
        } catch (error) {
          console.error(`Failed to fetch details for product ${product.id}:`, error);

          // Fallback to basic product info if detailed fetch fails
          const enrichedProduct = {
            ...product,
            category_name: getCategoryName(categorySlug),
            slug: categorySlug,
          };

          return transformProduct({ product: enrichedProduct });
        }
      });

      // Wait for all product details to be fetched
      const detailedProducts = await Promise.all(productDetailsPromises);
      transformedProducts.push(...detailedProducts);

      return transformedProducts;
    } catch (error) {
      console.error(`Failed to get products for category ${categorySlug}:`, error);
      return [];
    }
  });
}

/**
 * Helper function to get category display name
 */
function getCategoryName(categorySlug) {
  const categoryNames = {
    vpn: 'VPN',
    natverksprodukter: 'Nätverksprodukter',
    telefoni: 'Telefoni',
    // New categories from products listing feature
    sakerhet: 'Säkerhet',
    bredband: 'Bredband',
    tv: 'TV',
    hosting: 'Hosting',
  };
  return categoryNames[categorySlug] || categorySlug;
}

/**
 * Get applicable addons for a product
 */
export async function getProductApplicableAddons(productId, languageId = null) {
  const cacheKey = `product-addons-${productId}-${languageId || 'default'}`;
  
  return await withCache(cacheKey, async () => {
    try {
      const params = { id: productId.toString() };
      if (languageId) {
        params.language_id = languageId.toString();
      }
      
      const response = await hostBillRequest('getProductApplicableAddons', params);
      
      // Handle different possible response structures
      let addons = [];
      if (response.addons && response.addons.addons && Array.isArray(response.addons.addons)) {
        // HostBill returns nested structure: response.addons.addons
        addons = response.addons.addons.filter(addon => addon.assigned === true || addon.assigned === 'true');
      } else if (Array.isArray(response.addons)) {
        addons = response.addons.filter(addon => addon.assigned === true || addon.assigned === 'true');
      } else if (Array.isArray(response)) {
        addons = response.filter(addon => addon.assigned === true || addon.assigned === 'true');
      } else if (response.products && Array.isArray(response.products)) {
        addons = response.products.filter(addon => addon.assigned === true || addon.assigned === 'true');
      }
      
      
      // Fetch detailed information for each addon to get pricing
      const detailedAddons = await Promise.all(
        addons.map(async (addon) => {
          try {
            // Fetch addon details to get pricing information
            const detailsParams = { id: addon.id.toString() };
            if (languageId) {
              detailsParams.language_id = languageId.toString();
            }
            
            const detailsResponse = await hostBillRequest('getAddonDetails', detailsParams);
            
            if (detailsResponse.addon) {
              const addonDetails = detailsResponse.addon;
              return {
                id: parseInt(addon.id),
                name: addon.name || addonDetails.name,
                description: addonDetails.description || addon.description || '',
                m_price: addonDetails.m || addonDetails.m_price || addon.m || addon.m_price || '0.00',
                s_price: addonDetails.m_setup || addonDetails.s_price || addon.s_setup || addon.s_price || '0.00',
                paytype: addonDetails.paytype || addon.paytype || 'Regular',
                assigned: addon.assigned
              };
            }
          } catch (error) {
            console.error(`Failed to fetch details for addon ${addon.id}:`, error);
          }
          
          // Fallback to basic addon info if details fetch fails
          return {
            id: parseInt(addon.id),
            name: addon.name,
            description: addon.description || '',
            m_price: addon.m || addon.m_price || addon.monthly || '0.00',
            s_price: addon.s_setup || addon.s_price || addon.setup || '0.00',
            paytype: addon.paytype || 'Regular',
            assigned: addon.assigned
          };
        })
      );
      
      return {
        success: true,
        addons: detailedAddons.filter(Boolean) // Remove any null results
      };
    } catch (error) {
      console.error('Error in getProductApplicableAddons:', error);
      // Return empty addons array instead of failing completely
      return {
        success: true,
        addons: []
      };
    }
  });
}

/**
 * Get detailed information for a specific addon
 */
export async function getAddonDetails(addonId, languageId = null) {
  const cacheKey = `addon-details-${addonId}-${languageId || 'default'}`;
  
  return await withCache(cacheKey, async () => {
    try {
      const params = { id: addonId.toString() };
      if (languageId) {
        params.language_id = languageId.toString();
      }
      
      const response = await hostBillRequest('getAddonDetails', params);
      
      return {
        success: true,
        addon: response.addon
      };
    } catch (error) {
      console.error('Error in getAddonDetails:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });
}

/**
 * Test API connection
 */
export async function testConnection() {
  try {
    // Test with a known product ID
    const response = await hostBillRequest('getProductDetails', { id: '28' });
    return { success: true, product: response.product };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
