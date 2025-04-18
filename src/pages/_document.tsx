import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
	DocumentInitialProps,
} from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "@helpers/createEmotionCache";

export default class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
		const originalRenderPage = ctx.renderPage;

		const cache = createEmotionCache();
		const { extractCriticalToChunks } = createEmotionServer(cache);

		ctx.renderPage = () =>
			originalRenderPage({
				enhanceApp: (App: any) => (props) => <App emotionCache={cache} {...props} />,
			});

		const initialProps = await Document.getInitialProps(ctx);
		const emotionChunks = extractCriticalToChunks(initialProps.html);

		const emotionStyleTags = emotionChunks.styles.map(
			(style: { key: string; ids: string[]; css: string }) => (
				<style
					data-emotion={`${style.key} ${style.ids.join(" ")}`}
					key={style.key}
					dangerouslySetInnerHTML={{ __html: style.css }}
				/>
			)
		);

		return {
			...initialProps,
			styles: [
				...(Array.isArray(initialProps.styles) ? initialProps.styles : [initialProps.styles]),
				...emotionStyleTags,
			],
		};
	}

	render() {
		return (
			<Html lang="en">
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
