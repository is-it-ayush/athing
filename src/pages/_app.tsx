import { type AppType } from 'next/app';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { trpc } from '../utils/trpc';
import '../styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<>
			<Component {...pageProps} />
			<ReactQueryDevtools initialIsOpen={false} />
		</>
	);
};

export default trpc.withTRPC(MyApp);
