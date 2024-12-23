import { AppProps } from "next/app";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import Head from "next/head";
import setGlobalStyles from "@styles/setGlobalStyles";
import Theme from "@styles/theme";
import { wrapper } from "@store/index"; // Import the wrapper and persistor
import "../styles/globals.css";
import createEmotionCache from "@helpers/createEmotionCache";
import MainLayout from "src/layouts/MainLayout";
import MainHeader from "src/components/headers/MainHeader";
import Footer from "src/components/footers/MainFooter";
import { useRouter } from "next/router";

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

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"
				/>
			</Head>
			<ThemeProvider theme={Theme}>
				{setGlobalStyles(Theme)}
				<CssBaseline />
				{isAdminView ? (
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
		</CacheProvider>
	);
};

export default wrapper.withRedux(MyApp);
