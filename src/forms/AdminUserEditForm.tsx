import React, { useState } from "react";
import {
	TextField,
	Switch,
	FormControlLabel,
	Button,
	Box,
	Typography,
	Card,
	CardContent,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useUpdateUserMutation } from "@store/user.slice";
import { useRouter } from "next/router";

const AdminEditUserForm: React.FC = () => {
	const { adminUsersData } = useSelector(({ user }: any) => user);
	const { userInView: user } = adminUsersData || {};
	const [name, setName] = useState(user.name);
	const [email, setEmail] = useState(user.email);
	const [isAdmin, setIsAdmin] = useState(user.isAdmin);
	const [reqUpdateUser] = useUpdateUserMutation();

	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const userId = router?.query?._id;
		const userInfo = {
			_id: userId,
			name,
			email,
			isAdmin,
		};
		await reqUpdateUser({ userId, userInfo })
			.unwrap()
			.then(() => {
				router.push("/admin/users");
			});
	};

	return (
		<Card
			sx={{
				maxWidth: 500,
				mx: "auto",
				mt: 4,
				p: 3,
				borderRadius: 2,
				boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
			}}
		>
			<CardContent>
				<Typography variant="h5" align="center" gutterBottom>
					Edit User
				</Typography>

				<Box
					component="form"
					onSubmit={handleSubmit}
					sx={{ display: "flex", flexDirection: "column", gap: 3 }}
				>
					<TextField
						label="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						fullWidth
						required
						variant="outlined"
					/>

					<TextField
						label="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						fullWidth
						required
						variant="outlined"
					/>

					<FormControlLabel
						control={
							<Switch
								checked={isAdmin}
								onChange={(e) => setIsAdmin(e.target.checked)}
								color="primary"
							/>
						}
						label="Admin Rights"
						labelPlacement="start"
						sx={{ justifyContent: "center", m: 0 }}
					/>

					<Box sx={{ mt: 2, color: "text.secondary" }}>
						<Typography variant="body2">
							Created At: {new Date(user.createdAt).toLocaleString()}
						</Typography>
						<Typography variant="body2">
							Last Updated: {new Date(user.updatedAt).toLocaleString()}
						</Typography>
					</Box>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						fullWidth
						sx={{
							py: 1.5,
							fontSize: "1rem",
							mt: 1,
							borderRadius: "8px",
							boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
							"&:hover": {
								backgroundColor: "primary.dark",
							},
						}}
					>
						Save Changes
					</Button>
				</Box>
			</CardContent>
		</Card>
	);
};

export default AdminEditUserForm;
