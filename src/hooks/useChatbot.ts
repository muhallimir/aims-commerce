import { useState, useEffect, useCallback } from 'react';
import chatbotService, { ChatbotMessage, ChatbotResponse } from 'src/services/chatbotService';
import {
    useGetProductListForChatbotQuery,
    useGetProductCategoriesQuery
} from 'src/store/products.slice';

export const useChatbot = () => {
    const [messages, setMessages] = useState<ChatbotMessage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [shouldEscalateToAdmin, setShouldEscalateToAdmin] = useState(false);
    const [hasInteractedWithBot, setHasInteractedWithBot] = useState(false);

    // Initialize chat from localStorage or default message
    useEffect(() => {
        const savedMessages = localStorage.getItem('chatbot-messages');
        const savedInteractionState = localStorage.getItem('chatbot-hasInteracted');
        const savedEscalationState = localStorage.getItem('chatbot-shouldEscalate');

        if (savedMessages) {
            try {
                const parsedMessages = JSON.parse(savedMessages);
                setMessages(parsedMessages);
            } catch (error) {
                console.error('Error parsing saved messages:', error);
                setMessages([{
                    name: 'AI Assistant',
                    body: "Hello! I'm your AI shopping assistant. I can help you find products, check prices, and answer questions about our inventory. What are you looking for today?",
                    type: 'bot',
                    timestamp: new Date(),
                }]);
            }
        } else {
            setMessages([{
                name: 'AI Assistant',
                body: "Hello! I'm your AI shopping assistant. I can help you find products, check prices, and answer questions about our inventory. What are you looking for today?",
                type: 'bot',
                timestamp: new Date(),
            }]);
        }

        if (savedInteractionState) {
            setHasInteractedWithBot(JSON.parse(savedInteractionState));
        }

        if (savedEscalationState) {
            setShouldEscalateToAdmin(JSON.parse(savedEscalationState));
        }
    }, []);

    // Save chat state to localStorage whenever it changes
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chatbot-messages', JSON.stringify(messages));
        }
    }, [messages]);

    useEffect(() => {
        localStorage.setItem('chatbot-hasInteracted', JSON.stringify(hasInteractedWithBot));
    }, [hasInteractedWithBot]);

    useEffect(() => {
        localStorage.setItem('chatbot-shouldEscalate', JSON.stringify(shouldEscalateToAdmin));
    }, [shouldEscalateToAdmin]);

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

            // Create bot message
            const botMessage: ChatbotMessage = {
                name: 'AI Assistant',
                body: response.message,
                type: 'bot',
                timestamp: new Date(),
                products: response.products,
                isProductSuggestion: response.type === 'product_suggestions',
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
        const initialMessage = {
            name: 'AI Assistant',
            body: "Hello! I'm your AI shopping assistant. I can help you find products, check prices, and answer questions about our inventory. What are you looking for today?",
            type: 'bot' as const,
            timestamp: new Date(),
        };

        setMessages([initialMessage]);
        setShouldEscalateToAdmin(false);
        setHasInteractedWithBot(false);
        setIsTyping(false);

        // Clear localStorage
        localStorage.removeItem('chatbot-messages');
        localStorage.removeItem('chatbot-hasInteracted');
        localStorage.removeItem('chatbot-shouldEscalate');

        chatbotService.clearConversationHistory();
    }, []);

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
