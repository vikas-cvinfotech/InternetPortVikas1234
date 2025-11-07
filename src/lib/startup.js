/**
 * Application Startup Initialization
 * Handles critical startup tasks like environment validation
 */

import { initializeEnvironmentValidation } from './envValidation';

let isInitialized = false;

/**
 * Initialize the application (call once at startup)
 * This should be called from server-side code before handling requests
 */
export function initializeApplication() {
  // Prevent multiple initializations
  if (isInitialized) {
    return;
  }

  console.log('🚀 Initializing Internetport Application...');

  try {
    // Validate environment variables
    initializeEnvironmentValidation();

    // Mark as initialized
    isInitialized = true;
    console.log('✅ Application initialization completed successfully');
    
  } catch (error) {
    console.error('💥 Application initialization failed:', error.message);
    
    // In production, exit the process
    if (process.env.NODE_ENV === 'production') {
      console.error('🛑 Exiting due to initialization failure in production');
      process.exit(1);
    } else {
      console.warn('⚠️  Continuing despite initialization failure (development mode)');
      throw error;
    }
  }
}

/**
 * Get initialization status
 */
export function getInitializationStatus() {
  return {
    initialized: isInitialized,
    timestamp: new Date().toISOString()
  };
}