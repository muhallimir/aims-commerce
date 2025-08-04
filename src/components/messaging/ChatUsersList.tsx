import {
	Avatar,
	Badge,
	List,
	ListItem,
	Typography,
	Box,
	Divider,
	Chip,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import {
	Person as PersonIcon,
	Support as SupportIcon
} from "@mui/icons-material";
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
		<Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
			{/* Header */}
			<Box
				sx={{
					p: 3,
					bgcolor: "primary.main",
					color: "primary.contrastText"
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
					<SupportIcon sx={{ mr: 1, fontSize: 28 }} />
					<Typography variant="h6" sx={{ fontWeight: 600 }}>
						Support Chat
					</Typography>
				</Box>
				<Typography variant="body2" sx={{ opacity: 0.9 }}>
					Connect with customers in real-time
				</Typography>
			</Box>

			{/* Users Count */}
			<Box sx={{ p: 2, bgcolor: "background.paper" }}>
				<Chip
					label={`${users.filter((x) => x._id !== userInfo._id).length} Online Users`}
					color="success"
					variant="outlined"
					size="small"
					sx={{ fontWeight: 500 }}
				/>
			</Box>

			<Divider />

			{/* Users List */}
			<Box sx={{ flex: 1, overflow: "hidden" }}>
				{users.filter((x) => x._id !== userInfo._id).length === 0 ? (
					<Box
						sx={{
							p: 4,
							textAlign: "center",
							color: "text.secondary"
						}}
					>
						<PersonIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
						<Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
							No customers online
						</Typography>
						<Typography variant="body2">
							Users will appear here when they need support
						</Typography>
					</Box>
				) : (
					<List
						sx={{
							p: 0,
							height: "100%",
							overflowY: "auto",
							"&::-webkit-scrollbar": {
								width: "6px",
							},
							"&::-webkit-scrollbar-thumb": {
								backgroundColor: "rgba(0,0,0,0.2)",
								borderRadius: "3px",
							},
							"&::-webkit-scrollbar-track": {
								backgroundColor: "transparent",
							},
						}}
					>
						{users
							.filter((x) => x._id !== userInfo._id)
							.map((user, index) => (
								<React.Fragment key={user._id}>
									<ListItem
										onClick={() => selectUser(user)}
										sx={{
											py: 2,
											px: 3,
											cursor: "pointer",
											transition: "all 0.2s ease",
											borderLeft: "3px solid transparent",
											...(user._id === selectedUser._id && {
												bgcolor: "primary.50",
												borderLeftColor: "primary.main",
											}),
											"&:hover": {
												bgcolor: user._id === selectedUser._id
													? "primary.100"
													: "action.hover",
											},
										}}
									>
										<Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
											<Badge
												color={user.online ? "success" : "default"}
												variant="dot"
												overlap="circular"
												anchorOrigin={{
													vertical: 'bottom',
													horizontal: 'right',
												}}
												sx={{
													"& .MuiBadge-dot": {
														width: 12,
														height: 12,
														borderRadius: "50%",
														border: "2px solid white",
													}
												}}
											>
												<Avatar
													sx={{
														bgcolor: user._id === selectedUser._id
															? "primary.main"
															: "grey.400",
														width: 44,
														height: 44,
														fontSize: "1.1rem",
														fontWeight: 600,
														transition: "all 0.2s ease"
													}}
												>
													{user.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
												</Avatar>
											</Badge>

											<Box sx={{ ml: 2, flex: 1, minWidth: 0 }}>
												<Typography
													variant="subtitle1"
													sx={{
														fontWeight: 600,
														color: user._id === selectedUser._id
															? "primary.main"
															: "text.primary",
														textTransform: "capitalize",
														overflow: "hidden",
														textOverflow: "ellipsis",
														whiteSpace: "nowrap"
													}}
												>
													{user.name}
												</Typography>
												<Typography
													variant="caption"
													sx={{
														color: "text.secondary",
														display: "flex",
														alignItems: "center"
													}}
												>
													{user.online ? (
														<>
															<Box
																component="span"
																sx={{
																	width: 6,
																	height: 6,
																	borderRadius: "50%",
																	bgcolor: "success.main",
																	mr: 0.5
																}}
															/>
															Online
														</>
													) : (
														<>
															<Box
																component="span"
																sx={{
																	width: 6,
																	height: 6,
																	borderRadius: "50%",
																	bgcolor: "grey.400",
																	mr: 0.5
																}}
															/>
															Offline
														</>
													)}
												</Typography>
											</Box>

											{user.unread && (
												<Box
													sx={{
														width: 8,
														height: 8,
														borderRadius: "50%",
														bgcolor: "error.main",
														animation: "pulse 2s infinite",
														"@keyframes pulse": {
															"0%": {
																boxShadow: "0 0 0 0 rgba(244, 67, 54, 0.7)",
															},
															"70%": {
																boxShadow: "0 0 0 10px rgba(244, 67, 54, 0)",
															},
															"100%": {
																boxShadow: "0 0 0 0 rgba(244, 67, 54, 0)",
															},
														},
													}}
												/>
											)}
										</Box>
									</ListItem>
									{index < users.filter((x) => x._id !== userInfo._id).length - 1 && (
										<Divider variant="inset" component="li" sx={{ ml: 7 }} />
									)}
								</React.Fragment>
							))}
					</List>
				)}
			</Box>
		</Box>
	);
};

export default ChatUsersList;
