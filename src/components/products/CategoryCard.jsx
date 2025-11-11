import { Link } from '@/i18n/routing';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

import Image from 'next/image';

export default function CategoryCard({
  name,
  slug,
  description,
  imageSrc,
  imageAlt,
  locale = 'sv',
  href,
  isExternal = false,
}) {
  return (
    <div className="group relative">
      <a
        href={href || `/kategori/${slug}`}
        className="relative flex h-72 w-full flex-col overflow-hidden rounded-lg p-6 hover:opacity-75"
        {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        <span aria-hidden="true" className="absolute inset-0">
          <Image
            alt={imageAlt}
            src={imageSrc}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
        />
        <div className="relative mt-auto text-center">
          <h3 className="text-xl font-bold text-primary mb-2">{name}</h3>
          <p className="text-sm text-primary/90">{description}</p>
        </div>
      </a>
    </div>
  );
}
