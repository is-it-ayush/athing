import React from 'react';
import { type NextPage } from 'next';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

const Home: NextPage = () => {
	return (
		<AnimatePresence>
			<motion.div className="flex h-screen w-screen flex-col items-center justify-center font-spacemono">
				<motion.h1
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5 }}>
					<div className="flex flex-col">
						<h1 className="flex text-center">I'm still working on it, btw you're amazing :{')'}</h1>
					</div>
					<div className="fixed bottom-5 left-0 flex w-full items-center justify-center">
						<h1 className="flex">
							Twitter:{' '}
							<Link href="https://twitter.com/is_it_ayush" target="_blank">
								<h1 className="text-blue-500 mx-2">@is_it_ayush</h1>
							</Link>
						</h1>
					</div>
				</motion.h1>
			</motion.div>
		</AnimatePresence>
	);
};

export default Home;
