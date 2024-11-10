import {
	Box,
	Button,
	Chip,
	Divider,
	Card,
	CardContent,
	Typography,
	Pagination,
	Grid,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { AppState, User } from "@common/interface";
import {
	setIsRegisteringNewUser,
	setUserInview,
	useGetUsersMutation,
	useGetUserToManageMutation,
} from "@store/user.slice";
import AdminManagementSkeleton from "src/components/loaders/AdminManagementSkeleton";

const UserManagementLayout: React.FC = () => {
	const { loading } = useSelector((state: { app: AppState }) => state.app);
	const { adminUsersData } = useSelector(({ user }: any) => user);
	const { allUsers } = adminUsersData || {};
	const [currentPage, setCurrentPage] = useState(1);
	const [usersPerPage] = useState(6);
	const [reqUserList] = useGetUsersMutation();
	const [reqUser] = useGetUserToManageMutation();
	const router = useRouter();
	const dispatch = useDispatch();

	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;

	const sortedUsers = [...(allUsers || [])]?.sort(
		(a: User, b: User) =>
			new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
	);

	const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

	const handlePageChange = (
		event: React.ChangeEvent<unknown>,
		value: number,
	) => {
		setCurrentPage(value);
	};

	const handleEditUser = async (userId: string) => {
		await reqUser({ userId })
			.unwrap()
			.then(() => {
				const currentUser = allUsers.find((u: User) => u?._id === userId);
				dispatch(setUserInview(currentUser));
				router.push(`/admin/users/edit/${userId}`);
			});
	};

	const handleRegisterNewUser = () => {
		dispatch(setIsRegisteringNewUser(true));
		router.push("/register");
	};

	useEffect(() => {
		reqUserList({});
		dispatch(setIsRegisteringNewUser(false));
	}, []);

	const formatDate = (date: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		};
		return new Date(date).toLocaleDateString(undefined, options);
	};

	if (loading) {
		return <AdminManagementSkeleton title="User Management" />;
	}

	return (
		<Box sx={{ maxWidth: 1000, mx: "auto", p: 2 }}>
			<Typography variant="h4" gutterBottom color="primary">
				User Management
			</Typography>
			<Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
				<Button
					variant="contained"
					startIcon={<Add />}
					sx={{
						bgcolor: "primary.main",
						color: "white",
						fontWeight: "bold",
						"&:hover": { bgcolor: "primary.dark" },
					}}
					onClick={handleRegisterNewUser}
				>
					Create New User
				</Button>
			</Box>
			{currentUsers.length > 0 ? (
				<Grid container spacing={2}>
					{currentUsers.map((user: User) => (
						<Grid item xs={12} sm={6} md={4} key={user._id}>
							<Card sx={{ borderRadius: 2, boxShadow: 2, height: "100%" }}>
								<CardContent>
									<Typography variant="h6" noWrap>
										{user.name}
									</Typography>
									<Typography variant="body2" color="textSecondary">
										Email: {user.email}
									</Typography>
									<Chip
										label={user.isAdmin ? "Admin" : "Customer"}
										color={user.isAdmin ? "primary" : "default"}
										sx={{ mt: 1 }}
									/>
									<Divider sx={{ my: 2 }} />
									<Box sx={{ mb: 0 }}>
										<Typography
											variant="body2"
											color="textSecondary"
											sx={{ fontWeight: "bold" }}
										>
											Created Date:
										</Typography>
										<Typography variant="body2" color="textSecondary">
											{formatDate(user.createdAt)}
										</Typography>
									</Box>
									<Box sx={{ mb: 2 }}>
										<Typography
											variant="body2"
											color="textSecondary"
											sx={{ fontWeight: "bold" }}
										>
											Last Update:
										</Typography>
										<Typography variant="body2" color="textSecondary">
											{formatDate(user.updatedAt)}
										</Typography>
									</Box>
									<Divider sx={{ my: 2 }} />
									<Box
										sx={{ display: "flex", justifyContent: "center", gap: 1 }}
									>
										<Button
											variant="contained"
											startIcon={<Edit />}
											sx={{ bgcolor: "primary.main", color: "white" }}
											onClick={() => handleEditUser(user._id)}
										>
											Edit
										</Button>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			) : (
				<Box textAlign="center">
					<Typography variant="body1" color="textSecondary" align="center">
						No users available.
					</Typography>
				</Box>
			)}
			{currentUsers.length > 0 && (
				<>
					<Divider sx={{ my: 2 }} />
					<Pagination
						count={Math.ceil(allUsers.length / usersPerPage)}
						page={currentPage}
						onChange={handlePageChange}
						variant="outlined"
						color="primary"
						sx={{ display: "flex", justifyContent: "center", my: 2 }}
					/>
				</>
			)}
		</Box>
	);
};

export default UserManagementLayout;
