/**
 * Centralized Product Pricing Logic
 * 
 * This utility handles HostBill product pricing logic consistently across all product strategies.
 * All products use the same HostBill field structure for pricing.
 */

/**
 * Parse and determine the smart pricing for a HostBill product
 * @param {Object} product - The HostBill product data
 * @returns {Object} Pricing information with primaryPrice, billingPeriod, setupPrice, and display logic
 */
export function parseProductPricing(product) {
  if (!product) {
    return {
      primaryPrice: 0,
      billingPeriod: 'monthly',
      setupPrice: 0,
      isOneTime: false,
      hasPrice: false
    };
  }

  // Extract all possible price fields from HostBill
  const monthlyPrice = parseFloat(product.m_price || product.m) || 0;
  const quarterlyPrice = parseFloat(product.q) || 0;
  const semiAnnualPrice = parseFloat(product.s) || 0;
  const annualPrice = parseFloat(product.a) || 0;
  const setupPrice = (product.s_price && parseFloat(product.s_price) > 0) 
    ? parseFloat(product.s_price) 
    : (product.m_setup && parseFloat(product.m_setup) > 0) 
      ? parseFloat(product.m_setup) 
      : 0;

  // Determine pricing type based on paytype field
  const paytype = product.paytype || '';
  const isOneTimePurchase = paytype.toLowerCase() === 'once';
  const isRegularSubscription = paytype.toLowerCase() === 'regular';

  // Determine the primary price and billing period
  let primaryPrice = 0;
  let billingPeriod = '';

  if (isOneTimePurchase) {
    // For one-time purchases, check all price fields
    primaryPrice = (monthlyPrice > 0 ? monthlyPrice : 0) || 
                   (semiAnnualPrice > 0 ? semiAnnualPrice : 0) || 
                   (annualPrice > 0 ? annualPrice : 0) ||
                   (setupPrice > 0 ? setupPrice : 0);
    billingPeriod = 'once';
  } else if (isRegularSubscription || monthlyPrice > 0) {
    // Regular subscription - check which billing period has a price
    if (monthlyPrice > 0) {
      primaryPrice = monthlyPrice;
      billingPeriod = 'monthly';
    } else if (quarterlyPrice > 0) {
      primaryPrice = quarterlyPrice;
      billingPeriod = 'quarterly';
    } else if (semiAnnualPrice > 0) {
      primaryPrice = semiAnnualPrice;
      billingPeriod = 'semiannual';
    } else if (annualPrice > 0) {
      primaryPrice = annualPrice;
      billingPeriod = 'annual';
    }
  } else {
    // Fallback - use any available price
    primaryPrice = (monthlyPrice > 0 ? monthlyPrice : 0) || 
                   (quarterlyPrice > 0 ? quarterlyPrice : 0) || 
                   (semiAnnualPrice > 0 ? semiAnnualPrice : 0) || 
                   (annualPrice > 0 ? annualPrice : 0) ||
                   (setupPrice > 0 ? setupPrice : 0);
    billingPeriod = primaryPrice === monthlyPrice ? 'monthly' : 'once';
  }

  return {
    primaryPrice,
    billingPeriod,
    setupPrice: billingPeriod !== 'once' ? setupPrice : 0, // Only show setup for subscriptions
    isOneTime: billingPeriod === 'once',
    hasPrice: primaryPrice > 0,
    // Additional pricing options for advanced use cases
    pricing: {
      monthly: monthlyPrice,
      quarterly: quarterlyPrice,
      semiannual: semiAnnualPrice,
      annual: annualPrice,
      setup: setupPrice
    },
    paytype
  };
}

/**
 * Get the billing period suffix for display
 * @param {string} billingPeriod - The billing period ('monthly', 'quarterly', etc.)
 * @param {Function} tCommon - Translation function for common terms
 * @returns {string} The display suffix (e.g., '/month', '/quarter')
 */
export function getBillingPeriodSuffix(billingPeriod, tCommon) {
  switch (billingPeriod) {
    case 'monthly':
      // tCommon('currencyPerMonth') returns "kr/month" but we only want "/month"
      // since PriceDisplay already handles the "kr" part
      const monthlyText = tCommon('currencyPerMonth');
      return monthlyText.replace(/^.*?\//, '/'); // Extract just "/month" part
    case 'quarterly':
      return '/quarter';
    case 'semiannual':
      return '/6 months';
    case 'annual':
      return '/year';
    case 'once':
    default:
      return '';
  }
}

/**
 * Generate cart-compatible pricing data
 * @param {Object} product - The HostBill product data
 * @param {Object} pricingInfo - Result from parseProductPricing()
 * @returns {Object} Cart-compatible pricing data
 */
export function getCartPricingData(product, pricingInfo = null) {
  const pricing = pricingInfo || parseProductPricing(product);
  
  // For one-time products with 0 monthly price, use setup price as main price
  const finalPrice = (pricing.isOneTime && pricing.pricing.monthly === 0 && pricing.setupPrice > 0) 
    ? pricing.setupPrice 
    : pricing.primaryPrice;
  
  const finalSetupPrice = (pricing.isOneTime && pricing.pricing.monthly === 0 && pricing.setupPrice > 0) 
    ? 0 
    : pricing.setupPrice;

  return {
    price: finalPrice,
    setupPrice: finalSetupPrice,
    billingPeriod: pricing.billingPeriod,
    isOneTime: pricing.isOneTime,
    paytype: pricing.paytype
  };
}