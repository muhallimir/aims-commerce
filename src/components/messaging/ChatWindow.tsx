import {
	Box,
	Button,
	Paper,
	TextField,
	Typography,
	Avatar,
	IconButton,
} from "@mui/material";
import React from "react";
import {
	Send as SendIcon,
	Person as PersonIcon,
	AttachFile as AttachFileIcon,
	EmojiEmotions as EmojiIcon,
	MoreVert as MoreVertIcon
} from "@mui/icons-material";
import { ChatWindowProps } from "@common/interface";
import useAuthentication from "src/hooks/useAuthentication";

const ChatWindow: React.FC<ChatWindowProps> = ({
	selectedUser,
	uiMessagesRef,
	messages,
	submitHandler,
	messageBody,
	setMessageBody,
}) => {
	const { userInfo } = useAuthentication();

	return (
		<Box
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				bgcolor: "background.paper"
			}}
		>
			{!selectedUser._id ? (
				<Box
					sx={{
						flex: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "column",
						textAlign: "center",
						p: 4,
						bgcolor: "grey.50"
					}}
				>
					<Box
						sx={{
							width: 120,
							height: 120,
							borderRadius: "50%",
							bgcolor: "primary.50",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							mb: 3
						}}
					>
						<PersonIcon sx={{ fontSize: 60, color: "primary.main" }} />
					</Box>
					<Typography
						variant="h5"
						sx={{
							fontWeight: 600,
							color: "text.primary",
							mb: 1
						}}
					>
						Welcome to Support Chat
					</Typography>
					<Typography
						variant="body1"
						sx={{
							color: "text.secondary",
							maxWidth: 400,
							lineHeight: 1.6
						}}
					>
						Select a customer from the sidebar to start providing support.
						You'll be able to chat in real-time and help resolve their questions.
					</Typography>
				</Box>
			) : (
				<>
					{/* Chat Header */}
					<Box
						sx={{
							p: 3,
							bgcolor: "background.paper",
							borderBottom: "1px solid",
							borderColor: "divider",
							boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
							<Box sx={{ display: "flex", alignItems: "center" }}>
								<Avatar
									sx={{
										width: 48,
										height: 48,
										bgcolor: "primary.main",
										fontSize: "1.2rem",
										fontWeight: 600,
										mr: 2
									}}
								>
									{selectedUser.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
								</Avatar>
								<Box>
									<Typography
										variant="h6"
										sx={{
											fontWeight: 600,
											color: "text.primary",
											textTransform: "capitalize"
										}}
									>
										{selectedUser.name}
									</Typography>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<Box
											sx={{
												width: 8,
												height: 8,
												borderRadius: "50%",
												bgcolor: "success.main",
												mr: 1
											}}
										/>
										<Typography variant="caption" color="success.main" sx={{ fontWeight: 500 }}>
											Online
										</Typography>
									</Box>
								</Box>
							</Box>
							<IconButton size="small" sx={{ color: "text.secondary" }}>
								<MoreVertIcon />
							</IconButton>
						</Box>
					</Box>

					{/* Messages Area */}
					<Box
						ref={uiMessagesRef}
						sx={{
							flex: 1,
							overflow: "auto",
							p: 2,
							bgcolor: "#f8fafc",
							backgroundImage: `radial-gradient(circle at 20px 20px, rgba(0,0,0,0.02) 1px, transparent 0)`,
							backgroundSize: "40px 40px",
							"&::-webkit-scrollbar": {
								width: "8px",
							},
							"&::-webkit-scrollbar-thumb": {
								backgroundColor: "rgba(0,0,0,0.2)",
								borderRadius: "4px",
							},
							"&::-webkit-scrollbar-track": {
								backgroundColor: "transparent",
							},
						}}
					>
						{messages.length === 0 ? (
							<Box
								sx={{
									textAlign: "center",
									p: 4,
									color: "text.secondary"
								}}
							>
								<Typography variant="body1" sx={{ mb: 1 }}>
									No messages yet
								</Typography>
								<Typography variant="body2">
									Start the conversation by sending a message below
								</Typography>
							</Box>
						) : (
							<Box>
								{messages.map((msg, index) => {
									const isOwnMessage = msg.name === userInfo.name;
									const showAvatar = index === 0 || messages[index - 1]?.name !== msg.name;

									return (
										<Box
											key={index}
											sx={{
												display: "flex",
												justifyContent: isOwnMessage ? "flex-end" : "flex-start",
												mb: 2,
												alignItems: "flex-end"
											}}
										>
											{!isOwnMessage && showAvatar && (
												<Avatar
													sx={{
														width: 32,
														height: 32,
														bgcolor: "grey.400",
														fontSize: "0.9rem",
														mr: 1,
														mb: 0.5
													}}
												>
													{msg.name?.charAt(0)?.toUpperCase()}
												</Avatar>
											)}
											{!isOwnMessage && !showAvatar && (
												<Box sx={{ width: 32, mr: 1 }} />
											)}

											<Box
												sx={{
													maxWidth: "70%",
													minWidth: "120px"
												}}
											>
												{showAvatar && (
													<Typography
														variant="caption"
														sx={{
															color: "text.secondary",
															mb: 0.5,
															display: "block",
															textAlign: isOwnMessage ? "right" : "left",
															px: 1
														}}
													>
														{isOwnMessage ? "You" : msg.name}
													</Typography>
												)}
												<Paper
													elevation={0}
													sx={{
														p: 2,
														bgcolor: isOwnMessage ? "primary.main" : "background.paper",
														color: isOwnMessage ? "primary.contrastText" : "text.primary",
														borderRadius: isOwnMessage
															? "18px 18px 4px 18px"
															: "18px 18px 18px 4px",
														border: "1px solid",
														borderColor: isOwnMessage ? "primary.main" : "grey.200",
														boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
														position: "relative"
													}}
												>
													<Typography
														variant="body1"
														sx={{
															fontSize: "0.95rem",
															lineHeight: 1.4,
															wordBreak: "break-word"
														}}
													>
														{msg.body}
													</Typography>
												</Paper>
											</Box>
										</Box>
									);
								})}
							</Box>
						)}
					</Box>

					{/* Message Input */}
					<Box
						sx={{
							p: 3,
							bgcolor: "background.paper",
							borderTop: "1px solid",
							borderColor: "divider"
						}}
					>
						<form onSubmit={submitHandler}>
							<Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
								<IconButton
									size="small"
									sx={{
										color: "text.secondary",
										mb: 1
									}}
								>
									<AttachFileIcon />
								</IconButton>

								<TextField
									fullWidth
									variant="outlined"
									size="small"
									placeholder="Type your message..."
									value={messageBody}
									onChange={(e) => setMessageBody(e.target.value)}
									multiline
									maxRows={4}
									sx={{
										"& .MuiOutlinedInput-root": {
											borderRadius: "20px",
											bgcolor: "grey.50",
											"& fieldset": {
												borderColor: "grey.300",
											},
											"&:hover fieldset": {
												borderColor: "primary.main",
											},
											"&.Mui-focused fieldset": {
												borderColor: "primary.main",
												borderWidth: "2px"
											},
											"& .MuiInputBase-input": {
												py: 1.5,
												px: 2
											}
										},
									}}
								/>

								<IconButton
									size="small"
									sx={{
										color: "text.secondary",
										mb: 1
									}}
								>
									<EmojiIcon />
								</IconButton>

								<Button
									type="submit"
									variant="contained"
									sx={{
										minWidth: "auto",
										width: 48,
										height: 48,
										borderRadius: "50%",
										bgcolor: "primary.main",
										boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
										"&:hover": {
											bgcolor: "primary.dark",
											boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
										},
										"&:disabled": {
											bgcolor: "grey.300"
										}
									}}
									disabled={!messageBody.trim()}
								>
									<SendIcon sx={{ fontSize: 20 }} />
								</Button>
							</Box>
						</form>
					</Box>
				</>
			)}
		</Box>
	);
};

export default ChatWindow;
