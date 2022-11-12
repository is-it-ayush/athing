import { Button } from '@components/ui/Button';
import { Navbar } from '@components/ui/Navbar';
import { getSession, trpc } from '@utils/trpc';
import { AnimatePresence, motion } from 'framer-motion';
import { GetServerSidePropsContext, NextPage } from 'next/types';
import React from 'react';
import { Journal } from './Journal';
import { Notes } from './Notes';
import { Private } from './Private';

// Components

export const App: NextPage = () => {
	const muatation = trpc.user.logout.useMutation();
	const [showPage, setShowPage] = React.useState(0);

	return (
		<AnimatePresence>
			<Navbar pageController={setShowPage} />
			<motion.div
				className="flex h-screen w-screen flex-col items-center justify-center font-spacemono"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				key="main"
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5 }}>
				{showPage === 0 ? <Notes /> : showPage === 1 ? <Journal /> : showPage === 2 ? <Private /> : <div>404</div>}
			</motion.div>
		</AnimatePresence>
	);
};

export default App;
