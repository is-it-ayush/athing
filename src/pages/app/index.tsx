import { Menu } from '@components/ui/Menu';
import { Navbar } from '@components/ui/Navbar';
import { trpc } from '@utils/trpc';
import { AnimatePresence, motion } from 'framer-motion';
import { NextPage } from 'next/types';
import React from 'react';
import { Journal } from '@components/pages/Journal';
import { Notes } from '@components/pages/Notes';
import { Private } from '@components/pages/Private';
import { useAtom } from 'jotai';
import { FullLoad } from '@components/ui/FullLoad';
import { Button } from '@components/ui/Button';

// Icons
import { IoAdd } from 'react-icons/io5';

// Atoms
import { userInfo, noteModal, showModal, selectedNoteAtom, showToastAtom } from '@utils/store';
import { NoteModal } from '@components/ui/NoteModal';
import { Toast } from '@components/ui/Toast';

export const App: NextPage = () => {
	const userInfoResponse = trpc.user.me.useQuery(void 0, {
		refetchOnWindowFocus: false,
		refetchInterval: 1000 * 60 * 5,
	});
	const [showPage, setShowPage] = React.useState(0);
	const [showMenu, setShowMenu] = React.useState(false);
	const [showLoading, setShowLoading] = React.useState(false);

	const [, setUser] = useAtom(userInfo);
	const [, setNoteModalType] = useAtom(noteModal);
	const [displayModel, setDisplayModal] = useAtom(showModal);
	const [, setSelectedNoteAtom] = useAtom(selectedNoteAtom);

	const [displayToast] = useAtom(showToastAtom);

	React.useEffect(() => {
		if (userInfoResponse.isLoading) {
			setShowLoading(true);
		} else {
			setShowLoading(false);
		}
	}, [userInfoResponse.isLoading]);

	React.useEffect(() => {
		if (userInfoResponse.data) {
			setUser(userInfoResponse.data);
		}
	}, [userInfoResponse.data]);

	return (
		<main className="font-spacemono">
			<AnimatePresence>
				{showLoading === true ? <FullLoad /> : null}
				<Navbar key="navigation" pageController={setShowPage} menuController={[showMenu, setShowMenu]} />
				<motion.div
					key="content"
					className="flex flex-col font-spacemono"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5 }}>
					{showPage === 0 ? (
						<Notes />
					) : showPage === 1 ? (
						<Journal />
					) : showPage === 2 ? (
						<Private />
					) : (
						<div className="text-2xl font-semibold">You aren't supposed to be here</div>
					)}
				</motion.div>
				<div key="actionButton" className="fixed bottom-10 right-10 flex flex-col">
					<Button
						type="button"
						onClick={() => {
							// --todo-- make this have more options such as for journals too.
							setSelectedNoteAtom(null);
							setNoteModalType('edit');
							setDisplayModal(true);
						}}
						flex="row"
						width="fit"
						styles="opposite">
						<IoAdd className="h-6 w-6" />
					</Button>
				</div>
				<AnimatePresence key="modalAnimation">
					{displayModel ? <NoteModal key="modalKey" /> : null}
					{displayToast ? <Toast key="toastKey" /> : null}
				</AnimatePresence>
				<Menu key="menu" pageController={setShowPage} menuController={showMenu} />
			</AnimatePresence>
		</main>
	);
};

export default App;
