import {
  WifiIcon,
  PhoneIcon,
  TvIcon,
  ServerIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

export default function CategoryIcons() {
  const t = useTranslations('categoryIcons');

  const categories = [
    {
      name: t('broadband'),
      href: '#',
      icon: WifiIcon,
      bgColor: 'bg-accent',
    },
    {
      name: t('telephony'),
      href: '#',
      icon: PhoneIcon,
      bgColor: 'bg-accent',
    },
    {
      name: t('tv'),
      href: '#',
      icon: TvIcon,
      bgColor: 'bg-accent',
    },
    {
      name: t('hosting'),
      href: '#',
      icon: ServerIcon,
      bgColor: 'bg-accent',
    },
    {
      name: t('security'),
      href: '#',
      icon: ShieldCheckIcon,
      bgColor: 'bg-accent',
    },
  ];

  return (
    <div className="bg-primary py-0 sm:py-0 xl:mx-auto xl:max-w-4xl xl:px-6">
      <div className="mt-3 flow-root">
        <div className="-my-2">
          <div className="relative box-content h-40 overflow-x-auto py-2 xl:overflow-visible">
            <div className="absolute flex space-x-6 px-4 sm:px-5 lg:px-6 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-6 xl:space-x-0 xl:px-0">
              {categories.map((category) => (
                <a
                  key={category.name}
                  href={category.href}
                  className="relative flex h-40 w-40 flex-col overflow-hidden rounded-lg p-4 hover:opacity-75 xl:w-auto"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div
                      className={`w-14 h-14 flex items-center justify-center rounded-full ${category.bgColor}`}
                    >
                      <category.icon className="w-8 h-8 text-primary" aria-hidden="true" />
                    </div>
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-2/3 opacity-50"
                  />
                  <span className="relative mt-auto text-center text-base text-secondary">
                    {category.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
