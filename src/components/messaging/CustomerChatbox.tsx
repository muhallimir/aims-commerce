import React, { useEffect, useRef, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import {
	Box,
	Typography,
	TextField,
	IconButton,
	List,
	ListItem,
	Avatar,
	Stack,
	Button,
	Chip,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import RefreshIcon from "@mui/icons-material/Refresh";
import useAuthentication from "src/hooks/useAuthentication";
import { useChatbot } from "src/hooks/useChatbot";
import ProductSuggestion from "./ProductSuggestion";
import QuickSuggestions from "./QuickSuggestions";
import TypingIndicator from "./TypingIndicator";
import isEmpty from "lodash/isEmpty";

interface Message {
	name: string;
	body: string;
	type?: 'user' | 'admin' | 'bot';
	products?: any[];
	isProductSuggestion?: boolean;
}

const CustomerChatBox: React.FC = () => {
	const { userInfo, isAdmin } = useAuthentication();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTabletOrDesktop = useMediaQuery(theme.breakpoints.up('sm'));

	const [socket, setSocket] = useState<Socket | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [messageBody, setMessageBody] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [isAdminMode, setIsAdminMode] = useState(false);
	const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
	const uiMessagesRef = useRef<HTMLUListElement | null>(null);
	const [endpoint, setEndpoint] = useState<string | any>("");

	// Initialize admin messages from localStorage
	useEffect(() => {
		const savedAdminMessages = localStorage.getItem('admin-messages');
		const savedAdminMode = localStorage.getItem('admin-mode');

		if (savedAdminMessages) {
			try {
				const parsedMessages = JSON.parse(savedAdminMessages);
				setMessages(parsedMessages);
			} catch (error) {
				console.error('Error parsing saved admin messages:', error);
				setMessages([{ name: "Admin", body: "Hi! Please input your inquiry." }]);
			}
		} else {
			setMessages([{ name: "Admin", body: "Hi! Please input your inquiry." }]);
		}

		if (savedAdminMode) {
			setIsAdminMode(JSON.parse(savedAdminMode));
		}
	}, []);

	// Save admin messages to localStorage
	useEffect(() => {
		if (messages.length > 0) {
			localStorage.setItem('admin-messages', JSON.stringify(messages));
		}
	}, [messages]);

	// Save admin mode state
	useEffect(() => {
		localStorage.setItem('admin-mode', JSON.stringify(isAdminMode));
	}, [isAdminMode]);

	// Chatbot hook
	const {
		messages: botMessages,
		isProcessing,
		isTyping,
		sendMessage: sendBotMessage,
		handleSuggestionClick,
		handleProductClick,
		shouldShowAdminOption,
		resetChatbot,
		clearChatHistory,
	} = useChatbot();

	useEffect(() => {
		setEndpoint(
			window?.location?.host?.indexOf("localhost") >= 0
				? "http://localhost:5003"
				: process.env.NEXT_PUBLIC_MONGODB_URI,
		);
	}, []);

	useEffect(() => {
		if (uiMessagesRef.current) {
			uiMessagesRef.current.scrollTo({
				top: uiMessagesRef.current.scrollHeight,
				behavior: 'smooth'
			});
		}
	}, [messages, botMessages, isTyping]);

	// Use bot messages when not in admin mode
	const currentMessages = isAdminMode ? messages : botMessages;

	useEffect(() => {
		if (socket) {
			socket.emit("onLogin", {
				_id: userInfo._id,
				name: userInfo.name,
				isAdmin: userInfo.isAdmin,
			});

			const handleMessage = (data: Message) => {
				setMessages((prevMessages) => [...prevMessages, data]);
			};

			socket.on("message", handleMessage);

			return () => {
				socket.off("message", handleMessage);
			};
		}
	}, [socket, userInfo]);

	const supportHandler = () => {
		setIsOpen(true);
		setIsExpanded(false);
		// Don't reset chatbot when opening - preserve chat history
		if (!socket && isAdminMode) {
			const newSocket = socketIOClient(endpoint);
			setSocket(newSocket);
		}
	};

	const switchToAdminMode = () => {
		setIsAdminMode(true);
		// Don't reset admin messages completely, just add a connection message if needed
		const lastMessage = messages[messages.length - 1];
		if (!lastMessage || lastMessage.body !== "Connecting you to a human agent...") {
			setMessages(prev => [...prev, { name: "Admin", body: "Connecting you to a human agent..." }]);
		}
		if (!socket) {
			const newSocket = socketIOClient(endpoint);
			setSocket(newSocket);
		}
	};

	const switchToBotMode = () => {
		setIsAdminMode(false);
		// Don't reset chatbot completely - this preserves the interaction state
		// which is needed to show the "Human Help" button
		if (socket) {
			socket.disconnect();
			setSocket(null);
		}
	};

	const clearAdminHistory = () => {
		setMessages([{ name: "Admin", body: "Hi! Please input your inquiry." }]);
		localStorage.removeItem('admin-messages');
	};

	// Function to clear all chat data
	const clearAllChatData = () => {
		clearChatHistory();
		clearAdminHistory();
		if (socket) {
			socket.disconnect();
			setSocket(null);
		}
		setIsAdminMode(false);
	};

	// Expose clearAllChatData globally for logout handlers
	useEffect(() => {
		(window as any).clearAllChatData = clearAllChatData;
		return () => {
			delete (window as any).clearAllChatData;
		};
	}, [clearChatHistory]);

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!messageBody.trim()) {
			alert("Error. Please type a message.");
			return;
		}

		if (isAdminMode) {
			// Handle admin chat
			const newMessage = {
				body: messageBody,
				name: isAdmin ? "Admin" : userInfo.name,
			};
			setMessages((prevMessages) => [...prevMessages, newMessage]);
			socket?.emit("onMessage", {
				body: messageBody,
				name: isAdmin ? "Admin" : userInfo.name,
				isAdmin: userInfo.isAdmin,
				_id: userInfo._id,
			});
		} else {
			// Handle chatbot interaction
			const suggestions = await sendBotMessage(messageBody);
			setCurrentSuggestions(suggestions || []);
		}

		setMessageBody("");
	};

	const closeHandler = () => {
		setIsOpen(false);
		setIsAdminMode(false);
		setIsExpanded(false);
		// Don't reset chatbot when closing - preserve chat history
		if (socket) {
			socket.disconnect();
			setSocket(null);
		}
	};

	// Handle product click with proper cleanup for iOS
	const handleProductClickWithCleanup = (product: any) => {
		// Only auto-close on mobile devices
		if (isMobile) {
			setIsOpen(false);
			setTimeout(() => {
				handleProductClick(product);
			}, 100);
		} else {
			// On desktop/tablet, use the original handler
			handleProductClick(product);
		}
	};

	// Auto-close chatbox when navigating away (for iOS Safari fix) - Mobile only
	useEffect(() => {
		if (!isMobile) return; // Only apply mobile-specific fixes

		const handleVisibilityChange = () => {
			if (document.hidden) {
				setIsOpen(false);
			}
		};

		const handlePageShow = (e: any) => {
			if (e.persisted) {
				setIsOpen(false);
				setIsExpanded(false);
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		window.addEventListener('pageshow', handlePageShow);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			window.removeEventListener('pageshow', handlePageShow);
		};
	}, [isMobile]); // Add isMobile as dependency

	return (
		<Box sx={{
			position: "fixed",
			bottom: 16,
			right: 16,
			zIndex: isOpen ? 1300 : 1200,
			pointerEvents: isOpen ? "auto" : "none"
		}}>
			{!isEmpty(userInfo) && !isAdmin && !isOpen ? (
				<Box sx={{ position: "relative", pointerEvents: "auto" }}>
					{/* Main Chat Button */}
					<IconButton
						onClick={supportHandler}
						color="primary"
						aria-label="chat"
						sx={{
							background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
							color: "white",
							width: 60,
							height: 64,
							position: "fixed",
							bottom: { xs: "20px", md: "32px" },
							right: { xs: "20px", md: "32px" },
							zIndex: 1300,
							boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
							transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
							animation: "bounce 2s infinite",
							"&:hover": {
								transform: "scale(1.1)",
								boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
								background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
								animation: "none",
							},
							"&:active": {
								transform: "scale(0.95)",
							},
							"@keyframes bounce": {
								"0%, 20%, 50%, 80%, 100%": {
									transform: "translateY(0)",
								},
								"40%": {
									transform: "translateY(-8px)",
								},
								"60%": {
									transform: "translateY(-4px)",
								},
							},
						}}
					>
						<ChatIcon fontSize="large" />
					</IconButton>


					{/* Notification Badge */}
					<Box
						sx={{
							position: "fixed",
							bottom: { xs: "55px", md: "67px" },
							right: { xs: "15px", md: "27px" },
							zIndex: 1301,
							animation: "wiggle 1s ease-in-out infinite alternate",
							"@keyframes wiggle": {
								"0%": { transform: "rotate(-3deg)" },
								"100%": { transform: "rotate(3deg)" },
							},
						}}
					>
						<Chip
							size="small"
							label="NEW"
							sx={{
								backgroundColor: "#ff4444",
								color: "white",
								fontSize: "0.6rem",
								height: 18,
								fontWeight: "bold",
								boxShadow: "0 2px 8px rgba(255, 68, 68, 0.4)",
								animation: "glow 1.5s ease-in-out infinite alternate",
								"@keyframes glow": {
									"0%": { boxShadow: "0 2px 8px rgba(255, 68, 68, 0.4)" },
									"100%": { boxShadow: "0 4px 16px rgba(255, 68, 68, 0.8)" },
								},
							}}
						/>
					</Box>

					{/* Animated Prompt Tooltip */}
					<Box
						sx={{
							position: "fixed",
							bottom: { xs: "30px", md: "42px" },
							right: { xs: "90px", md: "102px" },
							zIndex: 1301,
							animation: "slideInPrompt 3s ease-in-out infinite",
							"@keyframes slideInPrompt": {
								"0%, 70%, 100%": {
									opacity: 0,
									transform: "translateX(20px) scale(0.8)",
								},
								"10%, 60%": {
									opacity: 1,
									transform: "translateX(0) scale(1)",
								},
							},
						}}
					>
						<Box
							sx={{
								background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
								color: "white",
								padding: "8px 16px",
								borderRadius: "20px",
								fontSize: "0.85rem",
								fontWeight: 600,
								boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
								position: "relative",
								whiteSpace: "nowrap",
								"&::after": {
									content: '""',
									position: "absolute",
									right: -8,
									top: "50%",
									transform: "translateY(-50%)",
									width: 0,
									height: 0,
									borderStyle: "solid",
									borderWidth: "8px 0 8px 8px",
									borderColor: "transparent transparent transparent #667eea",
								},
							}}
						>
							💬 Need help? Chat with AI!
						</Box>
					</Box>

					{/* Floating Sparkles */}
					{[...Array(3)].map((_, index) => (
						<Box
							key={index}
							sx={{
								position: "fixed",
								bottom: { xs: 40 + index * 15, md: 52 + index * 15 },
								right: { xs: 35 + index * 10, md: 47 + index * 10 },
								width: 6,
								height: 6,
								borderRadius: "50%",
								background: "linear-gradient(45deg, #ffd700, #ffeb3b)",
								zIndex: 1299,
								pointerEvents: "none",
								animation: `sparkle ${1.5 + index * 0.3}s ease-in-out infinite`,
								animationDelay: `${index * 0.5}s`,
								"@keyframes sparkle": {
									"0%, 100%": {
										opacity: 0,
										transform: "scale(0) rotate(0deg)",
									},
									"50%": {
										opacity: 1,
										transform: "scale(1) rotate(180deg)",
									},
								},
							}}
						/>
					))}
				</Box>
			) : (
				<Box
					sx={{
						width: isMobile
							? "calc(100vw - 32px)"
							: isExpanded
								? { sm: 600, md: 800, lg: 1000 }
								: 420,
						height: isMobile
							? "calc(100vh - 160px)" // Reduced from 100px to 160px to show header
							: isExpanded
								? { sm: 600, md: 700, lg: 800 }
								: 520,
						maxHeight: isMobile ? "75vh" : isExpanded ? "90vh" : "80vh", // Reduced from 90vh to 75vh on mobile
						display: "flex",
						flexDirection: "column",
						backgroundColor: "background.paper",
						borderRadius: 4,
						overflow: "hidden",
						mr: { xs: 0, sm: "20px" },
						mb: { xs: 2, sm: 0 },
						boxShadow: "0 24px 64px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)",
						backdropFilter: "blur(20px)",
						border: "1px solid rgba(255, 255, 255, 0.1)",
						animation: "slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
						transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
						position: "relative", // Ensure proper stacking context
						zIndex: 1301, // Ensure chatbox content is above backdrop
						"@keyframes slideUp": {
							from: {
								opacity: 0,
								transform: "translateY(20px) scale(0.95)",
							},
							to: {
								opacity: 1,
								transform: "translateY(0) scale(1)",
							},
						},
					}}
				>
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						sx={{
							p: { xs: 2, sm: 2.5 },
							background: isAdminMode
								? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
								: "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)",
							color: "white",
							position: "relative",
							"&::before": {
								content: '""',
								position: "absolute",
								bottom: 0,
								left: 0,
								right: 0,
								height: "1px",
								background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
							},
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: 1 }}>
							<Box
								sx={{
									width: 10,
									height: 10,
									borderRadius: "50%",
									backgroundColor: isAdminMode ? "#4ade80" : "#fbbf24",
									boxShadow: isAdminMode
										? "0 0 8px rgba(74, 222, 128, 0.6)"
										: "0 0 8px rgba(251, 191, 36, 0.6)",
									animation: "pulse 2s infinite",
									"@keyframes pulse": {
										"0%, 100%": { opacity: 1, transform: "scale(1)" },
										"50%": { opacity: 0.7, transform: "scale(1.1)" },
									},
								}}
							/>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
								{isAdminMode ? <SupportAgentIcon sx={{ fontSize: '1.25rem' }} /> : <SmartToyIcon sx={{ fontSize: '1.25rem' }} />}
								<Typography
									variant="subtitle1"
									sx={{
										fontWeight: 600,
										fontSize: { xs: '0.95rem', sm: '1rem' },
										whiteSpace: 'nowrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis'
									}}
								>
									{isAdminMode ? "Human Support" : "AI Chatbot"}
								</Typography>
							</Box>
						</Box>

						<Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
							{!isAdminMode && shouldShowAdminOption() && (
								<Button
									size="small"
									onClick={switchToAdminMode}
									sx={{
										color: "white",
										borderColor: "rgba(255, 255, 255, 0.3)",
										fontSize: "0.7rem",
										minWidth: "auto",
										px: 1.5,
										py: 0.5,
										height: 28,
										"&:hover": {
											borderColor: "white",
											backgroundColor: "rgba(255, 255, 255, 0.1)",
										},
									}}
									variant="outlined"
								>
									Human Help
								</Button>
							)}

							{isAdminMode && (
								<Button
									size="small"
									onClick={switchToBotMode}
									sx={{
										color: "white",
										borderColor: "rgba(255, 255, 255, 0.3)",
										fontSize: "0.7rem",
										minWidth: "auto",
										px: 1.5,
										py: 0.5,
										height: 28,
										"&:hover": {
											borderColor: "white",
											backgroundColor: "rgba(255, 255, 255, 0.1)",
										},
									}}
									variant="outlined"
								>
									AI Help
								</Button>
							)}

							{/* Clear chat history button for both modes */}
							{!isAdminMode ? (
								<IconButton
									onClick={clearChatHistory}
									size="small"
									sx={{
										color: "white",
										transition: "all 0.2s ease",
										"&:hover": {
											backgroundColor: "rgba(255, 255, 255, 0.1)",
											transform: "rotate(180deg)",
										},
									}}
									aria-label="clear chat history"
									title="Clear chat history"
								>
									<RefreshIcon fontSize="small" />
								</IconButton>
							) : (
								<IconButton
									onClick={clearAdminHistory}
									size="small"
									sx={{
										color: "white",
										transition: "all 0.2s ease",
										"&:hover": {
											backgroundColor: "rgba(255, 255, 255, 0.1)",
											transform: "rotate(180deg)",
										},
									}}
									aria-label="clear admin chat"
									title="Clear admin chat"
								>
									<RefreshIcon fontSize="small" />
								</IconButton>
							)}

							{/* Expand/Collapse button for desktop and tablet */}
							{isTabletOrDesktop && (
								<IconButton
									onClick={() => setIsExpanded(!isExpanded)}
									size="small"
									sx={{
										color: "white",
										transition: "all 0.2s ease",
										"&:hover": {
											backgroundColor: "rgba(255, 255, 255, 0.1)",
										},
									}}
									aria-label={isExpanded ? "collapse chat" : "expand chat"}
								>
									{isExpanded ? <CloseFullscreenIcon fontSize="small" /> : <OpenInFullIcon fontSize="small" />}
								</IconButton>
							)}

							<IconButton
								onClick={closeHandler}
								size="small"
								sx={{
									color: "white",
									transition: "all 0.2s ease",
									"&:hover": {
										backgroundColor: "rgba(255, 255, 255, 0.1)",
										transform: "rotate(90deg)",
									},
								}}
								aria-label="close chat"
							>
								<CloseIcon fontSize="small" />
							</IconButton>
						</Box>
					</Stack>

					<List
						ref={uiMessagesRef}
						sx={{
							flexGrow: 1,
							overflowY: "auto",
							p: 3,
							bgcolor: "transparent",
							background: "linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)",
							"&::-webkit-scrollbar": {
								width: "6px",
							},
							"&::-webkit-scrollbar-track": {
								background: "transparent",
							},
							"&::-webkit-scrollbar-thumb": {
								background: "rgba(0, 0, 0, 0.2)",
								borderRadius: "3px",
								"&:hover": {
									background: "rgba(0, 0, 0, 0.3)",
								},
							},
						}}
					>
						{currentMessages.map((msg, index) => {
							const isUserMessage = msg.name === (isAdmin ? "Admin" : userInfo.name);
							const isBotMessage = msg.type === 'bot' || msg.name === 'AI Assistant';

							return (
								<Box key={index}>
									<ListItem
										sx={{
											display: "flex",
											justifyContent: isUserMessage ? "flex-end" : "flex-start",
											mb: 2,
											p: 0,
											animation: `slideInMessage 0.4s ease-out ${index * 0.05}s both`,
											"@keyframes slideInMessage": {
												from: {
													opacity: 0,
													transform: isUserMessage
														? "translateX(30px) translateY(10px)"
														: "translateX(-30px) translateY(10px)",
													scale: 0.9
												},
												to: {
													opacity: 1,
													transform: "translateX(0) translateY(0)",
													scale: 1
												},
											},
										}}
									>
										{!isUserMessage && (
											<Avatar
												sx={{
													bgcolor: isBotMessage
														? "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)"
														: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
													mr: 2,
													width: 40,
													height: 40,
													boxShadow: isBotMessage
														? "0 4px 12px rgba(74, 222, 128, 0.3)"
														: "0 4px 12px rgba(102, 126, 234, 0.3)",
													border: "2px solid white",
												}}
											>
												{isBotMessage ? (
													<SmartToyIcon sx={{ fontSize: '1.2rem' }} />
												) : (
													msg.name[0].toUpperCase()
												)}
											</Avatar>
										)}
										<Box
											sx={{
												maxWidth: "75%",
												position: "relative",
											}}
										>
											<Box
												sx={{
													p: 2,
													borderRadius: isUserMessage
														? "20px 20px 4px 20px"
														: "20px 20px 20px 4px",
													background: isUserMessage
														? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
														: isBotMessage
															? "white"
															: "#f8fafc",
													color: isUserMessage
														? "white"
														: "text.primary",
													boxShadow: isUserMessage
														? "0 4px 12px rgba(102, 126, 234, 0.3)"
														: "0 2px 8px rgba(0, 0, 0, 0.1)",
													border: !isUserMessage
														? "1px solid rgba(0, 0, 0, 0.05)"
														: "none",
													position: "relative",
													"&::before": !isUserMessage ? {
														content: '""',
														position: "absolute",
														left: -8,
														top: 8,
														width: 0,
														height: 0,
														borderStyle: "solid",
														borderWidth: "8px 8px 8px 0",
														borderColor: isBotMessage
															? "transparent white transparent transparent"
															: "transparent #f8fafc transparent transparent",
													} : {},
													"&::after": isUserMessage ? {
														content: '""',
														position: "absolute",
														right: -8,
														top: 8,
														width: 0,
														height: 0,
														borderStyle: "solid",
														borderWidth: "8px 0 8px 8px",
														borderColor: "transparent transparent transparent #667eea",
													} : {},
												}}
											>
												<Typography
													variant="caption"
													sx={{
														fontWeight: 600,
														opacity: 0.8,
														fontSize: "0.75rem",
														display: "block",
														mb: 0.5,
													}}
												>
													{msg.name}
												</Typography>
												<Typography
													variant="body2"
													sx={{
														fontSize: "0.9rem",
														lineHeight: 1.4,
														whiteSpace: "pre-wrap",
													}}
												>
													{msg.body}
												</Typography>
											</Box>
										</Box>
										{isUserMessage && (
											<Avatar
												sx={{
													bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
													ml: 2,
													width: 40,
													height: 40,
													boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
													border: "2px solid white",
												}}
											>
												{userInfo.name[0].toUpperCase()}
											</Avatar>
										)}
									</ListItem>

									{/* Render product suggestions */}
									{msg.isProductSuggestion && msg.products && (
										<Box
											sx={{
												mb: 2,
												ml: 6,
												mr: 2,
												animation: `slideInProducts 0.5s ease-out 0.2s both`,
												"@keyframes slideInProducts": {
													from: {
														opacity: 0,
														transform: "translateY(20px) scale(0.95)",
													},
													to: {
														opacity: 1,
														transform: "translateY(0) scale(1)",
													},
												},
											}}
										>
											<ProductSuggestion
												products={msg.products}
												onProductClick={handleProductClickWithCleanup}
											/>
										</Box>
									)}
								</Box>
							);
						})}

						{/* Show quick suggestions for bot mode */}
						{!isAdminMode && currentSuggestions.length > 0 && (
							<Box
								sx={{
									mb: 2,
									ml: 6,
									mr: 2,
									animation: `slideInSuggestions 0.4s ease-out 0.1s both`,
									"@keyframes slideInSuggestions": {
										from: {
											opacity: 0,
											transform: "translateY(15px) scale(0.97)",
										},
										to: {
											opacity: 1,
											transform: "translateY(0) scale(1)",
										},
									},
								}}
							>
								<QuickSuggestions
									suggestions={currentSuggestions}
									onSuggestionClick={(suggestion) => {
										handleSuggestionClick(suggestion);
										setCurrentSuggestions([]);
									}}
								/>
							</Box>
						)}

						{/* Show typing indicator when processing */}
						{!isAdminMode && isTyping && (
							<Box sx={{ animation: "fadeIn 0.3s ease" }}>
								<TypingIndicator />
							</Box>
						)}
					</List>

					<Box
						component="form"
						onSubmit={submitHandler}
						sx={{
							p: 3,
							background: "white",
							borderTop: "1px solid rgba(0, 0, 0, 0.05)",
							display: "flex",
							alignItems: "center",
							gap: 2,
							backdropFilter: "blur(10px)",
						}}
					>
						<TextField
							fullWidth
							variant="outlined"
							placeholder={isAdminMode
								? "Type your message to support agent..."
								: "Ask me about products, prices, or anything else..."
							}
							value={messageBody}
							onChange={(e) => setMessageBody(e.target.value)}
							size="small"
							disabled={isProcessing}
							sx={{
								flexGrow: 1,
								"& .MuiOutlinedInput-root": {
									borderRadius: 3,
									backgroundColor: isProcessing ? "#f5f5f5" : "#f8fafc",
									border: "1px solid rgba(0, 0, 0, 0.08)",
									transition: "all 0.2s ease",
									"&:hover": !isProcessing ? {
										backgroundColor: "#f1f5f9",
										borderColor: isAdminMode
											? "rgba(102, 126, 234, 0.3)"
											: "rgba(74, 222, 128, 0.3)",
									} : {},
									"&.Mui-focused": {
										backgroundColor: "white",
										borderColor: isAdminMode ? "#667eea" : "#4ade80",
										boxShadow: isAdminMode
											? "0 0 0 3px rgba(102, 126, 234, 0.1)"
											: "0 0 0 3px rgba(74, 222, 128, 0.1)",
									},
									"&.Mui-disabled": {
										backgroundColor: "#f5f5f5",
									},
									"& fieldset": {
										border: "none",
									},
								},
								"& .MuiOutlinedInput-input": {
									padding: "12px 16px",
									fontSize: "0.9rem",
								},
							}}
						/>

						<IconButton
							type="submit"
							disabled={!messageBody.trim() || isProcessing}
							sx={{
								background: (messageBody.trim() && !isProcessing)
									? isAdminMode
										? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
										: "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)"
									: "rgba(0, 0, 0, 0.1)",
								color: "white",
								width: 48,
								height: 48,
								transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
								"&:hover": (messageBody.trim() && !isProcessing) ? {
									transform: "scale(1.05)",
									boxShadow: isAdminMode
										? "0 8px 24px rgba(102, 126, 234, 0.4)"
										: "0 8px 24px rgba(74, 222, 128, 0.4)",
									background: isAdminMode
										? "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
										: "linear-gradient(135deg, #16a34a 0%, #4ade80 100%)",
								} : {},
								"&:disabled": {
									color: "rgba(0, 0, 0, 0.3)",
								},
								"&:active": {
									transform: "scale(0.95)",
								},
							}}
						>
							<SendIcon />
						</IconButton>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default CustomerChatBox;
