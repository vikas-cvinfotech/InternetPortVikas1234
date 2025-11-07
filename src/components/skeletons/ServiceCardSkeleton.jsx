'use client';

/**
 * ServiceCardSkeleton - Loading skeleton for service cards
 * Used in BroadbandServiceSelector for loading states
 */
export default function ServiceCardSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-secondary/5 rounded-lg p-6 border border-divider"
        >
          {/* Service name */}
          <div className="h-6 bg-secondary/10 rounded w-3/4 mb-2" />
          
          {/* Speed badge */}
          <div className="h-5 bg-secondary/10 rounded-full w-24 mb-4" />
          
          {/* Price */}
          <div className="h-8 bg-secondary/10 rounded w-1/2 mb-1" />
          <div className="h-4 bg-secondary/10 rounded w-1/3 mb-4" />
          
          {/* Features list */}
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-secondary/10 rounded w-full" />
            <div className="h-3 bg-secondary/10 rounded w-4/5" />
            <div className="h-3 bg-secondary/10 rounded w-3/4" />
          </div>
          
          {/* Button */}
          <div className="h-10 bg-accent/20 rounded w-full" />
        </div>
      ))}
    </div>
  );
}