'use client';
import { useTranslations } from 'next-intl';

export default function SocialSection({ itemflex, borderleft, flexbasis }) {
  const t = useTranslations('header');

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-x-6 gap-y-6 sdfds">
      <div
        className={`flex items-center gap-4 ${itemflex ? itemflex : ''} ${
          borderleft ? borderleft : ''
        } ${flexbasis ? flexbasis : ''}`}
      >
        <div className="icon bg-[#F6F6F6] flex items-center justify-center px-[11px] py-[11px] h-full rounded-full">
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
            {t('addressLine1')} {t('addressLine2')}{' '}
          </span>
        </div>
      </div>
      <div
        className={`flex items-center gap-4 ${itemflex ? itemflex : ''} ${
          borderleft ? borderleft : ''
        }`}
      >
        <div className="icon bg-[#F6F6F6] flex items-center justify-center px-[11px] py-[11px] h-full rounded-full">
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
          <span className="text-sm text-neutral-700">{t('phone')} </span>
        </div>
      </div>
      <div className={`flex items-center gap-4 ${itemflex ? itemflex : ''}`}>
        <div className="icon bg-[#F6F6F6] flex items-center justify-center px-[11px] py-[11px] h-full rounded-full">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.25 7.22498V14.375C1.25 15.038 1.51339 15.6739 1.98223 16.1427C2.45107 16.6116 3.08696 16.875 3.75 16.875H16.25C16.913 16.875 17.5489 16.6116 18.0178 16.1427C18.4866 15.6739 18.75 15.038 18.75 14.375V7.22498L11.31 11.8025C10.916 12.0449 10.4626 12.1732 10 12.1732C9.53745 12.1732 9.08396 12.0449 8.69 11.8025L1.25 7.22498Z"
              fill="#BE1823"
            />
            <path
              d="M18.75 5.75667V5.625C18.75 4.96196 18.4866 4.32607 18.0178 3.85723C17.5489 3.38839 16.913 3.125 16.25 3.125H3.75C3.08696 3.125 2.45107 3.38839 1.98223 3.85723C1.51339 4.32607 1.25 4.96196 1.25 5.625V5.75667L9.345 10.7383C9.54198 10.8595 9.76872 10.9237 10 10.9237C10.2313 10.9237 10.458 10.8595 10.655 10.7383L18.75 5.75667Z"
              fill="#BE1823"
            />
          </svg>
        </div>
        <div className="flex flex-col ">
          <b className="text-neutral-700 text-base">{t('emailLabel')}</b>
          <span className="text-sm text-neutral-700">{t('supportEmail')}</span>
        </div>
      </div>
    </div>
  );
}
