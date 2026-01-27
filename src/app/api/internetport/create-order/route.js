import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { getApiPayloadSchema } from '@/lib/validation/apiPayloadSchema';
import { getAllTvServiceProductIds } from '@/config/tvProducts';
import { getNewNumberAddonId, getPortNumberAddonId } from '@/config/telephonyAddons';
import { getTelephonyServiceId, getTelephonyHardwareId } from '@/config/telephonyProducts';
import { validateCSRFMiddleware } from '@/lib/csrf';
import { generalRateLimiter, orderRateLimiter, applyRouteRateLimit } from '@/lib/rateLimit';
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
        // TV base packages require cityNet and deliveryAddress as per API docs
        Object.assign(productPayload, {
          cityNet: item.config?.cityNet || item.config?.stadsnat || item.cityNet,
          deliveryAddress: item.deliveryAddress || item.config?.deliveryAddress,
        });
      } else if (isTvHardware) {
        // TV hardware products require deliveryAddress
        Object.assign(productPayload, {
          deliveryAddress: item.deliveryAddress || item.config?.deliveryAddress,
        });
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

  // Layer 1: General rate limiting (100 req/min per IP)
  const generalLimit = await applyRouteRateLimit(request, generalRateLimiter);
  if (generalLimit) return generalLimit;

  // DEBUG: Log IP detection
  const { getClientIp } = await import('@/lib/rateLimit');
  const detectedIp = getClientIp(request);
  console.log('[CREATE ORDER] Detected IP:', detectedIp);
  console.log('[CREATE ORDER] Headers:', {
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
    'x-real-ip': request.headers.get('x-real-ip'),
    'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
    'request.ip': request.ip
  });

  // Layer 2: Order rate limiting (3 req/5min per IP)
  const orderLimit = await applyRouteRateLimit(request, orderRateLimiter);
  if (orderLimit) {
    // Log rate limit events for monitoring order creation abuse
    const { getClientIp } = await import('@/lib/rateLimit');
    console.warn('[CREATE ORDER] Rate limit exceeded for IP:', getClientIp(request));
    return orderLimit;
  }

  try {
    // Validate CSRF token for this critical endpoint
    const csrfValidation = await validateCSRFMiddleware(request);
    if (!csrfValidation.valid && !csrfValidation.skip) {
      console.error('[CREATE ORDER] CSRF validation failed:', {
        error: csrfValidation.error,
        code: csrfValidation.code
      });
      return NextResponse.json(
        { error: csrfValidation.error, code: csrfValidation.code },
        { status: 403 }
      );
    }

    const orderDetails = await request.json();

    if (!orderDetails || !orderDetails.customerDetails || !orderDetails.cart) {
      console.error('[CREATE ORDER] Invalid order data:', {
        hasOrderDetails: !!orderDetails,
        hasCustomerDetails: !!orderDetails?.customerDetails,
        hasCart: !!orderDetails?.cart,
        cartItemCount: orderDetails?.cart?.items?.length || 0
      });
      return NextResponse.json({ error: 'Invalid order data provided.' }, { status: 400 });
    }

    const apiKey = process.env.REST_API_2_KEY;
    const apiEndpoint = process.env.REST_API_2_ENDPOINT;
    if (!apiKey || !apiEndpoint) {
      console.error('[CREATE ORDER] Server configuration error - missing API credentials');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const apiPayload = formatPayloadForApi(orderDetails);


    try {
      const apiPayloadSchema = getApiPayloadSchema();
      apiPayloadSchema.parse(apiPayload);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('[CREATE ORDER] Payload validation failed:', {
          errors: error.errors,
          customerType: apiPayload.customer?.type,
          productCount: apiPayload.productList?.length || 0
        });
        return NextResponse.json(
          { error: 'Invalid payload structure.', details: error.errors },
          { status: 400 },
        );
      }
      throw error;
    }


    const response = await fetch(`${apiEndpoint}/orders/ecommerce`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(apiPayload),
    });

    const responseData = await response.json();


    if (!response.ok) {
      console.error('[CREATE ORDER] API request failed:', {
        status: response.status,
        statusText: response.statusText,
        errorMessage: responseData.message,
        errorDetails: responseData.details || responseData.error,
        customerEmail: apiPayload.customer?.email,
        productCount: apiPayload.productList?.length || 0
      });
      return NextResponse.json(
        { error: responseData.message || 'Failed to place the order.' },
        { status: response.status },
      );
    }

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('[CREATE ORDER] Unexpected error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
