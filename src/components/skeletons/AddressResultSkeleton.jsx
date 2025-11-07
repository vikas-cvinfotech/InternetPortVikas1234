'use client';

/**
 * AddressResultSkeleton - Loading skeleton for address search results
 * Used in Address Search Page for loading states
 */
export default function AddressResultSkeleton({ count = 8 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-8">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse relative p-3 rounded-lg border border-divider flex flex-col bg-secondary/5"
        >
          {/* Status badge */}
          <div className="absolute top-0 left-0 w-16 h-5 bg-secondary/10 rounded-br-lg" />
          
          {/* Address content */}
          <div className="pt-6 space-y-2 flex-grow">
            <div className="h-4 bg-secondary/10 rounded w-3/4" />
            <div className="h-3 bg-secondary/10 rounded w-1/2" />
          </div>
          
          {/* Footer info */}
          <div className="mt-2 space-y-1 text-right">
            <div className="h-3 bg-secondary/10 rounded w-20 ml-auto" />
            <div className="h-4 bg-secondary/10 rounded w-12 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}