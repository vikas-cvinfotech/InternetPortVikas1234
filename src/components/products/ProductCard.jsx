import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { formatPriceWithVAT } from '@/lib/utils/tax';
import { getBunnyCDNImageUrl, IMAGE_PRESETS } from '@/lib/utils/bunnycdn';

export default function ProductCard({ product, locale = 'sv', categorySlug, priority = false }) {
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

      let formattedPrice = `${priceWithTax.inclusivePrice} kr/mån`;
      if (setupWithTax && setupWithTax.inclusivePrice > 0) {
        formattedPrice += ` + ${setupWithTax.inclusivePrice} kr setup`;
      }
      return formattedPrice;
    } else if (baseSetup > 0) {
      const setupWithTax = formatPriceWithVAT(baseSetup);
      return `${setupWithTax.inclusivePrice} kr`;
    }

    return product.price || '';
  };

  return (
    <div className="group text-sm">
      <Link href={`/kategori/${categorySlug}/${product.id}`} className="block">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-secondary/5 group-hover:opacity-75 relative">
          {product.images && product.images[0] ? (
            <Image
              alt={product.images[0].alt}
              src={getBunnyCDNImageUrl(product.images[0].src, IMAGE_PRESETS.productCard)}
              fill
              className={`${
                product.imageType === 'logo' ? 'object-contain' : 'object-cover'
              } object-center`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-secondary/50">Ingen bild</span>
            </div>
          )}
        </div>
        <h3 className="mt-4 font-medium text-secondary group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="mt-2 font-medium text-secondary min-h-[1.5rem]">{getFormattedPrice()}</p>
      </Link>

      <Link href={`/kategori/${categorySlug}/${product.id}`}>
        <button className="mt-3 w-full rounded-md border border-divider bg-secondary/5 px-4 py-2 text-sm font-medium text-secondary hover:bg-accent hover:border-accent hover:text-primary transition-colors">
          Visa produkt
        </button>
      </Link>
    </div>
  );
}
