'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

export function DomainSearchBox({ btn_bg_color }) {
  const t = useTranslations('searchAddresses');

  const [inputValue, setInputValue] = useState('');
  const formRef = useRef(null);

  const redirectToDomainCheck = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const redirectUrl = `https://portal.internetport.com/?cmd=checkdomain&action=checkdomain&domain=${encodeURIComponent(
      trimmedInput
    )}&singlecheck=1&register=1&domain_cat=6`;

    // Redirect user
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    redirectToDomainCheck();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      redirectToDomainCheck();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex sm:flex-row shadow-secondaryShadow">
      <div className="min-w-0 flex-1">
        <label htmlFor="domain-search-input" className="sr-only">
          Domain Search
        </label>

        <input
          id="domain-search-input"
          type="search"
          placeholder={'example.com'}
          className="block w-full rounded-tl-[4px] rounded-bl-[4px] border border-divider py-[16px] px-[16px] text-sm font-medium text-mediumGray placeholder:text-mediumGray/75 shadow-xs sm:text-base focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          required
        />
      </div>

      <div className="sm:flex-shrink-0">
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className={`block w-full rounded-tr-[4px] rounded-br-[4px] border border-transparent ${
            btn_bg_color === 'red' ? 'bg-accent text-primary' : 'bg-secondary text-primary'
          } px-[16px] py-[16px] text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity sm:text-base sm:w-auto focus:outline-none capitalize`}
        >
          Check Availability
        </button>
      </div>
    </form>
  );
}
