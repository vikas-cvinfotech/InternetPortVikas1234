'use client';

/**
 * ArticleListSkeleton - Loading skeleton for article listings
 * Used in Knowledge Base Category Pages
 */
export default function ArticleListSkeleton({ count = 10 }) {
  return (
    <div className="container mx-auto p-6 bg-primary">
      {/* Search bar skeleton - matches SearchArticles component */}
      <div className="mb-12">
        <div className="max-w-xl mx-auto">
          <div className="h-12 bg-secondary/10 rounded-lg animate-pulse" />
        </div>
      </div>
      
      <section className="space-y-4">
        {/* Category name heading */}
        <div className="h-7 bg-secondary/10 rounded w-1/4 mb-12 animate-pulse" />
        
        {/* Results count heading */}
        <div className="h-7 bg-secondary/10 rounded w-1/3 animate-pulse" />
        
        {/* Article list matching the actual layout */}
        <ul className="space-y-3">
          {[...Array(count)].map((_, index) => (
            <li
              key={index}
              className="p-4 border border-divider rounded animate-pulse"
            >
              <div className="flex items-center space-x-3">
                {/* Document icon skeleton */}
                <div className="h-6 w-6 bg-secondary/10 rounded flex-shrink-0" />
                {/* Article title skeleton with varying widths for realism */}
                <div 
                  className="h-5 bg-secondary/10 rounded" 
                  style={{ width: `${Math.min(60 + (index % 3) * 15, 75)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        
        {/* Back to Knowledge Base button skeleton - centered */}
        <div className="pt-4 flex justify-center">
          <div className="h-10 bg-secondary/10 rounded w-48 animate-pulse" />
        </div>
      </section>
    </div>
  );
}