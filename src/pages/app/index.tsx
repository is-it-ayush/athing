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
import { userInfo, noteModal, showModal, selectedNoteAtom, showToastAtom, showActionWheelAtom } from '@utils/store';
import { NoteModal } from '@components/ui/NoteModal';
import { Toast } from '@components/ui/Toast';
import { ActionWheel } from '@components/ui/ActionWheel';

export const App: NextPage = () => {
	const userInfoResponse = trpc.user.me.useQuery(void 0, {
		refetchOnWindowFocus: false, // Because it's not needed, since data doesn't change.
		refetchInterval: 1000 * 60 * 5, // 5 minutes
	});

	const [showPage, setShowPage] = React.useState(0);
	const [showMenu, setShowMenu] = React.useState(false);
	const [showLoading, setShowLoading] = React.useState(false);

	// Atoms
	const [, setUser] = useAtom(userInfo);
	const [displayModel] = useAtom(showModal);
	const [showActionWheel, setShowActionWheel] = useAtom(showActionWheelAtom);

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
		<main className="bg-cross-pattern font-spacemono">
			<AnimatePresence>
				{showLoading === true ? <FullLoad /> : null}
				<Navbar key="navigation" pageController={setShowPage} menuController={[showMenu, setShowMenu]} />
				<motion.div
					key="content"
					className="no-select flex min-h-screen flex-col font-spacemono"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1 }}>
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
					{showActionWheel ? null : (
						<Button
							type="button"
							onClick={() => {
								setShowActionWheel(true);
								// --todo-- make this have more options such as for journals too.
							}}
							flex="row"
							width="fit"
							styles="opposite">
							<IoAdd className="h-6 w-6" />
						</Button>
					)}
				</div>
				<AnimatePresence key="modalAnimation">
					{displayModel ? <NoteModal key="modalKey" /> : null}
					{displayToast ? <Toast key="toastKey" /> : null}
					{showActionWheel ? <ActionWheel key="actionWheelKey" /> : null}
				</AnimatePresence>
				<Menu key="menu" pageController={setShowPage} menuController={showMenu} />
			</AnimatePresence>
		</main>
	);
};

export default App;
