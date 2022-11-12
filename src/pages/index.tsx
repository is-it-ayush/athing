import React from 'react';
import { type NextPage } from 'next';
import { AnimatePresence, motion } from 'framer-motion';

const Home: NextPage = () => {
	const [pageLoad, setPageLoad] = React.useState(false);

	React.useEffect(() => {
		if (!pageLoad) {
			setPageLoad(true);
		}
	}, []);

	return (
		<AnimatePresence>
			<motion.div className="flex h-screen w-screen flex-col items-center justify-center font-spacemono">
				<motion.h1
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5 }}>
					This supposed to be the front page.
				</motion.h1>
			</motion.div>
		</AnimatePresence>
	);
};

export default Home;
