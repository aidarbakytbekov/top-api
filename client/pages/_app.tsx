import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Router } from 'next/router';
import ym from 'react-yandex-metrika';
import { YMInitializer } from 'react-yandex-metrika';

import '../app/assets/styles/globals.scss';

Router.events.on('routeChangeComplete', (url: string) => {
	if (typeof window !== 'undefined') {
		ym('hit', url);
	}
});
function MyApp({ Component, pageProps, router }: AppProps): JSX.Element {
	return (
		<>
			<Head>
				<title>My top - наш лучший топ</title>
				<link rel="stylesheet" href="/favicon.ico" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link rel="preconnect" href="https://mc.yandex.ru" />
				<meta
					property="og:url"
					content={process.env.NEXT_PUBLIC_DOMAIN + router.asPath}
				/>
			</Head>
			<YMInitializer
				accounts={[]}
				options={{
					webvisor: true,
					defer: true,
				}}
				version="2"
			/>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
