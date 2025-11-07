import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { formatPriceWithVAT } from '@/lib/utils/tax';

export default function ServiceCard({
  name,
  href,
  image,
  imageType = 'photo',
  monthlyPrice,
  setupFee,
  fallbackPrice,
  fromPrice,
  priority = false,
}) {
  const t = useTranslations('common');

  const getFormattedPrice = () => {
    if (fromPrice && fromPrice > 0) {
      return `${t('from')} ${fromPrice} ${t('currencyPerMonth')}`;
    }

    if (monthlyPrice > 0) {
      const priceWithTax = formatPriceWithVAT(monthlyPrice);
      const setupWithTax = setupFee > 0 ? formatPriceWithVAT(setupFee) : null;

      let formattedPrice = `${priceWithTax.inclusivePrice} ${t('currencyPerMonth')}`;
      if (setupWithTax && setupWithTax.inclusivePrice > 0) {
        formattedPrice += ` + ${setupWithTax.inclusivePrice} ${t('currencySetupFee')}`;
      }
      return formattedPrice;
    } else if (setupFee > 0) {
      const setupWithTax = formatPriceWithVAT(setupFee);
      return `${setupWithTax.inclusivePrice} ${t('currency')}`;
    }

    return fallbackPrice || '';
  };

  return (
    <div className="group text-sm h-full flex flex-col" role="listitem">
      <Link href={href} className="block flex-1 flex flex-col">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-secondary/5 group-hover:opacity-75 relative">
          {image ? (
            <Image
              alt={name}
              src={image}
              fill
              className={`${
                imageType === 'logo' ? 'object-contain' : 'object-cover'
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
          <h3 className="text-sm text-secondary/70">{name}</h3>
          {(fromPrice > 0 || monthlyPrice > 0 || setupFee > 0 || fallbackPrice) && (
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-lg font-medium text-secondary">{getFormattedPrice()}</p>
              <span className="text-xs text-secondary/60">{t('inclVAT')}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
