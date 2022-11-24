import { type AppType } from 'next/app';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { trpc } from '../utils/trpc';
import '../styles/globals.css';
import SEO from '../../next-seo';
import { DefaultSeo } from 'next-seo';

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<>
			<DefaultSeo {...SEO} />
			<Component {...pageProps} />
			<ReactQueryDevtools initialIsOpen={false} />
		</>
	);
};

export default trpc.withTRPC(MyApp);
