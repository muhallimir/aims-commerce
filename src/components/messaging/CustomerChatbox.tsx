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
		<Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
			{!isEmpty(userInfo) && !isAdmin && !isOpen ? (
				<IconButton
					onClick={supportHandler}
					color="primary"
					aria-label="chat"
					sx={{
						backgroundColor: "primary.main",
						color: "white",
						position: "fixed",
						bottom: { xs: "16px", md: "32px" },
						right: { xs: "16px", md: "32px" },
						zIndex: 1000,
						"&:hover": { backgroundColor: "primary.dark" },
					}}
				>
					<ChatIcon fontSize="large" />
				</IconButton>
			) : (
				<Box
					sx={{
						width: 350,
						height: 450,
						display: "flex",
						flexDirection: "column",
						backgroundColor: "background.paper",
						boxShadow: 3,
						borderRadius: 2,
						mr: "20px",
					}}
				>
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						sx={{
							p: 1,
							backgroundColor: "primary.main",
							color: "white",
							borderRadius: "8px 8px 0 0",
						}}
					>
						<Typography variant="h6" ml={1}>
							Customer Support
						</Typography>
						<IconButton
							onClick={closeHandler}
							sx={{ color: "white" }}
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
							p: 2,
							bgcolor: "background.default",
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
									mb: 1,
								}}
							>
								{msg.name !== (isAdmin ? "Admin" : userInfo.name) && (
									<Avatar
										sx={{
											bgcolor:
												msg.name !== userInfo.name
													? "secondary.main"
													: "primary.main",
											mr: 1,
										}}
									>
										{msg.name[0].toUpperCase()}
									</Avatar>
								)}
								<Box
									sx={{
										p: 1,
										borderRadius: 2,
										backgroundColor:
											msg.name === (isAdmin ? "Admin" : userInfo.name)
												? "primary.light"
												: "secondary.light",
										boxShadow: 1,
										color: "common.white",
									}}
								>
									<Typography variant="body2" fontWeight="bold">
										{msg.name}
									</Typography>
									<Typography variant="body2">{msg.body}</Typography>
								</Box>
							</ListItem>
						))}
					</List>

					<Box
						component="form"
						onSubmit={submitHandler}
						sx={{
							p: 2,
							borderTop: "1px solid",
							borderColor: "divider",
							display: "flex",
							alignItems: "center",
						}}
					>
						<TextField
							fullWidth
							variant="outlined"
							placeholder="Type a message"
							value={messageBody}
							onChange={(e) => setMessageBody(e.target.value)}
							size="small"
							sx={{ flexGrow: 1, mr: 1 }}
						/>

						<IconButton
							type="submit"
							color="primary"
							sx={{
								backgroundColor: "primary.main",
								color: "white",
								"&:hover": { backgroundColor: "primary.dark" },
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
