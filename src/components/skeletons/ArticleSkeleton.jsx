'use client';

/**
 * ArticleSkeleton - Loading skeleton for article/content pages
 * Mimics the structure of ArticleContent and knowledge base articles
 */
export default function ArticleSkeleton({ showBackButton = false }) {
  return (
    <div className="animate-pulse">
      {/* Back button skeleton */}
      {showBackButton && (
        <div className="mb-2 flex items-center">
          <div className="w-5 h-5 bg-secondary/10 rounded mr-2" />
          <div className="h-4 bg-secondary/10 rounded w-12" />
        </div>
      )}
      
      {/* Title skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-secondary/10 rounded w-3/4 mb-2" />
        <div className="h-8 bg-secondary/10 rounded w-1/2" />
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-4">
        {/* First paragraph */}
        <div className="space-y-2">
          <div className="h-4 bg-secondary/10 rounded w-full" />
          <div className="h-4 bg-secondary/10 rounded w-full" />
          <div className="h-4 bg-secondary/10 rounded w-4/5" />
        </div>
        
        {/* Second paragraph */}
        <div className="space-y-2">
          <div className="h-4 bg-secondary/10 rounded w-full" />
          <div className="h-4 bg-secondary/10 rounded w-full" />
          <div className="h-4 bg-secondary/10 rounded w-3/4" />
        </div>
        
        {/* Third paragraph */}
        <div className="space-y-2">
          <div className="h-4 bg-secondary/10 rounded w-full" />
          <div className="h-4 bg-secondary/10 rounded w-5/6" />
        </div>
        
        {/* Subheading skeleton */}
        <div className="mt-8 mb-4">
          <div className="h-6 bg-secondary/10 rounded w-2/3" />
        </div>
        
        {/* More content paragraphs */}
        <div className="space-y-2">
          <div className="h-4 bg-secondary/10 rounded w-full" />
          <div className="h-4 bg-secondary/10 rounded w-full" />
          <div className="h-4 bg-secondary/10 rounded w-2/3" />
        </div>
        
        {/* List items skeleton */}
        <div className="space-y-3 mt-6">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-secondary/10 rounded-full mt-2 mr-3 flex-shrink-0" />
            <div className="h-4 bg-secondary/10 rounded w-4/5" />
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-secondary/10 rounded-full mt-2 mr-3 flex-shrink-0" />
            <div className="h-4 bg-secondary/10 rounded w-3/4" />
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-secondary/10 rounded-full mt-2 mr-3 flex-shrink-0" />
            <div className="h-4 bg-secondary/10 rounded w-5/6" />
          </div>
        </div>
        
        {/* Final paragraph */}
        <div className="space-y-2 mt-8">
          <div className="h-4 bg-secondary/10 rounded w-full" />
          <div className="h-4 bg-secondary/10 rounded w-2/3" />
        </div>
      </div>
      
      {/* Back to Knowledge Base button skeleton - centered */}
      <div className="mt-12 flex justify-center">
        <div className="h-10 bg-secondary/10 rounded w-48" />
      </div>
    </div>
  );
}