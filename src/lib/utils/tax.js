const VAT_RATE = parseFloat(process.env.NEXT_PUBLIC_TAX_RATE) || 1.25;
const VAT_PERCENTAGE = 25;

// Helper function to get tax suffix based on locale
const getTaxSuffix = (locale = 'sv') => {
  return locale === 'sv' ? 'inkl. moms' : 'incl. VAT';
};

export const calculateVATInclusivePrice = (basePrice) => {
  if (typeof basePrice !== 'number' || basePrice < 0) {
    console.warn(`Invalid base price: ${basePrice}`);
    return 0;
  }
  return basePrice * VAT_RATE;
};

export const formatPriceWithVAT = (basePrice, locale = 'sv') => {
  const priceWithVAT = calculateVATInclusivePrice(basePrice);
  const vatAmount = priceWithVAT - basePrice;

  return {
    basePrice: Math.round(basePrice),
    inclusivePrice: Math.round(priceWithVAT),
    taxAmount: Math.round(vatAmount),
    vatPercentage: VAT_PERCENTAGE,
    displaySuffix: getTaxSuffix(locale),
    isPrivateCustomer: true,
  };
};

export const calculateProductPricing = (pricing, phoneOptions = {}) => {
  const baseMonthly = pricing?.price || 0;
  const baseSetup = pricing?.setupFee || 0;
  const phoneMonthly = phoneOptions?.monthlyPrice || 0;
  const phoneSetup = phoneOptions?.setupPrice || 0;

  const totalMonthlyBase = baseMonthly + phoneMonthly;
  const totalSetupBase = baseSetup + phoneSetup;

  return {
    totalMonthlyBase: Math.round(totalMonthlyBase),
    totalSetupBase: Math.round(totalSetupBase),
    totalMonthly: Math.round(calculateVATInclusivePrice(totalMonthlyBase)),
    totalSetup: Math.round(calculateVATInclusivePrice(totalSetupBase)),
    hasAddons: phoneSetup > 0 || phoneMonthly > 0,
  };
};

export const formatPriceWithDefaultTax = (basePrice, locale = 'sv') => formatPriceWithVAT(basePrice, locale);
export const calculateSimpleProductPricing = calculateProductPricing;
