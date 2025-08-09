export interface Product {
    _id: string;
    name: string;
    image: string;
    brand: string;
    category: string;
    description: string;
    price: number;
    countInStock: number;
    rating: number;
    numReviews: number;
    isActive: boolean;
}

export interface ChatbotResponse {
    message: string;
    type: 'text' | 'product_suggestions' | 'escalate_to_admin';
    products?: Product[];
    suggestions?: string[];
}

export interface ChatbotMessage {
    name: string;
    body: string;
    type?: 'user' | 'bot' | 'admin';
    timestamp?: Date;
    products?: Product[];
    isProductSuggestion?: boolean;
}

class ChatbotService {
    private conversationHistory: ChatbotMessage[] = [];
    private productCache: Product[] = [];
    private categories: string[] = [];
    private getProductsApi: any = null;
    private getCategoriesApi: any = null;

    constructor() {
        // We'll initialize APIs from the component that uses this service
    }

    // Set API functions (called from React component)
    setApiEndpoints(getProductsApi: any, getCategoriesApi: any) {
        this.getProductsApi = getProductsApi;
        this.getCategoriesApi = getCategoriesApi;
    }

    // Initialize product data cache using RTK Query
    async initializeProductData() {
        try {
            if (!this.getProductsApi || !this.getCategoriesApi) {
                console.warn('API endpoints not set for chatbot service');
                return;
            }

            const [productsResult, categoriesResult] = await Promise.all([
                this.getProductsApi(),
                this.getCategoriesApi()
            ]);

            if (productsResult.data) {
                this.productCache = productsResult.data;
            }
            if (categoriesResult.data) {
                this.categories = categoriesResult.data;
            }
        } catch (error) {
            console.error('Failed to initialize product data:', error);
        }
    }

    // Refresh product cache
    async refreshProductCache() {
        await this.initializeProductData();
    }

    // Search products based on query
    private searchProducts(
        query: string,
        limit: number = 5,
        priceRange?: { min?: number; max?: number }
    ): Product[] {
        // Clean the query by removing price-related terms that aren't product descriptors
        const cleanedQuery = query.toLowerCase()
            .replace(/\b(?:under|below|less\s+than|over|above|more\s+than|between|price|cost|dollar|usd|\$\d+|\d+\s*dollars?)\b/gi, '')
            .replace(/\s+/g, ' ')
            .trim();

        const searchTerms = cleanedQuery.split(/\s+/).filter(term => term.length > 0);

        // If no meaningful search terms remain after cleaning, search by category or return trending
        if (searchTerms.length === 0) {
            return this.getTrendingProducts(limit);
        }

        // Determine if the search is category-specific
        const categoryFilter = this.determineCategoryFilter(query);

        return this.productCache
            .filter(product => {
                // Only include active products
                if (!product.isActive) return false;

                // Filter by price range if specified
                if (priceRange) {
                    const price = product.price;
                    if (priceRange.min !== undefined && price < priceRange.min) return false;
                    if (priceRange.max !== undefined && price > priceRange.max) return false;
                }

                // Apply category filter if determined
                if (categoryFilter && !this.matchesCategoryFilter(product, categoryFilter)) {
                    return false;
                }

                const searchText = `${product.name} ${product.description} ${product.category} ${product.brand}`.toLowerCase();

                // Check if ANY search term matches (more flexible than requiring ALL)
                return searchTerms.some(term => {
                    // Create regex with word boundaries to match whole words
                    const wordBoundaryRegex = new RegExp(`\\b${this.escapeRegex(term)}\\b`, 'i');

                    // Also check for exact substring matches in case of partial product names
                    const substringMatch = searchText.includes(term);

                    // Match if either word boundary match OR substring match (for flexibility)
                    return wordBoundaryRegex.test(searchText) || substringMatch;
                });
            })
            .sort((a, b) => {
                // Calculate relevance score for better ranking
                const aScore = this.calculateRelevanceScore(a, searchTerms);
                const bScore = this.calculateRelevanceScore(b, searchTerms);

                if (bScore !== aScore) return bScore - aScore;

                // Secondary sort by rating, then price
                if (b.rating !== a.rating) return b.rating - a.rating;
                return a.price - b.price;
            })
            .slice(0, limit);
    }

    // Determine if search should be filtered to specific categories
    private determineCategoryFilter(query: string): string | null {
        const lowerQuery = query.toLowerCase();

        // Electronics-related keywords
        const electronicsKeywords = [
            'electronics', 'electronic', 'gadget', 'gadgets', 'tech', 'technology',
            'laptop', 'laptops', 'computer', 'computers', 'pc', 'pcs', 'notebook', 'notebooks',
            'phone', 'phones', 'smartphone', 'smartphones', 'mobile', 'cellphone', 'iphone', 'android',
            'tablet', 'tablets', 'ipad', 'ipads',
            'headphones', 'earphones', 'earbuds', 'headsets', 'speaker', 'speakers', 'audio',
            'camera', 'cameras', 'webcam', 'webcams', 'photography',
            'watch', 'watches', 'smartwatch', 'smartwatches',
            'keyboard', 'keyboards', 'mouse', 'mice', 'monitor', 'monitors', 'display', 'displays',
            'gaming', 'gamer', 'game', 'games', 'console', 'consoles', 'playstation', 'xbox', 'nintendo',
            'charger', 'chargers', 'cable', 'cables', 'usb', 'bluetooth', 'wifi', 'wireless'
        ];

        // Clothing-related keywords
        const clothingKeywords = [
            'clothing', 'clothes', 'apparel', 'fashion', 'wear',
            'shirt', 'shirts', 't-shirt', 'tshirt', 'polo', 'blouse', 'top', 'tops',
            'pants', 'jeans', 'trousers', 'shorts', 'leggings', 'bottom', 'bottoms',
            'dress', 'dresses', 'skirt', 'skirts',
            'shoes', 'sneakers', 'boots', 'sandals', 'heels', 'footwear',
            'jacket', 'jackets', 'coat', 'coats', 'hoodie', 'hoodies', 'sweater', 'sweaters',
            'underwear', 'socks', 'hat', 'hats', 'cap', 'caps'
        ];

        // Check for electronics keywords
        const hasElectronicsKeywords = electronicsKeywords.some(keyword => {
            const wordBoundaryRegex = new RegExp(`\\b${this.escapeRegex(keyword)}\\b`, 'i');
            return wordBoundaryRegex.test(lowerQuery);
        });

        // Check for clothing keywords
        const hasClothingKeywords = clothingKeywords.some(keyword => {
            const wordBoundaryRegex = new RegExp(`\\b${this.escapeRegex(keyword)}\\b`, 'i');
            return wordBoundaryRegex.test(lowerQuery);
        });

        // If electronics keywords are found but no specific clothing keywords, filter to electronics
        if (hasElectronicsKeywords && !hasClothingKeywords) {
            return 'Electronics';
        }

        // If clothing keywords are found but no specific electronics keywords, filter to clothing
        if (hasClothingKeywords && !hasElectronicsKeywords) {
            return 'Clothing';
        }

        // If both or neither are found, don't apply category filter
        return null;
    }

    // Check if a product matches the category filter
    private matchesCategoryFilter(product: Product, categoryFilter: string): boolean {
        const productCategory = product.category.toLowerCase();
        const filterCategory = categoryFilter.toLowerCase();

        // Direct category match
        if (productCategory === filterCategory) {
            return true;
        }

        // Handle category synonyms and related categories
        if (filterCategory === 'electronics') {
            return ['electronics', 'gaming', 'tech', 'technology'].includes(productCategory);
        }

        if (filterCategory === 'clothing') {
            return ['shirts', 'pants', 'clothing', 'apparel', 'fashion', 'shoes', 'footwear'].includes(productCategory);
        }

        return false;
    }

    // Helper function to escape regex special characters
    private escapeRegex(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Calculate relevance score based on how well the product matches the search terms
    private calculateRelevanceScore(product: Product, searchTerms: string[]): number {
        let score = 0;
        const searchableText = {
            name: product.name.toLowerCase(),
            description: product.description.toLowerCase(),
            category: product.category.toLowerCase(),
            brand: product.brand.toLowerCase()
        };

        searchTerms.forEach(term => {
            // Exact name match gets highest score
            if (searchableText.name.includes(term)) {
                score += 10;
                // Bonus for exact word match in name
                if (new RegExp(`\\b${this.escapeRegex(term)}\\b`, 'i').test(searchableText.name)) {
                    score += 15;
                }
            }

            // Category match gets high score
            if (searchableText.category.includes(term)) {
                score += 8;
            }

            // Brand match gets medium score
            if (searchableText.brand.includes(term)) {
                score += 6;
            }

            // Description match gets lower score
            if (searchableText.description.includes(term)) {
                score += 3;
                // Bonus for exact word match in description
                if (new RegExp(`\\b${this.escapeRegex(term)}\\b`, 'i').test(searchableText.description)) {
                    score += 2;
                }
            }
        });

        return score;
    }    // Get products by category
    private getProductsByCategory(category: string, limit: number = 5): Product[] {
        return this.productCache
            .filter(product => {
                // Only include active products
                return product.isActive && product.category.toLowerCase() === category.toLowerCase();
            })
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }

    // Get trending/popular products
    private getTrendingProducts(limit: number = 5): Product[] {
        return this.productCache
            .filter(product => product.isActive) // Only include active products
            .sort((a, b) => {
                // Sort by rating and number of reviews
                const aScore = a.rating * a.numReviews;
                const bScore = b.rating * b.numReviews;
                return bScore - aScore;
            })
            .slice(0, limit);
    }

    // Analyze user intent and generate appropriate response
    private analyzeUserIntent(message: string): {
        intent: string;
        entities: string[];
        needsProductSuggestion: boolean;
        priceRange?: { min?: number; max?: number };
    } {
        const lowerMessage = message.toLowerCase();

        // Intent patterns
        const intents = {
            product_search: [
                'looking for', 'need', 'want', 'buy', 'purchase', 'search', 'find',
                'recommend', 'suggest', 'show me', 'do you have', 'sell', 'selling'
            ],
            category_browse: [
                'category', 'type', 'kind', 'browse', 'categories', 'section'
            ],
            price_inquiry: [
                'price', 'cost', 'expensive', 'cheap', 'budget', 'affordable', 'how much',
                'under', 'below', 'above', 'between', '$', 'dollar', 'usd'
            ],
            comparison: [
                'compare', 'difference', 'better', 'vs', 'versus', 'which one', 'best'
            ],
            availability: [
                'stock', 'available', 'in stock', 'out of stock', 'inventory'
            ],
            greeting: [
                'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'
            ],
            help: [
                'help', 'assist', 'support', 'problem', 'issue', 'question'
            ]
        };

        // Extract price range if mentioned
        const priceRange = this.extractPriceRange(lowerMessage);

        // Extract entities (categories, brands, product types, etc.)
        const entities: string[] = [];

        // Check for categories
        this.categories.forEach(category => {
            if (lowerMessage.includes(category.toLowerCase())) {
                entities.push(category);
            }
        });

        // Check for common product types/keywords
        const productKeywords = [
            // Electronics
            'laptop', 'laptops', 'notebook', 'notebooks', 'computer', 'computers', 'pc', 'pcs',
            'phone', 'phones', 'smartphone', 'smartphones', 'mobile', 'cellphone',
            'tablet', 'tablets', 'ipad', 'ipads',
            'headphones', 'earphones', 'earbuds', 'headsets', 'speaker', 'speakers',
            'camera', 'cameras', 'webcam', 'webcams',
            'watch', 'watches', 'smartwatch', 'smartwatches',
            'keyboard', 'keyboards', 'mouse', 'mice', 'monitor', 'monitors', 'display', 'displays',
            'gaming', 'gamer', 'game', 'games', 'console', 'consoles',
            // Clothing
            'pants', 'jeans', 'trousers', 'shorts', 'leggings',
            'shirt', 'shirts', 't-shirt', 'tshirt', 'polo', 'dress', 'dresses',
            'shoes', 'sneakers', 'boots', 'sandals', 'heels',
            'jacket', 'jackets', 'coat', 'coats', 'hoodie', 'hoodies', 'sweater', 'sweaters',
            // Books & Media
            'book', 'books', 'novel', 'novels', 'magazine', 'magazines',
            // Categories
            'electronics', 'clothing', 'apparel', 'fashion', 'tech', 'technology'
        ];

        productKeywords.forEach(keyword => {
            // Use word boundaries to match exact words
            const wordBoundaryRegex = new RegExp(`\\b${this.escapeRegex(keyword)}\\b`, 'i');
            if (wordBoundaryRegex.test(lowerMessage)) {
                entities.push(keyword);
            }
        });

        // Determine intent
        let detectedIntent = 'general';
        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => {
                // Use word boundaries for more accurate intent detection
                const wordBoundaryRegex = new RegExp(`\\b${this.escapeRegex(keyword)}\\b`, 'i');
                return wordBoundaryRegex.test(lowerMessage) || lowerMessage.includes(keyword);
            })) {
                detectedIntent = intent;
                break;
            }
        }

        // Determine if product suggestion is needed
        const needsProductSuggestion = [
            'product_search', 'category_browse', 'comparison'
        ].includes(detectedIntent) || entities.length > 0;

        return {
            intent: detectedIntent,
            entities,
            needsProductSuggestion,
            priceRange
        };
    }

    // Extract price range from user message
    private extractPriceRange(message: string): { min?: number; max?: number } | undefined {
        const priceRange: { min?: number; max?: number } = {};

        // Match patterns like "under $100", "below 50", "less than $200"
        const underMatch = message.match(/(?:under|below|less\s+than|maximum\s+of)\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
        if (underMatch) {
            priceRange.max = parseFloat(underMatch[1].replace(/,/g, ''));
        }

        // Match patterns like "over $100", "above 50", "more than $200", "minimum of $150"
        const overMatch = message.match(/(?:over|above|more\s+than|minimum\s+of)\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
        if (overMatch) {
            priceRange.min = parseFloat(overMatch[1].replace(/,/g, ''));
        }

        // Match patterns like "between $50 and $100", "$50-$100", "50 to 100"
        const betweenMatch = message.match(/(?:between\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:and|to|-)\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)|\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:-|to)\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?))/i);
        if (betweenMatch) {
            const min = parseFloat((betweenMatch[1] || betweenMatch[3]).replace(/,/g, ''));
            const max = parseFloat((betweenMatch[2] || betweenMatch[4]).replace(/,/g, ''));
            priceRange.min = Math.min(min, max);
            priceRange.max = Math.max(min, max);
        }

        // Match simple dollar amounts that might indicate a budget (e.g., "$500 laptop", "1000 dollar computer")
        if (!priceRange.min && !priceRange.max) {
            const simplePrice = message.match(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*dollars?/i);
            if (simplePrice) {
                const amount = parseFloat((simplePrice[1] || simplePrice[2]).replace(/,/g, ''));
                // If it's mentioned with words like "budget", "under", etc., treat as max
                if (/budget|under|below|less|maximum|max/i.test(message)) {
                    priceRange.max = amount;
                } else {
                    // Otherwise treat as approximate target (± 20%)
                    priceRange.min = amount * 0.8;
                    priceRange.max = amount * 1.2;
                }
            }
        }

        return Object.keys(priceRange).length > 0 ? priceRange : undefined;
    }

    // Generate chatbot response using GitHub Copilot-style intelligence
    async generateResponse(userMessage: string): Promise<ChatbotResponse> {
        try {
            // Add user message to conversation history
            this.conversationHistory.push({
                name: 'User',
                body: userMessage,
                type: 'user',
                timestamp: new Date()
            });

            // Analyze user intent
            const analysis = this.analyzeUserIntent(userMessage);

            let response: ChatbotResponse;

            switch (analysis.intent) {
                case 'greeting':
                    response = this.generateGreetingResponse();
                    break;

                case 'product_search':
                    response = this.generateProductSearchResponse(userMessage, analysis.priceRange);
                    break;

                case 'category_browse':
                    response = this.generateCategoryBrowseResponse(analysis.entities);
                    break;

                case 'price_inquiry':
                    response = this.generatePriceInquiryResponse(userMessage, analysis.priceRange);
                    break;

                case 'comparison':
                    response = this.generateComparisonResponse(userMessage);
                    break;

                case 'availability':
                    response = this.generateAvailabilityResponse(userMessage);
                    break;

                case 'help':
                    response = this.generateHelpResponse();
                    break;

                default:
                    response = this.generateGeneralResponse(userMessage);
            }

            // Add bot response to conversation history
            this.conversationHistory.push({
                name: 'AI Assistant',
                body: response.message,
                type: 'bot',
                timestamp: new Date(),
                products: response.products,
                isProductSuggestion: response.type === 'product_suggestions'
            });

            return response;
        } catch (error) {
            console.error('Error generating chatbot response:', error);
            return {
                message: "I'm having trouble processing your request right now. Would you like me to connect you with a human agent?",
                type: 'escalate_to_admin'
            };
        }
    }

    private generateGreetingResponse(): ChatbotResponse {
        const greetings = [
            "Hello! Welcome to our store! 👋 I'm here to help you find the perfect products. What are you looking for today?",
            "Hi there! 🛍️ I can help you discover amazing products, check prices, and answer any questions you have. How can I assist you?",
            "Welcome! I'm your AI shopping assistant. I know all about our products and can help you find exactly what you need. What interests you today?"
        ];

        return {
            message: greetings[Math.floor(Math.random() * greetings.length)],
            type: 'text',
            suggestions: [
                "Show me trending products",
                "I'm looking for electronics",
                "What's on sale today?",
                "Help me find a gift"
            ]
        };
    }

    private generateProductSearchResponse(
        userMessage: string,
        priceRange?: { min?: number; max?: number }
    ): ChatbotResponse {
        const products = this.searchProducts(userMessage, 5, priceRange);
        const categoryFilter = this.determineCategoryFilter(userMessage);

        if (products.length === 0) {
            let message = "I couldn't find any products matching your search";
            if (priceRange) {
                const priceText = this.formatPriceRange(priceRange);
                message += ` in the ${priceText} price range`;
            }
            if (categoryFilter) {
                message += ` in the ${categoryFilter} category`;
            }
            message += ". Let me show you some popular items instead, or you can try a different search term.";

            // Show trending products from the same category if filter was applied
            const fallbackProducts = categoryFilter
                ? this.getProductsByCategory(categoryFilter, 5)
                : this.getTrendingProducts(5);

            return {
                message,
                type: 'product_suggestions',
                products: fallbackProducts.length > 0 ? fallbackProducts : this.getTrendingProducts(5)
            };
        }

        let message = `Great! I found ${products.length} ${categoryFilter ? categoryFilter.toLowerCase() : ''} products that match what you're looking for`;
        if (priceRange) {
            const priceText = this.formatPriceRange(priceRange);
            message += ` in the ${priceText} price range`;
        }
        message += ". Here are my top recommendations:";

        return {
            message,
            type: 'product_suggestions',
            products
        };
    }

    private formatPriceRange(priceRange: { min?: number; max?: number }): string {
        if (priceRange.min && priceRange.max) {
            return `$${priceRange.min} - $${priceRange.max}`;
        } else if (priceRange.min) {
            return `over $${priceRange.min}`;
        } else if (priceRange.max) {
            return `under $${priceRange.max}`;
        }
        return '';
    }

    private generateCategoryBrowseResponse(entities: string[]): ChatbotResponse {
        if (entities.length > 0) {
            // Determine which category the user is most interested in
            const categoryFilter = this.determineCategoryFilter(entities.join(' '));

            if (categoryFilter) {
                const products = this.getProductsByCategory(categoryFilter);

                return {
                    message: `Here are the best ${categoryFilter.toLowerCase()} products we have:`,
                    type: 'product_suggestions',
                    products
                };
            } else {
                // Use the first entity as category
                const category = entities[0];
                const products = this.getProductsByCategory(category);

                if (products.length > 0) {
                    return {
                        message: `Here are the best products in ${category}:`,
                        type: 'product_suggestions',
                        products
                    };
                }
            }
        }

        return {
            message: `We have products in these categories: ${this.categories.join(', ')}. Which category interests you?`,
            type: 'text',
            suggestions: this.categories.slice(0, 4)
        };
    }

    private generatePriceInquiryResponse(
        userMessage: string,
        priceRange?: { min?: number; max?: number }
    ): ChatbotResponse {
        const products = this.searchProducts(userMessage, 5, priceRange);

        if (products.length > 0) {
            const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
            let message = `The average price for these products is $${avgPrice.toFixed(2)}`;

            if (priceRange) {
                const priceText = this.formatPriceRange(priceRange);
                message += ` in the ${priceText} range`;
            }

            message += ". Here are some options:";

            return {
                message,
                type: 'product_suggestions',
                products: products.slice(0, 3)
            };
        }

        let message = "I'd be happy to help you find products within your budget!";
        if (priceRange) {
            const priceText = this.formatPriceRange(priceRange);
            message += ` I can show you products in the ${priceText} range.`;
        }
        message += " What type of product are you looking for?";

        return {
            message,
            type: 'text'
        };
    }

    private generateComparisonResponse(userMessage: string): ChatbotResponse {
        const products = this.searchProducts(userMessage, 3);

        if (products.length >= 2) {
            return {
                message: "Here are some similar products you can compare. Each has different features and price points:",
                type: 'product_suggestions',
                products
            };
        }

        return {
            message: "I'd be happy to help you compare products! Can you tell me which specific products or categories you'd like to compare?",
            type: 'text'
        };
    }

    private generateAvailabilityResponse(userMessage: string): ChatbotResponse {
        const products = this.searchProducts(userMessage);

        if (products.length > 0) {
            // Filter for products that are both active and in stock
            const inStock = products.filter(p => p.isActive && p.countInStock > 0);
            return {
                message: `I found ${inStock.length} products in stock that match your search:`,
                type: 'product_suggestions',
                products: inStock
            };
        }

        return {
            message: "I can check stock availability for you! What product are you interested in?",
            type: 'text'
        };
    }

    private generateHelpResponse(): ChatbotResponse {
        return {
            message: "I'm here to help! I can assist you with:\n• Finding products\n• Checking prices and availability\n• Product recommendations\n• Comparing similar items\n• General product information\n\nIf you need human assistance, I can connect you with our support team. What would you like help with?",
            type: 'text',
            suggestions: [
                "Find products for me",
                "Check product availability",
                "Compare products",
                "Talk to human agent"
            ]
        };
    }

    private generateGeneralResponse(userMessage: string): ChatbotResponse {
        // Check if user wants to escalate to human
        if (userMessage.toLowerCase().includes('human') ||
            userMessage.toLowerCase().includes('agent') ||
            userMessage.toLowerCase().includes('person')) {
            return {
                message: "I understand you'd like to speak with a human agent. Let me connect you with our support team right away!",
                type: 'escalate_to_admin'
            };
        }

        // Try to find relevant products with category filtering
        const categoryFilter = this.determineCategoryFilter(userMessage);
        const products = this.searchProducts(userMessage);

        if (products.length > 0) {
            let message = "I'm not entirely sure what you're looking for, but here are some";
            if (categoryFilter) {
                message += ` ${categoryFilter.toLowerCase()}`;
            }
            message += " products that might interest you:";

            return {
                message,
                type: 'product_suggestions',
                products: products.slice(0, 3)
            };
        }

        return {
            message: "I'd love to help you find what you're looking for! Could you tell me more about what you need? You can ask me about products, prices, categories, or anything else.",
            type: 'text',
            suggestions: [
                "Show me electronics",
                "Browse clothing",
                "Find deals",
                "Talk to human agent"
            ]
        };
    }

    // Check if conversation should escalate to human
    shouldEscalateToHuman(): boolean {
        const recentMessages = this.conversationHistory.slice(-5);
        const botResponses = recentMessages.filter(msg => msg.type === 'bot');

        // Escalate if bot has made several suggestions without user engagement
        return botResponses.length >= 3;
    }

    // Get conversation history
    getConversationHistory(): ChatbotMessage[] {
        return this.conversationHistory;
    }

    // Clear conversation history
    clearConversationHistory(): void {
        this.conversationHistory = [];
    }
}

export default new ChatbotService();
