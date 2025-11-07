'use client';

/**
 * PageSkeleton - Loading skeleton for full page layouts
 * Provides skeleton layouts for different page types
 */
export default function PageSkeleton({ 
  variant = 'article', // 'article', 'product', 'category', 'checkout'
  showSidebar = false 
}) {
  if (variant === 'article') {
    return (
      <div className="animate-pulse max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="h-4 bg-secondary/10 rounded w-16" />
          <div className="w-4 h-4 bg-secondary/10 rounded" />
          <div className="h-4 bg-secondary/10 rounded w-20" />
          <div className="w-4 h-4 bg-secondary/10 rounded" />
          <div className="h-4 bg-secondary/10 rounded w-24" />
        </div>
        
        {/* Page title */}
        <div className="mb-8">
          <div className="h-10 bg-secondary/10 rounded w-3/4 mb-2" />
          <div className="h-10 bg-secondary/10 rounded w-1/2" />
        </div>
        
        {/* Content sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="space-y-4">
            <div className="h-6 bg-secondary/10 rounded w-1/3" />
            <div className="space-y-2">
              <div className="h-4 bg-secondary/10 rounded w-full" />
              <div className="h-4 bg-secondary/10 rounded w-full" />
              <div className="h-4 bg-secondary/10 rounded w-4/5" />
            </div>
          </div>
          
          {/* Section 2 */}
          <div className="space-y-4">
            <div className="h-6 bg-secondary/10 rounded w-2/5" />
            <div className="space-y-2">
              <div className="h-4 bg-secondary/10 rounded w-full" />
              <div className="h-4 bg-secondary/10 rounded w-3/4" />
            </div>
          </div>
          
          {/* Section 3 */}
          <div className="space-y-4">
            <div className="h-6 bg-secondary/10 rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-32 bg-secondary/10 rounded" />
              <div className="h-32 bg-secondary/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === 'product') {
    return (
      <div 
        className="animate-pulse max-w-7xl mx-auto px-4 py-8"
        style={{ minHeight: '80vh' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product images */}
          <div className="space-y-4">
            <div className="aspect-square bg-secondary/10 rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-secondary/10 rounded" />
              ))}
            </div>
          </div>
          
          {/* Product details */}
          <div className="space-y-6">
            {/* Title and price */}
            <div>
              <div className="h-8 bg-secondary/10 rounded w-3/4 mb-2" />
              <div className="h-10 bg-secondary/10 rounded w-1/2 mb-4" />
              <div className="h-4 bg-secondary/10 rounded w-1/3" />
            </div>
            
            {/* Configuration options */}
            <div className="space-y-4">
              <div className="h-6 bg-secondary/10 rounded w-1/4" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-secondary/10 rounded border" />
                ))}
              </div>
            </div>
            
            {/* Add to cart */}
            <div className="h-12 bg-accent/20 rounded w-full" />
            
            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-secondary/10 rounded w-full" />
              <div className="h-4 bg-secondary/10 rounded w-4/5" />
              <div className="h-4 bg-secondary/10 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === 'category') {
    return (
      <div className="animate-pulse max-w-7xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="h-10 bg-secondary/10 rounded w-1/2 mb-4" />
          <div className="h-4 bg-secondary/10 rounded w-3/4" />
        </div>
        
        {/* Filters and sorting */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="h-10 bg-secondary/10 rounded w-32" />
          <div className="h-10 bg-secondary/10 rounded w-24" />
          <div className="h-10 bg-secondary/10 rounded w-28" />
        </div>
        
        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square bg-secondary/10 rounded-lg" />
              <div className="h-4 bg-secondary/10 rounded w-3/4" />
              <div className="h-6 bg-secondary/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (variant === 'checkout') {
    return (
      <div className="animate-pulse max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout form */}
          <div className="space-y-6">
            <div className="h-8 bg-secondary/10 rounded w-1/2" />
            
            {/* Personal info section */}
            <div className="space-y-4">
              <div className="h-6 bg-secondary/10 rounded w-1/3" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-secondary/10 rounded border" />
                <div className="h-10 bg-secondary/10 rounded border" />
              </div>
              <div className="h-10 bg-secondary/10 rounded border" />
              <div className="h-10 bg-secondary/10 rounded border" />
            </div>
            
            {/* Address section */}
            <div className="space-y-4">
              <div className="h-6 bg-secondary/10 rounded w-1/4" />
              <div className="h-10 bg-secondary/10 rounded border" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-10 bg-secondary/10 rounded border col-span-2" />
                <div className="h-10 bg-secondary/10 rounded border" />
              </div>
            </div>
            
            {/* Payment section */}
            <div className="space-y-4">
              <div className="h-6 bg-secondary/10 rounded w-1/4" />
              <div className="h-40 bg-secondary/10 rounded border" />
            </div>
          </div>
          
          {/* Order summary */}
          <div className="space-y-6">
            <div className="h-6 bg-secondary/10 rounded w-1/3" />
            
            {/* Cart items */}
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-secondary/5 rounded-lg p-4">
                  <div className="h-4 bg-secondary/10 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-secondary/10 rounded w-1/2 mb-2" />
                  <div className="h-5 bg-secondary/10 rounded w-1/4" />
                </div>
              ))}
            </div>
            
            {/* Summary totals */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 bg-secondary/10 rounded w-20" />
                <div className="h-4 bg-secondary/10 rounded w-16" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-secondary/10 rounded w-16" />
                <div className="h-4 bg-secondary/10 rounded w-16" />
              </div>
              <div className="flex justify-between border-t pt-3">
                <div className="h-6 bg-secondary/10 rounded w-20" />
                <div className="h-6 bg-secondary/10 rounded w-20" />
              </div>
            </div>
            
            {/* Place order button */}
            <div className="h-12 bg-accent/20 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  // Default layout with sidebar
  return (
    <div className="animate-pulse max-w-7xl mx-auto px-4 py-8">
      <div className={`grid gap-8 ${showSidebar ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1'}`}>
        {/* Sidebar */}
        {showSidebar && (
          <div className="space-y-6">
            <div className="h-6 bg-secondary/10 rounded w-2/3" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-secondary/10 rounded w-full" />
              ))}
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className={showSidebar ? 'col-span-3' : 'col-span-1'}>
          <div className="space-y-8">
            <div className="h-8 bg-secondary/10 rounded w-1/2" />
            <div className="space-y-4">
              <div className="h-4 bg-secondary/10 rounded w-full" />
              <div className="h-4 bg-secondary/10 rounded w-4/5" />
              <div className="h-4 bg-secondary/10 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}