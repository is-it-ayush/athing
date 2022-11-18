import {
	currentPageAtom,
	selectedEntryAtom,
	selectedEntryIdAtom,
	selectedEntryTypeAtom,
	selectedJournalAtom,
	showEntryModalAtom,
	showJournalPickerAtom,
	showToastAtom,
	toastIntentAtom,
	toastMessageAtom,
} from '@utils/store';
import { trpc } from '@utils/trpc';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { IoClose, IoSave } from 'react-icons/io5';
import { RiSaveLine } from 'react-icons/ri';
import TextareaAutosize from 'react-textarea-autosize';
import { formatDate } from '@utils/client.util';
import React from 'react';
import { CgArrowsExchangeAlt } from 'react-icons/cg';

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
	const [entryType] = useAtom(selectedEntryTypeAtom);
	const [selectedEntry, setSelectedEntry] = useAtom(selectedEntryAtom);
	const [selectedEntryId, setSelectedEntryId] = useAtom(selectedEntryIdAtom);
	const [selectedJournal, setSelectedJournal] = useAtom(selectedJournalAtom);
	const [, setShowJournalPickerModal] = useAtom(showJournalPickerAtom);
	const [, setCurrentPage] = useAtom(currentPageAtom);

	// Local Component State
	const [text, setText] = useState('');
	const [title, setTitle] = useState('');
	const [journalId, setJournalId] = useState('');

	// tRPC
	const createEntryMutation = trpc.entry.create.useMutation();
	// This is supposed to never error because this will always be updated before EntryModal is opened.
	const fetchEntryById = trpc.entry.getOne.useQuery({
		entryId: selectedEntryId,
	});

	React.useEffect(() => {
		if (fetchEntryById.data) {
			setSelectedEntry(fetchEntryById.data);
		}
	}, [fetchEntryById.data]);

	// Toast
	const [, setDisplayToast] = useAtom(showToastAtom);
	const [, setToastIntent] = useAtom(toastIntentAtom);
	const [, setToastMessage] = useAtom(toastMessageAtom);

	React.useEffect(() => {
		if (selectedJournal) {
			setJournalId(selectedJournal.id);
		}
	}, [selectedJournal]);

	async function handleCreateEntry() {
		try {
			const res = await createEntryMutation.mutateAsync({
				title,
				content: text,
				journalId: journalId,
			});
			if (res.result) {
				setDisplayToast(true);
				setToastIntent('success');
				setToastMessage('The entry has been added to the journal.');
				setCurrentPage(0);
				setShowEntryModal(false);
			}
		} catch (err) {
			// --todo-- create client side error handling.
			setToastIntent('error');
			setToastMessage('There was an error creating your entry.');
			setDisplayToast(true);
		}
	}

	return (
		<motion.div
			className="font-monospace z-998 absolute top-0 left-0 flex min-h-screen  w-screen flex-col items-center overflow-y-auto bg-white p-10 text-black"
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
						setCurrentPage(0);
						if (entryType === 'edit') {
							setSelectedJournal(null);
						}
						setShowEntryModal(false);
					}}>
					<IoClose className="h-6 w-6" />
				</button>
				{entryType === 'edit' ? (
					<>
						<button
							className="flex flex-col items-center rounded-full border-2 border-gray-200 p-4"
							type="button"
							onClick={() => {
								if (journalId.length < 1) {
									setDisplayToast(true);
									setToastIntent('error');
									setToastMessage('No Journal has been selected!');
								} else {
									handleCreateEntry();
								}
							}}>
							<RiSaveLine className="h-6 w-6" />
						</button>
						<button
							className="flex flex-col items-center rounded-full border-2 border-gray-200 p-4"
							type="button"
							onClick={() => {
								setShowJournalPickerModal(true);
							}}>
							<CgArrowsExchangeAlt className="h-6 w-6" />
						</button>
					</>
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
						<h1 className="flex text-center">This is a easter egg. You aren't supposed to see this!</h1>
					</div>
				)
			}
		</motion.div>
	);
};
