import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { getApiPayloadSchema } from '@/lib/validation/apiPayloadSchema';
import { getAllTvServiceProductIds } from '@/config/tvProducts';
import { getNewNumberAddonId, getPortNumberAddonId } from '@/config/telephonyAddons';
import { getTelephonyServiceId, getTelephonyHardwareId } from '@/config/telephonyProducts';
import { validateCSRFMiddleware } from '@/lib/csrf';
import { orderRateLimiter, applyRateLimiter } from '@/lib/rateLimit';
import { sanitizeFormInput, sanitizeEmail, sanitizePhoneNumber } from '@/lib/utils/sanitization';
import { initializeApplication } from '@/lib/startup';

const routerProductIds = new Set(
  (process.env.NEXT_PUBLIC_ROUTER_PRODUCT_IDS || '')
    .split(',')
    .map((id) => parseInt(id.trim(), 10)),
);

function formatPayloadForApi(orderDetails) {
  const { customerDetails, paymentDetails, cart } = orderDetails;

  // Sanitize all customer input to prevent XSS
  const customerPayload = {
    type: customerDetails.type,
    orgPersonNr: customerDetails.orgPersonNr, // Already validated by schema
    firstName: sanitizeFormInput(customerDetails.firstName, { maxLength: 50 }),
    lastName: sanitizeFormInput(customerDetails.lastName, { maxLength: 50 }),
    address: sanitizeFormInput(customerDetails.address, { maxLength: 100 }),
    city: sanitizeFormInput(customerDetails.city, { maxLength: 50 }),
    postalCode: sanitizeFormInput(customerDetails.postalCode, { maxLength: 10, allowSpaces: false }),
    phoneNumber: sanitizePhoneNumber(customerDetails.phoneNumber),
    email: sanitizeEmail(customerDetails.email),
  };

  if (customerDetails.type === 'Company' && customerDetails.companyName) {
    customerPayload.companyName = sanitizeFormInput(customerDetails.companyName, { maxLength: 100 });
  }

  // Process cart items and collect additional products (like telephony hardware)
  const productList = [];
  
  cart.items.forEach((item) => {
      const hostBillProductId = parseInt(item.id, 10);
      const categoryId = parseInt(item.categoryId, 10);

      const isRouter = routerProductIds.has(hostBillProductId);
      const isBroadbandService = item.category === 'Bredband' && !isRouter;
      const isTvService = item.category === 'TV';
      const isTelephonyService = item.category === 'IP-telefoni' || item.category === 'Telefoni';
      
      // Distinguish between TV base packages (services) and TV hardware
      const tvServiceIds = getAllTvServiceProductIds();
      const isTvBasePackage = isTvService && tvServiceIds.includes(hostBillProductId);
      const isTvHardware = isTvService && !tvServiceIds.includes(hostBillProductId);
      
      if (isTvService) {
      }

      const productPayload = {
        hostBillProductId,
        quantity: item.quantity || 1,
        categoryId,
      };

      if (isBroadbandService) {
        Object.assign(productPayload, {
          serviceId: parseInt(item.serviceId, 10),
          accessId: item.config?.accessId,
          cityNet: item.config?.cityNet,
          apartmentNumberSocketId: item.config?.apartmentNumberSocketId,
          ...(typeof item.config?.mduDistinguisher === 'string' && {
            mduDistinguisher: item.config.mduDistinguisher,
          }),
        });
      }

      if (isTvBasePackage) {
        // TV base packages require cityNet as per API docs
        Object.assign(productPayload, {
          cityNet: item.config?.cityNet || item.config?.stadsnat || item.cityNet,
        });
      } else if (isTvHardware) {
        // TV hardware products have no special requirements according to API docs
      }

      if (isTelephonyService) {
        // Add phone number from config
        if (item.phoneNumber || item.config?.phoneNumber) {
          productPayload.phoneNumber = item.phoneNumber || item.config.phoneNumber;
        }
        
        // Add associatedOrgPersonNr for porting (if provided)
        if (item.associatedOrgPersonNr) {
          productPayload.associatedOrgPersonNr = item.associatedOrgPersonNr;
        }
        
        // Telephony services MUST have specific addons as per API docs
        if (item.addons && item.addons.length > 0) {
          productPayload.addons = item.addons;
        } else if (item.config?.numberOption) {
          // Auto-add the appropriate addon based on numberOption using environment-aware IDs
          if (item.config.numberOption === 'new') {
            productPayload.addons = [{ id: getNewNumberAddonId(), qty: 1 }]; // New Number addon
          } else if (item.config.numberOption === 'keep') {
            productPayload.addons = [{ id: getPortNumberAddonId(), qty: 1 }]; // Port Number addon
          }
        }
      }

      // Add addons for any product type (API docs: "Products can optionally include addons")
      // This handles TV, router, and any other product addons
      if (!isTelephonyService && item.addons && item.addons.length > 0) {
        productPayload.addons = item.addons;
      }

      // Add the main product to the list
      productList.push(productPayload);

      // For Standard telephony service, add hardware as a separate product if configured
      // Use environment-aware product IDs
      const standardServiceId = getTelephonyServiceId('standard');
      if (isTelephonyService && hostBillProductId === standardServiceId && item.config?.hardwareType) {
        // Map hardware type to product ID using environment-aware function
        const hardwareProductId = getTelephonyHardwareId(item.config.hardwareType);

        // Get environment-specific telephony category ID
        const telephonyCategoryId = parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_TELEPHONY, 10);

        if (hardwareProductId && telephonyCategoryId) {
          productList.push({
            hostBillProductId: hardwareProductId,
            quantity: 1,
            categoryId: telephonyCategoryId,
          });
        }
      }
    });

  return {
    customer: customerPayload,
    productList: productList,
    desiredActivationDate: customerDetails.desiredActivationDate,
    sendInvoiceWith: paymentDetails.paymentMethod, // Now directly 'email', 'paper', or 'kivra'
    billingFrequency: paymentDetails.billingFrequency,
  };
}

export async function POST(request) {
  // Initialize application if not already done
  initializeApplication();
  
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  
  try {
    // Apply rate limiting to prevent order flooding (3 orders per 5 minutes per IP)
    // Skip in development to avoid issues with React Strict Mode
    if (process.env.NODE_ENV === 'production') {
      const { success } = await applyRateLimiter(orderRateLimiter, ip);
      if (!success) {
        return NextResponse.json(
          { 
            error: 'Too many order attempts. Please wait a few minutes before trying again.',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: 300 // 5 minutes in seconds
          },
          { status: 429 }
        );
      }
    }

    // Validate CSRF token for this critical endpoint
    const csrfValidation = await validateCSRFMiddleware(request);
    if (!csrfValidation.valid && !csrfValidation.skip) {
      return NextResponse.json(
        { error: csrfValidation.error, code: csrfValidation.code },
        { status: 403 }
      );
    }

    const orderDetails = await request.json();

    if (!orderDetails || !orderDetails.customerDetails || !orderDetails.cart) {
      return NextResponse.json({ error: 'Invalid order data provided.' }, { status: 400 });
    }

    const apiKey = process.env.REST_API_2_KEY;
    const apiEndpoint = process.env.REST_API_2_ENDPOINT;
    if (!apiKey || !apiEndpoint) {
      console.error('API key or endpoint is not configured.');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const apiPayload = formatPayloadForApi(orderDetails);

    
    try {
      const apiPayloadSchema = getApiPayloadSchema();
      apiPayloadSchema.parse(apiPayload);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('API Payload Validation Error:', error.errors);
        return NextResponse.json(
          { error: 'Invalid payload structure.', details: error.errors },
          { status: 400 },
        );
      }
      throw error;
    }

    
    const response = await fetch(`${apiEndpoint}/api/v1/orders/ecommerce`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(apiPayload),
    });

    const responseData = await response.json();
    

    if (!response.ok) {
      console.error('Order creation failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: responseData.message || 'Failed to place the order.' },
        { status: response.status },
      );
    }

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
