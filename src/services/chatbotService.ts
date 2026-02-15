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
    showPopularityChart?: boolean; // Flag to show popularity chart visualization
}

export interface ChatbotMessage {
    name: string;
    body: string;
    type?: 'user' | 'bot' | 'admin';
    timestamp?: Date;
    products?: Product[];
    isProductSuggestion?: boolean;
    showPopularityChart?: boolean; // Flag to show popularity chart visualization
}

class ChatbotService {
    private conversationHistory: ChatbotMessage[] = [];
    private productCache: Product[] = [];
    private categories: string[] = [];
    private getProductsApi: any = null;
    private getCategoriesApi: any = null;

    // E-commerce Knowledge Base for common questions
    private knowledgeBase = {
        // Shipping & Delivery
        shipping: {
            patterns: ['shipping', 'delivery', 'ship', 'deliver', 'how long', 'arrive', 'when will', 'shipping cost', 'free shipping', 'shipping fee', 'track', 'tracking'],
            responses: {
                general: "📦 **Shipping Information**\n\nWe offer several shipping options:\n• **Standard Shipping**: 5-7 business days\n• **Express Shipping**: 2-3 business days\n• **Overnight**: Next business day\n\nFree shipping on orders over $50! Track your order anytime in your account.",
                cost: "🚚 **Shipping Costs**\n\n• Orders over $50: **FREE standard shipping**\n• Orders under $50: $5.99 standard, $12.99 express\n• Overnight: $24.99\n\nShipping is calculated at checkout based on your location.",
                tracking: "📍 **Track Your Order**\n\nOnce your order ships, you'll receive a tracking number via email. You can also:\n1. Log into your account\n2. Go to 'My Orders'\n3. Click 'Track Order'\n\nNeed help tracking? Contact our support team!",
                international: "🌍 **International Shipping**\n\nWe ship to over 100 countries! International shipping typically takes 7-14 business days. Customs fees may apply depending on your country."
            }
        },
        // Returns & Refunds
        returns: {
            patterns: ['return', 'refund', 'exchange', 'money back', 'send back', 'return policy', 'warranty', 'damaged', 'defective', 'wrong item', 'cancel order'],
            responses: {
                general: "↩️ **Return Policy**\n\nWe offer hassle-free returns!\n• **30-day return window** for most items\n• **Free return shipping** on defective items\n• **Full refund** or exchange available\n\nItems must be unused and in original packaging.",
                process: "📋 **How to Return**\n\n1. Log into your account\n2. Go to 'My Orders'\n3. Select the item to return\n4. Print the return label\n5. Ship it back!\n\nRefunds are processed within 5-7 business days after we receive the item.",
                exchange: "🔄 **Exchanges**\n\nWant a different size, color, or product? We've got you!\n\n1. Start a return for the original item\n2. Place a new order for the replacement\n3. We'll expedite your new order!\n\nNo extra shipping charges for exchanges.",
                damaged: "⚠️ **Damaged or Defective Items**\n\nSo sorry about that! We'll make it right:\n1. Contact us within 48 hours of delivery\n2. Send a photo of the damage\n3. We'll ship a replacement immediately!\n\nNo need to return the damaged item."
            }
        },
        // Payment
        payment: {
            patterns: ['payment', 'pay', 'credit card', 'debit', 'paypal', 'payment method', 'secure', 'checkout', 'billing', 'invoice', 'receipt', 'promo code', 'coupon', 'discount code', 'gift card'],
            responses: {
                general: "💳 **Payment Methods**\n\nWe accept:\n• Credit/Debit Cards (Visa, Mastercard, Amex)\n• PayPal\n• Apple Pay & Google Pay\n• Gift Cards\n\nAll transactions are secured with 256-bit SSL encryption.",
                security: "🔒 **Payment Security**\n\nYour payment is 100% secure!\n• 256-bit SSL encryption\n• PCI-DSS compliant\n• No card details stored on our servers\n• Fraud protection on all orders",
                promo: "🎟️ **Promo Codes & Discounts**\n\nTo apply a promo code:\n1. Add items to your cart\n2. Go to checkout\n3. Enter code in 'Promo Code' field\n4. Click 'Apply'\n\nSign up for our newsletter for exclusive discounts!",
                giftCard: "🎁 **Gift Cards**\n\nGift cards can be applied at checkout:\n1. Enter your gift card code\n2. The balance will be deducted from your total\n3. Pay any remaining balance with another method\n\nGift cards never expire!"
            }
        },
        // Account
        account: {
            patterns: ['account', 'password', 'sign up', 'register', 'login', 'sign in', 'forgot password', 'reset password', 'profile', 'email', 'update account', 'delete account'],
            responses: {
                general: "👤 **Account Help**\n\nI can help with:\n• Creating an account\n• Password reset\n• Updating your profile\n• Order history\n\nWhat do you need help with?",
                create: "✨ **Create an Account**\n\nJoin us for exclusive benefits:\n1. Click 'Sign In' in the header\n2. Select 'Create Account'\n3. Fill in your details\n4. Verify your email\n\nBenefits: Faster checkout, order tracking, exclusive offers!",
                password: "🔑 **Reset Password**\n\n1. Click 'Sign In'\n2. Select 'Forgot Password'\n3. Enter your email\n4. Check your inbox for reset link\n5. Create a new password\n\nLink expires in 24 hours.",
                benefits: "⭐ **Account Benefits**\n\n• Save shipping addresses\n• Quick checkout\n• Track all your orders\n• Wishlist feature\n• Exclusive member discounts\n• Early access to sales"
            }
        },
        // Orders
        orders: {
            patterns: ['order', 'order status', 'where is my order', 'my order', 'order history', 'past orders', 'recent orders', 'order confirmation', 'order number'],
            responses: {
                general: "📦 **Order Information**\n\nTo check your order:\n1. Log into your account\n2. Go to 'My Orders' or 'Purchase History'\n3. View status, tracking, and details\n\nNeed your order number? Check your confirmation email!",
                status: "📊 **Order Status Guide**\n\n• **Processing**: We're preparing your order\n• **Shipped**: On its way to you!\n• **Out for Delivery**: Arriving today\n• **Delivered**: Enjoy your purchase!\n\nTracking updates are sent via email.",
                modify: "✏️ **Modify Your Order**\n\nNeed to change something? Act fast!\n• **Within 1 hour**: Most changes possible\n• **After 1 hour**: Contact support immediately\n• **Already shipped**: May need to return\n\nContact us ASAP for order changes."
            }
        },
        // Product Questions
        products: {
            patterns: ['product info', 'specifications', 'specs', 'size guide', 'sizing', 'dimensions', 'material', 'warranty', 'guarantee', 'authentic', 'genuine', 'quality'],
            responses: {
                sizing: "📏 **Size Guide**\n\nEach product page has a detailed size guide:\n1. Go to the product page\n2. Click 'Size Guide' near the size options\n3. Compare measurements\n\nTip: Check customer reviews for fit feedback!",
                quality: "✅ **Quality Guarantee**\n\nAll our products are:\n• 100% authentic\n• Quality inspected before shipping\n• Backed by manufacturer warranty\n• Covered by our satisfaction guarantee\n\nNot satisfied? Return within 30 days!",
                warranty: "🛡️ **Warranty Information**\n\nWarranty varies by product:\n• Electronics: 1-2 year manufacturer warranty\n• Clothing: 90-day quality guarantee\n• Accessories: 6-month warranty\n\nCheck the product page for specific warranty details."
            }
        },
        // Contact & Support
        support: {
            patterns: ['contact', 'customer service', 'support', 'help', 'speak to someone', 'talk to human', 'agent', 'representative', 'phone', 'email support', 'live chat'],
            responses: {
                general: "💬 **Contact Us**\n\nWe're here to help!\n• **Live Chat**: I'm here 24/7!\n• **Human Support**: Click 'Human Help' button\n• **Email**: support@aims-commerce.com\n• **Response time**: Within 24 hours\n\nHow can I assist you today?",
                hours: "🕐 **Support Hours**\n\n• **AI Assistant**: 24/7 (that's me!)\n• **Human Agents**: 9 AM - 9 PM EST\n• **Email**: Monitored 24/7\n\nFor urgent issues, our human team is here to help!"
            }
        },
        // Seller
        seller: {
            patterns: ['sell', 'become seller', 'start selling', 'seller account', 'vendor', 'merchant', 'list products', 'sell my products'],
            responses: {
                general: "🏪 **Become a Seller**\n\nWant to sell on our platform? Great choice!\n\n1. Click 'Start Selling' in the menu\n2. Fill out the seller application\n3. Get approved (usually within 48 hours)\n4. Start listing your products!\n\nBenefits: Large customer base, easy tools, competitive fees!"
            }
        },
        // Greetings & Pleasantries
        greetings: {
            patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings'],
            responses: {
                default: null // Handled by existing greeting response
            }
        },
        // Thanks
        thanks: {
            patterns: ['thank', 'thanks', 'thank you', 'appreciate', 'helpful', 'great help'],
            responses: {
                general: "You're welcome! 😊 I'm happy to help! Is there anything else you'd like to know about our products or services?"
            }
        },
        // Goodbye
        goodbye: {
            patterns: ['bye', 'goodbye', 'see you', 'take care', 'later', 'have a good day'],
            responses: {
                general: "Goodbye! 👋 Thanks for chatting with us. Have a great day and happy shopping! Come back anytime you need help."
            }
        },
        // Deals & Promotions
        deals: {
            patterns: ['deal', 'deals', 'sale', 'sales', 'discount', 'offer', 'offers', 'promotion', 'clearance', 'flash sale', 'special', 'save'],
            responses: {
                general: "🎉 **Current Deals & Promotions**\n\nHere's what's on offer:\n• **Free Shipping**: Orders over $50\n• **New Customer**: 10% off first order\n• **Newsletter Signup**: Exclusive deals weekly\n\nCheck our homepage for flash sales and seasonal promotions!",
                subscribe: "📧 **Get Exclusive Deals**\n\nSign up for our newsletter to receive:\n• Early access to sales\n• Exclusive discount codes\n• New arrival alerts\n• Flash sale notifications\n\nSubscribe at the bottom of any page!"
            }
        },
        // Wishlist
        wishlist: {
            patterns: ['wishlist', 'wish list', 'save for later', 'favorites', 'save item', 'bookmark'],
            responses: {
                general: "❤️ **Wishlist Feature**\n\nSave items for later!\n\n1. Sign in to your account\n2. Click the heart icon on any product\n3. View your wishlist from your profile\n\nYou'll get notified when wishlist items go on sale!"
            }
        },
        // Categories
        categories: {
            patterns: ['categories', 'category', 'browse', 'departments', 'sections', 'what do you sell', 'what products'],
            responses: {
                general: "🛍️ **Our Categories**\n\nExplore our departments:\n• **Electronics**: Laptops, phones, gadgets\n• **Clothing**: Fashion for all\n• **Home & Living**: Decor, furniture\n• **Beauty**: Skincare, cosmetics\n• **Sports**: Fitness gear\n\nWhat category interests you?"
            }
        },
        // Stock Availability
        stock: {
            patterns: ['in stock', 'out of stock', 'availability', 'available', 'inventory', 'back in stock', 'restock', 'when available'],
            responses: {
                general: "📦 **Stock Availability**\n\nStock status shows on each product page:\n• ✅ **In Stock**: Ready to ship\n• ⚠️ **Low Stock**: Limited quantity\n• ❌ **Out of Stock**: Sign up for restock alerts\n\nWant to be notified? Click 'Notify Me' on sold-out items!",
                notify: "🔔 **Restock Notifications**\n\nNever miss when items are back:\n1. Go to the product page\n2. Click 'Notify When Available'\n3. Enter your email\n\nWe'll email you the moment it's back in stock!"
            }
        },
        // Loyalty & Rewards
        loyalty: {
            patterns: ['loyalty', 'rewards', 'points', 'membership', 'vip', 'member'],
            responses: {
                general: "⭐ **Rewards Program**\n\nEarn points on every purchase!\n• **1 point per $1 spent**\n• **100 points = $5 off**\n• **Birthday bonus points**\n• **Double points days**\n\nSign up for an account to start earning!"
            }
        },
        // Bulk Orders
        bulk: {
            patterns: ['bulk', 'wholesale', 'large order', 'quantity discount', 'business order', 'corporate'],
            responses: {
                general: "📦 **Bulk & Wholesale Orders**\n\nOrdering in quantity? We offer:\n• Volume discounts (10+ items)\n• Corporate accounts\n• Custom invoicing\n• Priority shipping\n\nContact us for a custom quote!"
            }
        },
        // Security & Privacy
        privacy: {
            patterns: ['privacy', 'data', 'personal information', 'security', 'safe', 'secure', 'trust', 'fraud'],
            responses: {
                general: "🔐 **Privacy & Security**\n\nYour data is protected:\n• **256-bit SSL** encryption\n• **No data selling** - ever\n• **Secure payments** - PCI compliant\n• **Fraud protection** on all orders\n\nRead our privacy policy for full details."
            }
        }
    };

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

        // Comprehensive category mapping for flexible matching
        const categoryMappings: Record<string, string[]> = {
            'electronics': [
                'electronics', 'electronic', 'gaming', 'tech', 'technology',
                'laptop', 'laptops', 'computer', 'computers', 'phone', 'phones',
                'tablet', 'tablets', 'camera', 'cameras', 'audio', 'headphones',
                'speaker', 'speakers', 'tv', 'television', 'monitor', 'monitors',
                'keyboard', 'mouse', 'accessories', 'gadgets', 'devices'
            ],
            'clothing': [
                'clothing', 'clothes', 'apparel', 'fashion', 'wear',
                'shirts', 'shirt', 'pants', 'pant', 'jeans', 'dresses', 'dress',
                'tops', 'top', 'bottoms', 'bottom', 'outerwear', 'jacket', 'jackets',
                'shoes', 'shoe', 'footwear', 'sneakers', 'boots', 'sandals',
                'accessories', 'hats', 'caps', 'belts', 'bags', 'men', 'women', 'kids'
            ],
            'books': [
                'books', 'book', 'reading', 'novels', 'novel', 'literature',
                'textbooks', 'magazines', 'comics', 'ebooks', 'audiobooks'
            ],
            'home': [
                'home', 'house', 'furniture', 'decor', 'decoration', 'kitchen',
                'bedroom', 'living room', 'bathroom', 'garden', 'outdoor',
                'appliances', 'tools', 'lighting', 'storage'
            ],
            'beauty': [
                'beauty', 'cosmetics', 'makeup', 'skincare', 'haircare',
                'personal care', 'fragrance', 'perfume', 'grooming', 'wellness'
            ],
            'sports': [
                'sports', 'sport', 'fitness', 'exercise', 'workout', 'gym',
                'outdoor', 'athletic', 'sportswear', 'equipment', 'gear'
            ],
            'toys': [
                'toys', 'toy', 'games', 'game', 'puzzles', 'kids', 'children',
                'baby', 'educational', 'dolls', 'action figures'
            ]
        };

        // Check if the filter category has a mapping
        const filterCategoryMappings = categoryMappings[filterCategory];
        if (filterCategoryMappings && filterCategoryMappings.includes(productCategory)) {
            return true;
        }

        // Check reverse - if product category is a key, see if filter matches its mappings
        for (const [key, values] of Object.entries(categoryMappings)) {
            if (productCategory === key && values.includes(filterCategory)) {
                return true;
            }
            // Also check if product category is in values and filter matches key
            if (values.includes(productCategory) && (filterCategory === key || values.includes(filterCategory))) {
                return true;
            }
        }

        // Partial match - check if either contains the other
        if (productCategory.includes(filterCategory) || filterCategory.includes(productCategory)) {
            return true;
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
    }

    // Get products by category (uses flexible category matching)
    private getProductsByCategory(category: string, limit: number = 5): Product[] {
        return this.productCache
            .filter(product => {
                // Only include active products that match the category
                return product.isActive && this.matchesCategoryFilter(product, category);
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

    // Match message against knowledge base topics
    private matchKnowledgeBase(message: string): { topic: string; subtopic: string } | null {
        const lowerMessage = message.toLowerCase();

        // Priority order for knowledge base matching (more specific topics first)
        const topicPriority = [
            'returns', 'shipping', 'payment', 'orders', 'account',
            'products', 'stock', 'deals', 'wishlist', 'loyalty',
            'bulk', 'privacy', 'categories', 'support', 'seller',
            'thanks', 'goodbye'
        ];

        for (const topic of topicPriority) {
            const kb = this.knowledgeBase[topic as keyof typeof this.knowledgeBase];
            if (!kb) continue;

            const hasMatch = kb.patterns.some(pattern => {
                const regex = new RegExp(`\\b${this.escapeRegex(pattern)}\\b`, 'i');
                return regex.test(lowerMessage) || lowerMessage.includes(pattern);
            });

            if (hasMatch) {
                // Determine subtopic based on message content
                const subtopic = this.determineSubtopic(topic, lowerMessage);
                return { topic, subtopic };
            }
        }

        return null;
    }

    // Determine the most relevant subtopic within a topic
    private determineSubtopic(topic: string, message: string): string {
        const subtopicPatterns: Record<string, Record<string, string[]>> = {
            shipping: {
                cost: ['cost', 'fee', 'how much', 'price', 'free shipping', 'shipping cost'],
                tracking: ['track', 'tracking', 'where is', 'status'],
                international: ['international', 'worldwide', 'overseas', 'another country', 'outside']
            },
            returns: {
                process: ['how to', 'how do i', 'process', 'steps', 'procedure'],
                exchange: ['exchange', 'swap', 'different size', 'different color', 'wrong size'],
                damaged: ['damaged', 'broken', 'defective', 'wrong item', 'not working']
            },
            payment: {
                security: ['secure', 'safe', 'security', 'protection', 'fraud'],
                promo: ['promo', 'coupon', 'discount', 'code', 'voucher'],
                giftCard: ['gift card', 'gift certificate', 'giftcard']
            },
            account: {
                create: ['create', 'sign up', 'register', 'new account', 'join'],
                password: ['password', 'forgot', 'reset', 'can\'t login', 'locked out'],
                benefits: ['benefits', 'why', 'advantage', 'perks']
            },
            orders: {
                status: ['status', 'where', 'when', 'arriving'],
                modify: ['change', 'modify', 'cancel', 'update', 'edit']
            },
            products: {
                sizing: ['size', 'sizing', 'fit', 'dimensions', 'measurements'],
                quality: ['quality', 'authentic', 'genuine', 'real', 'original'],
                warranty: ['warranty', 'guarantee', 'protection']
            },
            support: {
                hours: ['hours', 'when', 'available', 'open']
            }
        };

        const patterns = subtopicPatterns[topic];
        if (!patterns) return 'general';

        for (const [subtopic, keywords] of Object.entries(patterns)) {
            const hasMatch = keywords.some(keyword => message.includes(keyword));
            if (hasMatch) return subtopic;
        }

        return 'general';
    }

    // Analyze user intent and generate appropriate response
    private analyzeUserIntent(message: string): {
        intent: string;
        entities: string[];
        needsProductSuggestion: boolean;
        priceRange?: { min?: number; max?: number };
        knowledgeBaseTopic?: string;
        knowledgeBaseSubtopic?: string;
    } {
        const lowerMessage = message.toLowerCase();

        // First check for knowledge base topics (common e-commerce questions)
        const kbMatch = this.matchKnowledgeBase(lowerMessage);
        if (kbMatch) {
            return {
                intent: 'knowledge_base',
                entities: [],
                needsProductSuggestion: false,
                knowledgeBaseTopic: kbMatch.topic,
                knowledgeBaseSubtopic: kbMatch.subtopic
            };
        }

        // Intent patterns
        const intents = {
            product_search: [
                'looking for', 'need', 'want', 'buy', 'purchase', 'search', 'find',
                'recommend', 'suggest', 'show me', 'do you have', 'sell', 'selling'
            ],
            category_browse: [
                'category', 'type', 'kind', 'browse', 'categories', 'section'
            ],
            popularity: [
                'popular', 'trending', 'top rated', 'highest rated', 'best rated',
                'best seller', 'bestseller', 'most popular', 'hot', 'what\'s hot',
                'most loved', 'favorite', 'favourites', 'favorites', 'top picks',
                'best products', 'highly rated', 'top selling'
            ],
            price_extreme: [
                'cheapest', 'most expensive', 'lowest price', 'highest price',
                'least expensive', 'most costly', 'budget friendly', 'premium',
                'luxury', 'bargain', 'steal', 'splurge', 'affordable',
                'most affordable', 'priciest', 'costliest'
            ],
            price_inquiry: [
                'price', 'cost', 'expensive', 'cheap', 'budget', 'how much',
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
                case 'knowledge_base':
                    response = this.generateKnowledgeBaseResponse(
                        analysis.knowledgeBaseTopic!,
                        analysis.knowledgeBaseSubtopic!
                    );
                    break;

                case 'greeting':
                    response = this.generateGreetingResponse();
                    break;

                case 'product_search':
                    response = this.generateProductSearchResponse(userMessage, analysis.priceRange);
                    break;

                case 'category_browse':
                    response = this.generateCategoryBrowseResponse(analysis.entities);
                    break;

                case 'popularity':
                    response = this.generatePopularityResponse(userMessage);
                    break;

                case 'price_extreme':
                    response = this.generatePriceExtremeResponse(userMessage);
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
                isProductSuggestion: response.type === 'product_suggestions',
                showPopularityChart: response.showPopularityChart
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

    // Generate response from knowledge base
    private generateKnowledgeBaseResponse(topic: string, subtopic: string): ChatbotResponse {
        const kb = this.knowledgeBase[topic as keyof typeof this.knowledgeBase];

        if (!kb || !kb.responses) {
            return this.generateHelpResponse();
        }

        // Get the specific subtopic response or fall back to general
        const responses = kb.responses as Record<string, string | null>;
        let message = responses[subtopic] || responses['general'];

        // Handle special cases
        if (topic === 'greetings') {
            return this.generateGreetingResponse();
        }

        if (!message) {
            return this.generateHelpResponse();
        }

        // Generate contextual suggestions based on topic
        const suggestions = this.getTopicSuggestions(topic);

        return {
            message,
            type: 'text',
            suggestions
        };
    }

    // Get relevant follow-up suggestions based on topic
    private getTopicSuggestions(topic: string): string[] {
        const suggestionMap: Record<string, string[]> = {
            shipping: [
                "Track my order",
                "International shipping info",
                "Shipping costs",
                "Show me products"
            ],
            returns: [
                "How to start a return",
                "Exchange an item",
                "Refund status",
                "Browse products"
            ],
            payment: [
                "Apply promo code",
                "Payment security",
                "Gift cards",
                "Start shopping"
            ],
            account: [
                "Reset my password",
                "Account benefits",
                "View my orders",
                "Browse products"
            ],
            orders: [
                "Track my order",
                "Modify my order",
                "Return an item",
                "Shop more"
            ],
            products: [
                "Size guide help",
                "Product warranty",
                "Browse electronics",
                "Browse clothing"
            ],
            support: [
                "Talk to human agent",
                "Track my order",
                "Return policy",
                "Browse products"
            ],
            seller: [
                "Start selling now",
                "Seller benefits",
                "Browse products",
                "Contact support"
            ],
            thanks: [
                "Browse products",
                "Check order status",
                "Return policy",
                "Talk to human"
            ],
            goodbye: []
        };

        return suggestionMap[topic] || [
            "Browse products",
            "Track my order",
            "Return policy",
            "Talk to human"
        ];
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

    // Generate response for cheapest/most expensive queries
    private generatePriceExtremeResponse(userMessage: string): ChatbotResponse {
        const lowerMessage = userMessage.toLowerCase();

        // Determine if looking for cheapest or most expensive
        const isCheapest = /cheapest|lowest price|least expensive|budget|bargain|affordable|most affordable|steal/i.test(lowerMessage);
        const isMostExpensive = /most expensive|highest price|most costly|premium|luxury|priciest|costliest|splurge/i.test(lowerMessage);

        // Check if user specified a category
        const categoryFilter = this.determineCategoryFilter(lowerMessage);

        let products: Product[];

        if (categoryFilter) {
            products = this.getProductsByCategory(categoryFilter, 10);
        } else {
            products = this.productCache.filter(p => p.isActive).slice(0, 50);
        }

        if (products.length === 0) {
            const trendingProducts = this.getTrendingProducts(5);
            if (trendingProducts.length > 0) {
                return {
                    message: `😔 **No ${categoryFilter || ''} Products Available Yet**\n\nWe don't have products in that category, but here are some trending items you might like:`,
                    type: 'product_suggestions',
                    products: trendingProducts,
                    suggestions: [
                        "Show me all products",
                        "What categories do you have?",
                        "Show me trending items"
                    ]
                };
            }
            return {
                message: "🏗️ **We're Building Our Catalog!**\n\nWe don't have products listed yet. Check back soon or become a seller to list yours!",
                type: 'text',
                suggestions: [
                    "How do I become a seller?",
                    "What categories will you have?",
                    "Notify me when you launch"
                ]
            };
        }

        // Sort by price
        let sortedProducts: Product[];
        let message: string;
        let emoji: string;

        if (isCheapest) {
            sortedProducts = [...products].sort((a, b) => a.price - b.price).slice(0, 5);
            emoji = "💰";
            message = categoryFilter
                ? `${emoji} **Best Budget ${categoryFilter} Deals**\n\nHere are the most affordable ${categoryFilter.toLowerCase()} products, sorted from lowest to highest price:`
                : `${emoji} **Best Budget Deals**\n\nHere are our most affordable products, perfect for budget-conscious shoppers:`;
        } else if (isMostExpensive) {
            sortedProducts = [...products].sort((a, b) => b.price - a.price).slice(0, 5);
            emoji = "💎";
            message = categoryFilter
                ? `${emoji} **Premium ${categoryFilter} Collection**\n\nHere are our finest ${categoryFilter.toLowerCase()} products for those who want the best:`
                : `${emoji} **Premium Collection**\n\nHere are our top-tier products for those seeking the ultimate quality:`;
        } else {
            // Default to cheapest if unclear
            sortedProducts = [...products].sort((a, b) => a.price - b.price).slice(0, 5);
            emoji = "💰";
            message = `${emoji} **Products by Price**\n\nHere are some options sorted by price:`;
        }

        // Calculate price range info
        const minPrice = Math.min(...sortedProducts.map(p => p.price));
        const maxPrice = Math.max(...sortedProducts.map(p => p.price));

        message += `\n\n_Price range: $${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}_`;

        return {
            message,
            type: 'product_suggestions',
            products: sortedProducts,
            suggestions: isCheapest
                ? [
                    "Show me premium options",
                    "Products under $50",
                    "Best deals today",
                    "Compare prices"
                ]
                : [
                    "Show me budget options",
                    "What's your cheapest?",
                    "Best value products",
                    "Compare prices"
                ]
        };
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

    // Generate popularity response with chart flag
    private generatePopularityResponse(userMessage: string): ChatbotResponse {
        const lowerMessage = userMessage.toLowerCase();

        // Check if user is asking about a specific category
        const categoryFilter = this.determineCategoryFilter(lowerMessage);

        let products: Product[];
        let message: string;

        if (categoryFilter) {
            // Get products from specific category, sorted by rating
            products = this.getProductsByCategory(categoryFilter, 5);

            if (products.length === 0) {
                // Category-specific empty state - show trending from all categories instead
                const trendingProducts = this.getTrendingProducts(5);
                const availableCategories = [...new Set(this.productCache.map(p => p.category))].slice(0, 4);

                if (trendingProducts.length > 0) {
                    return {
                        message: `📊 **No ${categoryFilter} Products Yet**\n\nWe don't have any ${categoryFilter.toLowerCase()} products available right now, but here are our **top trending items** across all categories that you might love:`,
                        type: 'product_suggestions',
                        products: trendingProducts,
                        showPopularityChart: true,
                        suggestions: [
                            "Show me all trending products",
                            ...availableCategories.map(cat => `Browse ${cat}`),
                            "What categories do you have?"
                        ].slice(0, 4)
                    };
                } else {
                    return {
                        message: `😔 **No ${categoryFilter} Products Available**\n\nWe're still building our ${categoryFilter.toLowerCase()} collection. In the meantime, feel free to explore our other categories or check back soon!`,
                        type: 'text',
                        suggestions: [
                            "What categories do you have?",
                            "Show me what's available",
                            "Talk to support",
                            "Become a seller"
                        ]
                    };
                }
            }

            message = `📊 **Most Popular ${categoryFilter} Products**\n\nHere are our top-rated ${categoryFilter.toLowerCase()} products, ranked by customer ratings and reviews:`;
        } else {
            // Get overall trending products
            products = this.getTrendingProducts(5);
            message = `📊 **Trending Now - Our Most Popular Products**\n\nHere are our top-rated products based on customer reviews and ratings:`;
        }

        if (products.length === 0) {
            // Complete empty state - no products at all
            return {
                message: "🏗️ **We're Just Getting Started!**\n\nOur product catalog is being built. Check back soon for amazing deals, or become a seller to list your products!\n\nIn the meantime, I can help you with:\n• Shipping & delivery info\n• Return policies\n• Account setup\n• Becoming a seller",
                type: 'text',
                suggestions: [
                    "How does shipping work?",
                    "What's the return policy?",
                    "How do I create an account?",
                    "I want to become a seller"
                ]
            };
        }

        return {
            message,
            type: 'product_suggestions',
            products,
            showPopularityChart: true, // Flag to show the popularity chart
            suggestions: [
                "Show me more popular items",
                "What's trending in Electronics?",
                "Best rated Clothing",
                "Compare top products"
            ]
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
            message: "🤖 **I'm Here to Help!**\n\nI can assist you with:\n\n**🛍️ Shopping**\n• Finding products & recommendations\n• Checking prices and availability\n• Comparing products\n\n**📦 Orders & Shipping**\n• Order status & tracking\n• Shipping information\n• Returns & refunds\n\n**💳 Account & Payments**\n• Payment methods\n• Account setup\n• Password reset\n\n**🎁 More**\n• Deals & promotions\n• Becoming a seller\n• Human support\n\nWhat would you like help with?",
            type: 'text',
            suggestions: [
                "Show me trending products",
                "How does shipping work?",
                "What's the return policy?",
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
