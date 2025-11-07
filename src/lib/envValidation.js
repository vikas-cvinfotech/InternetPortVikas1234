/**
 * Environment Variable Validation
 * Ensures all critical environment variables are properly configured
 * Prevents runtime failures due to missing or invalid configuration
 */

/**
 * Configuration schema defining required and optional environment variables
 */
const ENV_SCHEMA = {
  // Critical Security Variables
  SECRET_COOKIE_PASSWORD: {
    required: true,
    type: 'string',
    minLength: 32,
    description: 'JWT secret for session tokens - must be cryptographically strong'
  },

  // BankID API Configuration
  BANKID_API_URL: {
    required: true,
    type: 'url',
    description: 'BankID API endpoint URL'
  },
  BANKID_API_USER: {
    required: true,
    type: 'string',
    description: 'BankID API username'
  },
  BANKID_API_KEY: {
    required: true,
    type: 'string',
    minLength: 20,
    description: 'BankID API password/key'
  },
  BANKID_API_COMPANY: {
    required: true,
    type: 'uuid',
    description: 'BankID API company GUID'
  },

  // HostBill API Configuration
  HOSTBILL_API_ID: {
    required: true,
    type: 'string',
    description: 'HostBill API ID'
  },
  HOSTBILL_API_KEY: {
    required: true,
    type: 'string',
    minLength: 16,
    description: 'HostBill API key'
  },
  HOSTBILL_API_ENDPOINT: {
    required: true,
    type: 'url',
    description: 'HostBill API endpoint URL'
  },

  // Internetport API Configuration
  REST_API_2_KEY: {
    required: true,
    type: 'string',
    minLength: 16,
    description: 'Internetport REST API v2 key for order creation'
  },
  REST_API_2_ENDPOINT: {
    required: true,
    type: 'url',
    description: 'Internetport REST API v2 endpoint'
  },
  API_INTERNETPORT_SE_X_AUTH_KEY: {
    required: true,
    type: 'string',
    description: 'Internetport address lookup API key'
  },
  API_INTERNETPORT_SE_ENDPOINT: {
    required: true,
    type: 'url',
    description: 'Internetport address lookup API endpoint'
  },

  // External Service APIs
  MAILJET_API_KEY: {
    required: false,
    type: 'string',
    description: 'Mailjet API key for email subscriptions'
  },
  MAILJET_API_SECRET: {
    required: false,
    type: 'string',
    description: 'Mailjet API secret'
  },
  MAILJET_API_CONTACT_URL: {
    required: false,
    type: 'url',
    description: 'Mailjet contact API URL'
  },
  TAWK_TO_API_KEY: {
    required: false,
    type: 'string',
    description: 'Tawk.to API key for support widget'
  },

  // Public Configuration (NEXT_PUBLIC_*)
  NEXT_PUBLIC_GTM_CONTAINER_ID: {
    required: false,
    type: 'string',
    pattern: /^GTM-[A-Z0-9]+$/,
    description: 'Google Tag Manager container ID'
  },
  NEXT_PUBLIC_BASE_URL: {
    required: false,
    type: 'url',
    description: 'Base URL for the application'
  },

  // Product Configuration
  NEXT_PUBLIC_ROUTER_PRODUCT_IDS: {
    required: true,
    type: 'string',
    description: 'Comma-separated list of router product IDs'
  },
  NEXT_PUBLIC_TV_PRODUCT_MAPPINGS: {
    required: false,
    type: 'string',
    description: 'JSON string mapping TV products between environments'
  },
  NEXT_PUBLIC_TELEPHONY_STANDARD_SERVICE_ID: {
    required: true,
    type: 'number',
    description: 'Standard telephony service product ID'
  },
  NEXT_PUBLIC_TELEPHONY_NEW_NUMBER_ADDON_ID: {
    required: true,
    type: 'number',
    description: 'New number addon ID for telephony'
  },
  NEXT_PUBLIC_TELEPHONY_PORT_NUMBER_ADDON_ID: {
    required: true,
    type: 'number',
    description: 'Port number addon ID for telephony'
  },

  // Rate Limiting Configuration
  RATE_LIMIT_GENERAL_POINTS: {
    required: false,
    type: 'number',
    min: 1,
    max: 1000,
    description: 'General rate limit points per window'
  },
  RATE_LIMIT_AUTH_POINTS: {
    required: false,
    type: 'number',
    min: 1,
    max: 100,
    description: 'Authentication rate limit points per window'
  },
  RATE_LIMIT_ORDER_POINTS: {
    required: false,
    type: 'number',
    min: 1,
    max: 50,
    description: 'Order creation rate limit points per window'
  },

  // Caching Configuration
  CACHE_VALIDITY_SECONDS: {
    required: false,
    type: 'number',
    min: 60,
    max: 86400,
    description: 'Cache validity duration in seconds'
  }
};

/**
 * Validation functions for different types
 */
const validators = {
  string: (value, config) => {
    if (typeof value !== 'string') return 'Must be a string';
    if (config.minLength && value.length < config.minLength) {
      return `Must be at least ${config.minLength} characters long`;
    }
    if (config.pattern && !config.pattern.test(value)) {
      return 'Does not match required pattern';
    }
    return null;
  },

  number: (value, config) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return 'Must be a valid number';
    if (config.min !== undefined && num < config.min) {
      return `Must be at least ${config.min}`;
    }
    if (config.max !== undefined && num > config.max) {
      return `Must be at most ${config.max}`;
    }
    return null;
  },

  url: (value) => {
    try {
      new URL(value);
      return null;
    } catch {
      return 'Must be a valid URL';
    }
  },

  uuid: (value) => {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(value)) {
      return 'Must be a valid UUID';
    }
    return null;
  }
};

/**
 * Validate a single environment variable
 */
function validateEnvVar(name, config) {
  const value = process.env[name];
  const errors = [];

  // Check if required variable is missing
  if (config.required && (!value || value.trim() === '')) {
    return [`${name} is required but not set`];
  }

  // Skip validation if optional and not set
  if (!value) return [];

  // Validate type
  const validator = validators[config.type];
  if (validator) {
    const error = validator(value, config);
    if (error) {
      errors.push(`${name}: ${error}`);
    }
  }

  return errors;
}

/**
 * Validate all environment variables according to schema
 */
export function validateEnvironment() {
  const errors = [];
  const warnings = [];

  // Validate each variable in the schema
  for (const [name, config] of Object.entries(ENV_SCHEMA)) {
    const varErrors = validateEnvVar(name, config);
    errors.push(...varErrors);
  }

  // Check for potentially dangerous configurations
  if (process.env.NODE_ENV === 'production') {
    // Production-specific checks
    if (process.env.BANKID_API_URL?.includes('test')) {
      warnings.push('Using test BankID API in production environment');
    }
    if (process.env.HOSTBILL_API_ENDPOINT?.includes('dev')) {
      warnings.push('Using development HostBill API in production environment');
    }
    if (!process.env.SECRET_COOKIE_PASSWORD || process.env.SECRET_COOKIE_PASSWORD.length < 32) {
      errors.push('SECRET_COOKIE_PASSWORD must be at least 32 characters in production');
    }
  }

  // Check for test credentials in production
  const testCredentials = [
    { key: 'BANKID_API_USER', testValue: 'testcompany' },
    { key: 'BANKID_API_KEY', testValue: 'cd12a89b-7643-4e22-ae5b-ed0ca67402ec' },
    { key: 'BANKID_API_COMPANY', testValue: '7e0a62e9-6153-4590-8854-e3fcf0e11699' }
  ];

  if (process.env.NODE_ENV === 'production') {
    for (const { key, testValue } of testCredentials) {
      if (process.env[key] === testValue) {
        errors.push(`${key} appears to be using test/default credentials in production`);
      }
    }
  }

  return { errors, warnings };
}

/**
 * Initialize environment validation (call at application startup)
 */
export function initializeEnvironmentValidation() {
  const { errors, warnings } = validateEnvironment();

  // Log warnings
  if (warnings.length > 0) {
    console.warn('⚠️  Environment Variable Warnings:');
    warnings.forEach(warning => console.warn(`   ${warning}`));
  }

  // Handle errors
  if (errors.length > 0) {
    console.error('❌ Environment Variable Validation Failed:');
    errors.forEach(error => console.error(`   ${error}`));
    
    if (process.env.NODE_ENV === 'production') {
      // In production, exit the process to prevent running with invalid config
      console.error('💥 Exiting due to invalid environment configuration in production');
      process.exit(1);
    } else {
      // In development, log errors but continue (for developer convenience)
      console.warn('🚧 Continuing in development mode despite validation errors');
    }
  } else {
    console.log('✅ All environment variables validated successfully');
  }
}

/**
 * Get environment-specific configuration summary for debugging
 */
export function getEnvironmentSummary() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    environment: process.env.NODE_ENV || 'development',
    bankidEndpoint: process.env.BANKID_API_URL?.replace(/\/api$/, '') || 'not-set',
    hostbillEndpoint: process.env.HOSTBILL_API_ENDPOINT?.replace(/\/.*$/, '') || 'not-set',
    apiEndpoint: process.env.REST_API_2_ENDPOINT?.replace(/\/.*$/, '') || 'not-set',
    hasJwtSecret: !!process.env.SECRET_COOKIE_PASSWORD,
    jwtSecretLength: process.env.SECRET_COOKIE_PASSWORD?.length || 0,
    usingTestCredentials: isProduction ? 'check-disabled-in-prod' : (
      process.env.BANKID_API_USER === 'testcompany' ? 'yes' : 'no'
    )
  };
}