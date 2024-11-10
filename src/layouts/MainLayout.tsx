import { MainLayoutProps } from "@common/interface";
import { Box } from "@mui/material";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import useAuthentication from "src/hooks/useAuthentication";

export default function MainLayout({ children }: MainLayoutProps) {
	const { theme: mode } = useSelector((state: any) => state.app);
	const { userInfo, isAdmin } = useAuthentication();
	const router = useRouter();

	useEffect(() => {
		if (isEmpty(userInfo) && !isAdmin && router.pathname.includes("/admin")) {
			router.push("/store");
		}
	}, []);

	return (
		<Box
			textAlign="center"
			sx={{
				backgroundColor: mode === "dark" ? "common.black" : "common.white",
				paddingTop: "59px",
				minHeight: "80vh",
				height: "100%",
			}}
		>
			<Box>{children}</Box>
		</Box>
	);
}
