'use client';

import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';

export const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  // On initial load, try to get the order details from sessionStorage.
  // The function inside useState ensures this runs only once.
  const [orderDetails, setOrderDetailsState] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const storedDetails = sessionStorage.getItem('orderDetails');
      return storedDetails ? JSON.parse(storedDetails) : null;
    } catch (error) {
      console.error('Failed to parse orderDetails from sessionStorage', error);
      return null;
    }
  });

  // This effect runs whenever orderDetails changes, saving it to sessionStorage.
  useEffect(() => {
    try {
      if (orderDetails) {
        sessionStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      } else {
        // If orderDetails is null (e.g., after clearing), remove it.
        sessionStorage.removeItem('orderDetails');
      }
    } catch (error) {
      console.error('Failed to save orderDetails to sessionStorage', error);
    }
  }, [orderDetails]);

  const setOrderDetails = useCallback((details) => {
    setOrderDetailsState(details);
  }, []);

  const clearOrderDetails = useCallback(() => {
    setOrderDetailsState(null);
  }, []);

  const value = useMemo(
    () => ({
      orderDetails,
      setOrderDetails,
      clearOrderDetails,
    }),
    [orderDetails, setOrderDetails, clearOrderDetails],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
