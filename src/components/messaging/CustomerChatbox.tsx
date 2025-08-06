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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import useAuthentication from "src/hooks/useAuthentication";
import isEmpty from "lodash/isEmpty";

interface Message {
	name: string;
	body: string;
}

const CustomerChatBox: React.FC = () => {
	const { userInfo, isAdmin } = useAuthentication();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [messageBody, setMessageBody] = useState("");
	const [messages, setMessages] = useState<Message[]>([
		{ name: "Admin", body: "Hi! Please input your inquiry." },
	]);
	const uiMessagesRef = useRef<HTMLUListElement | null>(null);
	const [endpoint, setEndpoint] = useState<string | any>("");

	useEffect(() => {
		setEndpoint(
			window?.location?.host?.indexOf("localhost") >= 0
				? "http://localhost:5003"
				: process.env.NEXT_PUBLIC_MONGODB_URI,
		);
	}, []);

	useEffect(() => {
		if (uiMessagesRef.current) {
			uiMessagesRef.current.scrollTop = uiMessagesRef.current.scrollHeight;
		}
	}, [messages]);

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
		if (!socket) {
			const newSocket = socketIOClient(endpoint);
			setSocket(newSocket);
		}
	};

	const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!messageBody.trim()) {
			alert("Error. Please type a message.");
		} else {
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
			setMessageBody("");
		}
	};

	const closeHandler = () => {
		setIsOpen(false);
	};

	return (
		<Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1300 }}>
			{!isEmpty(userInfo) && !isAdmin && !isOpen ? (
				<IconButton
					onClick={supportHandler}
					color="primary"
					aria-label="chat"
					sx={{
						background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
						color: "white",
						width: 64,
						height: 64,
						position: "fixed",
						bottom: { xs: "20px", md: "32px" },
						right: { xs: "20px", md: "32px" },
						zIndex: 1300,
						boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
						transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
						"&:hover": { 
							transform: "scale(1.1)",
							boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
							background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
						},
						"&:active": {
							transform: "scale(0.95)",
						},
					}}
				>
					<ChatIcon fontSize="large" />
				</IconButton>
			) : (
				<Box
					sx={{
						width: { xs: "calc(100vw - 32px)", sm: 380 },
						height: { xs: "calc(100vh - 100px)", sm: 520 },
						maxHeight: "80vh",
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
							p: 3,
							background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<Box
								sx={{
									width: 10,
									height: 10,
									borderRadius: "50%",
									backgroundColor: "#4ade80",
									boxShadow: "0 0 8px rgba(74, 222, 128, 0.6)",
									animation: "pulse 2s infinite",
									"@keyframes pulse": {
										"0%, 100%": { opacity: 1, transform: "scale(1)" },
										"50%": { opacity: 0.7, transform: "scale(1.1)" },
									},
								}}
							/>
							<Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
								Customer Support
							</Typography>
						</Box>
						<IconButton
							onClick={closeHandler}
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
							<CloseIcon />
						</IconButton>
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
						{messages.map((msg, index) => (
							<ListItem
								key={index}
								sx={{
									display: "flex",
									justifyContent:
										msg.name === (isAdmin ? "Admin" : userInfo.name)
											? "flex-end"
											: "flex-start",
									mb: 2,
									p: 0,
									animation: `fadeIn 0.3s ease ${index * 0.1}s both`,
									"@keyframes fadeIn": {
										from: { opacity: 0, transform: "translateY(10px)" },
										to: { opacity: 1, transform: "translateY(0)" },
									},
								}}
							>
								{msg.name !== (isAdmin ? "Admin" : userInfo.name) && (
									<Avatar
										sx={{
											bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
											mr: 2,
											width: 40,
											height: 40,
											boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
											border: "2px solid white",
										}}
									>
										{msg.name[0].toUpperCase()}
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
											borderRadius: msg.name === (isAdmin ? "Admin" : userInfo.name)
												? "20px 20px 4px 20px"
												: "20px 20px 20px 4px",
											background: msg.name === (isAdmin ? "Admin" : userInfo.name)
												? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
												: "white",
											color: msg.name === (isAdmin ? "Admin" : userInfo.name)
												? "white"
												: "text.primary",
											boxShadow: msg.name === (isAdmin ? "Admin" : userInfo.name)
												? "0 4px 12px rgba(102, 126, 234, 0.3)"
												: "0 2px 8px rgba(0, 0, 0, 0.1)",
											border: msg.name !== (isAdmin ? "Admin" : userInfo.name)
												? "1px solid rgba(0, 0, 0, 0.05)"
												: "none",
											position: "relative",
											"&::before": msg.name !== (isAdmin ? "Admin" : userInfo.name) ? {
												content: '""',
												position: "absolute",
												left: -8,
												top: 8,
												width: 0,
												height: 0,
												borderStyle: "solid",
												borderWidth: "8px 8px 8px 0",
												borderColor: "transparent white transparent transparent",
											} : {},
											"&::after": msg.name === (isAdmin ? "Admin" : userInfo.name) ? {
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
											}}
										>
											{msg.body}
										</Typography>
									</Box>
								</Box>
								{msg.name === (isAdmin ? "Admin" : userInfo.name) && (
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
						))}
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
							placeholder="Type your message..."
							value={messageBody}
							onChange={(e) => setMessageBody(e.target.value)}
							size="small"
							sx={{ 
								flexGrow: 1,
								"& .MuiOutlinedInput-root": {
									borderRadius: 3,
									backgroundColor: "#f8fafc",
									border: "1px solid rgba(0, 0, 0, 0.08)",
									transition: "all 0.2s ease",
									"&:hover": {
										backgroundColor: "#f1f5f9",
										borderColor: "rgba(102, 126, 234, 0.3)",
									},
									"&.Mui-focused": {
										backgroundColor: "white",
										borderColor: "#667eea",
										boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
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
							disabled={!messageBody.trim()}
							sx={{
								background: messageBody.trim() 
									? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
									: "rgba(0, 0, 0, 0.1)",
								color: "white",
								width: 48,
								height: 48,
								transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
								"&:hover": messageBody.trim() ? {
									transform: "scale(1.05)",
									boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
									background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
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
