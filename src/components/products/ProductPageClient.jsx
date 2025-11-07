
'use client';

import { useState, lazy, Suspense } from 'react';
import ProductLayout from './ProductLayout';
import { calculateSimpleProductPricing } from '@/lib/utils/tax';

// Lazy load all strategies to improve Speed Index (5.2s → target <4s)
const StandardProductStrategy = lazy(() => import('./strategies/StandardProductStrategy'));
const BroadbandProductStrategy = lazy(() => import('./strategies/BroadbandProductStrategy'));
const TvServiceProductStrategy = lazy(() => import('./strategies/TvServiceProductStrategy'));
const TelephonyServiceProductStrategy = lazy(() => import('./strategies/TelephonyServiceProductStrategy'));

const productStrategies = {
  standard: StandardProductStrategy,
  'broadband-service': BroadbandProductStrategy,
  'tv-service': TvServiceProductStrategy,
  telephony: TelephonyServiceProductStrategy,
};

export default function ProductPageClient({ 
  product: rawProduct, 
  onAdd, 
  strategyType = 'standard',
  productSlugWithId = null,
  currentUrl = null,
  // Broadband-specific props
  servicesPrivate = null,
  servicesCompany = null,
  installationAddress = null,
  // Optional React component for description instead of HTML
  descriptionComponent = null
}) {
  const [strategyOptions, setStrategyOptions] = useState({});

  const getProductStrategy = () => {
    // Use the provided strategy type to select the appropriate strategy component
    return productStrategies[strategyType] || productStrategies.standard;
  };

  const calculateDisplayPrice = () => {
    const baseMonthly = parseFloat(rawProduct.m_price) || 0;
    const baseSetup = parseFloat(rawProduct.s_price) || 0;

    return calculateSimpleProductPricing({ price: baseMonthly, setupFee: baseSetup }, {});
  };

  const getCampaignDisplay = () => {
    const hasCampaign =
      rawProduct.m_campaign_price &&
      rawProduct.m_campaign_length > 0 &&
      parseFloat(rawProduct.m_campaign_price) > 0;

    if (!hasCampaign) return null;

    const baseCampaignPrice = parseFloat(rawProduct.m_campaign_price);
    const baseRegularPrice = parseFloat(rawProduct.m_price || 0);

    const campaignPricing = calculateSimpleProductPricing(
      { price: baseCampaignPrice, setupFee: 0 },
      { monthlyPrice: 0, setupPrice: 0 },
    );

    const regularPricing = calculateSimpleProductPricing(
      { price: baseRegularPrice, setupFee: 0 },
      { monthlyPrice: 0, setupPrice: 0 },
    );

    return {
      campaignPrice: campaignPricing.totalMonthly,
      regularPrice: regularPricing.totalMonthly,
      campaignLength: rawProduct.m_campaign_length,
    };
  };

  const handleAddToCart = () => {
    if (onAdd) {
      return onAdd(rawProduct.id, {
        quantity: 1,
        // Store tax-exclusive price to avoid double taxation in cart
        price: pricing.totalMonthlyBase || parseFloat(rawProduct.m_price) || 0,
        ...strategyOptions,
        rawProductData: rawProduct,
      });
    }
  };

  const StrategyComponent = getProductStrategy();
  const pricing = calculateDisplayPrice();
  const campaign = getCampaignDisplay();

  // Prepare strategy-specific props
  const strategyProps = {
    product: rawProduct,
    options: strategyOptions,
    onOptionChange: setStrategyOptions,
    currentUrl,
  };

  // Add strategy-specific props based on type
  if (strategyType === 'broadband-service') {
    // Broadband service strategy needs service data
    Object.assign(strategyProps, {
      servicesPrivate,
      servicesCompany,
      installationAddress,
    });
  } else if (strategyType === 'tv-service') {
    // TV service strategy needs add to cart functionality and installation address for stadsnät
    Object.assign(strategyProps, {
      onAdd: handleAddToCart,
      installationAddress,
      productSlugWithId,
    });
  } else if (strategyType === 'telephony') {
    // Telephony strategy needs add to cart functionality and product slug
    Object.assign(strategyProps, {
      onAdd: handleAddToCart,
      productSlugWithId,
    });
  } else if (strategyType === 'standard') {
    // Standard strategy needs add to cart functionality
    Object.assign(strategyProps, {
      onAdd: handleAddToCart,
    });
  }

  const renderStrategy = () => {
    return <StrategyComponent {...strategyProps} />;
  };

  return (
    <ProductLayout
      product={rawProduct}
      description={rawProduct.description}
      descriptionComponent={descriptionComponent}
    >
      {renderStrategy()}
    </ProductLayout>
  );
}
