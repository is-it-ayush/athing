import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import TextareaAutosize from 'react-textarea-autosize';

// Atoms
import { showJournalModalAtom, showToastAtom, toastIntentAtom, toastMessageAtom } from '@utils/store';
import React, { useState } from 'react';
import { trpc } from '@utils/trpc';
import { handleError } from '@utils/client.util';
import { TRPCClientError } from '@trpc/client';

export const AddJournalBox = () => {
	const [, setShowAddJournalModal] = useAtom(showJournalModalAtom);
	const [, setToastIntent] = useAtom(toastIntentAtom);
	const [, setToastMessage] = useAtom(toastMessageAtom);
	const [, setShowToast] = useAtom(showToastAtom);

	const [isPrivate, setIsPrivate] = useState(false);
	const [titleText, setTitleText] = useState('');

	//trpc
	const createJournalMutation = trpc.journals.create.useMutation();
	const utils = trpc.useContext();

	async function handleCreateJournal() {
		try {
			await createJournalMutation.mutateAsync({
				title: titleText,
				isPrivate,
			});
			utils.journals.getJournalsByUserId.refetch();
			setToastIntent('success');
			setToastMessage('Your new journal has been created!');
			setShowToast(true);
			setShowAddJournalModal(false);
		} catch (err) {
			let message;
			if (err instanceof TRPCClientError) {
				message = await handleError(err);
			}
			setToastIntent('error');
			setToastMessage(message ? message : 'Something went wrong!');
			setShowToast(true);
		}
	}

	return (
		<motion.div
			className="fixed top-[50%] left-[50%] flex min-h-[300px] w-auto -translate-x-[50%] -translate-y-[50%] bg-white p-10"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}>
			<div className="m-5 flex flex-col">
				<div className="flex flex-col">
					<h1 className="my-2 text-sm">Title</h1>
					<TextareaAutosize
						value={titleText}
						onChange={(e) => {
							if (e.target.value.length < 50) {
								setTitleText(e.target.value);
							} else {
								setToastIntent('error');
								setToastMessage('Hey! Title can only contain 50 characters.');
								setShowToast(true);
							}
						}}
						className="h-[180px] w-[150px] resize-none overflow-hidden border-0 bg-white p-0 text-2xl placeholder-black placeholder:opacity-50 focus:border-0 focus:outline-none focus:ring-0"
						placeholder="Write your amazing title..."
						maxRows={7}
						maxLength={50}
						minLength={10}
					/>
				</div>
				<div className="absolute -bottom-5 left-[50%] flex -translate-x-[50%] flex-row gap-5">
					<button
						className="border-2 border-gray-300 bg-white px-5 py-2 text-black transition-colors duration-200 hover:border-white hover:bg-black hover:text-white"
						onClick={() => {
							handleCreateJournal();
						}}>
						Create
					</button>
					<button
						className={
							`w-[110px] border-2 border-gray-300 bg-white px-5 py-2 duration-200 hover:border-white ` +
							(isPrivate ? 'text-gray-900' : 'text-pink-600')
						}
						onClick={() => {
							setIsPrivate(!isPrivate);
						}}>
						{isPrivate ? 'Private' : 'Public'}
					</button>
					<button
						className="border-2 border-gray-300 bg-white px-5 py-2 text-black duration-200 hover:border-white hover:bg-black hover:text-white"
						onClick={() => {
							setShowAddJournalModal(false);
						}}>
						Cancel
					</button>
				</div>
			</div>
		</motion.div>
	);
};
