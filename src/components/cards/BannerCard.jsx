import { Grid } from "@mui/material";
import Image from "next/image";
import useScreenSize from "src/hooks/useScreenSize";

const BannerCard = (props) => {
	// const theme = useTheme();
	const { _id, image, mobileIMG, alt } = props;
	const { lg, md, sm, xs } = useScreenSize();

	const getImageDimensions = () => {
		if (xs) return { width: 430, height: 200 };
		if (sm) return { width: 768, height: 260 };
		if (md) return { width: 1024, height: 346.353 };
		if (lg) return { width: 1366, height: 460 };
		return { width: 1596, height: 460 };
	};

	const { width, height } = getImageDimensions();

	return (
		<>
			<Grid
				id="test_id"
				container
				sx={{
					marginTop: "0 !important",
					alignItems: "center",
					display: "block !important",
					width: "100%",
					height: "100%",
					maxHeight: "100%",
					overflow: "hidden",
					cursor: "pointer",
				}}
				xs={12}
			>
				<Grid
					container
					item
					xs={12}
					sx={{ width: "100%", height: "100%", padding: 0, margin: 0 }}
				>
					<Image
						src={xs && _id === 1 ? mobileIMG : image}
						layout="fixed"
						objectFit="cover"
						width={width}
						height={height}
						alt={alt}
						priority={_id === 1 ? true : false}
						quality={75}
						className="slide-image"
					/>
				</Grid>
			</Grid>
		</>
	);
};

export default BannerCard;
