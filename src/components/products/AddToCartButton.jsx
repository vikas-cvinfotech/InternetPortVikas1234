'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function AddToCartButton({ 
  onAdd, 
  disabled = false, 
  className = "",
  children = null,
  showAlreadyAddedMessage = false,
  onAlreadyAddedMessageChange = () => {}
}) {
  const tCommon = useTranslations('common');
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = async () => {
    if (disabled || isAdding) return;
    
    setIsAdding(true);
    onAlreadyAddedMessageChange(false); // Reset message when trying to add
    
    try {
      const result = await onAdd();
      
      // Check if the item was already in cart (based on BroadbandProductStrategy logic)
      if (result === 'already-in-cart') {
        onAlreadyAddedMessageChange(true);
        setIsAdding(false);
        return;
      }
      
      // Only set isAdding to false after a delay if an item was actually added/updated
      setTimeout(() => {
        setIsAdding(false);
      }, 1000); // 1 second delay matching BroadbandProductStrategy
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  };

  const getButtonText = () => {
    if (isAdding) return tCommon('addingToCart') || 'Adding...';
    return children || tCommon('cta.addToCart') || 'Add to cart';
  };

  const getButtonClass = () => {
    // Use design system colors: accent for CTA buttons, secondary for disabled
    const baseClass = `w-full font-bold py-3 px-6 rounded-lg transition-colors ${className}`;
    
    if (disabled || isAdding) {
      // Use secondary color with reduced opacity for disabled state
      return `${baseClass} bg-secondary/30 text-secondary/50 cursor-not-allowed`;
    }
    
    // Use accent color (10% usage) for CTAs as per design guidelines
    return `${baseClass} bg-accent text-primary hover:bg-accent/90`;
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || isAdding}
        className={getButtonClass()}
      >
        {getButtonText()}
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          showAlreadyAddedMessage ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'
        }`}
      >
        <p className="mt-2 text-sm text-center text-accent">{tCommon('itemAlreadyInCart')}</p>
      </div>
    </>
  );
}