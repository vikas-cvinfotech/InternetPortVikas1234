'use client';

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getAllTvServiceProductIds } from '@/config/tvProducts';
import { getAllTelephonyServiceProductIds, getAllTelephonyHardwareProductIds, isTelephonyMonthlyBoundHardware } from '@/config/telephonyProducts';
import { getNewNumberAddonId, getPortNumberAddonId } from '@/config/telephonyAddons';
import { getCampaignPricingDisplay } from '@/lib/utils/campaignPricing';
import { parseProductPricing } from '@/lib/utils/productPricing';

export const CartContext = createContext(null);

// Category definitions based on business requirements
const CATEGORY_CONFIG = {
  // Broadband services - address-based, requires service selection
  BROADBAND: {
    id: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_BROADBAND) || 10, // HostBill category ID from env
    name: 'Bredband',
    exclusive: 'address', // Only one per address
    requiresServiceId: true,
    requiresAccessInfo: true,
    supportsQuantity: false
  },
  // TV services - stadsnät-based, base package + add-ons
  TV: {
    id: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_TV) || 21, // HostBill category ID from env
    name: 'TV',
    exclusive: 'category', // Only one TV service per customer (not address-based like broadband)
    requiresCityNet: true, // TV base packages require cityNet, not accessId
    supportsAddons: true,
    supportsQuantity: false
  },
  // TV hardware - digital boxes, can have multiple quantities
  TV_HARDWARE: {
    id: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_TV) || 21, // Same category ID as TV but different handling
    name: 'TV Hardware',
    exclusive: false, // TV hardware can be ordered in multiple quantities
    requiresCityNet: false, // TV hardware has no special requirements
    supportsQuantity: true
  },
  // Telephony services - IP-telefoni with number options
  TELEPHONY: {
    id: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_TELEPHONY) || 16, // HostBill category ID from env (16 dev, 11 prod)
    name: 'IP-telefoni',
    exclusive: 'category', // Only one telephony service
    requiresNumberConfig: true,
    supportsQuantity: false
  },
  // Telephony hardware - phone equipment, can have multiple quantities
  TELEPHONY_HARDWARE: {
    id: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_TELEPHONY) || 16, // Same category ID as TELEPHONY but different handling
    name: 'Telephony Hardware',
    exclusive: false, // Telephony hardware can be ordered in multiple quantities
    requiresNumberConfig: false, // Telephony hardware has no special requirements
    supportsQuantity: true
  },
  // Monthly bound telephony hardware - installment plan equipment with contract periods
  TELEPHONY_HARDWARE_MONTHLY_BOUND: {
    id: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_TELEPHONY) || 16, // Same category ID as TELEPHONY but different handling
    name: 'Monthly Bound Telephony Hardware',
    exclusive: false, // Monthly bound telephony hardware can be ordered in multiple quantities
    requiresNumberConfig: false, // Telephony hardware has no special requirements
    supportsQuantity: true
  },
  // Router products - can be standalone or addon
  ROUTER: {
    id: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_BROADBAND) || 10, // Same as broadband but different handling
    name: 'Router',
    exclusive: false,
    supportsQuantity: true
  },
  // Standard products - VPN, network products, etc.
  STANDARD: {
    exclusive: false,
    supportsQuantity: true
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [taxRate, setTaxRate] = useState(1.25);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  useEffect(() => {
    if (!hasLoadedFromStorage) {
      setIsLoading(true);
      try {
        // Check if we're on the test page and start with empty cart
        const isTestPage = window.location.pathname.includes('test-cart');
        
        if (isTestPage) {
          localStorage.removeItem('shoppingCart');
          localStorage.removeItem('cartTaxRate');
          setCartItems([]);
        } else {
          const localCart = localStorage.getItem('shoppingCart');
          if (localCart) {
            const parsedCart = JSON.parse(localCart);
            setCartItems(parsedCart);
          } else {
            setCartItems([]);
          }
        }
        
        const localTax = localStorage.getItem('cartTaxRate');
        if (localTax) {
          setTaxRate(parseFloat(localTax));
        }
      } catch (error) {
        console.error('[CartContext] Failed to load from localStorage', error);
      } finally {
        setHasLoadedFromStorage(true);
        setIsLoading(false);
      }
    }
  }, [hasLoadedFromStorage]);

  useEffect(() => {
    if (!isLoading && !window.location.pathname.includes('test-cart')) {
      localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cartTaxRate', taxRate.toString());
    }
  }, [taxRate, isLoading]);

  // Helper function to determine product category type
  const getProductCategoryType = useCallback((product) => {
    const routerProductIds = new Set(
      (process.env.NEXT_PUBLIC_ROUTER_PRODUCT_IDS || '')
        .split(',')
        .map(id => parseInt(id.trim(), 10))
        .filter(id => !isNaN(id))
    );

    // Check if it's a router product by ID (check multiple ID fields like TV/Telephony do)
    const productId = parseInt(product.id) || parseInt(product.hb_product_id) || parseInt(product.hostBillProductId);
    if (routerProductIds.has(productId) || product.category === 'Router') {
      return 'ROUTER';
    }

    switch (product.category) {
      case 'Bredband':
        return 'BROADBAND';
      case 'TV':
        // Distinguish between TV services and TV hardware
        const productId = parseInt(product.id) || parseInt(product.hb_product_id);
        const tvServiceIds = getAllTvServiceProductIds();
        const isTvService = tvServiceIds.includes(productId);
        return isTvService ? 'TV' : 'TV_HARDWARE';
      case 'IP-telefoni':
      case 'Telefoni':
      case 'telefoni':
        // Distinguish between telephony services and telephony hardware
        const telephonyProductId = parseInt(product.id) || parseInt(product.hb_product_id);
        const telephonyServiceIds = getAllTelephonyServiceProductIds();
        const isTelephonyService = telephonyServiceIds.includes(telephonyProductId);
        
        if (isTelephonyService) {
          return 'TELEPHONY';
        } else {
          // Distinguish between regular and monthly bound telephony hardware
          const isMonthlyBound = isTelephonyMonthlyBoundHardware(telephonyProductId);
          return isMonthlyBound ? 'TELEPHONY_HARDWARE_MONTHLY_BOUND' : 'TELEPHONY_HARDWARE';
        }
      default:
        return 'STANDARD';
    }
  }, []);

  // Helper function to validate product for e-commerce API
  const validateProductForAPI = useCallback((product, categoryType) => {
    const config = CATEGORY_CONFIG[categoryType];
    
    // Validate required fields based on category
    if (config?.requiresServiceId && !product.serviceId) {
      throw new Error(`${config.name} products require serviceId`);
    }
    
    if (config?.requiresAccessInfo) {
      // Check both top-level and config for accessId
      const hasAccessId = product.accessId || product.config?.accessId;
      if (!hasAccessId) {
        throw new Error(`${config.name} products require accessId`);
      }
    }
    
    if (config?.requiresCityNet) {
      // Check for cityNet requirement - TV hardware explicitly doesn't require it
      const hasCityNet = product.cityNet || product.config?.cityNet || product.config?.stadsnat;
      if (!hasCityNet) {
        throw new Error(`${config.name} products require cityNet`);
      }
    }
    
    if (config?.requiresNumberConfig && categoryType === 'TELEPHONY' && !product.phoneNumber && !product.areaCode) {
      throw new Error('Telephony products require either phoneNumber (to port) or areaCode (for new number)');
    }
    
    return true;
  }, []);

  // Helper function to structure product for e-commerce API
  const structureProductForAPI = useCallback((product, categoryType) => {
    const baseProduct = {
      // Core product info
      hostBillProductId: parseInt(product.id) || parseInt(product.hb_product_id),
      quantity: product.quantity || 1,
      categoryId: product.categoryId,
    };

    // Add category-specific fields
    switch (categoryType) {
      case 'BROADBAND':
        return {
          ...baseProduct,
          serviceId: product.serviceId,
          accessId: product.accessId || product.config?.accessId,
          cityNet: product.cityNet || product.config?.cityNet || product.config?.stadsnat,
          apartmentNumberSocketId: product.apartmentNumberSocketId || product.config?.mduApartmentNumber,
          mduDistinguisher: product.mduDistinguisher || product.config?.mduDistinguisher,
        };
      
      case 'TV':
        return {
          ...baseProduct,
          cityNet: product.cityNet || product.config?.cityNet || product.config?.stadsnat,
          accessId: product.accessId || product.config?.accessId,
          apartmentNumberSocketId: product.apartmentNumberSocketId || product.config?.mduApartmentNumber,
          mduDistinguisher: product.mduDistinguisher || product.config?.mduDistinguisher,
        };
      
      case 'TV_HARDWARE':
        // TV hardware products have no special requirements
        return baseProduct;
      
      case 'TELEPHONY':
        return {
          ...baseProduct,
          ...(product.phoneNumber && { phoneNumber: product.phoneNumber }),
          ...(product.areaCode && { areaCode: product.areaCode }),
        };
      
      case 'TELEPHONY_HARDWARE':
      case 'TELEPHONY_HARDWARE_MONTHLY_BOUND':
        // Telephony hardware products have no special requirements
        return baseProduct;
      
      case 'ROUTER':
      case 'STANDARD':
      default:
        return baseProduct;
    }
  }, []);

  const addToCart = useCallback((product) => {
    if (typeof product.categoryId !== 'number' || isNaN(product.categoryId)) {
      console.error('[CartContext] Tried to add product without valid categoryId:', product);
      throw new Error('All products added to cart must have a valid categoryId');
    }

    const categoryType = getProductCategoryType(product);

    try {
      validateProductForAPI(product, categoryType);
    } catch (error) {
      console.error('[CartContext] Product validation failed:', error);
      throw error;
    }

    // Apply NordVPN campaign pricing if applicable
    let productWithCampaign = { ...product };
    const campaignProductIds = (process.env.NEXT_PUBLIC_NORDVPN_CAMPAIGN_PRODUCT_IDS || '')
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id));

    if (campaignProductIds.includes(parseInt(product.id))) {
      // Apply campaign pricing from environment variables
      const campaignPrice = parseFloat(process.env.NEXT_PUBLIC_NORDVPN_CAMPAIGN_PRICE) || 32;
      const campaignLength = parseInt(process.env.NEXT_PUBLIC_NORDVPN_CAMPAIGN_LENGTH) || 3;

      productWithCampaign = {
        ...product,
        m_price: campaignPrice, // Set the actual price to campaign price
        m_campaign_price: campaignPrice, // Also set campaign price
        m_campaign_length: campaignLength,
        // Preserve other campaign data if it exists
        rawProductData: {
          ...product.rawProductData,
          m_price: campaignPrice,
          m_campaign_price: campaignPrice,
          m_campaign_length: campaignLength,
        }
      };
    }

    setCartItems((prevItems) => {
      const config = CATEGORY_CONFIG[categoryType];
      let updatedItems = [...prevItems];

      // Handle exclusive categories (only one per address/category)
      if (config?.exclusive === 'address') {
        // Remove existing items from same category and same address
        const addressKey = productWithCampaign.unique || `${productWithCampaign.config?.stadsnat || productWithCampaign.config?.cityNet || productWithCampaign.cityNet}-${productWithCampaign.config?.accessId || productWithCampaign.accessId}`;
        updatedItems = prevItems.filter((item) => {
          // Use stored categoryType if available to prevent recategorization bugs
          const itemCategoryType = item.categoryType || getProductCategoryType(item);
          const itemAddressKey = item.unique || `${item.config?.stadsnat || item.config?.cityNet || item.cityNet}-${item.config?.accessId || item.accessId}`;
          return !(itemCategoryType === categoryType && itemAddressKey === addressKey);
        });
      } else if (config?.exclusive === 'category') {
        // Remove all items from same category
        updatedItems = prevItems.filter((item) => {
          // Use stored categoryType if available to prevent recategorization bugs
          const itemCategoryType = item.categoryType || getProductCategoryType(item);
          return itemCategoryType !== categoryType;
        });
      } else if (productWithCampaign.unique) {
        // Handle unique products (remove existing with same unique key)
        updatedItems = prevItems.filter((item) => item.unique !== productWithCampaign.unique);
      } else {
        // Handle quantity-based products
        const existingItemIndex = prevItems.findIndex((item) =>
          item.id === productWithCampaign.id &&
          item.categoryId === productWithCampaign.categoryId &&
          !item.unique
        );

        if (existingItemIndex > -1) {
          // Update quantity of existing item
          updatedItems = prevItems.map((item, index) => {
            if (index === existingItemIndex) {
              return { ...item, quantity: item.quantity + (productWithCampaign.quantity || 1) };
            }
            return item;
          });
          return updatedItems;
        }
      }

      // Structure product for API and add to cart
      const structuredProduct = {
        ...productWithCampaign,
        ...structureProductForAPI(productWithCampaign, categoryType),
        config: productWithCampaign.config || {},
        categoryType, // Store for easy identification
      };

      updatedItems.push(structuredProduct);
      return updatedItems;
    });
  }, [getProductCategoryType, validateProductForAPI, structureProductForAPI]);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    // Immediately clear localStorage to prevent reload issues
    try {
      localStorage.removeItem('shoppingCart');
      localStorage.removeItem('cartTaxRate');
    } catch (error) {
      console.error('[CartContext] Error clearing localStorage:', error);
    }
    // Don't reload from localStorage after clearing
    setHasLoadedFromStorage(true);
  }, []);

  const getItemById = useCallback(
    (productId) => cartItems.find((item) => item.id === productId),
    [cartItems],
  );

  const getBroadbandItemByUniqueAddress = useCallback(
    (uniqueAddressKey) =>
      cartItems.find((item) => item.unique === uniqueAddressKey && item.category === 'Bredband'),
    [cartItems],
  );

  const removeBroadbandItemByUniqueAddress = useCallback((uniqueAddressKey) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.unique === uniqueAddressKey && item.category === 'Bredband'),
      ),
    );
  }, []);

  const handleSetTaxRate = useCallback((newRate) => {
    setTaxRate(newRate);
  }, []);

  const updateItemConfig = useCallback((itemId, newConfigData) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, config: { ...item.config, ...newConfigData } } : item,
      ),
    );
  }, []);

  // --- Computed Values (Pre-tax) ---

  const cartSummaryStart = useMemo(() => {
    let total_s_price = 0;
    let total_s_campaign_price = 0; // This will be the sum of effective setup fees.
    cartItems.forEach((item) => {
      const quantity = item.quantity || 1;
      const s_price = parseFloat(item.s_price) || 0;
      const s_campaign_price_for_item =
        item.s_campaign_price !== null && item.s_campaign_price !== undefined
          ? parseFloat(item.s_campaign_price)
          : s_price;

      total_s_price += s_price * quantity;
      total_s_campaign_price += s_campaign_price_for_item * quantity;
    });
    return {
      s_price: total_s_price,
      s_campaign_price: total_s_campaign_price,
    };
  }, [cartItems]);

  const cartSummaryMonthlyRaw = useMemo(() => {
    return cartItems
      .filter((item) => item.m_price || item.m_campaign_price) // Consider items with any monthly price.
      .reduce((acc, cur) => {
        const quantity = cur.quantity || 1;
        const m_price = parseFloat(cur.m_price) || 0;
        const m_campaign_length = parseInt(cur.m_campaign_length, 10) || 0;
        const effective_m_campaign_price =
          m_campaign_length > 0 &&
          cur.m_campaign_price !== null &&
          cur.m_campaign_price !== undefined
            ? parseFloat(cur.m_campaign_price)
            : m_price;

        let existingPeriod = acc.find((p) => p.m_campaign_length === m_campaign_length);

        if (existingPeriod) {
          existingPeriod.total_m_price += m_price * quantity;
          existingPeriod.total_m_campaign_price += effective_m_campaign_price * quantity;
        } else {
          acc.push({
            m_campaign_length: m_campaign_length,
            total_m_campaign_price: effective_m_campaign_price * quantity,
            total_m_price: m_price * quantity,
          });
        }
        return acc;
      }, [])
      .sort((a, b) => a.m_campaign_length - b.m_campaign_length);
  }, [cartItems]);

  const monthlyPaymentBreakdown = useMemo(() => {
    const breakdown = [];

    // Calculate regular monthly totals from broadband products
    const totalRegularMonthlyPrice = cartSummaryMonthlyRaw.reduce(
      (sum, period) => sum + period.total_m_price,
      0,
    );

    const totalInitialCampaignMonthlyPrice = cartSummaryMonthlyRaw.reduce((sum, period) => {
      return sum + period.total_m_campaign_price;
    }, 0);

    const longestCampaign = cartSummaryMonthlyRaw.reduce(
      (max, p) => (p.m_campaign_length > max ? p.m_campaign_length : max),
      0,
    );

    // Check for HostBill campaign products (like NordVPN)
    let hostbillCampaignInfo = null;
    let totalNonCampaignMonthlyPrice = 0;
    let totalCampaignMonthlyPrice = 0;
    let hostbillCampaignLength = 0;

    cartItems.forEach(item => {
      const paytype = item.paytype || item.rawProductData?.paytype || '';
      const isOneTimePurchase = paytype.toLowerCase() === 'once';
      
      // Skip one-time purchases
      if (isOneTimePurchase) return;
      
      const quantity = item.quantity || 1;
      const monthlyPrice = parseFloat(item.m_price || item.price || 0) * quantity;
      
      // Check if this item has campaign pricing
      const campaignInfo = getCampaignPricingDisplay(item.rawProductData);
      
      if (campaignInfo) {
        // This is a campaign product (like NordVPN)
        hostbillCampaignInfo = campaignInfo;
        hostbillCampaignLength = Math.max(hostbillCampaignLength, campaignInfo.campaignLength);
        totalCampaignMonthlyPrice += campaignInfo.campaignPrice * quantity;
        totalNonCampaignMonthlyPrice += campaignInfo.originalPrice * quantity;
      } else {
        // Regular product, add to both totals
        totalNonCampaignMonthlyPrice += monthlyPrice;
        totalCampaignMonthlyPrice += monthlyPrice;
      }
    });

    // Determine which campaign system to use
    const hasHostbillCampaign = hostbillCampaignInfo !== null;
    const hasBroadbandCampaign = longestCampaign > 0;

    if (hasHostbillCampaign) {
      // Use HostBill campaign system (NordVPN style)
      const campaignLength = hostbillCampaignLength;
      
      // Add campaign period
      breakdown.push({
        periodLabel: `Mån 1 - ${campaignLength}`,
        monthlyCost: totalCampaignMonthlyPrice,
        isCampaign: true,
      });
      
      // Add regular period after campaign
      if (totalNonCampaignMonthlyPrice !== totalCampaignMonthlyPrice) {
        breakdown.push({
          periodLabel: 'Därefter',
          monthlyCost: totalNonCampaignMonthlyPrice,
          isCampaign: false,
        });
      }
    } else if (hasBroadbandCampaign) {
      // Use existing broadband campaign system
      const hasTrueCampaignDiscount = cartSummaryMonthlyRaw.some(
        (p) => p.m_campaign_length > 0 && p.total_m_campaign_price < p.total_m_price,
      );

      if (hasTrueCampaignDiscount || cartSummaryMonthlyRaw.some((p) => p.m_campaign_length > 0)) {
        breakdown.push({
          periodLabel: `Mån 1 - ${longestCampaign}`,
          monthlyCost: totalInitialCampaignMonthlyPrice,
          isCampaign: true,
        });
      }

      if (
        breakdown.length === 0 ||
        (breakdown.length > 0 && breakdown[0].monthlyCost !== totalRegularMonthlyPrice)
      ) {
        breakdown.push({
          periodLabel: longestCampaign > 0 ? 'Därefter' : 'Per månad',
          monthlyCost: totalRegularMonthlyPrice,
          isCampaign: false,
        });
      }
    } else {
      // No campaigns, use regular monthly total
      const regularTotal = totalNonCampaignMonthlyPrice || totalRegularMonthlyPrice;
      breakdown.push({
        periodLabel: 'Per månad',
        monthlyCost: regularTotal,
        isCampaign: false,
      });
    }

    // Clean up single "Därefter" entries
    if (breakdown.length === 1 && breakdown[0].periodLabel === 'Därefter') {
      breakdown[0].periodLabel = 'Per månad';
    }

    // Ensure we always have at least one entry
    if (breakdown.length === 0) {
      breakdown.push({
        periodLabel: 'Per månad',
        monthlyCost: 0,
        isCampaign: false,
      });
    }

    return breakdown;
  }, [cartSummaryMonthlyRaw, cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((count, item) => count + (item.quantity || 0), 0);
  }, [cartItems]);

  // --- Tax-Inclusive Totals (Updated for different payment types) ---
  const cartTotalMonthly = useMemo(() => {
    return cartItems.reduce((total, item) => {
      // Use the same logic as RouterCartItem for determining pricing type
      const paytype = item.paytype || item.rawProductData?.paytype || '';
      const isOneTimePurchase = paytype.toLowerCase() === 'once';
      
      // Skip one-time purchases for monthly total
      if (isOneTimePurchase) return total;
      
      // Use the exact same pricing logic as product pages
      // This ensures cart totals match the product page and line item displays
      let monthlyPrice;
      
      if (item.rawProductData) {
        // Use productPricing utility for consistency with product pages
        const pricingInfo = parseProductPricing(item.rawProductData);
        if (pricingInfo.billingPeriod === 'monthly' && !pricingInfo.isOneTime) {
          monthlyPrice = pricingInfo.primaryPrice;
        } else if (pricingInfo.isOneTime) {
          // Skip one-time purchases for monthly total (they go in setup total)
          return total;
        } else {
          // Fallback for other billing periods
          monthlyPrice = pricingInfo.pricing.monthly || 0;
        }
      } else {
        // Fallback for items without rawProductData
        monthlyPrice = item.m_campaign_price && item.m_campaign_length > 0
          ? parseFloat(item.m_campaign_price)
          : parseFloat(item.m_price || item.price || 0);
      }
      
      const quantity = item.quantity || 1;
      
      // Add addon prices for TV services
      if (item.category === 'TV' && item.addons && Array.isArray(item.addons)) {
        const addonsPrice = item.addons.reduce((addonTotal, addon) => {
          return addonTotal + (parseFloat(addon.m_price || 0) * (addon.qty || 1));
        }, 0);
        monthlyPrice += addonsPrice;
      }
      
      // Add addon prices for telephony services
      if (item.category === 'IP-telefoni' && item.addons && Array.isArray(item.addons)) {
        const addonsPrice = item.addons.reduce((addonTotal, addon) => {
          const addonId = parseInt(addon.id);
          // New Number addon is monthly
          if (addonId === getNewNumberAddonId()) {
            return addonTotal + (parseFloat(addon.m_price || 23.2) * (addon.qty || 1)); // 29kr including VAT / 1.25
          }
          // Port Number addon is one-time, not monthly - skip for monthly total
          return addonTotal;
        }, 0);
        monthlyPrice += addonsPrice;
      }
      
      // Round each item's tax-inclusive price before adding to total
      // This ensures consistency with individual product line displays
      return total + Math.round(monthlyPrice * quantity * taxRate);
    }, 0);
  }, [cartItems, taxRate]);

  const cartTotalSetup = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const paytype = item.paytype || item.rawProductData?.paytype || '';
      const isOneTimePurchase = paytype.toLowerCase() === 'once';
      const quantity = item.quantity || 1;
      
      if (isOneTimePurchase) {
        // For one-time purchases, check multiple possible price fields
        const oneTimePrice = parseFloat(
          item.m_price || 
          item.price || 
          item.rawProductData?.price ||
          item.rawProductData?.m_price || 
          item.rawProductData?.m ||
          item.rawProductData?.m_setup ||
          item.s_price ||
          item.setupPrice ||
          item.rawProductData?.s_price ||
          item.rawProductData?.s ||
          0
        );
        // Round each item's tax-inclusive price before adding to total
        return total + Math.round(oneTimePrice * quantity * taxRate);
      } else {
        // For subscriptions, add setup/installation fees
        let setupPrice = parseFloat(item.s_price || item.setupPrice || 0);
        
        // Add addon setup prices for TV services
        if (item.category === 'TV' && item.addons && Array.isArray(item.addons)) {
          const addonsSetupPrice = item.addons.reduce((addonTotal, addon) => {
            return addonTotal + (parseFloat(addon.s_price || 0) * (addon.qty || 1));
          }, 0);
          setupPrice += addonsSetupPrice;
        }
        
        // Add addon setup prices and equipment pricing for telephony services
        if (item.category === 'IP-telefoni' && item.addons && Array.isArray(item.addons)) {
          const addonsSetupPrice = item.addons.reduce((addonTotal, addon) => {
            const addonId = parseInt(addon.id);
            // Port Number addon is one-time setup fee
            if (addonId === getPortNumberAddonId()) {
              return addonTotal + (parseFloat(addon.s_price || 236) * (addon.qty || 1)); // 295kr including VAT / 1.25
            }
            // New Number addon has no setup fee
            return addonTotal;
          }, 0);
          setupPrice += addonsSetupPrice;
          
          // Add equipment pricing for telephony services
          if (item.config?.hardwareType) {
            const hardwareType = item.config.hardwareType.toLowerCase();
            const equipmentPricing = {
              'grandstream': 520, // 650kr including VAT / 1.25
              'gigaset': 1000, // 1250kr including VAT / 1.25
              'yealink': 400,
              'snom': 350,
            };
            const equipmentPrice = equipmentPricing[hardwareType] || 0;
            setupPrice += equipmentPrice;
          }
        }
        
        // Round each item's tax-inclusive price before adding to total
        return total + Math.round(setupPrice * quantity * taxRate);
      }
    }, 0);
  }, [cartItems, taxRate]);

  // Generate e-commerce API payload from cart
  const generateEcommercePayload = useCallback((customerInfo, orderOptions = {}) => {
    const productList = cartItems.map((item) => {
      const baseProduct = {
        hostBillProductId: item.hostBillProductId || parseInt(item.id),
        quantity: item.quantity || 1,
        categoryId: item.categoryId,
      };

      // Add category-specific fields
      const categoryType = item.categoryType || getProductCategoryType(item);
      switch (categoryType) {
        case 'BROADBAND':
          return {
            ...baseProduct,
            serviceId: item.serviceId,
            accessId: item.accessId,
            cityNet: item.cityNet,
            ...(item.apartmentNumberSocketId && { apartmentNumberSocketId: item.apartmentNumberSocketId }),
            ...(item.mduDistinguisher && { mduDistinguisher: item.mduDistinguisher }),
          };
        
        case 'TV':
          return {
            ...baseProduct,
            cityNet: item.cityNet,
            ...(item.accessId && { accessId: item.accessId }),
            ...(item.apartmentNumberSocketId && { apartmentNumberSocketId: item.apartmentNumberSocketId }),
            ...(item.mduDistinguisher && { mduDistinguisher: item.mduDistinguisher }),
            // Add addons for TV services
            ...(item.addons && { addons: item.addons }),
          };
        
        case 'TV_HARDWARE':
          // TV hardware products have no special requirements
          return baseProduct;
        
        case 'TELEPHONY':
          return {
            ...baseProduct,
            ...(item.phoneNumber && { phoneNumber: item.phoneNumber }),
            ...(item.associatedOrgPersonNr && { associatedOrgPersonNr: item.associatedOrgPersonNr }),
            // Add addons for telephony services
            ...(item.addons && { addons: item.addons }),
          };
        
        case 'TELEPHONY_HARDWARE':
        case 'TELEPHONY_HARDWARE_MONTHLY_BOUND':
          // Telephony hardware products have no special requirements
          return baseProduct;
        
        case 'ROUTER':
        case 'STANDARD':
        default:
          return baseProduct;
      }
    });

    return {
      customer: {
        type: taxRate === 1.25 ? 'Private' : 'Company',
        ...customerInfo,
      },
      productList,
      desiredActivationDate: orderOptions.desiredActivationDate || new Date().toISOString().split('T')[0],
      sendInvoiceWith: orderOptions.sendInvoiceWith || 'email',
      billingFrequency: orderOptions.billingFrequency || 'monthly',
    };
  }, [cartItems, taxRate, getProductCategoryType]);

  // Helper function to get cart items by category type
  const getItemsByCategory = useCallback((categoryType) => {
    return cartItems.filter((item) => {
      const itemCategoryType = item.categoryType || getProductCategoryType(item);
      return itemCategoryType === categoryType;
    });
  }, [cartItems, getProductCategoryType]);

  // Check if cart has items of specific category
  const hasCategory = useCallback((categoryType) => {
    return getItemsByCategory(categoryType).length > 0;
  }, [getItemsByCategory]);

  const value = {
    // Core cart functionality
    cartItems,
    taxRate,
    isLoadingCart: isLoading,
    setTaxRate: handleSetTaxRate,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateItemConfig,
    clearCart,
    getItemById,
    getBroadbandItemByUniqueAddress,
    removeBroadbandItemByUniqueAddress,

    // Summary and calculations
    cartSummaryStart,
    monthlyPaymentBreakdown,
    totalItems,
    cartTotalMonthly,
    cartTotalSetup,

    // Category helpers
    getProductCategoryType,
    getItemsByCategory,
    hasCategory,

    // E-commerce API support
    generateEcommercePayload,

    // Category configurations
    CATEGORY_CONFIG,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
