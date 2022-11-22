import {
	allowPagesDisplayAtom,
	selectedEntryIdAtom,
	selectedEntryTypeAtom,
	selectedJournalAtom,
	showEntryModalAtom,
	showJournalIndexModalAtom,
	showJournalPickerAtom,
	showToastAtom,
	toastIntentAtom,
	toastMessageAtom,
	userInfo,
} from '@utils/store';
import { trpc } from '@utils/trpc';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { RiSaveLine } from 'react-icons/ri';
import TextareaAutosize from 'react-textarea-autosize';
import { FiEdit3 } from 'react-icons/fi';
import React from 'react';
import { CgArrowsExchangeAlt } from 'react-icons/cg';
import { TRPCClientError } from '@trpc/client';
import type { Entry } from '@prisma/client';
import { handleError } from '@utils/client.util';

const EntryModalAnimations = {
	hidden: {
		x: '-100%',
	},
	visible: {
		x: 0,
	},
};

export const EntryModal = () => {
	const [, setShowEntryModal] = useAtom(showEntryModalAtom);
	const [, setAllowPagesDisplay] = useAtom(allowPagesDisplayAtom);
	const [showJournalIndexModal] = useAtom(showJournalIndexModalAtom);

	const [entryType, setEntryType] = useAtom(selectedEntryTypeAtom);
	const [selectedEntry, setSelectedEntry] = useState<Entry>();
	const [selectedEntryId, setSelectedEntryId] = useAtom(selectedEntryIdAtom);
	const [selectedJournal, setSelectedJournal] = useAtom(selectedJournalAtom);

	const [user] = useAtom(userInfo);
	const [, setShowJournalPickerModal] = useAtom(showJournalPickerAtom);
	const [switched, setSwitched] = useState(false);

	const [hasShownExitWarning, setHasShownExitWarning] = useState(false);

	// Toast
	const [, setDisplayToast] = useAtom(showToastAtom);
	const [, setToastIntent] = useAtom(toastIntentAtom);
	const [, setToastMessage] = useAtom(toastMessageAtom);

	// Local Component State
	const [text, setText] = useState('');
	const [title, setTitle] = useState('');

	//TRPC
	const utils = trpc.useContext();
	const createEntryMutation = trpc.entry.create.useMutation();
	const updateEntryMutation = trpc.entry.update.useMutation();
	const getEntryDetailsQuery = trpc.entry.getOne.useQuery(
		{
			entryId: selectedEntryId,
		},
		{
			enabled: selectedEntryId !== '',
		},
	);

	async function handleSwitchToEdit() {
		setSwitched(true);
		setEntryType('edit');
	}

	async function handleUpdateEntryMutation() {
		try {
			await updateEntryMutation.mutateAsync({
				entryId: selectedEntryId,
				title,
				content: text,
			});
			utils.entry.getAll.refetch();
			setToastIntent('success');
			setToastMessage('The entry was updated successfully!');
			setDisplayToast(true);
		} catch (err) {
			const message = await handleError(err);
			setToastIntent('error');
			setToastMessage(message);
			setDisplayToast(true);
		} finally {
			setSelectedEntryId('');
			if (!showJournalIndexModal) {
				setSelectedJournal(null);
			}
			setAllowPagesDisplay(true);
			setShowEntryModal(false);
		}
	}

	/**
	 * This function is called when the user clicks the X button.
	 * Reset's the global variables and closes the modal.
	 */
	async function handleCloseModal() {
		if (entryType === 'edit' && hasShownExitWarning === false) {
			setHasShownExitWarning(true);
			setToastIntent('warning');
			setToastMessage('Are you sure you want to exit? Your changes will not be saved.');
			setDisplayToast(true);
			return;
		}

		if (!showJournalIndexModal) {
			setAllowPagesDisplay(true);
		}

		setShowEntryModal(false);
		if (!showJournalIndexModal) {
			setSelectedJournal(null);
		}
		setSelectedEntryId('');
		setEntryType(null);
	}

	/**
	 * This will create the entry and close the modal and reset the global state.
	 * It'll also warn the journal is not selected.
	 */
	async function handleCreateEntryMutation() {
		if (selectedJournal?.id) {
			try {
				await createEntryMutation.mutateAsync({
					content: text,
					journalId: selectedJournal.id,
					title,
				});
				setToastIntent('success');
				setToastMessage('The entry was successfully created!');
				setDisplayToast(true);
				setSelectedEntryId('');
				if (!showJournalIndexModal) {
					setSelectedJournal(null);
				}
				setAllowPagesDisplay(true);
				setShowEntryModal(false);
			} catch (err) {
				const message = await handleError(err);
				setToastIntent('error');
				setToastMessage(message);
				setDisplayToast(true);
			}
		} else {
			setToastIntent('error');
			setToastMessage('Hey! You need to select a journal first.');
			setDisplayToast(true);
		}
	}

	useEffect(() => {
		if (entryType === 'view') {
			setSelectedEntry(getEntryDetailsQuery.data);
		} else if (entryType === 'edit') {
			if (selectedEntry) {
				setText(selectedEntry.text);
				setTitle(selectedEntry.title);
			}
		}
	}, [entryType, getEntryDetailsQuery.isInitialLoading]);

	return (
		<motion.div
			className="font-monospace z-998 absolute top-0 left-0 z-[997] flex min-h-screen w-screen flex-col items-center overflow-y-auto bg-white p-10 text-black"
			initial={EntryModalAnimations.hidden}
			animate={EntryModalAnimations.visible}
			exit={EntryModalAnimations.hidden}
			transition={{
				duration: 0.3,
			}}>
			<div className="my-2 flex flex-row gap-5">
				<button
					className="flex flex-col items-center rounded-full border-2 border-gray-200 p-4"
					type="button"
					onClick={() => {
						handleCloseModal();
					}}>
					<IoClose className="h-6 w-6" />
				</button>
				{entryType === 'edit' ? (
					<>
						<button
							className="flex flex-col items-center rounded-full border-2 border-gray-200 p-4"
							type="button"
							onClick={() => {
								setShowJournalPickerModal(true);
							}}>
							<CgArrowsExchangeAlt className="h-6 w-6" />
						</button>
						<button
							className="flex flex-col items-center rounded-full border-2 border-gray-200 p-4"
							type="button"
							onClick={() => {
								if (!switched) {
									handleCreateEntryMutation();
								} else {
									handleUpdateEntryMutation();
								}
							}}>
							<RiSaveLine className="h-6 w-6" />
						</button>
					</>
				) : entryType === 'view' && user.id === getEntryDetailsQuery.data?.authorId ? (
					<button
						className="flex flex-col items-center rounded-full border-2 border-gray-200 p-4"
						type="button"
						onClick={() => {
							handleSwitchToEdit();
						}}>
						<FiEdit3 className="h-6 w-6" />
					</button>
				) : null}
			</div>
			<div className="my-2 flex text-start">
				<h1 className="text-sm font-semibold">Title</h1>
			</div>
			{
				// This is where the parsing and editing logic would go!!
				entryType === 'view' ? (
					<div className="flex h-full max-w-[600px] flex-col ">
						<TextareaAutosize
							className="flex w-full resize-none border-none text-4xl font-bold text-black underline outline-none focus:border-none focus:ring-white"
							placeholder="Today was a crazy day!"
							minLength={10}
							maxLength={40}
							readOnly={true}
							value={selectedEntry?.title}
						/>
						<TextareaAutosize
							className="prose my-3 flex w-full resize-none overflow-hidden border-none outline-none focus:ring-0"
							placeholder="This is my diary entry..."
							minLength={20}
							maxLength={3000}
							readOnly={true}
							value={selectedEntry?.text}
						/>
					</div>
				) : entryType === 'edit' ? (
					<div className="flex h-full max-w-[600px] flex-col ">
						<TextareaAutosize
							className="flex w-full resize-none border-none text-4xl font-bold text-black underline outline-none focus:border-none focus:ring-white"
							placeholder="Today was a crazy day!"
							minLength={10}
							maxLength={40}
							value={title}
							onChange={(e) => {
								if (e.target.value.length < 40) {
									setTitle(e.target.value);
								} else {
									setToastIntent('error');
									setToastMessage('The title cannot be longer than 40 characters.');
									setDisplayToast(true);
								}
							}}
						/>
						<TextareaAutosize
							className="prose my-3 flex w-full resize-none overflow-hidden border-none outline-none focus:ring-0"
							placeholder="This is my diary entry..."
							minLength={20}
							maxLength={3000}
							value={text}
							onChange={(e) => {
								if (e.target.value.length < 3001) {
									setText(e.target.value);
								} else {
									setToastIntent('error');
									setToastMessage('The posts cannot be longer than 6000 characters.');
									setDisplayToast(true);
								}
							}}
						/>
					</div>
				) : (
					<div className="flex h-full flex-col items-center justify-center">
						<h1 className="flex text-center">This is a easter egg. You aren&apos;t supposed to see this!</h1>
					</div>
				)
			}
		</motion.div>
	);
};
