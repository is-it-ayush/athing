import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { Button } from './Button';

// Icons
import { RiSaveLine } from 'react-icons/ri';
import { Toast, ToastIntent } from './Toast';
import { trpc } from '@utils/trpc';
import { TRPCError } from '@trpc/server';
import { handleError } from '@utils/client.util';

type NoteModalProps = {
	type: 'add' | 'edit' | 'parse'; // Add, Edit, Parse
	controller: Function;
	toParseText?: string;
};

export const NoteModal = ({ type, controller, toParseText }: NoteModalProps) => {
	// Add Properties
	const [text, setText] = React.useState('');
	const createNoteMutation = trpc.post.create.useMutation();

	async function handleCreateNoteMutation() {
		try {
			const res = await createNoteMutation.mutateAsync({ text });
			if (res.result) {
				setToastIntent('success');
				setToastMessage('Your note was created!');
				setShowToast(true);

				setTimeout(() => {
					controller(false);
				}, 2000);
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
			<div className="fixed top-5 right-5 flex flex-col">
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
				<Button
					flex="row"
					type="button"
					onClick={() => {
						handleCreateNoteMutation();
					}}>
					<RiSaveLine className="h-6 w-6" />
				</Button>
			</div>
			{
				// Add Note Modal
				type === 'add' ? (
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
function controller(arg0: boolean) {
	throw new Error('Function not implemented.');
}
