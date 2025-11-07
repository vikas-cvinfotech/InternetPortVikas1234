'use client';

import { useState, useEffect } from 'react';

/**
 * A custom hook to detect if the current device is mobile based on its user agent.
 * @returns {{isMobile: boolean}} An object containing a boolean indicating if the device is mobile.
 */
export function useDevice() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Ensure this only runs on the client side where `window` is available.
    if (typeof window !== 'undefined') {
      setIsMobile(/Mobi/i.test(window.navigator.userAgent));
    }
  }, []);

  return { isMobile };
}
