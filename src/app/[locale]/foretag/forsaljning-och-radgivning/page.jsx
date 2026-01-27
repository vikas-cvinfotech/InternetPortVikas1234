import Image from 'next/image';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/20/solid';
import { useTranslations } from 'next-intl';

const teamMembers = [
  {
    id: 1,
    name: 'Peter Forslund',
    roleKey: 'ceo',
    location: 'Hudiksvall',
    phone: '0650-40 20 05',
    email: 'peter.forslund@internetport.se',
    image: 'https://internetportcom.b-cdn.net/se/img/peter-forslund-vd-internetport.jpg',
  },
  {
    id: 2,
    name: 'Oscar Bergström',
    roleKey: 'productManager',
    location: 'Gävle',
    phone: '0650-40 20 06',
    email: 'oscar.bergstrom@internetport.se',
    image: 'https://internetportcom.b-cdn.net/se/img/oscar-berstrom-produktchef-internetport.jpg',
  },
];

export default function CompanySalesPage() {
  const t = useTranslations('companySales');

  return (
    <div className="bg-primary">
      {/* Hero Section with Background Image */}
      <div className="relative bg-secondary">
        <div className="absolute inset-0">
          <Image
            src="https://internetportcom.b-cdn.net/se/img/radgivning-forsaljning-it.jpg"
            alt={t('bannerAlt')}
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 to-secondary/90" />
        </div>
        <div className="relative px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
          </div>
        </div>
      </div>

      {/* Two-Column Text Section */}
      <div className="bg-primary py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="text-base/7 text-secondary">
              <p>{t('intro1')}</p>
            </div>
            <div className="text-base/7 text-secondary">
              <p>{t('intro2')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Grid Section */}
      <div className="bg-secondary py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mx-0 lg:max-w-none">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-secondary/50">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-divider">
                      <svg
                        className="h-32 w-32 text-secondary/30"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                  {/* Location Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center gap-1 rounded bg-accent px-2 py-1 text-xs font-medium text-primary">
                      <MapPinIcon className="h-3 w-3" />
                      {member.location}
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="mt-4">
                  <p className="text-sm text-primary/70">{t(`roles.${member.roleKey}`)}</p>
                  <h3 className="mt-1 text-xl font-semibold text-primary">{member.name}</h3>
                  <div className="mt-3 space-y-1">
                    <a
                      href={`tel:${member.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-sm text-primary/70 hover:text-accent transition-colors"
                    >
                      <PhoneIcon className="h-4 w-4 text-accent" />
                      {member.phone}
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-sm text-primary/70 hover:text-accent transition-colors"
                    >
                      <EnvelopeIcon className="h-4 w-4 text-accent" />
                      {member.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
