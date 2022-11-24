import { Button } from '@components/ui/Button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

const StatsPage = () => {
	const router = useRouter();

	return (
		<motion.div
			className="no-select flex h-screen w-screen flex-col items-center justify-center bg-white p-10 font-spacemono text-black dark:bg-black dark:text-white"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}>
			<NextSeo title="Statistics" description="The Server Statistics Of A Thing." />
			<h1>I&apos;m stil building It.</h1>
			<Button width="fit" onClick={() => router.back()}>
				Return Home
			</Button>
		</motion.div>
	);
};

export default StatsPage;
