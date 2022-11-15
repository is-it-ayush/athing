import React from 'react';
import { Toast } from './Toast';
import { trpc } from '@utils/trpc';
import { TRPCError } from '@trpc/server';
import { handleError } from '@utils/client.util';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './Button';

// Atoms
import { userInfo } from '@utils/store';

// Icons
import { RiSaveLine } from 'react-icons/ri';
import { BiLockOpenAlt, BiLockAlt } from 'react-icons/bi';

// Types
import { NoteModalProps, ToastIntent } from '@utils/client.typing';
import { useAtom } from 'jotai';

export const NoteModal = ({ type, controller, selectedNote }: NoteModalProps) => {
	// Edit Properties
	const selectedText = selectedNote?.text;
	const selectedStatus = selectedNote?.isPublished;

	// Add Properties
	const [text, setText] = React.useState(selectedText ?? '');
	const [isNotePrivate, setIsNotePrivate] = React.useState(!selectedStatus ?? false);

	const createNoteMutation = trpc.post.create.useMutation();
	const updateNoteMutation = trpc.post.edit.useMutation();

	// Helpers
	const utils = trpc.useContext();
	const [user, setUser] = useAtom(userInfo);

	React.useEffect(() => {
		if (isNotePrivate) {
			setShowToast(true);
			setToastIntent('info');
			setToastMessage('Your note is now private.');
		} else {
			setShowToast(true);
			setToastIntent('info');
			setToastMessage('Your note is now public.');
		}

		setTimeout(() => {
			setShowToast(false);
		}, 2000);
	}, [isNotePrivate]);

	async function handleNoteSave() {
		try {
			let res;
			if (selectedNote !== undefined) {
				res = await updateNoteMutation.mutateAsync({ id: selectedNote.id, text, isPrivate: isNotePrivate });
			} else {
				res = await createNoteMutation.mutateAsync({ text, isPrivate: isNotePrivate });
			}
			if (res.result) {
				setToastIntent('success');
				setToastMessage('The note was saved successfully.');
				setShowToast(true);

				// Invalidate the query
				utils.post.get.refetch();
				utils.post.getAllByUserId.refetch({ id: user.id });

				setTimeout(() => {
					controller(false);
				}, 500);
			}
		} catch (err: TRPCError | any) {
			const errorMessage = (await handleError(err)) as string;
			setToastIntent('error');
			setToastMessage(errorMessage);
			setShowToast(true);
		}
	}

	// Required Toast State
	const [showToast, setShowToast] = React.useState(false);
	const [toastIntent, setToastIntent] = React.useState<ToastIntent>('success');
	const [toastMessage, setToastMessage] = React.useState('');

	// Exceed Handler
	React.useEffect(() => {
		if (text.length >= 3000) {
			setToastIntent('error');
			setToastMessage('Your note is too long! Checkout Journals?');
			setShowToast(true);
		} else {
			setShowToast(false);
		}
	}, [text]);

	return (
		<motion.div
			className="font-monospace fixed top-0 left-0 flex h-screen w-screen bg-white text-black"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}>
			{
				<div className="fixed top-0 left-0 flex h-3 w-screen">
					<span
						className="transition-all duration-300 "
						style={{
							backgroundColor: '#000000',
							width: `${(text.length / 3000) * 100}%`,
						}}></span>
				</div>
			}
			<div className="fixed bottom-[10%] right-5 flex flex-col lg:top-5">
				<Button
					flex="row"
					type="button"
					onClick={() => {
						controller(false);
					}}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</Button>
				{type === 'add' || type === 'edit' ? (
					<>
						<Button
							flex="row"
							type="button"
							onClick={() => {
								handleNoteSave();
							}}>
							<RiSaveLine className="h-6 w-6" />
						</Button>
						<Button
							flex="row"
							type="button"
							onClick={() => {
								setIsNotePrivate(!isNotePrivate);
							}}>
							{isNotePrivate ? (
								<BiLockAlt className="h-6 w-6 text-red-600 " />
							) : (
								<BiLockOpenAlt className="h-6 w-6 text-green-600" />
							)}
						</Button>
					</>
				) : null}
			</div>
			{
				// Add Note Modal
				type === 'edit' || type === 'add' ? (
					// Textarea
					<textarea
						className="h-full w-full p-20"
						placeholder="hey, it'll get better. tell me all about it!!!"
						minLength={20}
						maxLength={3000}
						value={text}
						onChange={(e) => {
							setText(e.target.value);
						}}
					/>
				) : type === 'parse' ? (
					<textarea
						readOnly={true}
						className="h-full w-full p-20"
						placeholder="hey, it'll get better. tell me all about it!!!"
						minLength={20}
						maxLength={3000}
						value={selectedNote?.text}
					/>
				) : null
			}
			<AnimatePresence>
				{showToast ? (
					<Toast
						key="toastKey"
						intent={toastIntent}
						message={toastMessage}
						onClose={() => {
							setShowToast(!showToast);
						}}
					/>
				) : null}
			</AnimatePresence>
		</motion.div>
	);
};
