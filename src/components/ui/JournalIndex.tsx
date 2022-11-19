import { Entry } from '@prisma/client';
import { JournalEntryOnlyTitle } from '@utils/client.typing';
import {
	selectedEntryTypeAtom,
	selectedJournalAtom,
	showJournalIndexModalAtom,
	selectedEntryIdAtom,
	showEntryModalAtom,
	currentPageAtom,
	showToastAtom,
	toastIntentAtom,
	toastMessageAtom,
} from '@utils/store';
import { trpc } from '@utils/trpc';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { BiTrash } from 'react-icons/bi';
import { IoClose, IoTrash } from 'react-icons/io5';
import { Button } from './Button';

const JournalIndexAnimation = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
	},
};

export const JournalIndex = () => {
	// Atoms
	const [selectedJournal, setSelectedJournal] = useAtom(selectedJournalAtom);
	const [, setShowJournalIndexModal] = useAtom(showJournalIndexModalAtom);
	const [, setSelectedEntryType] = useAtom(selectedEntryTypeAtom);
	const [, setSelectedEntryId] = useAtom(selectedEntryIdAtom);
	const [, setShowEntryModal] = useAtom(showEntryModalAtom);
	const [, setCurrentPage] = useAtom(currentPageAtom);
	const [shownOnceWarning, setShownOnceWarning] = useState(false);

	// Toast
	const [, setDisplayToast] = useAtom(showToastAtom);
	const [, setToastIntent] = useAtom(toastIntentAtom);
	const [, setToastMessage] = useAtom(toastMessageAtom);

	//TRPC
	const entriesList = trpc.entry.getAll.useQuery({
		journalId: selectedJournal?.id ? selectedJournal.id : '',
	});

	const deleteJournal = trpc.journals.delete.useMutation();

	async function handleDeleteJournalMutation() {
		try {
			const res = await deleteJournal.mutateAsync({
				id: selectedJournal?.id ? selectedJournal.id : '',
			});
			if (res.result) {
				setShowJournalIndexModal(false);
				setDisplayToast(true);
				setToastIntent('success');
				setToastMessage('The Journal has been deleted.');
			}
		} catch (err) {
			setDisplayToast(true);
			setToastIntent('error');
			setToastMessage('There was an error deleting the journal.');
		}
	}

	return (
		<motion.div
			className="absolute top-0 left-0 flex min-h-screen w-screen items-center justify-center bg-black font-spacemono"
			initial={JournalIndexAnimation.hidden}
			animate={JournalIndexAnimation.visible}
			exit={JournalIndexAnimation.hidden}
			transition={{
				duration: 0.5,
			}}>
			<div className="absolute top-5 right-5 flex flex-row gap-5">
				<Button
					type="button"
					onClick={() => {
						if (!shownOnceWarning) {
							setCurrentPage(2);
							setShownOnceWarning(true);
							setDisplayToast(true);
							setToastIntent('warning');
							setToastMessage('This action cannot be undone.');
						} else {
							handleDeleteJournalMutation();
						}
					}}
					width="fit"
					styles="opposite">
					<BiTrash className="h-6 w-6" />
				</Button>
				<Button
					type="button"
					onClick={() => {
						setCurrentPage(2);
						setShowJournalIndexModal(false);
						setSelectedJournal(null);
					}}
					width="fit"
					styles="opposite">
					<IoClose className="h-6 w-6" />
				</Button>
			</div>
			<div className="flex flex-col items-center text-white">
				{entriesList.data ? (
					entriesList.data.length > 0 ? (
						entriesList.data.map((entry, i) => {
							return (
								<div
									key={entry.id}
									className="my-1 flex cursor-pointer"
									onClick={() => {
										setSelectedEntryType('view');
										setSelectedEntryId(entry.id);
										setShowEntryModal(true);
									}}>
									<h1 className="underline">
										Chapter {(i + 1).toString().toUpperCase()}.){' '}
										{entry.title.length > 20 ? entry.title.slice(0, 15) + '...' : entry.title}
									</h1>
								</div>
							);
						})
					) : (
						<div>
							<p>No entries found</p>
						</div>
					)
				) : (
					<div>
						<p>Connection Error!</p>
					</div>
				)}
			</div>
		</motion.div>
	);
};
