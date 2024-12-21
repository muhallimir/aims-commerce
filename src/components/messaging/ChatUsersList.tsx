import {
	Avatar,
	Badge,
	List,
	ListItem,
	ListItemText,
	Paper,
	Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Person as PersonIcon } from "@mui/icons-material";
import { ChatUsersListProps } from "@common/interface";

const ChatUsersList: React.FC<ChatUsersListProps> = ({
	socket,
	users,
	setUsers,
	allUsers,
	allSelectedUser,
	selectedUser,
	setSelectedUser,
}) => {
	const { userInfo } = useSelector(({ user }: any) => user);

	const selectUser = (user: any) => {
		allSelectedUser = user;
		setSelectedUser(allSelectedUser);
		const existUser = allUsers.find((x) => x._id === user._id);
		if (existUser) {
			allUsers = allUsers.map((x) =>
				x._id === existUser._id ? { ...x, unread: false } : x,
			);
			setUsers(allUsers);
		}
		socket?.emit("onUserSelected", user);
	};

	return (
		<Paper
			elevation={3}
			sx={{ width: 300, p: 2, bgcolor: "background.paper", borderRadius: 2 }}
		>
			<Typography
				variant="h6"
				gutterBottom
				sx={{ fontWeight: "bold", color: "text.primary" }}
			>
				Online Users
			</Typography>
			{users.filter((x) => x._id !== userInfo._id).length === 0 ? (
				<Typography>No Online User Found</Typography>
			) : (
				<List
					sx={{
						bgcolor: "background.paper",
						borderRadius: 1,
						height: "80vh",
						overflowY: "auto",
					}}
				>
					{users
						.filter((x) => x._id !== userInfo._id)
						.map((user) => (
							<ListItem
								key={user._id}
								onClick={() => selectUser(user)}
								sx={{
									"&:hover": {
										backgroundColor: "action.hover",
									},
									backgroundColor:
										user._id === selectedUser._id
											? "action.selected"
											: "transparent",
								}}
							>
								<Badge
									color={user.online ? "success" : "default"}
									variant="dot"
								>
									<Avatar sx={{ bgcolor: "primary.main", borderRadius: 4 }}>
										<PersonIcon />
									</Avatar>
								</Badge>
								<ListItemText
									primary={user.name}
									sx={{ ml: 1, textTransform: "capitalize" }}
								/>
							</ListItem>
						))}
				</List>
			)}
		</Paper>
	);
};

export default ChatUsersList;
