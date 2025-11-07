'use client';

/**
 * CartSkeleton - Loading skeleton specifically for cart page
 * Mimics the structure of the cart page with items list and order summary
 */
export default function CartSkeleton() {
  return (
    <div className="bg-primary">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        {/* Cart title skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 bg-secondary/10 rounded w-64 mx-auto animate-pulse" />
        </div>

        <div className="animate-pulse">
          {/* Cart items section */}
          <section aria-labelledby="cart-heading">
            <div className="divide-y divide-divider border-b border-t border-divider">
              {/* Cart item skeletons */}
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex py-6 sm:py-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between w-full">
                    <div className="pr-0 sm:pr-6 flex-1">
                      {/* Product name */}
                      <div className="h-4 bg-secondary/10 rounded w-3/4 mb-3" />
                      
                      {/* Product details */}
                      <div className="space-y-2 text-xs mb-4">
                        <div className="h-3 bg-secondary/10 rounded w-48" />
                        <div className="h-3 bg-secondary/10 rounded w-32" />
                        <div className="h-3 bg-secondary/10 rounded w-40" />
                        
                        {/* Addons section */}
                        <div className="mt-3">
                          <div className="h-3 bg-secondary/10 rounded w-16 mb-2" />
                          <div className="space-y-1">
                            <div className="h-3 bg-secondary/10 rounded w-52" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Pricing and controls */}
                    <div className="mt-1 sm:mt-0 flex flex-col items-end">
                      {/* Price */}
                      <div className="h-4 bg-secondary/10 rounded w-24 mb-1" />
                      <div className="h-3 bg-secondary/10 rounded w-20 mb-3" />
                      
                      {/* Remove button */}
                      <div className="w-6 h-6 bg-secondary/10 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Order summary section */}
          <section className="mt-10 rounded-lg bg-secondary/5 px-4 py-6 sm:p-6 lg:p-8">
            {/* Summary title */}
            <div className="h-6 bg-secondary/10 rounded w-32 mb-6" />

            <div className="space-y-4">
              {/* Summary rows */}
              <div className="flex justify-between">
                <div className="h-4 bg-secondary/10 rounded w-32" />
                <div className="h-4 bg-secondary/10 rounded w-20" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-secondary/10 rounded w-40" />
                <div className="h-4 bg-secondary/10 rounded w-24" />
              </div>
              
              {/* Checkout button */}
              <div className="mt-6 h-12 bg-accent/20 rounded-md w-full" />
              
              {/* Continue shopping link */}
              <div className="mt-4 text-center">
                <div className="h-4 bg-secondary/10 rounded w-40 mx-auto" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}