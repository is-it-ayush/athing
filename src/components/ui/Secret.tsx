import { motion } from 'framer-motion';
import React, { useState } from 'react';

async function generateRandomChance() {
	const randomChance = Math.floor(Math.random() * 100); // This would be the random number between 0 and 100
	return randomChance;
}

export const Secret = () => {
	const [pageLoad, setPageLoad] = useState(false);
	const [rng, setRng] = useState(0);

	return (
		<motion.div
			className="mt-[60px] flex w-screen flex-col overflow-hidden p-10 font-spacemono"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}>
			{rng < 10 ? (
				<div className="flex flex-col items-center justify-center">
					<h1 className="flex text-center text-xl font-bold">
						WAIT WHAT? you aren&apos;t supposed to be here. I don&apos;t do easter eggs. Or Do I?. :(
					</h1>
				</div>
			) : null}
		</motion.div>
	);
};
