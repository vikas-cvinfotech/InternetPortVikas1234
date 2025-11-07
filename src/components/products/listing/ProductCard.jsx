import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { formatPriceWithVAT } from '@/lib/utils/tax';
import { useTranslations } from 'next-intl';
import { getCampaignPricingDisplay } from '@/lib/utils/campaignPricing';
import { roundedPrice } from '@/lib/utils/formatting';

const hardwareKeywords = ['router', 'modem', 'switch', 'mesh', 'wifi', 'repeater'];

import { slugify } from '@/lib/utils/formatting';

function generateProductSlug(productName, productId) {
  return `${slugify(productName)}-${productId}`;
}

export default function ProductCard({ product, locale = 'sv', categorySlug, priority = false }) {
  const t = useTranslations('common');

  // Check for special campaign pricing (like NordVPN)
  const specialCampaignInfo = getCampaignPricingDisplay(product, locale);

  const getFormattedPrice = () => {
    if (!product.pricingOptions || product.pricingOptions.length === 0) {
      return product.price || '';
    }

    const monthlyOption = product.pricingOptions.find((opt) => opt.period === 'monthly');
    const selectedOption = monthlyOption || product.pricingOptions[0];

    if (!selectedOption) {
      return product.price || '';
    }

    const basePrice = selectedOption.price;
    const baseSetup = selectedOption.setupFee || 0;

    if (basePrice > 0) {
      const priceWithTax = formatPriceWithVAT(basePrice);
      const setupWithTax = baseSetup > 0 ? formatPriceWithVAT(baseSetup) : null;

      // Check if it's a one-time payment or monthly
      const isOneTime = product.paytype === 'Once';
      let formattedPrice = isOneTime
        ? `${priceWithTax.inclusivePrice} ${t('currency')}`
        : `${priceWithTax.inclusivePrice} ${t('currencyPerMonth')}`;

      if (setupWithTax && setupWithTax.inclusivePrice > 0) {
        formattedPrice += ` + ${setupWithTax.inclusivePrice} ${t('currencySetupFee')}`;
      }
      return formattedPrice;
    } else if (baseSetup > 0) {
      const setupWithTax = formatPriceWithVAT(baseSetup);
      return `${setupWithTax.inclusivePrice} ${t('currency')}`;
    }

    return product.price || '';
  };

  const getCampaignPricing = () => {
    if (!product.m_campaign_price || !product.m_price) {
      return null;
    }

    const campaignPrice = formatPriceWithVAT(parseFloat(product.m_campaign_price));
    const regularPrice = parseFloat(product.m_price);

    return {
      campaignPrice: campaignPrice.inclusivePrice,
      regularPrice: regularPrice,
      campaignLength: product.m_campaign_length,
      campaignPercentage: product.m_campaign_percentage,
      customBadgeText: product.m_campaign_custom_badge,
    };
  };

  const productSlug = generateProductSlug(product.name, product.id);

  const isBroadbandService = (productName) => {
    const name = productName.toLowerCase();
    return !hardwareKeywords.some((keyword) => name.includes(keyword));
  };

  const href =
    categorySlug === 'bredband' && isBroadbandService(product.name)
      ? `/address-sok-bredband`
      : `/kategori/${categorySlug}/${productSlug}`;

  return (
    <div className="group text-sm h-full flex flex-col" role="listitem">
      <Link href={href} className="block flex-1 flex flex-col">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-secondary/5 group-hover:opacity-75 relative">
          {product.images && product.images[0] ? (
            <Image
              alt={product.images[0].alt}
              src={product.images[0].src}
              fill
              className={`${
                product.imageType === 'logo' ? 'object-contain' : 'object-cover'
              } object-center`}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              placeholder={priority ? 'empty' : 'blur'}
              blurDataURL={
                priority
                  ? undefined
                  : 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k='
              }
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-secondary/50">{t('noImage')}</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          {/* Product Name and Campaign Badge */}
          <div className="flex flex-col gap-2 mb-2">
            <h3 className="text-sm text-secondary/70">
              {product.name || product.fallbackName || `Product ${product.id}`}
            </h3>
            {/* Display campaign badge for special campaigns (NordVPN) or regular campaigns */}
            {(() => {
              // Priority: Special campaign (NordVPN) > Regular campaign
              if (specialCampaignInfo) {
                return (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full border border-accent w-fit">
                      {specialCampaignInfo.badgeText} {specialCampaignInfo.campaignText}
                    </span>
                  </div>
                );
              } else {
                const campaignPricing = getCampaignPricing();
                if (campaignPricing) {
                  let badgeText = '';

                  if (campaignPricing.customBadgeText && campaignPricing.customBadgeText[locale]) {
                    badgeText = campaignPricing.customBadgeText[locale];
                  } else if (campaignPricing.campaignPercentage && campaignPricing.campaignLength) {
                    badgeText = t('campaignBadgePercentage', {
                      percentage: campaignPricing.campaignPercentage,
                      months: campaignPricing.campaignLength,
                    });
                  }

                  if (badgeText) {
                    return (
                      <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full border border-accent w-fit">
                        {badgeText}
                      </span>
                    );
                  }
                }
              }
              return null;
            })()}
          </div>

          {/* Pricing Display */}
          <div className="flex items-baseline gap-2">
            {(() => {
              // Priority: Special campaign (NordVPN) > Regular campaign > Normal pricing
              if (specialCampaignInfo) {
                const taxRate = 1.25; // VAT rate
                return (
                  <>
                    <p className="text-lg font-medium text-accent">
                      {roundedPrice(specialCampaignInfo.campaignPrice * taxRate)}{' '}
                      {t('currencyPerMonth')}
                    </p>
                    <span className="text-sm text-secondary/50 line-through">
                      {roundedPrice(specialCampaignInfo.originalPrice * taxRate)}{' '}
                      {t('currencyPerMonth')}
                    </span>
                    <span className="text-xs text-secondary/60">{t('inclVAT')}</span>
                  </>
                );
              } else {
                const campaignPricing = getCampaignPricing();
                if (campaignPricing) {
                  return (
                    <>
                      <p className="text-lg font-medium text-accent">
                        {campaignPricing.campaignPrice} {t('currencyPerMonth')}
                      </p>
                      <span className="text-sm text-secondary/50 line-through">
                        {campaignPricing.regularPrice} {t('currencyPerMonth')}
                      </span>
                      <span className="text-xs text-secondary/60">{t('inclVAT')}</span>
                    </>
                  );
                } else {
                  return (
                    <>
                      <p className="text-lg font-medium text-secondary">{getFormattedPrice()}</p>
                      <span className="text-xs text-secondary/60">{t('inclVAT')}</span>
                    </>
                  );
                }
              }
            })()}
          </div>
        </div>
      </Link>
    </div>
  );
}
