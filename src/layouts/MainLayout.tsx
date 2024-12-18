import { MainLayoutProps } from "@common/interface";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useAuthentication from "src/hooks/useAuthentication";
import CustomerChatBox from "src/components/messaging/CustomerChatbox";
import { isEmpty } from "lodash";

export default function MainLayout({ children }: MainLayoutProps) {
	const { theme: mode } = useSelector((state: any) => state.app);
	const { userInfo, isAdmin } = useAuthentication();
	const [isHydrating, setIsHydrating] = useState(true);
	const router = useRouter();

	useEffect(() => {
		setIsHydrating(false);
	}, []);

	useEffect(() => {
		if (!isHydrating && !isAdmin && router.asPath.includes("/admin")) {
			router.push("/store");
		}
	}, [isHydrating, userInfo, isAdmin]);

	return (
		<Box
			textAlign="center"
			sx={{
				backgroundColor: mode === "dark" ? "common.black" : "common.white",
				paddingTop: "59px",
				minHeight: "80vh",
				height: "100%",
				position: "relative",
			}}
		>
			<Box>{children}</Box>
			{!isAdmin && !isEmpty(userInfo) && (
				<Box
					sx={{
						position: "fixed",
						bottom: { xs: "80px", md: "100px" },
						right: { xs: "16px", md: "32px" },
						width: { xs: "90%", md: "400px" },
						maxWidth: "100%",
						zIndex: 1000,
						boxShadow: 5,
					}}
				>
					<CustomerChatBox />
				</Box>
			)}
		</Box>
	);
}
