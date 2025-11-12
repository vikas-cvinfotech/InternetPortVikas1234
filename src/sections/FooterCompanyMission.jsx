import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import SocialSection from './SocialSection';

export default function FooterCompanyMission() {
  const t = useTranslations('footerCompanyMission');

  const navigation = {
    services: [
      { name: t('services.broadband'), href: '/kategori/bredband' },
      { name: t('services.telephony'), href: '/kategori/telefoni' },
      { name: t('services.tv'), href: '/kategori/tv' },
      { name: t('services.hosting'), href: 'https://internetport.com', external: true },
      { name: t('services.security'), href: '/kategori/sakerhet' },
    ],
    support: [
      { name: t('support.submitTicket'), href: '/kontakta-oss' },
      { name: t('support.knowledgeBase'), href: '/kunskapsbas' },
      { name: t('support.operationalStatus'), href: '/driftstatus' },
      {
        name: t('support.teamviewer'),
        href: 'https://get.teamviewer.com/internetport',
        external: true,
      },
    ],
    company: [
      { name: t('company.aboutUs'), href: '/om-oss' },
      { name: t('company.careers'), href: '/karriar' },
      { name: t('company.contactUs'), href: '/kontakta-oss' },
    ],
    legal: [
      { name: t('legal.termsAndConditions'), href: '/allmana-villkor' },
      { name: t('legal.privacyPolicy'), href: '/integritetspolicy' },
      { name: t('legal.serviceSpecificTerms'), href: '/tjanstespecifika-villkor' },
      { name: t('legal.rightOfWithdrawalAndReturns'), href: '/angerratt-och-returer' },
      { name: t('legal.cookies'), href: '/cookies' },
    ],
    social: [
      {
        name: 'trust',
        href: 'https://se.trustpilot.com/review/internetport.se',
        icon: (props) => (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="M14.3558 13.8916L16.1808 19.5099L10.0033 15.0199L14.3558 13.8916ZM20 7.75822H12.3625L10.0042 0.490723L7.6375 7.75989L0 7.74989L6.185 12.2474L3.81833 19.5091L10.0033 15.0199L13.8225 12.2474L20 7.75822Z"
              fill="currentColor"
            />
          </svg>
        ),
      },
      {
        name: 'Facebook',
        href: 'https://www.facebook.com/internetport.se',
        icon: (props) => (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="M11.6154 1.6665C10.5076 1.6665 9.44514 2.1115 8.66182 2.90361C7.87849 3.69572 7.43842 4.77004 7.43842 5.89025V8.24185H5.2032C5.09122 8.24185 5 8.33317 5 8.44733V11.5523C5 11.6656 5.09031 11.7578 5.2032 11.7578H7.43842V18.1277C7.43842 18.2409 7.52874 18.3332 7.64163 18.3332H10.7122C10.8242 18.3332 10.9154 18.2418 10.9154 18.1277V11.7578H13.1705C13.2635 11.7578 13.3448 11.6939 13.3674 11.6026L14.1351 8.49755C14.1426 8.46726 14.1432 8.43561 14.1369 8.40504C14.1305 8.37446 14.1173 8.34575 14.0984 8.32109C14.0794 8.29644 14.0551 8.27649 14.0273 8.26275C13.9996 8.24902 13.9691 8.24187 13.9382 8.24185H10.9154V5.89025C10.9154 5.7973 10.9335 5.70527 10.9687 5.6194C11.0039 5.53353 11.0554 5.45551 11.1204 5.38978C11.1854 5.32406 11.2626 5.27193 11.3475 5.23636C11.4324 5.20079 11.5234 5.18249 11.6154 5.18249H13.9635C14.0755 5.18249 14.1667 5.09116 14.1667 4.97701V1.87198C14.1667 1.75874 14.0764 1.6665 13.9635 1.6665H11.6154Z"
              fill="currentColor"
            />
          </svg>
        ),
      },
      {
        name: 'Instagram',
        href: 'https://www.instagram.com/internetport.se/',
        icon: (props) => (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="M10.8565 1.6665C11.794 1.669 12.2698 1.674 12.6807 1.68567L12.8423 1.6915C13.029 1.69817 13.2132 1.7065 13.4357 1.7165C14.3223 1.75817 14.9273 1.89817 15.4582 2.104C16.0082 2.31567 16.4715 2.60234 16.9348 3.06484C17.3587 3.48128 17.6866 3.98523 17.8957 4.5415C18.1015 5.07234 18.2415 5.67734 18.2832 6.56484C18.2932 6.7865 18.3015 6.97067 18.3082 7.15817L18.3132 7.31984C18.3257 7.72984 18.3307 8.20567 18.3323 9.14317L18.3332 9.76484V10.8565C18.3352 11.4643 18.3288 12.0722 18.314 12.6798L18.309 12.8415C18.3023 13.029 18.294 13.2132 18.284 13.4348C18.2423 14.3223 18.1007 14.9265 17.8957 15.4582C17.6866 16.0144 17.3587 16.5184 16.9348 16.9348C16.5184 17.3587 16.0144 17.6867 15.4582 17.8957C14.9273 18.1015 14.3223 18.2415 13.4357 18.2832L12.8423 18.3082L12.6807 18.3132C12.2698 18.3248 11.794 18.3307 10.8565 18.3323L10.2348 18.3332H9.14399C8.53587 18.3353 7.92776 18.3289 7.31982 18.314L7.15816 18.309C6.96033 18.3015 6.76255 18.2929 6.56482 18.2832C5.67816 18.2415 5.07316 18.1015 4.54149 17.8957C3.98551 17.6866 3.48186 17.3586 3.06566 16.9348C2.64144 16.5185 2.31325 16.0145 2.10399 15.4582C1.89816 14.9273 1.75816 14.3223 1.71649 13.4348L1.69149 12.8415L1.68732 12.6798C1.67196 12.0722 1.66502 11.4643 1.66649 10.8565V9.14317C1.66418 8.53534 1.67029 7.9275 1.68482 7.31984L1.69066 7.15817C1.69732 6.97067 1.70566 6.7865 1.71566 6.56484C1.75732 5.67734 1.89732 5.07317 2.10316 4.5415C2.3129 3.985 2.64168 3.48103 3.06649 3.06484C3.48245 2.64113 3.98581 2.31323 4.54149 2.104C5.07316 1.89817 5.67732 1.75817 6.56482 1.7165C6.78649 1.7065 6.97149 1.69817 7.15816 1.6915L7.31982 1.6865C7.92748 1.6717 8.53532 1.66531 9.14316 1.66734L10.8565 1.6665ZM9.99982 5.83317C8.89475 5.83317 7.83495 6.27216 7.05354 7.05356C6.27214 7.83496 5.83316 8.89477 5.83316 9.99984C5.83316 11.1049 6.27214 12.1647 7.05354 12.9461C7.83495 13.7275 8.89475 14.1665 9.99982 14.1665C11.1049 14.1665 12.1647 13.7275 12.9461 12.9461C13.7275 12.1647 14.1665 11.1049 14.1665 9.99984C14.1665 8.89477 13.7275 7.83496 12.9461 7.05356C12.1647 6.27216 11.1049 5.83317 9.99982 5.83317ZM9.99982 7.49984C10.3281 7.49978 10.6532 7.56439 10.9566 7.68998C11.2599 7.81557 11.5355 7.99967 11.7677 8.23178C11.9999 8.46388 12.1841 8.73945 12.3098 9.04274C12.4355 9.34604 12.5002 9.67112 12.5002 9.99942C12.5003 10.3277 12.4357 10.6528 12.3101 10.9562C12.1845 11.2595 12.0004 11.5351 11.7683 11.7673C11.5362 11.9995 11.2606 12.1837 10.9573 12.3094C10.654 12.4351 10.329 12.4998 10.0007 12.4998C9.33762 12.4998 8.70173 12.2364 8.23289 11.7676C7.76405 11.2988 7.50066 10.6629 7.50066 9.99984C7.50066 9.3368 7.76405 8.70091 8.23289 8.23207C8.70173 7.76323 9.33762 7.49984 10.0007 7.49984M14.3757 4.58317C14.0994 4.58317 13.8344 4.69292 13.6391 4.88827C13.4437 5.08362 13.334 5.34857 13.334 5.62484C13.334 5.9011 13.4437 6.16606 13.6391 6.36141C13.8344 6.55676 14.0994 6.6665 14.3757 6.6665C14.6519 6.6665 14.9169 6.55676 15.1122 6.36141C15.3076 6.16606 15.4173 5.9011 15.4173 5.62484C15.4173 5.34857 15.3076 5.08362 15.1122 4.88827C14.9169 4.69292 14.6519 4.58317 14.3757 4.58317Z"
              fill="currentColor"
            />
          </svg>
        ),
      },
      {
        name: 'TikTok',
        href: 'https://www.tiktok.com/@internetport',
        icon: (props) => (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="M15.631 5.23159C15.5141 5.17355 15.4004 5.10976 15.2903 5.0405C14.9699 4.83677 14.6763 4.59653 14.4157 4.32501C13.7627 3.60582 13.5189 2.87626 13.4297 2.36593H13.4327C13.3581 1.94153 13.3889 1.66748 13.3943 1.66748H10.4215V12.7353C10.4225 12.8835 10.4205 13.0304 10.4153 13.176L10.4123 13.2301C10.4123 13.238 10.4115 13.2461 10.4099 13.2545V13.2612C10.3787 13.6582 10.2467 14.0418 10.0254 14.3781C9.80405 14.7144 9.5003 14.9932 9.14083 15.1899C8.76616 15.3962 8.34175 15.504 7.91017 15.5025C6.52568 15.5025 5.4027 14.4152 5.4027 13.0723C5.4027 11.7295 6.52568 10.6415 7.91017 10.6415C8.17245 10.6415 8.4332 10.6815 8.68241 10.76L8.68625 7.84468C7.92941 7.75074 7.16057 7.80887 6.42822 8.01538C5.69587 8.2219 5.01592 8.57233 4.43125 9.04457C3.91907 9.47325 3.48832 9.98455 3.15829 10.5555C3.03292 10.7637 2.55911 11.6014 2.5022 12.9598C2.46605 13.7301 2.70679 14.53 2.8214 14.8596V14.867C2.89293 15.061 3.1729 15.7247 3.62825 16.2839C3.9958 16.7324 4.4296 17.1267 4.91582 17.4541V17.4467L4.92275 17.4541C6.36108 18.3948 7.95709 18.3333 7.95709 18.3333C8.23322 18.3222 9.15852 18.3333 10.2092 17.8541C11.3745 17.3223 12.0375 16.5305 12.0375 16.5305C12.4617 16.0576 12.7989 15.5183 13.0343 14.9359C13.3035 14.2544 13.3928 13.4382 13.3928 13.1123V7.23955C13.4289 7.26029 13.9096 7.56619 13.9096 7.56619C13.9096 7.56619 14.6019 7.99355 15.681 8.27131C16.4548 8.46907 17.4985 8.51128 17.4985 8.51128V5.66933C17.1332 5.70784 16.3909 5.59674 15.6302 5.23233"
              fill="currentColor"
            />
          </svg>
        ),
      },
      {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/company/internetport-ab',
        icon: (props) => (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="M3.92332 1.6665C3.43537 1.6665 2.9674 1.86034 2.62237 2.20538C2.27733 2.55041 2.0835 3.01838 2.0835 3.50633C2.0835 3.99428 2.27733 4.46225 2.62237 4.80728C2.9674 5.15232 3.43537 5.34616 3.92332 5.34616C4.41128 5.34616 4.87924 5.15232 5.22428 4.80728C5.56931 4.46225 5.76315 3.99428 5.76315 3.50633C5.76315 3.01838 5.56931 2.55041 5.22428 2.20538C4.87924 1.86034 4.41128 1.6665 3.92332 1.6665ZM2.19172 6.86131C2.16302 6.86131 2.13549 6.87271 2.11519 6.89301C2.0949 6.9133 2.0835 6.94083 2.0835 6.96953V18.2249C2.0835 18.2847 2.13198 18.3332 2.19172 18.3332H5.65492C5.68363 18.3332 5.71116 18.3218 5.73145 18.3015C5.75175 18.2812 5.76315 18.2536 5.76315 18.2249V6.96953C5.76315 6.94083 5.75175 6.9133 5.73145 6.89301C5.71116 6.87271 5.68363 6.86131 5.65492 6.86131H2.19172ZM7.81943 6.86131C7.79072 6.86131 7.7632 6.87271 7.7429 6.89301C7.7226 6.9133 7.7112 6.94083 7.7112 6.96953V18.2249C7.7112 18.2847 7.75969 18.3332 7.81943 18.3332H11.2826C11.3113 18.3332 11.3389 18.3218 11.3592 18.3015C11.3795 18.2812 11.3909 18.2536 11.3909 18.2249V12.1643C11.3909 11.7338 11.5619 11.3209 11.8663 11.0164C12.1708 10.712 12.5837 10.541 13.0142 10.541C13.4448 10.541 13.8577 10.712 14.1621 11.0164C14.4666 11.3209 14.6376 11.7338 14.6376 12.1643V18.2249C14.6376 18.2847 14.6861 18.3332 14.7458 18.3332H18.209C18.2377 18.3332 18.2653 18.3218 18.2856 18.3015C18.3059 18.2812 18.3173 18.2536 18.3173 18.2249V10.7617C18.3173 8.66044 16.4904 7.01715 14.3995 7.20676C13.7526 7.26611 13.119 7.42619 12.5216 7.68122L11.3909 8.16607V6.96953C11.3909 6.94083 11.3795 6.9133 11.3592 6.89301C11.3389 6.87271 11.3113 6.86131 11.2826 6.86131H7.81943Z"
              fill="currentColor"
            />
          </svg>
        ),
      },
    ],
  };

  return (
    <footer className="bg-secondary">
      <div className="mx-auto px-4 sm:px-[24px] lg:px-[50px] xl:px-[80px] xxl:px-[135px]">
        <div className="mb-16 xl:grid xl:grid-cols-4 xl:gap-8 ">
          <div className="image flex items-center justify-center w-full h-full bg-accent rounded-bl-lg rounded-br-lg py-8 xl:py-0">
            <Image
              alt="Internetport Sweden AB logo"
              src="https://internetportcom.b-cdn.net/se/img/internetportfooterlogo.webp"
              width={200}
              height={53}
              className="h-9 w-auto"
              quality={95}
            />
          </div>
          <div className="footer-social gap-8 xl:col-span-3 xl:mt-0 py-6 px-4 xxl:py-6 xxl:px-10 bg-secondaryBg rounded-bl-lg rounded-br-lg">
            <SocialSection
              itemflex="lg:flex-1"
              borderleft="border-r border-borderLightGray"
              flexbasis="basis-[20%] xxl:basis-[15%]"
            />
          </div>
        </div>
        <div className="xl:grid xl:grid-cols-4 xl:gap-8 ">
          <div>
            <h2 className="text-2xl font-bold text-primary capitalize">{t(`title`)}</h2>
            <p className="text-lg text-balance text-primary font-normal my-[35px]">
              {t('mission')}
            </p>
            <div className="flex gap-x-3">
              {navigation.social?.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-secondary hover:text-primary bg-primary hover:bg-accent p-2 rounded-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon aria-hidden="true" className="size-6" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 xl:col-span-3 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-primary">{t('sections.services')}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.services.map((item) => (
                    <li key={item.name}>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base text-primary hover:text-accent"
                        >
                          {item.name}
                        </a>
                      ) : (
                        <Link href={item.href} className="text-base text-primary hover:text-accent">
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-2xl font-semibold text-primary">{t('sections.support')}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base text-primary hover:text-accent"
                        >
                          {item.name}
                        </a>
                      ) : (
                        <Link href={item.href} className="text-base text-primary hover:text-accent">
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-primary">{t('sections.company')}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-primary hover:text-accent">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-2xl font-semibold text-primary">{t('sections.legal')}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-primary hover:text-accent">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="my-8">
          <hr className="border border-paraSecondary" />
        </div>
        <div className="border-t border-divider pb-8 flex flex-col items-center justify-between lg:flex-row text-mediumGray">
          <p className="text-sm">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
