# Aims Commerce - Copilot Instructions

## Project Overview

Full-stack e-commerce platform with Next.js (Pages Router) frontend and Express/MongoDB backend as separate packages. Supports three user roles: **Customer**, **Seller**, and **Admin**.

## Architecture

### Monorepo Structure

```
aims-commerce/          # Next.js 15 frontend (port 3005)
aims-commerce-backend/  # Express.js API (port 5003)
```

### Frontend Stack

- **Next.js 15** with Pages Router (`src/pages/`)
- **TypeScript** (mixed with JS - migrating)
- **Material-UI (MUI) v5** for components
- **Redux Toolkit + RTK Query** for state/API (`src/store/`)
- **Formik + Yup** for form handling
- **Emotion** for CSS-in-JS styling

### Backend Stack

- **Express.js** with ES Modules
- **MongoDB + Mongoose** for data
- **JWT** for authentication
- **Socket.io** for real-time chat/support
- **Stripe & PayPal** for payments

## Key Patterns

### State Management

RTK Query endpoints are co-located with Redux slices using `apiSlice.injectEndpoints()`:

```javascript
// src/store/user.slice.js
export const userApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		PostSignIn: builder.mutation({
			query: (args) => ({
				url: "/api/users/signin",
				method: "POST",
				body: args,
			}),
		}),
	}),
});
```

### Custom Hooks Pattern

Business logic is encapsulated in hooks under `src/hooks/`:

- `useAuthentication` - Sign in/out, role checks
- `useCartHandling` - Cart operations
- `useSellerAuth` - Seller verification
- `useChatbot` - AI chatbot integration

### Path Aliases (tsconfig.json)

```
@pages/*, @store/*, @common/*, @helpers/*, @styles/*
```

### Route Protection

Middleware (`src/middleware.ts`) handles auth redirects:

- `/admin/*` - requires `isAdmin` JWT claim
- `/seller/*` - requires `isSeller` JWT claim
- `/start-selling` - authenticated non-sellers only

### Layout Pattern

Pages use layout components from `src/layouts/`. Admin/Seller dashboards bypass `MainLayout` in `_app.tsx`.

## Component Organization

```
src/components/
├── cards/          # ProductCard, etc.
├── forms/          # Located in src/forms/ (separate folder)
├── headers/        # MainHeader
├── footers/        # MainFooter
├── modals/         # SuccessModal, etc.
├── sections/       # ProductDetailSection, admin/, seller/
└── messaging/      # CustomerChatbox (AI + human support)
```

## API Integration

- Base URL: `process.env.NEXT_PUBLIC_API_URI`
- Auth: JWT token stored in cookies, attached via `apiSlice` prepareHeaders
- Backend routes: `/api/users`, `/api/products`, `/api/orders`, `/api/sellers`

## Development Commands

```bash
# Frontend (aims-commerce/)
npm run dev          # Start on port 3005 with Turbopack
npm run lint:fix     # ESLint auto-fix
npm run storybook    # Component development

# Backend (aims-commerce-backend/)
npm start            # Production server
nodemon              # Development (install nodemon)
```

## Database Models

- **User** - Core user with `isAdmin`, `isSeller` flags
- **Seller** - Auto-created when user becomes seller (see `userModel.js` hooks)
- **Product** - Has optional `seller` reference
- **Order** - Order with items, shipping, payment status

## Testing

- Jest + React Testing Library
- Run: `npm test`

## Coding Standards

### Core Principles

- **KISS** - Keep solutions simple; avoid over-engineering
- **YAGNI** - Don't add functionality until needed
- **DRY** - Extract repeated logic into helpers/hooks/components
- **SOLID** - Single responsibility per file; depend on abstractions

### File & Component Guidelines

- **Max ~150 lines per file** - Split large components into smaller modules
- **Follow existing folder structure** - Place new files in appropriate `src/` subdirectories
- **One component per file** - Export default for main component

### Performance Optimization (Frontend)

```tsx
// Use useMemo for expensive calculations
const filteredProducts = useMemo(
	() => products.filter((p) => p.category === selectedCategory),
	[products, selectedCategory],
);

// Use useCallback for functions passed to children
const handleAddToCart = useCallback(
	(productId: string) => {
		dispatch(updateCartList(productId));
	},
	[dispatch],
);

// Use useRef for DOM refs and mutable values that don't trigger re-renders
const inputRef = useRef<HTMLInputElement>(null);
```

### Custom Hooks Pattern

Extract reusable logic into `src/hooks/`:

```tsx
// Good: Encapsulate related state and effects
const useProductSearch = (query: string) => {
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	// ... logic
	return { results, loading };
};
```

### Modularity & Reusability

- Extract shared UI into `src/components/` by category (cards, buttons, modals)
- Place form components in `src/forms/`
- Create section components in `src/components/sections/`
- Use `src/common/constants.ts` for shared constants
- Define TypeScript interfaces in `src/common/interface.tsx`

## Conventions

- Forms use Formik with Yup validation schemas
- MUI theme in `src/styles/theme/` with custom breakpoints
- Constants/interfaces in `src/common/`
- Use `lodash/isEmpty` for object checks
- Loading states managed via `app.slice` (`setLoading`, `setAppError`)

## AI Chatbot Feature

### Chat Availability

- Chat is available for **all users** (authenticated and unauthenticated)
- Unauthenticated users can browse products and get recommendations
- "Add to Cart" shows sign-in prompt dialog for unauthenticated users
- After sign-in, pending product is auto-added to cart and user is redirected to checkout

### User-Specific Chat Persistence

- Chat history is stored per-user using localStorage with user ID keys
- Pattern: `chatbot-messages-{userId}` or `chatbot-messages-guest`
- **Guest → Login (same session)**: Guest chat is migrated to user's chat (persists)
- **Login as different user**: Fresh chat for new user, previous user's chat preserved separately
- **Logout**: User's chat preserved, loads fresh guest chat
- Users can manually clear chat via the clear button

### Key Files

- `src/hooks/useChatbot.ts` - Chat state management with user-specific persistence
- `src/hooks/useAuthentication.js` - Handles pending cart product after login
- `src/components/messaging/CustomerChatbox.tsx` - Main chat UI (AI + human support)
- `src/components/messaging/ProductSuggestion.tsx` - Product cards with auth-aware "Add to Cart"
- `src/components/messaging/TypewriterText.tsx` - Typing animation component for bot responses
- `src/components/messaging/PopularityChart.tsx` - Visual chart for product popularity rankings
- `src/services/chatbotService.ts` - AI response generation and product search
- `docs/CHATBOT_TESTING.md` - Test questions and expected responses

### Knowledge Base Topics

The chatbot handles common e-commerce questions via a built-in knowledge base:

| Topic      | Example Questions                                  |
| ---------- | -------------------------------------------------- |
| Shipping   | "How long does shipping take?", "Free shipping?"   |
| Returns    | "Return policy", "How to exchange?"                |
| Payment    | "Payment methods", "Is it secure?"                 |
| Account    | "Forgot password", "Create account"                |
| Orders     | "Where is my order?", "Cancel order"               |
| Products   | "Size guide", "Warranty info"                      |
| Popularity | "What's trending?", "Most popular?", "Best rated?" |
| Price      | "Cheapest?", "Most expensive?", "Budget options?"  |
| Deals      | "Any sales?", "Discounts?", "Promotions?"          |
| Stock      | "Is this in stock?", "Notify when available?"      |
| Wishlist   | "Save for later", "Where's my wishlist?"           |
| Loyalty    | "Rewards program?", "Earn points?"                 |
| Categories | "What do you sell?", "Browse categories"           |
| Privacy    | "Is my data safe?", "Secure payments?"             |
| Seller     | "How to become a seller?"                          |

### Typing Animation

Bot responses use a fast typewriter effect for natural conversation feel:

- **Component**: `TypewriterText.tsx`
- **Speed**: ~100 characters/second
- **Features**: Character-by-character reveal, blinking cursor, completion callback

### Popularity Chart

When users ask about popular/trending products, a visual chart is displayed:

- **Component**: `PopularityChart.tsx`
- **Trigger Words**: "popular", "trending", "best rated", "top rated", "bestseller"
- **Features**: Horizontal bar chart, gold/silver/bronze rankings, hover tooltips, animated bars
- **Data**: Products sorted by rating × log(numReviews)

### Price Extreme Queries

Handles "cheapest" and "most expensive" product searches:

- **Cheapest triggers**: "cheapest", "lowest price", "budget", "bargain", "affordable"
- **Expensive triggers**: "most expensive", "premium", "luxury", "priciest"
- **Category support**: "cheapest electronics", "most expensive clothing"
- **Features**: Price-sorted results, price range display, relevant follow-up suggestions

### Empty State Handling

The chatbot gracefully handles scenarios when no products are found:

- **Category Empty**: Shows trending products from ALL categories as fallback
- **Helpful Message**: Explains no products in that category yet
- **Alternative Suggestions**: Offers other categories to browse
- **No Broken UI**: Never shows "browse categories" with empty suggestions
- **Complete Empty**: If no products at all, offers helpful info about shipping, returns, etc.

### Adding New Knowledge Base Topics

To add new Q&A topics, update the `knowledgeBase` object in `chatbotService.ts`:

```typescript
topicName: {
    patterns: ['keyword1', 'keyword2'],  // Trigger words
    responses: {
        general: "Default response...",
        subtopic: "Specific response..."
    }
}
```
