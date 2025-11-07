'use client';
import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function NewsLetterSection() {
  const t = useTranslations('newsLetterSection');
  const [message, setMessage] = useState('');
  const emailRef = useRef(null); // Reference for the email input field

  // Simple email validation using regex
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value.trim();

    if (!validateEmail(email)) {
      setMessage(t('invalidEmail')); // Use a translation key for invalid email
      return;
    }

    try {
      const res = await fetch('/api/mailjet/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(t('subscriptionSuccess')); // e.g. "Subscription successful!"
        emailRef.current.value = ''; // Clear the input field
      } else {
        setMessage(data.error || t('subscriptionError')); // e.g. "Subscription failed, please try again."
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(t('subscriptionError'));
    }
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-8xl px-4 lg:px-6 lg:px-8 flex items-center justify-center flex-col">
        <h2 className="text-3xl font-bold text-secondary sm:text-4xl md:text-5xl text-center">
          {t('stayConnected1')}
          <div className="text-accent">{t('stayConnected2')}</div>
        </h2>
        <div className="pt-[30px] pb-[60px]">
          {message && <p className="text-base text-primary/75">{message}</p>}
          <p className="text-base text-secondary/75">
            {t('weCareAboutYourData')}{' '}
            <a
              href="/integritetspolicy"
              className="font-semibold text-secondary hover:opacity-75 underline"
            >
              {t('privacyPolicy')}
            </a>
            .
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex">
            <label htmlFor="email-address" className="sr-only">
              {t('emailAddress')}
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              ref={emailRef} // Attach the ref to the input field
              placeholder={t('enterYourEmail')}
              autoComplete="email"
              className="min-w-0 flex-auto rounded-[4px] rounded-tr-none rounded-br-none focus:rounded-tr-none focus:rounded-br-none focus:outline-none  bg-primary/10 px-4 py-4 border text-secondary placeholder:text-secondary/75 sm:text-base"
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-[4px] rounded-tl-none rounded-bl-none bg-secondary px-4 py-4 text-base font-semibold text-primary shadow-xs hover:opacity-75"
            >
              {t('subscribe')}
              <span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7 4.25C6.27065 4.25 5.57118 4.53973 5.05546 5.05546C4.53973 5.57118 4.25 6.27065 4.25 7V8.25H5C5.43434 8.25001 5.8594 8.37573 6.22386 8.612C6.58832 8.84826 6.8766 9.18497 7.05392 9.58146C7.23123 9.97796 7.29 10.4173 7.22311 10.8465C7.15623 11.2756 6.96656 11.6763 6.677 12C6.96656 12.3237 7.15623 12.7244 7.22311 13.1535C7.29 13.5827 7.23123 14.022 7.05392 14.4185C6.8766 14.815 6.58832 15.1517 6.22386 15.388C5.8594 15.6243 5.43434 15.75 5 15.75H4.25V17C4.25 17.7293 4.53973 18.4288 5.05546 18.9445C5.57118 19.4603 6.27065 19.75 7 19.75H20C20.7293 19.75 21.4288 19.4603 21.9445 18.9445C22.4603 18.4288 22.75 17.7293 22.75 17V7C22.75 6.27065 22.4603 5.57118 21.9445 5.05546C21.4288 4.53973 20.7293 4.25 20 4.25H7ZM9.416 8.376C9.25049 8.26827 9.04917 8.23016 8.85573 8.26996C8.6623 8.30975 8.49237 8.42423 8.38282 8.58855C8.27328 8.75287 8.23296 8.95376 8.27063 9.14762C8.30829 9.34148 8.4209 9.51266 8.584 9.624L13.084 12.624C13.2072 12.7061 13.3519 12.7499 13.5 12.7499C13.6481 12.7499 13.7928 12.7061 13.916 12.624L18.416 9.624C18.5791 9.51266 18.6917 9.34148 18.7294 9.14762C18.767 8.95376 18.7267 8.75287 18.6172 8.58855C18.5076 8.42423 18.3377 8.30975 18.1443 8.26996C17.9508 8.23016 17.7495 8.26827 17.584 8.376L13.5 11.099L9.416 8.376Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.75 13.5C5.75 13.6989 5.67098 13.8897 5.53033 14.0303C5.38968 14.171 5.19891 14.25 5 14.25H3C2.80109 14.25 2.61032 14.171 2.46967 14.0303C2.32902 13.8897 2.25 13.6989 2.25 13.5C2.25 13.3011 2.32902 13.1103 2.46967 12.9697C2.61032 12.829 2.80109 12.75 3 12.75H5C5.19891 12.75 5.38968 12.829 5.53033 12.9697C5.67098 13.1103 5.75 13.3011 5.75 13.5ZM5.75 10.5C5.75 10.6989 5.67098 10.8897 5.53033 11.0303C5.38968 11.171 5.19891 11.25 5 11.25H1C0.801088 11.25 0.610322 11.171 0.46967 11.0303C0.329018 10.8897 0.25 10.6989 0.25 10.5C0.25 10.3011 0.329018 10.1103 0.46967 9.96967C0.610322 9.82902 0.801088 9.75 1 9.75H5C5.19891 9.75 5.38968 9.82902 5.53033 9.96967C5.67098 10.1103 5.75 10.3011 5.75 10.5Z"
                    fill="white"
                  />
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
