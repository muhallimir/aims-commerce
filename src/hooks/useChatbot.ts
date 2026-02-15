import { useState, useEffect, useCallback, useRef } from 'react';
import chatbotService, { ChatbotMessage, ChatbotResponse } from 'src/services/chatbotService';
import {
    useGetProductListForChatbotQuery,
    useGetProductCategoriesQuery
} from 'src/store/products.slice';
import { useSelector } from 'react-redux';

// Helper functions for user-specific storage keys
const getChatStorageKey = (userId: string | null) =>
    userId ? `chatbot-messages-${userId}` : 'chatbot-messages-guest';
const getInteractionStorageKey = (userId: string | null) =>
    userId ? `chatbot-hasInteracted-${userId}` : 'chatbot-hasInteracted-guest';
const getEscalationStorageKey = (userId: string | null) =>
    userId ? `chatbot-shouldEscalate-${userId}` : 'chatbot-shouldEscalate-guest';
const getLastUserKey = () => 'chatbot-lastUserId';

export const useChatbot = () => {
    const [messages, setMessages] = useState<ChatbotMessage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [shouldEscalateToAdmin, setShouldEscalateToAdmin] = useState(false);
    const [hasInteractedWithBot, setHasInteractedWithBot] = useState(false);

    // Get current user from Redux
    const { userInfo } = useSelector((state: any) => state.user);
    const currentUserId = userInfo?._id || null;
    const previousUserIdRef = useRef<string | null>(null);

    // Initialize and handle user changes
    useEffect(() => {
        const lastUserId = localStorage.getItem(getLastUserKey());
        const wasGuest = lastUserId === 'guest' || lastUserId === null;
        const isNowLoggedIn = currentUserId !== null;
        const isDifferentLoggedInUser = lastUserId !== null && lastUserId !== 'guest' && lastUserId !== currentUserId;

        // Case 1: Guest just logged in - migrate guest chat to user
        if (wasGuest && isNowLoggedIn) {
            migrateGuestChatToUser(currentUserId);
        }
        // Case 2: Different logged-in user - clear and load fresh for new user
        else if (isDifferentLoggedInUser && isNowLoggedIn) {
            loadChatForUser(currentUserId);
        }
        // Case 3: User logged out (now guest) - load guest chat or start fresh
        else if (!isNowLoggedIn && lastUserId && lastUserId !== 'guest') {
            loadChatForUser(null);
        }
        // Case 4: Same user or first load - just load their chat
        else {
            loadChatForUser(currentUserId);
        }

        // Update last user tracking
        localStorage.setItem(getLastUserKey(), currentUserId || 'guest');
        previousUserIdRef.current = currentUserId;
    }, [currentUserId]);

    // Migrate guest chat history to logged-in user
    const migrateGuestChatToUser = (userId: string) => {
        const guestMessages = localStorage.getItem(getChatStorageKey(null));
        const guestInteraction = localStorage.getItem(getInteractionStorageKey(null));
        const guestEscalation = localStorage.getItem(getEscalationStorageKey(null));

        // Check if user already has chat history
        const userMessages = localStorage.getItem(getChatStorageKey(userId));

        if (guestMessages && !userMessages) {
            // Migrate guest chat to user
            localStorage.setItem(getChatStorageKey(userId), guestMessages);
            if (guestInteraction) {
                localStorage.setItem(getInteractionStorageKey(userId), guestInteraction);
            }
            if (guestEscalation) {
                localStorage.setItem(getEscalationStorageKey(userId), guestEscalation);
            }
        }

        // Clear guest data after migration
        clearGuestChatData();

        // Load the (now migrated) user chat
        loadChatForUser(userId);
    };

    const loadChatForUser = (userId: string | null) => {
        const savedMessages = localStorage.getItem(getChatStorageKey(userId));
        const savedInteractionState = localStorage.getItem(getInteractionStorageKey(userId));
        const savedEscalationState = localStorage.getItem(getEscalationStorageKey(userId));

        if (savedMessages) {
            try {
                const parsedMessages = JSON.parse(savedMessages);
                setMessages(parsedMessages);
            } catch (error) {
                console.error('Error parsing saved messages:', error);
                setMessages([getInitialMessage()]);
            }
        } else {
            setMessages([getInitialMessage()]);
        }

        if (savedInteractionState) {
            setHasInteractedWithBot(JSON.parse(savedInteractionState));
        } else {
            setHasInteractedWithBot(false);
        }

        if (savedEscalationState) {
            setShouldEscalateToAdmin(JSON.parse(savedEscalationState));
        } else {
            setShouldEscalateToAdmin(false);
        }
    };

    const getInitialMessage = (): ChatbotMessage => ({
        name: 'AI Assistant',
        body: "Hello! I'm your AI shopping assistant. I can help you find products, check prices, and answer questions about our inventory. What are you looking for today?",
        type: 'bot',
        timestamp: new Date(),
    });

    const clearGuestChatData = () => {
        localStorage.removeItem(getChatStorageKey(null));
        localStorage.removeItem(getInteractionStorageKey(null));
        localStorage.removeItem(getEscalationStorageKey(null));
    };

    // Save chat state to localStorage whenever it changes
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(getChatStorageKey(currentUserId), JSON.stringify(messages));
        }
    }, [messages, currentUserId]);

    useEffect(() => {
        localStorage.setItem(getInteractionStorageKey(currentUserId), JSON.stringify(hasInteractedWithBot));
    }, [hasInteractedWithBot, currentUserId]);

    useEffect(() => {
        localStorage.setItem(getEscalationStorageKey(currentUserId), JSON.stringify(shouldEscalateToAdmin));
    }, [shouldEscalateToAdmin, currentUserId]);

    // RTK Query hooks
    const {
        data: products,
        refetch: refetchProducts
    } = useGetProductListForChatbotQuery({});

    const {
        data: categories,
        refetch: refetchCategories
    } = useGetProductCategoriesQuery({});

    // Initialize chatbot service with RTK Query endpoints
    useEffect(() => {
        if (products && categories) {
            chatbotService.setApiEndpoints(
                () => Promise.resolve({ data: products }),
                () => Promise.resolve({ data: categories })
            );
            chatbotService.initializeProductData();
        }
    }, [products, categories]);

    // Send message to chatbot
    const sendMessage = useCallback(async (userMessage: string) => {
        if (!userMessage.trim() || isProcessing) return;

        setIsProcessing(true);
        setHasInteractedWithBot(true);

        // Add user message to chat
        const userChatMessage: ChatbotMessage = {
            name: 'User',
            body: userMessage,
            type: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userChatMessage]);

        try {
            // Show typing indicator
            setIsTyping(true);

            // Get bot response
            const response: ChatbotResponse = await chatbotService.generateResponse(userMessage);

            // Calculate typing delay based on message length (more realistic)
            const messageLength = response.message.length;
            const baseDelay = 800; // Minimum delay
            const typingDelay = Math.min(baseDelay + (messageLength * 20), 3000); // Max 3 seconds

            // Simulate typing delay
            await new Promise(resolve => setTimeout(resolve, typingDelay));

            setIsTyping(false);

            // Create bot message with typing animation flag
            const botMessage: ChatbotMessage = {
                name: 'AI Assistant',
                body: response.message,
                type: 'bot',
                timestamp: new Date(),
                products: response.products,
                isProductSuggestion: response.type === 'product_suggestions',
                showPopularityChart: response.showPopularityChart,
            };

            setMessages(prev => [...prev, botMessage]);

            // Check if should escalate to admin
            if (response.type === 'escalate_to_admin') {
                setShouldEscalateToAdmin(true);
            }

            // Return suggestions for UI
            return response.suggestions || [];
        } catch (error) {
            console.error('Error sending message to chatbot:', error);

            setIsTyping(false);

            // Add error message
            const errorMessage: ChatbotMessage = {
                name: 'AI Assistant',
                body: "I'm sorry, I encountered an error. Would you like me to connect you with a human agent?",
                type: 'bot',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, errorMessage]);
            return [];
        } finally {
            setIsProcessing(false);
        }
    }, [isProcessing]);

    // Handle suggestion click
    const handleSuggestionClick = useCallback((suggestion: string) => {
        sendMessage(suggestion);
    }, [sendMessage]);

    // Handle product click
    const handleProductClick = useCallback((product: any) => {
        // You can add analytics or tracking here
        console.log('Product clicked:', product.name);
    }, []);

    // Reset chatbot state
    const resetChatbot = useCallback(() => {
        setMessages([getInitialMessage()]);
        setShouldEscalateToAdmin(false);
        setHasInteractedWithBot(false);
        setIsTyping(false);

        // Clear localStorage for current user
        localStorage.removeItem(getChatStorageKey(currentUserId));
        localStorage.removeItem(getInteractionStorageKey(currentUserId));
        localStorage.removeItem(getEscalationStorageKey(currentUserId));

        chatbotService.clearConversationHistory();
    }, [currentUserId]);

    // Refresh product data
    const refreshProductData = useCallback(async () => {
        await Promise.all([refetchProducts(), refetchCategories()]);
        await chatbotService.refreshProductCache();
    }, [refetchProducts, refetchCategories]);

    // Check if should show admin chat option
    const shouldShowAdminOption = useCallback(() => {
        return shouldEscalateToAdmin ||
            (hasInteractedWithBot && messages.filter(m => m.type === 'bot').length >= 1);
    }, [shouldEscalateToAdmin, hasInteractedWithBot, messages]);

    // Clear chat history (for manual reset)
    const clearChatHistory = useCallback(() => {
        resetChatbot();
    }, [resetChatbot]);

    return {
        messages,
        isProcessing,
        isTyping,
        shouldEscalateToAdmin,
        hasInteractedWithBot,
        sendMessage,
        handleSuggestionClick,
        handleProductClick,
        resetChatbot,
        clearChatHistory,
        refreshProductData,
        shouldShowAdminOption,
    };
};
