import { MainLayoutProps } from "@common/interface";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

export default function MainLayout({ children }: MainLayoutProps) {
	const { theme: mode } = useSelector((state: any) => state.app);

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
