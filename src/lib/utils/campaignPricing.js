/**
 * Campaign Pricing Utility
 * 
 * This utility handles special campaign pricing for products like NordVPN
 * that have automated discount pricing applied.
 */

/**
 * Get campaign product IDs from environment variables
 * @returns {Set<number>} Set of product IDs with campaign pricing
 */
const getCampaignProductIds = () => {
  const envVar = process.env.NEXT_PUBLIC_NORDVPN_CAMPAIGN_PRODUCT_IDS;
  return new Set(
    (envVar || '')
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id))
  );
};

/**
 * Check if a product has campaign pricing
 * @param {number} productId - The product ID to check
 * @returns {boolean} True if product has campaign pricing
 */
export function hasCampaignPricing(productId) {
  if (!productId) return false;
  const campaignProductIds = getCampaignProductIds();
  return campaignProductIds.has(productId);
}

/**
 * Get campaign pricing display information for NordVPN products
 * @param {object} product - The product data
 * @param {string} locale - The current locale (sv/en)
 * @returns {object|null} Campaign pricing info or null if not a campaign product
 */
export function getCampaignPricingDisplay(product, locale = 'sv') {
  if (!product) {
    return null;
  }

  const productId = parseInt(product.id);
  const campaignProductIds = getCampaignProductIds();
  
  
  // NordVPN specific campaign - check if product ID is in campaign list
  if (campaignProductIds.has(productId)) {
    const currentPrice = parseFloat(product.m_price) || 32; // Current automated price without VAT (32kr)
    const originalPrice = 63.2; // Original price before campaign without VAT (79kr / 1.25 = 63.2kr)
    const discountPercentage = 50; // Fixed 50% discount as specified
    
    
    // Localized text based on locale
    const badgeText = locale === 'en' ? `${discountPercentage}% off` : `${discountPercentage}% rabatt`;
    const campaignText = locale === 'en' 
      ? `for the first ${3} months`
      : `de första ${3} månaderna`;

    return {
      originalPrice,
      campaignPrice: currentPrice,
      discountPercentage,
      campaignLength: 3, // months
      campaignType: 'first_months_discount',
      badgeText,
      campaignText
    };
  }

  // Add other campaign types here as needed
  return null;
}