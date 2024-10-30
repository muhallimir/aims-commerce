import { Container } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef, useState } from "react";
import { useTheme } from "@emotion/react";
import BannerCard from "../cards/BannerCard";
import { useSelector } from "react-redux";

const BannerCarousel = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const { banner } = useSelector(({ productLists }) => productLists);
	const theme = useTheme();
	const swiperRef = useRef(null);

	const settings = {
		loop: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		onBeforeInit: (swiper) => (swiperRef.current = swiper),
		onSlideChange: (swiper) => setCurrentIndex(swiper.realIndex),
	};

	return (
		<>
			<Container
				maxWidth="xl"
				sx={{
					px: { xs: 0 },
					position: "relative",
					height: "100%",
					".swiper-slide": {
						aspectRatio: "1600/460",
						[theme.breakpoints.down("767")]: {
							aspectRatio: "750 / 400",
						},
						".slide-image": {
							aspectRatio: "1600/460",
							[theme.breakpoints.down("767")]: {},
						},
					},
					".swiper-controls": {
						display: "block",
						position: "absolute",
						right: "15px",
						bottom: "24px",
						zIndex: 1,
						ul: {
							display: "flex",
							listStyle: "none",
							columnGap: "var(--spacing0d25Rem)",
							margin: 0,
							padding: 0,
							lineHeight: "var(--spacing0d125Rem)",
						},
						".swiper-arrow-btns": {
							display: "none",
							alignItems: "center",
							justifyContent: "flex-end",
							columnGap: "var(--spacing0d5Rem)",
							marginBottom: "var(--spacing2d375Rem)",

							".swiper-arrow-btn": {
								backgroundColor:
									theme.mode === "dark" ? "var(--base20)" : "var(--base80)",
								borderRadius: "var(--radiusFull)",
								color:
									theme.mode === "dark" ? "var(--base100)" : "var(--base20)",
								cursor: "pointer",
								border: 0,
								padding: 0,
								"&:hover": {
									backgroundColor:
										theme.mode === "dark" ? "var(--base30)" : "var(--base70)",
								},
								"&:active": {
									backgroundColor:
										theme.mode === "dark" ? "var(--base40)" : "var(--base60)",
								},

								[theme.breakpoints.up("sm")]: {
									height: "36px",
									width: "36px",
								},
								[theme.breakpoints.up("md")]: {
									height: "48px",
									width: "48px",
								},
							},

							[theme.breakpoints.down("md")]: {
								display: "none !important",
							},
						},
						".swiper-custom-dot": {
							height: "var(--spacing0d125Rem)",
							width: "var(--spacing3d5Rem)",
							backgroundColor: `${
								theme.mode === "dark" ? "var(--base20)" : "var(--base80)"
							}`,
							borderRadius: "var(--radiusFull)",
							border: 0,
							padding: 0,
							position: "relative",
							cursor: "pointer",
							verticalAlign: "top",
							"&--loading:before": {
								content: '""',
								display: "block",
								width: "100%",
								height: "100%",
								animation: "loading 5s ease-out",
								backgroundColor: `${
									theme.mode === "dark" ? "var(--base100)" : "var(--base0)"
								}`,
							},
						},
						[theme.breakpoints.down("sm")]: {
							display: "none",
						},
						[theme.breakpoints.up("sm")]: {
							right: "18px",
							bottom: "30px",
						},
						[theme.breakpoints.up("md")]: {
							right: "24px",
							bottom: "40px",
						},
					},
					"&:hover .swiper-arrow-btns": {
						display: "flex",
					},
					"@keyframes loading": {
						from: {
							width: "0%",
						},
						to: {
							width: "100%",
						},
					},
				}}
			>
				<Swiper {...settings}>
					{banner?.map((item) => {
						return (
							<SwiperSlide key={item?._id.toString()}>
								<BannerCard
									_id={item?._id}
									image={item?.image}
									alt={item?.alt}
									mobileIMG={item?.image_mobile}
								/>
							</SwiperSlide>
						);
					})}
					{Array.isArray(banner) && banner.length > 1 && (
						<div className="swiper-controls">
							<div className="swiper-arrow-btns">
								<button
									onClick={() => swiperRef.current?.slidePrev()}
									className="swiper-arrow-btn swiper-arrow-btn--prev"
								>
									<ArrowBackIosIcon fontSize="small" />
								</button>
								<button
									onClick={() => swiperRef.current?.slideNext()}
									className="swiper-arrow-btn swiper-arrow-btn--next"
								>
									<ArrowForwardIosIcon fontSize="small" />
								</button>
							</div>
							<ul>
								{(banner || []).map((item, key) => (
									<li key={item?._id.toString()}>
										<button
											className={`swiper-custom-dot ${
												currentIndex === key
													? "swiper-custom-dot--loading"
													: null
											}`}
											onClick={() => swiperRef.current?.slideTo(key)}
											aria-label="slide dot"
										></button>
									</li>
								))}
							</ul>
						</div>
					)}
				</Swiper>
			</Container>
		</>
	);
};

export default BannerCarousel;
