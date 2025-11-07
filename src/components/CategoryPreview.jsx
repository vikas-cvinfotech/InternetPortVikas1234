import Image from 'next/image';

const categories = [
  {
    name: 'Broadband',
    href: '#',
    imageSrc: 'https://internetportcom.b-cdn.net/se/img/futuristic-router.webp',
  },
  {
    name: 'Telephony',
    href: '#',
    imageSrc: 'https://internetportcom.b-cdn.net/se/img/cellphone-in-hand.webp',
  },
  {
    name: 'Tv',
    href: '#',
    imageSrc: 'https://internetportcom.b-cdn.net/se/img/futuristic-tv.webp',
  },
  {
    name: 'Hosting',
    href: '#',
    imageSrc: 'https://internetportcom.b-cdn.net/se/img/futuristic-server.webp',
  },
  {
    name: 'Security',
    href: '#',
    imageSrc: 'https://internetportcom.b-cdn.net/se/img/futuristic-safety-cables.webp',
  },
];

export default function CategoryPreview() {
  return (
    <div className="bg-primary">
      <div className="py-16 sm:py-24 xl:mx-auto xl:max-w-7xl xl:px-8">
        <div className="mt-4 flow-root">
          <div className="-my-2">
            <div className="relative box-content h-80 overflow-x-auto py-2 xl:overflow-visible">
              <div className="absolute flex space-x-8 px-4 sm:px-6 lg:px-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0 xl:px-0">
                {categories.map((category) => (
                  <a
                    key={category.name}
                    href={category.href}
                    className="relative flex h-80 w-56 flex-col overflow-hidden rounded-lg p-6 hover:opacity-75 xl:w-auto"
                  >
                    <span aria-hidden="true" className="absolute inset-0">
                      <Image alt="" src={category.imageSrc} fill className="object-cover" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-secondary opacity-50"
                    />
                    <span className="relative mt-auto text-center text-xl font-bold text-primary">
                      {category.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
