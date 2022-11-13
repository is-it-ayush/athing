import { Button } from '@components/ui/Button';
import { Menu } from '@components/ui/Menu';
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
	const [showMenu, setShowMenu] = React.useState(false);

	return (
		<AnimatePresence>
			<Navbar key="navigation" pageController={setShowPage} menuController={[showMenu, setShowMenu]} />
			<motion.div
				key="content"
				className="flex flex-col font-spacemono"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5 }}>
				{showPage === 0 ? <Notes /> : showPage === 1 ? <Journal /> : showPage === 2 ? <Private /> : <div>404</div>}
			</motion.div>
			<Menu key="menu" pageController={setShowPage} menuController={showMenu} />
		</AnimatePresence>
	);
};

export default App;
