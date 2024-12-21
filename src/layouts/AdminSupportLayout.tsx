import React, { useEffect, useRef, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { isEmpty } from "lodash";
import ChatUsersList from "src/components/messaging/ChatUsersList";
import ChatWindow from "src/components/messaging/ChatWindow";

let allUsers: any[] = [];
let allMessages: any[] = [];
let allSelectedUser: any = {};

const AdminSupportLayout: React.FC = () => {
	const [selectedUser, setSelectedUser] = useState<any>({});
	const [socket, setSocket] = useState<Socket | null>(null);
	const uiMessagesRef = useRef<HTMLUListElement>(null);
	const [messageBody, setMessageBody] = useState<string>("");
	const [messages, setMessages] = useState<any[]>([]);
	const [users, setUsers] = useState<any[]>([]);
	const { userInfo } = useSelector(({ user }: any) => user);
	const [endpoint, setEndpoint] = useState<any>("");

	useEffect(() => {
		if (!isEmpty(selectedUser) && selectedUser.unread) {
			const interval = setInterval(() => {
				socket?.emit("onUserSelected", selectedUser);
			}, 10);
			return () => clearInterval(interval);
		}
	}, [selectedUser, socket]);

	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			window.location.host.indexOf("localhost") >= 0
		) {
			setEndpoint("http://localhost:5003");
		} else {
			setEndpoint(process.env.NEXT_PUBLIC_MONGODB_URI);
		}
	}, []);

	useEffect(() => {
		if (uiMessagesRef.current) {
			uiMessagesRef.current.scrollTo({
				top: uiMessagesRef.current.scrollHeight,
				behavior: "smooth",
			});
		}

		if (!socket && !isEmpty(endpoint)) {
			const sk = socketIOClient(endpoint);
			setSocket(sk);
			sk.emit("onLogin", {
				_id: userInfo._id,
				name: userInfo.name,
				isAdmin: userInfo.isAdmin,
			});

			sk.on("message", (data) => {
				if (allSelectedUser._id === data._id) {
					allMessages = [...allMessages, data];
				} else {
					const existUser = allUsers.find((user) => user._id === data._id);
					if (existUser) {
						allUsers = allUsers.map((user) =>
							user._id === existUser._id ? { ...user, unread: true } : user,
						);
						setUsers(allUsers);
					}
				}
				setMessages(allMessages);
			});

			sk.on("updateUser", (updatedUser) => {
				const existUser = allUsers.find((user) => user._id === updatedUser._id);
				if (existUser) {
					allUsers = allUsers.map((user) =>
						user._id === existUser._id ? updatedUser : user,
					);
					setUsers(allUsers);
				} else {
					allUsers = [...allUsers, updatedUser];
					setUsers(allUsers);
				}
			});

			sk.on("listUsers", (updatedUsers) => {
				allUsers = updatedUsers;
				setUsers(allUsers);
			});

			sk.on("selectUser", (user) => {
				allMessages = user.messages;
				setMessages(allMessages);
			});
		}
	}, [messages, socket, endpoint, users]);

	const submitHandler = (e: React.FormEvent) => {
		e.preventDefault();
		if (!messageBody.trim()) {
			alert("Error. Please type a message.");
			return;
		}
		allMessages = [...allMessages, { body: messageBody, name: userInfo.name }];
		setMessages(allMessages);
		setMessageBody("");

		setTimeout(() => {
			socket?.emit("onMessage", {
				body: messageBody,
				name: userInfo.name,
				isAdmin: userInfo.isAdmin,
				_id: selectedUser._id,
			});
		}, 1000);
	};

	return (
		<Box display="flex" gap={2} p={2} height="100%">
			<ChatUsersList
				socket={socket}
				users={users}
				setUsers={setUsers}
				allUsers={allUsers}
				allSelectedUser={allSelectedUser}
				selectedUser={selectedUser}
				setSelectedUser={setSelectedUser}
			/>
			<ChatWindow
				selectedUser={selectedUser}
				uiMessagesRef={uiMessagesRef}
				messages={messages}
				submitHandler={submitHandler}
				messageBody={messageBody}
				setMessageBody={setMessageBody}
			/>
		</Box>
	);
};

export default AdminSupportLayout;
