'use client';

/**
 * CardSkeleton - Loading skeleton for cart items and smaller cards
 * Mimics the structure of cart items with addon details
 */
export default function CardSkeleton({ 
  showAddons = false, 
  showImage = false, 
  showQuantityControls = false,
  variant = 'cart' // 'cart', 'product', 'service'
}) {
  if (variant === 'cart') {
    return (
      <div className="animate-pulse bg-primary border border-divider rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="pr-0 sm:pr-6 flex-1">
            {/* Product name skeleton */}
            <div className="h-4 bg-secondary/10 rounded w-3/4 mb-3" />
            
            {/* Product details skeleton */}
            <div className="space-y-2 text-xs">
              {/* Configuration details */}
              <div className="flex items-start">
                <div className="h-3 bg-secondary/10 rounded w-20 mr-2" />
                <div className="h-3 bg-secondary/10 rounded w-24" />
              </div>
              
              {/* Service terms */}
              <div className="h-3 bg-secondary/10 rounded w-32" />
              
              {/* Addons section */}
              {showAddons && (
                <div className="mt-3">
                  <div className="h-3 bg-secondary/10 rounded w-16 mb-2" />
                  <div className="space-y-1">
                    <div className="h-3 bg-secondary/10 rounded w-48" />
                    <div className="h-3 bg-secondary/10 rounded w-40" />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Pricing and controls */}
          <div className="mt-4 sm:mt-0 flex flex-col items-end">
            {/* Price skeleton */}
            <div className="h-4 bg-secondary/10 rounded w-24 mb-1" />
            <div className="h-3 bg-secondary/10 rounded w-20 mb-3" />
            
            {/* Quantity controls skeleton */}
            {showQuantityControls && (
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-secondary/10 rounded border" />
                <div className="w-8 h-6 bg-secondary/10 rounded" />
                <div className="w-8 h-8 bg-secondary/10 rounded border" />
              </div>
            )}
            
            {/* Remove button skeleton */}
            <div className="w-6 h-6 bg-secondary/10 rounded" />
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === 'product') {
    return (
      <div className="animate-pulse bg-primary border border-divider rounded-lg overflow-hidden">
        {/* Image skeleton */}
        {showImage && (
          <div className="aspect-square w-full bg-secondary/5 relative">
            <div className="absolute inset-0 bg-secondary/10" />
          </div>
        )}
        
        <div className="p-4">
          {/* Product name */}
          <div className="h-5 bg-secondary/10 rounded w-3/4 mb-2" />
          
          {/* Description */}
          <div className="space-y-1 mb-4">
            <div className="h-3 bg-secondary/10 rounded w-full" />
            <div className="h-3 bg-secondary/10 rounded w-2/3" />
          </div>
          
          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <div className="h-6 bg-secondary/10 rounded w-20" />
            <div className="h-4 bg-secondary/10 rounded w-16" />
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === 'service') {
    return (
      <div className="animate-pulse bg-primary border border-divider rounded-lg p-6">
        {/* Service title */}
        <div className="h-6 bg-secondary/10 rounded w-2/3 mb-4" />
        
        {/* Service description */}
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-secondary/10 rounded w-full" />
          <div className="h-4 bg-secondary/10 rounded w-4/5" />
          <div className="h-4 bg-secondary/10 rounded w-3/4" />
        </div>
        
        {/* Action button */}
        <div className="h-10 bg-accent/20 rounded w-32" />
      </div>
    );
  }
  
  // Default fallback
  return (
    <div className="animate-pulse bg-primary border border-divider rounded-lg p-4">
      <div className="h-4 bg-secondary/10 rounded w-3/4 mb-2" />
      <div className="h-3 bg-secondary/10 rounded w-1/2" />
    </div>
  );
}