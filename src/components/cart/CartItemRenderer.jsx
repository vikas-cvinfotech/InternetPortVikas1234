'use client';

import React from 'react';
import { RouterCartItem } from './RouterCartItem';
import { StandardCartItem } from './StandardCartItem';
import { TvCartItem } from './TvCartItem';
import { TvHardwareCartItem } from './TvHardwareCartItem';
import { TelephonyCartItem } from './TelephonyCartItem';
import { TelephonyHardwareCartItem } from './TelephonyHardwareCartItem';

// Component mapping for different product categories
const CART_ITEM_COMPONENTS = {
  'ROUTER': RouterCartItem,
  'BROADBAND': StandardCartItem,    // Keep existing broadband behavior
  'TV': TvCartItem,                 // TV services with addon support
  'TV_HARDWARE': TvHardwareCartItem, // TV hardware (digital boxes) with installment support
  'TELEPHONY': TelephonyCartItem,   // Telephony services with addon support
  'TELEPHONY_HARDWARE': StandardCartItem, // Telephony hardware
  'TELEPHONY_HARDWARE_MONTHLY_BOUND': TelephonyHardwareCartItem, // Monthly bound telephony hardware with installment support
  'STANDARD': StandardCartItem
};

export const CartItemRenderer = ({ 
  product, 
  cartItems, 
  taxRate, 
  onQuantityChange, 
  onRemove 
}) => {
  // Get the category type from the product (set by CartContext)
  const categoryType = product.categoryType || 'STANDARD';
  
  
  // Select the appropriate component, fallback to StandardCartItem
  const ComponentToRender = CART_ITEM_COMPONENTS[categoryType] || StandardCartItem;
  
  return (
    <ComponentToRender
      product={product}
      cartItems={cartItems}
      taxRate={taxRate}
      onQuantityChange={onQuantityChange}
      onRemove={onRemove}
    />
  );
};