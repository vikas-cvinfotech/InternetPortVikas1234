'use client';

import { useState } from 'react';

const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  
  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  
  return { isLoading, startLoading, stopLoading };
};

export default useLoadingState;