import { AppProps } from "next/app";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import Head from "next/head";
import Script from "next/script";
import setGlobalStyles from "@styles/setGlobalStyles";
import Theme from "@styles/theme";
import { wrapper } from "@store/index";
import "../styles/globals.css";
import createEmotionCache from "@helpers/createEmotionCache";
import MainLayout from "src/layouts/MainLayout";
import MainHeader from "src/components/headers/MainHeader";
import Footer from "src/components/footers/MainFooter";
import { useRouter } from "next/router";
import { useGoogleAuth } from "src/hooks/useGoogleAuth";
import { Analytics } from '@vercel/analytics/next';

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
	emotionCache?: typeof clientSideEmotionCache;
}

const MyApp = ({
	Component,
	emotionCache = clientSideEmotionCache,
	pageProps,
}: MyAppProps) => {
	const router = useRouter();
	const isAdminView = router.pathname.includes("/admin");
	const isSellerDashboard = router.pathname.includes("/seller/dashboard");
	const { initializeGoogle } = useGoogleAuth();

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"
				/>
			</Head>
			<Script
				src="https://accounts.google.com/gsi/client"
				strategy="afterInteractive"
				onLoad={() => {
					initializeGoogle();
				}}
				onError={() => {
					console.error("Failed to load Google Sign-In script");
				}}
			/>
			<ThemeProvider theme={Theme}>
				{setGlobalStyles(Theme)}
				<CssBaseline />
				{isAdminView || isSellerDashboard ? (
					<Component {...pageProps} />
				) : (
					<>
						<MainLayout>
							<MainHeader />
							<Component {...pageProps} />
						</MainLayout>
						<Footer />
					</>
				)}
			</ThemeProvider>
			<Analytics />
		</CacheProvider>
	);
};

export default wrapper.withRedux(MyApp);
