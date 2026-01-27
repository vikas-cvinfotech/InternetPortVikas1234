'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function SocialSection({ itemflex, borderleft, flexbasis }) {
  const t = useTranslations('header');
  const tt = useTranslations('contactUs');

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-x-6 gap-y-6 sdfds">
      <div
        className={`flex items-center gap-4 ${itemflex ? itemflex : ''} ${
          borderleft ? borderleft : ''
        } ${flexbasis ? flexbasis : ''}`}
      >
        <div className="icon bg-surfaceSecondary flex items-center justify-center px-[11px] py-[11px] h-full rounded-full">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.61667 18.6258L9.675 18.6592L9.69833 18.6725C9.79086 18.7225 9.89439 18.7487 9.99958 18.7487C10.1048 18.7487 10.2083 18.7225 10.3008 18.6725L10.3242 18.66L10.3833 18.6258C10.7093 18.4326 11.0273 18.2263 11.3367 18.0075C12.1376 17.4421 12.8859 16.8056 13.5725 16.1058C15.1925 14.4475 16.875 11.9558 16.875 8.75C16.875 6.92664 16.1507 5.17795 14.8614 3.88864C13.572 2.59933 11.8234 1.875 10 1.875C8.17664 1.875 6.42795 2.59933 5.13864 3.88864C3.84933 5.17795 3.125 6.92664 3.125 8.75C3.125 11.955 4.80833 14.4475 6.4275 16.1058C7.11387 16.8056 7.86189 17.442 8.6625 18.0075C8.97214 18.2263 9.29045 18.4326 9.61667 18.6258ZM10 11.25C10.663 11.25 11.2989 10.9866 11.7678 10.5178C12.2366 10.0489 12.5 9.41304 12.5 8.75C12.5 8.08696 12.2366 7.45107 11.7678 6.98223C11.2989 6.51339 10.663 6.25 10 6.25C9.33696 6.25 8.70107 6.51339 8.23223 6.98223C7.76339 7.45107 7.5 8.08696 7.5 8.75C7.5 9.41304 7.76339 10.0489 8.23223 10.5178C8.70107 10.9866 9.33696 11.25 10 11.25Z"
              fill="#BE1823"
            />
          </svg>
        </div>
        <div className="flex flex-col ">
          <b className="text-neutral-700 text-base">{t('addressLabel')}</b>
          <span className="text-sm text-neutral-700">
            {tt('addressLine1')} {tt('addressLine2')}{' '}
          </span>
        </div>
      </div>
      <div
        className={`flex items-center gap-4 ${itemflex ? itemflex : ''} ${
          borderleft ? borderleft : ''
        }`}
      >
        <div className="icon bg-surfaceSecondary flex items-center justify-center px-[11px] py-[11px] h-full rounded-full">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.6665 4.04758C1.6665 3.41611 1.91735 2.81051 2.36387 2.36399C2.81038 1.91748 3.41599 1.66663 4.04746 1.66663H5.13635C5.81889 1.66663 6.41412 2.13171 6.58 2.79361L7.45698 6.30393C7.52805 6.58805 7.51369 6.88683 7.41572 7.16284C7.31774 7.43884 7.14049 7.67979 6.90619 7.85552L5.88 8.62536C5.77285 8.70552 5.74984 8.82298 5.78 8.90472C6.22792 10.1229 6.93523 11.2291 7.85297 12.1468C8.77071 13.0646 9.87694 13.7719 11.0951 14.2198C11.1768 14.25 11.2935 14.2269 11.3744 14.1198L12.1443 13.0936C12.32 12.8593 12.561 12.6821 12.837 12.5841C13.113 12.4861 13.4117 12.4718 13.6959 12.5428L17.2062 13.4198C17.8681 13.5857 18.3332 14.1809 18.3332 14.8642V15.9523C18.3332 16.5838 18.0823 17.1894 17.6358 17.6359C17.1893 18.0824 16.5837 18.3333 15.9522 18.3333H14.1665C7.26333 18.3333 1.6665 12.7365 1.6665 5.83329V4.04758Z"
              fill="#BE1823"
            />
          </svg>
        </div>
        <div className="flex flex-col ">
          <b className="text-neutral-700 text-base">{t('phoneLabel')}</b>
          <span className="text-sm text-neutral-700">
            <a href="tel:+46 (0)650-40 20 00" className="hover:text-accent">
              {tt('phone')}
            </a>
          </span>
        </div>
      </div>
      <Link
        href="/foretag/forsaljning-och-radgivning"
        className={`flex items-center gap-4 hover:opacity-80 transition-opacity ${itemflex ? itemflex : ''}`}
      >
        <div className="icon bg-surfaceSecondary flex items-center justify-center px-[11px] py-[11px] h-full rounded-full">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 6V5C6 3.93913 6.42143 2.92172 7.17157 2.17157C7.92172 1.42143 8.93913 1 10 1C11.0609 1 12.0783 1.42143 12.8284 2.17157C13.5786 2.92172 14 3.93913 14 5V6H16C16.5304 6 17.0391 6.21071 17.4142 6.58579C17.7893 6.96086 18 7.46957 18 8V17C18 17.5304 17.7893 18.0391 17.4142 18.4142C17.0391 18.7893 16.5304 19 16 19H4C3.46957 19 2.96086 18.7893 2.58579 18.4142C2.21071 18.0391 2 17.5304 2 17V8C2 7.46957 2.21071 6.96086 2.58579 6.58579C2.96086 6.21071 3.46957 6 4 6H6ZM12 5V6H8V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3C10.5304 3 11.0391 3.21071 11.4142 3.58579C11.7893 3.96086 12 4.46957 12 5Z"
              fill="#BE1823"
            />
          </svg>
        </div>
        <div className="flex flex-col ">
          <b className="text-neutral-700 text-base">{t('consultingLabel')}</b>
          <span className="text-sm text-neutral-700">{t('consultingCta')}</span>
        </div>
      </Link>
    </div>
  );
}
