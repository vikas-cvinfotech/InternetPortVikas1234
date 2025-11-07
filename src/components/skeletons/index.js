// Skeleton Components - Centralized exports for easy importing

export { default as ArticleSkeleton } from './ArticleSkeleton';
export { default as CardSkeleton } from './CardSkeleton';
export { default as PageSkeleton } from './PageSkeleton';
export { default as CartSkeleton } from './CartSkeleton';

// Convenience re-exports for common use cases
import React from 'react';
import CardSkeleton from './CardSkeleton';

export const ProductSkeleton = (props) => <CardSkeleton variant="product" showImage={true} {...props} />;
export const CartItemSkeleton = (props) => <CardSkeleton variant="cart" showAddons={true} {...props} />;
export const ServiceSkeleton = (props) => <CardSkeleton variant="service" {...props} />;