/**
 * Utility functions for Bunny CDN image transformations
 */

/**
 * Adds Bunny CDN image transformation parameters to a URL
 * @param {string} imageUrl - The original image URL
 * @param {Object} options - Transformation options
 * @param {number} options.width - Target width in pixels
 * @param {number} options.height - Target height in pixels
 * @param {string} options.fit - Fit mode: 'cover', 'contain', 'fill', 'inside', 'outside'
 * @param {number} options.quality - Image quality (1-100)
 * @param {string} options.format - Output format: 'auto', 'webp', 'jpeg', 'png'
 * @returns {string} - The transformed image URL
 */
export function getBunnyCDNImageUrl(imageUrl, options = {}) {
  // Only apply transformations to Bunny CDN URLs
  if (!imageUrl || !imageUrl.includes('b-cdn.net')) {
    return imageUrl;
  }

  // Parse the URL
  const url = new URL(imageUrl);
  
  // Apply transformation parameters
  if (options.width) {
    url.searchParams.set('width', options.width);
  }
  
  if (options.height) {
    url.searchParams.set('height', options.height);
  }
  
  if (options.fit) {
    url.searchParams.set('fit', options.fit);
  }
  
  if (options.quality) {
    url.searchParams.set('quality', options.quality);
  }
  
  if (options.format) {
    url.searchParams.set('format', options.format);
  }
  
  return url.toString();
}

/**
 * Preset configurations for different image contexts
 */
export const IMAGE_PRESETS = {
  // Product gallery main image
  productHero: {
    width: 800,
    height: 800,
    fit: 'cover',
    quality: 85,
    format: 'auto'
  },
  
  // Product gallery thumbnails
  productThumbnail: {
    width: 120,
    height: 120,
    fit: 'cover',
    quality: 80,
    format: 'auto'
  },
  
  // Product grid/list view
  productCard: {
    width: 400,
    height: 400,
    fit: 'cover',
    quality: 80,
    format: 'auto'
  },
  
  // Mobile optimized hero
  productHeroMobile: {
    width: 600,
    height: 600,
    fit: 'cover',
    quality: 80,
    format: 'auto'
  }
};

/**
 * Get responsive image srcset for different screen sizes
 * @param {string} imageUrl - The original image URL
 * @param {Array} sizes - Array of width sizes
 * @returns {string} - The srcset string
 */
export function getResponsiveSrcSet(imageUrl, sizes = [400, 600, 800, 1200]) {
  return sizes
    .map(width => {
      const url = getBunnyCDNImageUrl(imageUrl, { 
        width, 
        fit: 'cover',
        quality: 85,
        format: 'auto'
      });
      return `${url} ${width}w`;
    })
    .join(', ');
}