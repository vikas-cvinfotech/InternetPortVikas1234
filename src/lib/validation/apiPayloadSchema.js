import { z } from 'zod';
import { isSwedishIdentityNumber } from './isSwedishIdentityNumber.js';
import { getAllTvServiceProductIds } from '../../config/tvProducts.js';
import { getAllTelephonyServiceProductIds } from '../../config/telephonyProducts.js';
import { getNewNumberAddonId, getPortNumberAddonId } from '../../config/telephonyAddons.js';

/**
 * Creates and returns the Zod schema for the API payload.
 * This schema follows the API documentation requirements for e-commerce orders.
 * @returns {z.ZodObject} The fully constructed Zod schema.
 */
export const getApiPayloadSchema = () => {
  const CATEGORY_ID_BROADBAND = parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_BROADBAND, 10);
  const CATEGORY_ID_TV = parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_TV, 10);
  const CATEGORY_ID_TELEPHONY = parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_TELEPHONY, 10);
  
  // Get environment-specific product and addon IDs
  const TV_SERVICE_PRODUCT_IDS = getAllTvServiceProductIds();
  const TELEPHONY_SERVICE_PRODUCT_IDS = getAllTelephonyServiceProductIds();
  const NEW_NUMBER_ADDON_ID = getNewNumberAddonId();
  const PORT_NUMBER_ADDON_ID = getPortNumberAddonId();
  
  // Router product IDs from environment
  const ROUTER_PRODUCT_IDS = new Set(
    (process.env.NEXT_PUBLIC_ROUTER_PRODUCT_IDS || '')
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id))
  );

  // --- Define Individual Product Schemas According to API Documentation ---
  
  // Broadband Products: Non-router products require serviceId, accessId, cityNet
  const broadbandProductSchema = z.object({
    hostBillProductId: z.number(),
    quantity: z.number().max(1, 'Broadband services cannot have quantity > 1'),
    categoryId: z.number(),
    serviceId: z.number().optional(), // Required for non-router products
    accessId: z.string().optional(), // Required for non-router products
    cityNet: z.string().optional(), // Required for non-router products
    apartmentNumberSocketId: z.string().optional(),
    mduDistinguisher: z.string().optional(),
    addons: z.array(z.object({
      id: z.number(),
      qty: z.number().min(1)
    })).optional()
  }).refine((data) => {
    // Router products have no special field requirements
    if (ROUTER_PRODUCT_IDS.has(data.hostBillProductId)) {
      return true;
    }
    // Non-router broadband products require serviceId, accessId, cityNet
    return data.serviceId && data.accessId && data.cityNet;
  }, {
    message: 'Broadband services (non-router) require serviceId, accessId, and cityNet',
    path: ['serviceId']
  });
  
  // TV Products: Base packages require cityNet, hardware products have no special requirements
  const tvProductSchema = z.object({
    hostBillProductId: z.number(),
    quantity: z.number(),
    categoryId: z.number(),
    cityNet: z.string().optional(), // Required for TV base packages
    accessId: z.string().optional(),
    apartmentNumberSocketId: z.string().optional(),
    mduDistinguisher: z.string().optional(),
    addons: z.array(z.object({
      id: z.number(),
      qty: z.number().min(1)
    })).optional()
  }).refine((data) => {
    // Check if this is a TV service (base package) or TV hardware
    const isTvService = TV_SERVICE_PRODUCT_IDS.includes(data.hostBillProductId);
    
    if (isTvService) {
      // TV base packages must have quantity = 1 and require cityNet
      return data.quantity === 1 && data.cityNet;
    }
    // TV hardware products have no special requirements and can have quantity > 1
    return true;
  }, {
    message: 'TV base packages require cityNet and quantity must be 1',
    path: ['cityNet']
  });
  
  // Telephony Products: Services require phoneNumber and appropriate addons
  const telephonyProductSchema = z.object({
    hostBillProductId: z.number(),
    quantity: z.number(),
    categoryId: z.number(),
    phoneNumber: z.string().optional(), // Required for telephony services
    associatedOrgPersonNr: z.string().optional(), // Required for number porting
    addons: z.array(z.object({
      id: z.number(),
      qty: z.number().min(1)
    })).optional()
  }).refine((data) => {
    // Check if this is a telephony service or telephony hardware
    const isTelephonyService = TELEPHONY_SERVICE_PRODUCT_IDS.includes(data.hostBillProductId);
    
    if (isTelephonyService) {
      // Telephony services require phoneNumber
      return data.phoneNumber && data.phoneNumber.length > 0;
    }
    // Telephony hardware products have no special requirements
    return true;
  }, {
    message: 'Telephony services require a phoneNumber field',
    path: ['phoneNumber']
  }).refine((data) => {
    // Telephony services cannot have quantity > 1
    const isTelephonyService = TELEPHONY_SERVICE_PRODUCT_IDS.includes(data.hostBillProductId);
    
    if (isTelephonyService) {
      return data.quantity <= 1;
    }
    // Telephony hardware can have quantity > 1
    return true;
  }, {
    message: 'Telephony services cannot have quantity > 1',
    path: ['quantity']
  }).refine((data) => {
    // Validate addon requirements for telephony services
    const isTelephonyService = TELEPHONY_SERVICE_PRODUCT_IDS.includes(data.hostBillProductId);
    
    if (isTelephonyService && data.addons && data.addons.length > 0) {
      const hasNewNumberAddon = data.addons.some(addon => addon.id === NEW_NUMBER_ADDON_ID);
      const hasPortNumberAddon = data.addons.some(addon => addon.id === PORT_NUMBER_ADDON_ID);
      
      // For porting, must have associatedOrgPersonNr and port number addon
      if (hasPortNumberAddon) {
        return data.associatedOrgPersonNr && data.associatedOrgPersonNr.length > 0;
      }
      
      // Must have either new number addon or port number addon
      return hasNewNumberAddon || hasPortNumberAddon;
    }
    return true;
  }, {
    message: 'Number porting requires associatedOrgPersonNr, or include new number addon',
    path: ['associatedOrgPersonNr']
  });
  
  // Generic Product Schema for other categories
  const genericProductSchema = z.object({
    hostBillProductId: z.number(),
    quantity: z.number().min(1),
    categoryId: z.number(),
    addons: z.array(z.object({
      id: z.number(),
      qty: z.number().min(1)
    })).optional()
  });

  // --- Define the Main Payload Schema ---
  return z.object({
    customer: z
      .object({
        type: z.enum(['Private', 'Company']),
        orgPersonNr: z.string().trim(),
        firstName: z.string().trim().min(1),
        lastName: z.string().trim().min(1),
        address: z.string().trim().min(1),
        city: z.string().trim().min(1),
        postalCode: z.string().transform((val) => val.replace(/\s/g, '')),
        phoneNumber: z.string().transform((val) => val.replace(/\D/g, '')),
        email: z.string().email(),
        companyName: z.string().optional(),
      })
      // This .refine block ensures companyName is present for Company type.
      .refine(
        (data) =>
          data.type === 'Company'
            ? typeof data.companyName === 'string' && data.companyName.length > 0
            : true,
        {
          message: 'companyName is required for customers of type "Company"',
          path: ['companyName'],
        },
      )
      // This superRefine block adds the dynamic validation for personal data.
      .superRefine((data, ctx) => {
        // Phone Number Validation
        if (data.phoneNumber.length < 8 || data.phoneNumber.length > 19) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Phone number must be between 8 and 19 digits.',
            path: ['phoneNumber'],
          });
        }

        // Identity and Postal Code Validation.
        if (isSwedishIdentityNumber(data.orgPersonNr)) {
          // Swedish Postal Code
          if (!/^\d{5}$/.test(data.postalCode)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'A valid 5-digit Swedish postal code is required.',
              path: ['postalCode'],
            });
          }
          // Swedish Identity Number.
          const numericId = data.orgPersonNr.replace(/\D/g, '');
          const expectedLength = data.type === 'Private' ? 12 : 10;
          if (numericId.length !== expectedLength) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Swedish ${data.type} ID must be ${expectedLength} digits.`,
              path: ['orgPersonNr'],
            });
          }
        } else {
          // International Postal Code.
          if (data.postalCode.length < 3) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Postal code must be at least 3 characters long.',
              path: ['postalCode'],
            });
          }
          // International Identity Number.
          if (data.orgPersonNr.length < 5) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'International ID number must be at least 5 characters long.',
              path: ['orgPersonNr'],
            });
          }
        }
      }),

    productList: z
      .array(z.any())
      .min(1, { message: 'Product list cannot be empty.' })
      .superRefine((products, ctx) => {
        // Count products by category (exclude router products from broadband count)
        const broadbandCount = products.filter(p => {
          const categoryId = Number(p?.categoryId);
          const productId = Number(p?.hostBillProductId);
          const isRouter = ROUTER_PRODUCT_IDS.has(productId);
          return categoryId === CATEGORY_ID_BROADBAND && !isRouter;
        }).length;
        
        // TV base packages are identified by being actual TV service products, not just by category ID
        const tvBasePackageCount = products.filter(p => {
          const productId = Number(p?.hostBillProductId);
          const isActualTvService = TV_SERVICE_PRODUCT_IDS.includes(productId);
          const hasBaseQuantity = p?.quantity === 1;
          return isActualTvService && hasBaseQuantity;
        }).length;
        
        const telephonyServiceCount = products.filter(p => {
          const productId = Number(p?.hostBillProductId);
          const isTelephonyService = TELEPHONY_SERVICE_PRODUCT_IDS.includes(productId);
          return isTelephonyService;
        }).length;

        // Enforce quantity limits
        if (broadbandCount > 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Only one broadband service is allowed per order.',
            path: ['productList'],
          });
        }
        if (tvBasePackageCount > 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Only one TV base package is allowed per order.',
            path: ['productList'],
          });
        }
        if (telephonyServiceCount > 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Only one telephony service is allowed per order.',
            path: ['productList'],
          });
        }

        products.forEach((product, index) => {
          let schema;
          const categoryId = Number(product?.categoryId);
          const productId = Number(product?.hostBillProductId);
          const isRouter = ROUTER_PRODUCT_IDS.has(productId);

          switch (categoryId) {
            case CATEGORY_ID_BROADBAND:
              // Use generic schema for router products to avoid quantity restrictions
              schema = isRouter ? genericProductSchema : broadbandProductSchema;
              break;
            case CATEGORY_ID_TV:
              schema = tvProductSchema;
              break;
            case CATEGORY_ID_TELEPHONY:
              schema = telephonyProductSchema;
              break;
            default:
              schema = genericProductSchema;
              break;
          }

          const result = schema.safeParse(product);
          if (!result.success) {
            result.error.issues.forEach((issue) => {
              ctx.addIssue({ ...issue, path: [index, ...issue.path] });
            });
          }
        });
      }),

    desiredActivationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    sendInvoiceWith: z.enum(['email', 'paper', 'kivra']),
    billingFrequency: z.enum(['monthly', 'quarterly']),
  });
};
