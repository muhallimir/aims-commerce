# AI Chatbot Integration

This document describes the AI chatbot functionality integrated into the CustomerChatbox component.

## Features

### 🤖 AI-Powered Chatbot

- **Intelligent Product Recommendations**: Analyzes user queries and suggests relevant products from the MongoDB database
- **Advanced Natural Language Understanding**: Recognizes multiple intent types including product searches, price inquiries, category browsing, comparisons, availability checks, and more
- **Complete Product Knowledge**: Has access to the entire product catalog including names, descriptions, prices, availability, categories, brands, and ratings
- **Contextual Conversations**: Maintains conversation history for better context understanding and escalation logic
- **Smart Category Filtering**: Automatically filters results by category (e.g., electronics vs clothing) based on detected keywords
- **Flexible Price Range Handling**: Supports various price query formats like "under $1000", "between $500-$800", "$300 laptop", etc.
- **Query Cleaning**: Intelligently removes price-related terms from product searches to improve matching accuracy

### 🛍️ Interactive Product Suggestions

- **Clickable Product Cards**: Product suggestions are displayed as interactive cards with images, prices, ratings, and stock status
- **Direct Navigation**: Clicking on any suggested product redirects users to the product detail page
- **Add to Cart Integration**: Each product card includes an "Add to Cart" button with dynamic loading states and notifications
- **Real-time Availability**: Shows current stock status and handles out-of-stock scenarios
- **Price Formatting**: Displays properly formatted prices with currency symbols
- **Staggered Animations**: Smooth card animations with staggered timing for better visual experience
- **Category-Aware Suggestions**: Products are filtered by category context (electronics, clothing, etc.)

### 🔄 Seamless Escalation to Human Support

- **Smart Escalation**: Automatically suggests human support after 1 bot interaction to ensure users can easily access help
- **Manual Escalation**: Users can request human assistance at any time through the "Human Help" button
- **Smooth Transition**: Seamlessly switches between AI and human support modes without losing context
- **Chat Persistence**: Chat history is maintained during mode switches and across browser sessions using localStorage
- **Dual-Mode Interface**: Clear visual indicators distinguish between AI chatbot and human support modes
- **Resizable Chat Window**: Users can expand/collapse the chat window for better viewing experience

### 💡 Enhanced User Experience Features

- **Natural Typing Animation**: Realistic typing delays based on message length with visual typing indicators
- **Dynamic Suggestions**: Provides contextual quick-reply options based on conversation flow and detected intent
- **One-Click Responses**: Users can quickly select from suggested responses for common queries
- **Smart Prompts**: Suggests relevant follow-up questions and actions based on user intent
- **Responsive Design**: Fully responsive chat interface that adapts to mobile, tablet, and desktop screens
- **Accessibility Features**: Proper ARIA labels, keyboard navigation, and screen reader support

## Technical Implementation

### Architecture

```
Frontend (React/TypeScript)
├── CustomerChatbox.tsx (Main dual-mode chat component)
├── ProductSuggestion.tsx (Interactive product cards with cart integration)
├── QuickSuggestions.tsx (Dynamic quick reply buttons)
├── TypingIndicator.tsx (Realistic typing animation)
├── useChatbot.ts (Chatbot logic hook with persistence)
└── chatbotService.ts (Advanced AI service layer)

State Management
├── RTK Query (Data fetching and caching)
├── Redux (Cart state management)
└── localStorage (Chat persistence across sessions)
```

### Key Components

#### 1. ChatbotService

- **Advanced AI Response Generation**: Analyzes user intent and generates contextual responses
- **Intelligent Product Search**: Implements flexible search with query cleaning and category filtering
- **Price Range Extraction**: Supports multiple price query formats (under/over/between/exact amounts)
- **Category-Specific Filtering**: Automatically filters electronics vs clothing based on detected keywords
- **Conversation Context Management**: Maintains chat history for escalation logic and context awareness
- **RTK Query Integration**: Seamlessly integrates with existing data fetching infrastructure

#### 2. useChatbot Hook

- **State Management**: Manages chatbot state, typing indicators, and processing flags
- **Message Flow Control**: Handles interaction between user input and AI responses
- **Escalation Logic**: Smart escalation after minimal interactions (1 message threshold)
- **Chat Persistence**: localStorage integration for conversation history across sessions
- **Typing Simulation**: Natural typing delays based on message length for realistic experience

#### 3. CustomerChatbox

- **Dual-Mode Interface**: Seamless switching between AI chatbot and human support
- **Responsive Design**: Adapts to mobile, tablet, and desktop with proper breakpoints
- **Chat Persistence**: Maintains separate chat histories for bot and admin modes
- **WebSocket Management**: Handles real-time connections for human support
- **Visual Indicators**: Clear mode distinction with animated status indicators
- **Resizable Interface**: Expandable chat window for better user experience

#### 4. ProductSuggestion Component

- **Interactive Product Cards**: Rich product display with images, prices, ratings, and stock status
- **Cart Integration**: Direct "Add to Cart" functionality with loading states and notifications
- **Navigation Handling**: Smooth routing to product detail pages
- **Animation System**: Staggered card animations for enhanced visual appeal
- **Responsive Grid**: Adaptive layout for different screen sizes

### Data Flow

1. **User Input** → CustomerChatbox receives message
2. **Intent Analysis** → ChatbotService analyzes user intent
3. **Product Search** → Service searches product database via RTK Query
4. **Response Generation** → AI generates contextual response with product suggestions
5. **UI Update** → Components render response with interactive elements
6. **User Interaction** → Product clicks navigate to detail pages
7. **Escalation** → Smooth transition to human support when needed

## Usage

### For Users

1. **Start Chatting**: Click the chat icon to open the assistant
2. **Ask Questions**: Type questions about products, prices, or categories
3. **Explore Suggestions**: Click on suggested products to view details
4. **Quick Actions**: Use suggested responses for faster interaction
5. **Get Human Help**: Request human assistance when needed

### Example Interactions & Test Cases

#### 🔍 Product Search with Price Filtering

```
User: "I'm looking for a laptop under $1000"
AI: "Great! I found 3 electronics products that match what you're looking for in the under $1000 price range. Here are my top recommendations:"
[Shows: ASUS ROG Strix Scar 15 ($799.59), HP Pavilion Gaming ($799.25), Acer Nitro 5 ($875.05)]

User: "Show me phones between $200 and $500"
AI: "I found electronics products in the $200 - $500 price range. Here are my top recommendations:"
[Displays relevant phone products within price range]
```

#### 🏷️ Category-Specific Searches

```
User: "electronics"
AI: "Here are the best electronics products we have:"
[Shows only electronics, no clothing items]

User: "gadgets under $800"
AI: "Great! I found 5 electronics products that match what you're looking for in the under $800 price range..."
[Electronics only, filtered by price]

User: "I need clothing"
AI: "Here are the best clothing products we have:"
[Shows shirts, pants, etc. - no electronics]
```

#### 🛒 Mixed Category Handling

```
User: "laptop and shirt"
AI: "I found products that match what you're looking for. Here are my top recommendations:"
[Shows both electronics and clothing since both categories mentioned]

User: "phone case"
AI: "I found electronics products that match what you're looking for..."
[Shows electronics accessories]
```

#### 💰 Price-Only Queries

```
User: "What's under $100?"
AI: "Here are some popular items under $100:"
[Shows various products across categories under $100]

User: "$500 budget for gaming"
AI: "I found electronics products that match what you're looking for in the $400 - $600 price range..."
[Gaming electronics within ±20% of $500]
```

#### 🎯 Specific Product Searches

```
User: "ASUS laptop"
AI: "Great! I found electronics products that match what you're looking for. Here are my top recommendations:"
[Shows ASUS laptops with high relevance scoring]

User: "gaming headphones"
AI: "I found electronics products that match what you're looking for..."
[Audio products with gaming keywords]
```

#### 🤝 Escalation Scenarios

```
User: "Hi there!"
AI: "Hello! Welcome to our store! 👋 I'm here to help you find the perfect products. What are you looking for today?"
[After this interaction, "Human Help" button becomes available]

User: "I need help with my order"
AI: "I understand you'd like to speak with a human agent. Let me connect you with our support team right away!"
[Escalates to human support immediately]
```

## Testing Guide

### 🧪 Core Functionality Tests

#### Price Range Searches

- `"laptop under $1000"` - Should show ASUS ROG, HP Pavilion, Acer Nitro 5
- `"electronics under $800"` - Should show electronics under $800
- `"between $700 and $900"` - Should show products in price range
- `"$500 gaming laptop"` - Should show gaming laptops around $400-$600

#### Category Filtering

- `"electronics"` - Only electronics, no clothing
- `"gadgets"` - Only electronics/tech products
- `"laptop"` - Only electronics (no shirts/pants)
- `"phone"` - Only electronics (no clothing)
- `"clothing"` - Only clothing items
- `"shirt"` - Only clothing items
- `"laptop and shirt"` - Both categories (mixed results)

#### Intent Recognition

- `"Hi there!"` - Greeting response + suggestions
- `"What do you sell?"` - General browse response
- `"Show me popular items"` - Trending products
- `"I need help"` - Help response with options
- `"human agent"` - Immediate escalation

#### Search Flexibility

- `"ASUS"` - Brand-based search
- `"gaming"` - Gaming products across categories
- `"cheap laptop"` - Price-conscious search
- `"best phone"` - Quality-focused search

### 🎯 Edge Cases

- `"asdfgh"` - No matches, shows trending products
- `"$99999"` - High price, shows available products
- `"laptop shirt phone"` - Multiple categories, shows mixed results

### 🔄 Escalation Testing

1. Send any message to chatbot
2. "Human Help" button should appear after first interaction
3. Click button to switch to human support mode
4. Verify seamless mode switching
5. Test chat persistence across mode switches

### 📱 UI/UX Testing

- Test on mobile, tablet, and desktop
- Verify resizable chat window
- Check typing animations and delays
- Test product card interactions and cart integration
- Verify responsive design across breakpoints

## Configuration

### Environment Variables

```bash
# (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5003
NEXT_PUBLIC_MONGODB_URI=your_backend_url

### RTK Query Setup

The chatbot uses existing RTK Query endpoints and adds new ones:

- `useGetProductListForChatbotQuery` - Fetches all products for AI
- `useGetProductCategoriesQuery` - Gets available categories
- `useSearchProductsQuery` - Advanced product search

## Benefits

### For Customers

- **24/7 Availability**: AI assistant available round the clock with instant responses
- **Intelligent Search**: Smart product discovery with category filtering and price range support
- **Visual Shopping Experience**: Interactive product cards with images, pricing, and direct cart integration
- **Natural Conversations**: Realistic typing animations and contextual responses
- **Flexible Interface**: Resizable chat window that adapts to user preferences and device types
- **Persistent Chat History**: Conversations saved across browser sessions for continuity
- **Quick Human Access**: Easy escalation to human support after just one interaction
- **Cross-Device Compatibility**: Fully responsive design works seamlessly on all devices

### For Business

- **Reduced Support Load**: AI handles product inquiries, price questions, and category browsing
- **Increased Sales Conversion**: Direct cart integration and smart product recommendations
- **Enhanced User Experience**: Fast, interactive product discovery with visual elements
- **Scalable Customer Service**: Handles unlimited concurrent users without additional staffing
- **Data-Driven Insights**: Conversation history provides valuable customer behavior data
- **Cost-Effective Solution**: Reduces need for 24/7 human support while maintaining quality
- **Brand Consistency**: Maintains consistent product knowledge and response quality

## Future Enhancements

- **Learning Capability**: Machine learning from user interactions
- **Personalization**: User-specific recommendations based on history
- **Multi-language Support**: Internationalization for global markets
- **Voice Interface**: Speech-to-text and text-to-speech capabilities
- **Advanced Analytics**: Detailed conversation and conversion tracking
```
