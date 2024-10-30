import { CacheProvider, ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import Head from "next/head";
import setGlobalStyles from "@styles/setGlobalStyles";
import Theme from "@styles/theme";
import PropTypes from "prop-types";
import { wrapper } from "@store/index"; // Import the wrapper and persistor
import "../styles/globals.css";
import createEmotionCache from "@helpers/createEmotionCache";
import MainLayout from "src/layouts/MainLayout";

const clientSideEmotionCache = createEmotionCache();

export function MyApp(props) {
	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

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
				<MainLayout>
					<Component {...pageProps} />
				</MainLayout>
			</ThemeProvider>
		</CacheProvider>
	);
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	emotionCache: PropTypes.instanceOf(Object),
	pageProps: PropTypes.instanceOf(Object).isRequired,
};

export default wrapper.withRedux(MyApp);
