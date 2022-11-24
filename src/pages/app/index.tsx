import { Menu } from '@components/ui/Menu';
import { Navbar } from '@components/ui/Navbar';
import { trpc } from '@utils/trpc';
import { AnimatePresence, motion } from 'framer-motion';
import type { NextPage } from 'next/types';
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
import {
	userInfo,
	showModal,
	showToastAtom,
	showActionWheelAtom,
	showJournalModalAtom,
	showJournalIndexModalAtom,
	showEntryModalAtom,
	showJournalPickerAtom,
	currentPageAtom,
	allowPagesDisplayAtom,
	showFeedbackModalAtom,
	showCustomizationModalAtom,
	showSettingsModalAtom,
	showConfirmDialogAtom,
} from '@utils/store';
import { NoteModal } from '@components/ui/NoteModal';
import { Toast } from '@components/ui/Toast';
import { ActionWheel } from '@components/ui/ActionWheel';
import { AddJournalBox } from '@components/ui/AddJournalBox';
import { JournalIndex } from '@components/ui/JournalIndex';
import { EntryModal } from '@components/ui/EntryModal';
import { JournalPicker } from '@components/ui/JournalPicker';
import { Secret } from '@components/ui/Secret';
import { FeedbackModal } from '@components/ui/FeedbackModal';
import { Customization } from '@components/ui/Customization';
import { Settings } from '@components/ui/Settings';
import getTheme from '@utils/PatternController';
import { Confirm } from '@components/ui/Confirm';
import { NextSeo } from 'next-seo';

export const App: NextPage = () => {
	const userInfoResponse = trpc.user.me.useQuery(void 0, {
		refetchOnWindowFocus: false, // Because it's not needed, since data doesn't change.
		refetchInterval: 1000 * 60 * 5, // 5 minutes
	});

	// Atoms
	const [user, setUser] = useAtom(userInfo);
	const [showPage] = useAtom(currentPageAtom);
	const [allowPagesDisplay] = useAtom(allowPagesDisplayAtom);
	const [displayModel] = useAtom(showModal);
	const [showActionWheel, setShowActionWheel] = useAtom(showActionWheelAtom);
	const [showAddJounralModal] = useAtom(showJournalModalAtom);
	const [showJournalIndexModal] = useAtom(showJournalIndexModalAtom);
	const [showEntryModal] = useAtom(showEntryModalAtom);
	const [showJournalPickerModal] = useAtom(showJournalPickerAtom);
	const [displayToast] = useAtom(showToastAtom);
	const [showFeedback] = useAtom(showFeedbackModalAtom);
	const [showCustomizationModal] = useAtom(showCustomizationModalAtom);
	const [showSettingsModal] = useAtom(showSettingsModalAtom);
	const [showConfirmDialog] = useAtom(showConfirmDialogAtom);

	React.useEffect(() => {
		if (userInfoResponse.data) {
			setUser(userInfoResponse.data);
		}
	}, [userInfoResponse.data]);

	return (
		<main className={`no-scrollbar font-spacemono ` + getTheme(user.styling)}>
			{allowPagesDisplay ? (
				<>
					<NextSeo title="App" />
					<Navbar key="navigation" />
					<motion.div
						key="content"
						className="no-select flex min-h-screen flex-col font-spacemono"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 1 }}>
						<AnimatePresence>
							{showPage === 0 ? <Notes /> : showPage === 1 ? <Journal /> : showPage === 2 ? <Private /> : <Secret />}
						</AnimatePresence>
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
				</>
			) : null}
			<AnimatePresence key="modalAnimation">
				{displayModel ? <NoteModal key="modalKey" /> : null}
				{displayToast ? <Toast key="toastKey" /> : null}
				{showActionWheel ? <ActionWheel key="actionWheelKey" /> : null}
				{showAddJounralModal ? <AddJournalBox key="addJournalBoxKey" /> : null}
				{showJournalIndexModal ? <JournalIndex key="journalIndexKey" /> : null}
				{showEntryModal ? <EntryModal key="entryModalKey" /> : null}
				{showJournalPickerModal ? <JournalPicker key="journalPickerKey" /> : null}
				{showFeedback ? <FeedbackModal key="feedbackModalKey" /> : null}
				{showCustomizationModal ? <Customization key="customizationModalKey" /> : null}
				{showSettingsModal ? <Settings key="settingsModalKey" /> : null}
				{showConfirmDialog ? <Confirm key="confirmDialogKey" /> : null}
			</AnimatePresence>
			<Menu key="menu" />
		</main>
	);
};

export default App;
