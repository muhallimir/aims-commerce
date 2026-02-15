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
				paddingY: "59px",
				minHeight: "80vh",
				height: "100%",
				position: "relative",
			}}
		>
			<Box>{children}</Box>
			{!isAdmin && <CustomerChatBox />}
		</Box>
	);
}
