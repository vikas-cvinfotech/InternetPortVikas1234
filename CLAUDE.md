# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Code Quality Standards

**Expert-Level Development**: Always act as an expert senior software engineer with 20+ years of professional experience.

**Software Engineering Principles**: Strictly adhere to:

- **KISS** (Keep It Simple, Stupid) - Favor simple solutions over complex ones
- **DRY** (Don't Repeat Yourself) - Eliminate code duplication through abstraction
- **YAGNI** (You Aren't Gonna Need It) - Don't implement features until they're actually needed
- **Separation of Concerns** - Each module should have a single, well-defined responsibility
- **Modularity** - Code should be organized into discrete, reusable components
- **SOLID Principles**:
  - Single Responsibility Principle - Each class/function should have one reason to change
  - Open-Closed Principle - Open for extension, closed for modification
  - Liskov Substitution Principle - Subtypes must be substitutable for their base types
  - Interface Segregation Principle - Many specific interfaces are better than one general-purpose interface
  - Dependency Inversion Principle - Depend on abstractions, not concretions
- **Composition over Inheritance** - Favor object composition over class inheritance (aligns with React patterns)
- **Fail Fast** - Detect and report errors as early as possible (validate inputs immediately, check requirements upfront)
- **Defensive Programming** - Write code that handles unexpected inputs and API failures gracefully
- **Security by Design** - Build security considerations into architecture from the start (consider data protection, access control, and potential misuse in all features)
- **Boy Scout Rule** - Always leave code cleaner than you found it (encourage continuous improvement)

**Code Quality Guidelines**:

- Use meaningful and descriptive names for variables, functions, and classes
- Avoid hard-coded numbers - use named constants or environment variables
- Use comments sparingly - only when code cannot be self-explanatory
- Encapsulate nested conditionals into well-named functions
- Refactor continuously to maintain clean, readable code
- Thoroughly analyze existing code before making changes
- **Preserve existing functionality** - only change what's necessary to fulfill requirements
- Maintain consistency with established patterns and conventions in the codebase

## Design System & UI Guidelines

### Tailwind CSS Configuration & Color Palette

The project follows a **60/30/10 color rule** for visual hierarchy:

- **Primary (60%)**: `#ffffff` - Backgrounds and large surfaces
- **Secondary (30%)**: `#1d1d1c` - Text and UI elements (icons, borders, footers)
- **Accent (10%)**: `#be1823` - Buttons, links, and calls to action
- **Divider**: `#1d1d1C1A` - Divider stripes and borders (10% opacity of secondary)

#### Semantic Colors

- **Success**: Light `#f0fdf4`, Default `#16a34a`, Dark `#15803d`
- **Failure**: Light `#fef2f2`, Default `#dc2626`, Dark `#b91c1c`
- **Warning**: Light `#fff7ed`, Default `#f97316`, Dark `#c2410c`
- **Info**: Light `#eff6ff`, Default `#2563eb`, Dark `#1d4ed8`

#### Design Implementation Guidelines

1. Apply primary color to ~60% of design (page backgrounds, cards)
2. Use secondary color for ~30% (text, icons, borders)
3. Reserve accent color for ~10% (buttons, CTAs, important links)
4. Use semantic colors consistently for status messages and alerts
<!-- 5. Default font: Figtree (sans-serif) -->
5. Default font: "IBM Plex Sans" (sans-serif)
6. Maintain visual hierarchy by emphasizing primary color usage
7. Use semantic color variants: `bg-success-light`, `text-success`, `text-success-dark`

**Component Styling Consistency**: Always reference these color definitions from `tailwind.config.mjs` when creating new components. Use Tailwind utility classes that map to these custom color tokens rather than arbitrary color values.

## Development Commands

```bash
# Development (with custom SSL cert for HostBill API)
npm run dev

# Production build and start
npm run build
npm start

# Linting
npm run lint
```

## Architecture Overview

### E-commerce Platform Structure

This is a Next.js 15 e-commerce platform for Internetport Sweden AB, an ISP selling broadband, telephony, TV, hosting, and security services. The app supports both Swedish (.se) and English (.com) domains with full internationalization.

### Key Business Logic Patterns

**Product Category System**: The codebase uses a sophisticated category-based product system with distinct handling:

- `BROADBAND`: Address-exclusive services requiring `serviceId` and `accessId`
- `TV`/`TV_HARDWARE`: CityNet-based services vs. one-time hardware purchases
- `TELEPHONY`/`TELEPHONY_HARDWARE`: Services with phone number config vs. equipment
- `ROUTER`: Hardware add-ons for broadband services
- `SECURITY`: Campaign-enabled subscription services

**Cart Context Architecture**: `src/context/CartContext.js` implements complex business rules:

- Address-based exclusivity (broadband)
- Category-based exclusivity (TV, telephony)
- Hardware vs service distinction using product ID lists
- Campaign pricing integration
- Environment-aware product categorization

**API Integration Pattern**: The app integrates with HostBill API for:

- Product data via `/api/hostbill/*` routes
- Order creation via `/api/internal/internetport/create-order/`
- Address lookup for broadband services
- Validation schemas that mirror API requirements

### Component Architecture

**Strategy Pattern**: Product rendering uses strategy pattern:

- `UnifiedProductPageController.jsx` routes to appropriate strategy
- `BroadbandProductStrategy.jsx`, `TelephonyServiceProductStrategy.jsx`, etc.
- Each strategy handles category-specific UI and business logic

**Cart Item Delegation**: `CartItemRenderer.jsx` delegates to specialized components:

- `TelephonyCartItem.jsx` for services with addons and phone numbers
- `StandardCartItem.jsx` for hardware and simple products
- `TvCartItem.jsx` for TV services with addon support
- `RouterCartItem.jsx` for installment plans

**Pricing Logic**: Centralized in utility functions:

- `campaignPricing.js` for campaign discount calculations
- `productPricing.js` for tax calculations (always VAT-inclusive display)
- `formatting.js` for price rounding and display formatting

### Environment Configuration

**Multi-Environment Support**: Uses environment variables for:

- Product IDs that differ between dev/prod HostBill instances
- SSL certificates for API connections (`./certs/`)
- Category IDs and addon mappings in `/config/*` files

**Validation Architecture**: Zod schemas in `/lib/validation/`:

- `apiPayloadSchema.js` mirrors HostBill API requirements exactly
- `checkoutSchema.js` for form validation
- Environment-aware validation using product ID lists

### Internationalization

**Domain-Based i18n**:

- `internetport.se` → Swedish (default)
- `internetport.com` → English
- Translations in `/messages/en.json` and `/messages/sv.json`
- Route structure: `/[locale]/category/subcategory/product`

### Critical Files to Understand

**CartContext.js**: Core business logic for cart management, product categorization, and API payload generation. Contains `CATEGORY_CONFIG` that defines all business rules.

**apiPayloadSchema.js**: Zod validation that exactly mirrors HostBill API requirements. Critical for order processing.

**Product Strategy Files**: Each product category has specialized logic in `/components/products/strategies/`. These handle category-specific rendering, validation, and cart interactions.

**Config Files**: `/config/tvProducts.js`, `/config/telephonyProducts.js` contain environment-aware product ID mappings essential for distinguishing services from hardware.

## Key Patterns and Conventions

**Error Boundaries**: Product pages use nested error boundaries (`ProductStrategyErrorBoundary`) to isolate failures per category.

**Async State Management**: Uses SWR for API caching and custom hooks (`useBroadbandData`, `useCart`) for state management.

**Debug Logging**: Extensive debug logging in API routes for troubleshooting HostBill integration (search for `console.log('DEBUG:')`).

**Tax Calculations**: All pricing displays are VAT-inclusive (multiply by 1.25), using `roundedPrice()` for consistent rounding.

**Phone Number Handling**: Telephony products require special addon logic (ID 16 for porting, ID 17 for new numbers) with environment-aware addon IDs.

## Testing and Development Notes

**SSL Certificates**: Development requires custom SSL certs in `/certs/` for HostBill API integration. Different certs for dev vs prod environments.

**API Documentation**: `api-docs.md` contains full HostBill API specifications that validation schemas mirror.

**Environment Variables**: Check `.env.development` for required configuration. Product IDs and category IDs must match HostBill environment.

**Linting**: Uses ESLint with Next.js config. Run `npm run lint` before commits.

## Common Development Scenarios

**Adding New Product Categories**:

1. Add to `CATEGORY_CONFIG` in `CartContext.js`
2. Create strategy component in `/components/products/strategies/`
3. Update `apiPayloadSchema.js` validation
4. Add to `CartItemRenderer.jsx` mapping

**Modifying Pricing Logic**:

- Campaign pricing: `/lib/utils/campaignPricing.js`
- Tax calculations: `/lib/utils/productPricing.js`
- Display formatting: `/lib/utils/formatting.js`

**API Integration Changes**:

- Validation schemas in `/lib/validation/`
- API routes in `/app/api/`
- Environment config in `/config/`
