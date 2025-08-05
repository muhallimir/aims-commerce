import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Container,
	Link,
	Divider,
	Paper,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Chip,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";
import LoadingOverlay from "src/components/loaders/TextLoader";
import DemoBanner from "src/components/misc/DemoBanner";
import { LOADERTEXT } from "@common/constants";
import { SignInFormValues } from "@common/interface";
import useAuthentication from "src/hooks/useAuthentication";
import { getErrorMessage } from "@helpers/getErrorMessage";
import { PlayArrow as PlayArrowIcon, Info as InfoIcon, Person as PersonIcon, Email as EmailIcon, Lock as LockIcon, ContentCopy as CopyIcon, Check as CheckIcon } from "@mui/icons-material";
import useThemeMode from "src/hooks/useThemeMode";

const validationSchema = yup.object({
	email: yup
		.string()
		.email("Must be a valid email")
		.required("Email is required"),
	password: yup
		.string()
		.required("Password is required")
		.min(6, "Password should be at least 8 characters"),
});

const SignInForm: React.FC = () => {
	const router = useRouter();
	const { reqSignIn, resSignIn, reqRegister, resRegister } = useAuthentication();
	const { isLoading, isError, error } = resSignIn;
	const [showDemoCredentials, setShowDemoCredentials] = useState(false);
	const [demoAccountInfo, setDemoAccountInfo] = useState<any>(null);
	const [copiedField, setCopiedField] = useState<string | null>(null);
	const { isDarkMode } = useThemeMode();

	const formik = useFormik<SignInFormValues>({
		initialValues: { email: "", password: "" },
		validationSchema: validationSchema,
		onSubmit: (values) => {
			reqSignIn(values);
		},
	});

	const generateDemoCredentials = () => {
		const timestamp = Date.now();
		const randomId = Math.random().toString(36).substring(2, 8);
		const demoNames = [
			"Alex Johnson", "Sarah Williams", "Mike Chen", "Emma Davis",
			"John Smith", "Lisa Brown", "David Wilson", "Jessica Garcia",
			"Ryan Martinez", "Taylor Anderson", "Jordan Thomas", "Ashley Lee",
			"Daniel Kim", "Sophia Nguyen", "Ethan Patel", "Olivia Robinson",
			"Liam Turner", "Mia Clark", "Noah Walker", "Ava Hall",
			"William Wright", "Isabella Adams", "James Lewis", "Emily Scott",
			"Benjamin Rivera", "Chloe Young", "Lucas Hill", "Grace Green",
			"Henry Edwards", "Zoe Mitchell", "Samuel Baker", "Lily Nelson",
			"Jackson Carter", "Aria Perez", "Gabriel Ramirez", "Ella Murphy",
			"Matthew Reed", "Hannah Torres", "Christopher Brooks", "Abigail Flores",
			"Nathan Bell", "Natalie Cox", "Elijah Sanders", "Victoria Kelly",
			"Caleb Long", "Avery Ward", "Owen Price", "Scarlett Bennett",
			"Isaac Wood", "Madison Ross"
		];


		const randomName = demoNames[Math.floor(Math.random() * demoNames.length)];

		return {
			name: randomName,
			email: `demo-${randomId}-${timestamp}@aims-commerce.com`,
			password: "demo12345678",
			confirmPassword: "demo12345678"
		};
	};

	const handleDemoLogin = async () => {
		try {
			const demoCredentials = generateDemoCredentials();

			const registrationResult = await reqRegister(demoCredentials).unwrap();

			if (registrationResult) {
				const accountInfo = {
					name: demoCredentials.name,
					email: demoCredentials.email,
					password: demoCredentials.password,
					createdAt: new Date().toISOString()
				};

				setDemoAccountInfo(accountInfo);

				localStorage.setItem('demoAccountInfo', JSON.stringify(accountInfo));

				setShowDemoCredentials(true);

				formik.setFieldValue("email", demoCredentials.email);
				formik.setFieldValue("password", demoCredentials.password);
			}
		} catch (error) {
			console.error("Failed to create demo account:", error);
			const demoCredentials = generateDemoCredentials();
			const accountInfo = {
				name: demoCredentials.name,
				email: demoCredentials.email,
				password: demoCredentials.password,
				createdAt: new Date().toISOString()
			};

			setDemoAccountInfo(accountInfo);
			localStorage.setItem('demoAccountInfo', JSON.stringify(accountInfo));
			setShowDemoCredentials(true);
			formik.setFieldValue("email", demoCredentials.email);
			formik.setFieldValue("password", demoCredentials.password);
		}
	};

	const handleSignInWithDemo = () => {
		if (demoAccountInfo) {
			reqSignIn({
				email: demoAccountInfo.email,
				password: demoAccountInfo.password
			})
		}
	};

	const handleCloseDemoDialog = () => {
		setShowDemoCredentials(false);
		localStorage.removeItem('demoAccountInfo');
		setCopiedField(null);
	};

	const handleCopyToClipboard = async (text: string, field: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedField(field);
			setTimeout(() => setCopiedField(null), 2000);
		} catch (error) {
			console.error("Failed to copy to clipboard:", error);
		}
	};

	useEffect(() => {
		const storedDemoInfo = localStorage.getItem('demoAccountInfo');
		if (storedDemoInfo) {
			try {
				const accountInfo = JSON.parse(storedDemoInfo);
				setDemoAccountInfo(accountInfo);
				setShowDemoCredentials(true);
			} catch (error) {
				localStorage.removeItem('demoAccountInfo');
			}
		}
	}, []);

	return (
		<Container maxWidth="sm">
			{isLoading && <LoadingOverlay loadingMessage={LOADERTEXT.SIGN_IN} />}

			<DemoBanner
				onDemoLogin={handleDemoLogin}
				isLoading={isLoading}
				isRegisterLoading={resRegister.isLoading}
				isSignInForm={true}
			/>

			<Box
				component="form"
				onSubmit={formik.handleSubmit}
				sx={{
					mt: 3,
					p: 3,
					boxShadow: 3,
					borderRadius: 2,
					backgroundColor: "common.white",
				}}
			>
				<Typography
					variant="h5"
					gutterBottom
					color="text.secondary"
					sx={{ fontWeight: "bold", textAlign: "center" }}
				>
					Sign In
				</Typography>
				<TextField
					fullWidth
					margin="dense"
					label="Email"
					name="email"
					placeholder="Enter email"
					value={formik.values.email}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.email && Boolean(formik.errors.email)}
					helperText={formik.touched.email && formik.errors.email}
					InputProps={{ autoComplete: "off" }}
				/>
				<TextField
					fullWidth
					margin="dense"
					label="Password"
					type="password"
					name="password"
					placeholder="Enter password"
					value={formik.values.password}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.password && Boolean(formik.errors.password)}
					helperText={formik.touched.password && formik.errors.password}
					InputProps={{ autoComplete: "off" }}
				/>

				<Button
					type="submit"
					variant="contained"
					color="primary"
					fullWidth
					sx={{ mt: 3, py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
				>
					Sign In
				</Button>

				<Divider sx={{ my: 2 }}>
					<Typography variant="body2" color="textSecondary">
						OR
					</Typography>
				</Divider>

				<Box
					id="google-signin-btn"
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
					}}
				/>

				{isError && (
					<Typography
						variant="body2"
						color="error"
						sx={{ mt: 2, textAlign: "center" }}
					>
						{getErrorMessage(error)}
					</Typography>
				)}
			</Box>
			<Box sx={{ mt: 2, textAlign: "center" }}>
				<Typography variant="body2" color={isDarkMode ? "white" : "text.secondary"}>
					New to Aims-Commerce?{" "}
					<Link
						component="button"
						onClick={() => router.push("/register")}
						color="primary"
					>
						Create your account
					</Link>
				</Typography>
			</Box>

			<Dialog
				open={showDemoCredentials}
				onClose={handleCloseDemoDialog}
				maxWidth="sm"
				fullWidth
				disableEscapeKeyDown={false}
			>
				<DialogTitle>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<InfoIcon sx={{ color: "success.main", mr: 1 }} />
						<Typography variant="h6" sx={{ fontWeight: 600 }}>
							Demo Account Created Successfully!
						</Typography>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Typography variant="body1" sx={{ mb: 3 }}>
						Your unique demo account has been created and will be saved for you. These credentials will remain available until you manually close this dialog:
					</Typography>

					{demoAccountInfo && (
						<Paper sx={{ p: 3, bgcolor: "grey.50", border: "1px solid", borderColor: "grey.200" }}>
							<Box sx={{ mb: 2 }}>
								<Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
									<PersonIcon sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
									<Typography variant="subtitle2" color="text.secondary">
										Name:
									</Typography>
								</Box>
								<Chip
									label={demoAccountInfo.name}
									variant="outlined"
									onClick={() => handleCopyToClipboard(demoAccountInfo.name, 'name')}
									icon={copiedField === 'name' ? <CheckIcon sx={{ fontSize: 16 }} /> : <CopyIcon sx={{ fontSize: 16 }} />}
									sx={{
										fontFamily: "monospace",
										cursor: "pointer",
										"&:hover": { bgcolor: "action.hover" },
										"& .MuiChip-icon": {
											color: copiedField === 'name' ? "success.main" : "text.secondary"
										}
									}}
								/>
								{copiedField === 'name' && (
									<Typography variant="caption" sx={{ ml: 1, color: "success.main" }}>
										Copied!
									</Typography>
								)}
							</Box>

							<Box sx={{ mb: 2 }}>
								<Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
									<EmailIcon sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
									<Typography variant="subtitle2" color="text.secondary">
										Email:
									</Typography>
								</Box>
								<Chip
									label={demoAccountInfo.email}
									variant="outlined"
									onClick={() => handleCopyToClipboard(demoAccountInfo.email, 'email')}
									icon={copiedField === 'email' ? <CheckIcon sx={{ fontSize: 16 }} /> : <CopyIcon sx={{ fontSize: 16 }} />}
									sx={{
										fontFamily: "monospace",
										cursor: "pointer",
										"&:hover": { bgcolor: "action.hover" },
										"& .MuiChip-icon": {
											color: copiedField === 'email' ? "success.main" : "text.secondary"
										}
									}}
								/>
								{copiedField === 'email' && (
									<Typography variant="caption" sx={{ ml: 1, color: "success.main" }}>
										Copied!
									</Typography>
								)}
							</Box>

							<Box>
								<Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
									<LockIcon sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
									<Typography variant="subtitle2" color="text.secondary">
										Password:
									</Typography>
								</Box>
								<Chip
									label={demoAccountInfo.password}
									variant="outlined"
									onClick={() => handleCopyToClipboard(demoAccountInfo.password, 'password')}
									icon={copiedField === 'password' ? <CheckIcon sx={{ fontSize: 16 }} /> : <CopyIcon sx={{ fontSize: 16 }} />}
									sx={{
										fontFamily: "monospace",
										cursor: "pointer",
										"&:hover": { bgcolor: "action.hover" },
										"& .MuiChip-icon": {
											color: copiedField === 'password' ? "success.main" : "text.secondary"
										}
									}}
								/>
								{copiedField === 'password' && (
									<Typography variant="caption" sx={{ ml: 1, color: "success.main" }}>
										Copied!
									</Typography>
								)}
							</Box>
						</Paper>
					)}

					<Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
						💡 <strong>Tip:</strong> This dialog will persist even after you login and navigate around the app. You can access your credentials anytime until you manually close it. Perfect for testing login/logout functionality!
					</Typography>
				</DialogContent>
				<DialogActions sx={{ p: 3, gap: 1 }}>
					<Button
						onClick={handleCloseDemoDialog}
						variant="outlined"
					>
						Close & Save for Later
					</Button>
					<Button
						onClick={handleSignInWithDemo}
						variant="contained"
						startIcon={<PlayArrowIcon />}
						sx={{ fontWeight: 600 }}
					>
						Login with Demo Account
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default SignInForm;
