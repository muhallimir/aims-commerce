import {
	Box,
	Button,
	List,
	ListItem,
	Paper,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import React from "react";
import { Send as SendIcon } from "@mui/icons-material";
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
		<Paper
			elevation={4}
			sx={{
				flex: 1,
				p: 2,
				bgcolor: "background.default",
				borderRadius: 2,
				boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
				transition: "box-shadow 0.3s ease",
				"&:hover": {
					boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
				},
			}}
		>
			{!selectedUser._id ? (
				<Typography
					variant="h6"
					align="center"
					sx={{
						fontStyle: "italic",
						color: "text.secondary",
						mb: 2,
						fontWeight: "lighter",
					}}
				>
					Select a user to start a chat
				</Typography>
			) : (
				<Stack
					spacing={2}
					sx={{
						height: "80vh",
						overflowY: "auto",
					}}
				>
					<Typography
						variant="h6"
						sx={{
							fontWeight: "bold",
							color: "primary.main",
							textAlign: "center",
						}}
					>
						Chat with {selectedUser.name}
					</Typography>
					<Box
						ref={uiMessagesRef}
						sx={{
							flex: 1,
							overflowY: "auto",
							border: "1px solid",
							borderColor: "divider",
							borderRadius: 1,
							backgroundColor: "background.paper",
							p: 1,
							boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
							"&::-webkit-scrollbar": {
								width: "8px",
							},
							"&::-webkit-scrollbar-thumb": {
								backgroundColor: "rgba(0, 0, 0, 0.2)",
								borderRadius: "4px",
							},
							"&::-webkit-scrollbar-track": {
								backgroundColor: "transparent",
							},
						}}
					>
						{messages.length === 0 ? (
							<Typography align="center" sx={{ color: "text.secondary" }}>
								No messages yet.
							</Typography>
						) : (
							<List>
								{messages.map((msg, index) => (
									<ListItem
										key={index}
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent:
												msg.name === userInfo.name ? "flex-end" : "flex-start",
											p: 1,
											borderRadius: 1,
											backgroundColor: "background.paper",
											color: "text.primary",
											alignSelf:
												msg.name === userInfo.name ? "flex-end" : "flex-start",
											boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
											transition: "box-shadow 0.2s ease",
											"&:hover": {
												boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
											},
										}}
									>
										<Typography sx={{ fontSize: "0.9rem" }}>
											<strong>{msg.name}:</strong> {msg.body}
										</Typography>
									</ListItem>
								))}
							</List>
						)}
					</Box>
					<form onSubmit={submitHandler}>
						<Stack direction="row" spacing={1} justifyContent="flex-end">
							<TextField
								fullWidth
								variant="outlined"
								size="small"
								placeholder="Type a message..."
								value={messageBody}
								onChange={(e) => setMessageBody(e.target.value)}
								sx={{
									borderRadius: 1,
									bgcolor: "background.default",
									"& .MuiOutlinedInput-root": {
										borderRadius: 1,
										"& fieldset": {
											borderColor: "divider",
										},
										"&:hover fieldset": {
											borderColor: "primary.main",
										},
										"&.Mui-focused fieldset": {
											borderColor: "primary.main",
										},
									},
								}}
							/>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								startIcon={<SendIcon />}
								sx={{
									borderRadius: 1,
									boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
									transition: "box-shadow 0.2s ease",
									"&:hover": {
										boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
									},
								}}
							>
								Send
							</Button>
						</Stack>
					</form>
				</Stack>
			)}
		</Paper>
	);
};

export default ChatWindow;
