import { showFeedbackModalAtom, showToastAtom, toastIntentAtom, toastMessageAtom } from '@utils/store';
import { trpc } from '@utils/trpc';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { BiUserVoice } from 'react-icons/bi';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from './Button';

const FeedbackModalAnimations = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
	},
	transition: {
		duration: 0.5,
	},
};

export const FeedbackModal = () => {
	const [showFeedback, setShowFeedback] = useAtom(showFeedbackModalAtom);
	const [text, setText] = useState('');

	//TRPC
	const feedback = trpc.user.feedback.useMutation();

	// Toast
	const [, setDisplayToast] = useAtom(showToastAtom);
	const [, setToastIntent] = useAtom(toastIntentAtom);
	const [, setToastMessage] = useAtom(toastMessageAtom);

	async function handleFeedbackSubmit() {
		if (text.length < 20) {
			setToastIntent('error');
			setToastMessage('At least 20 characters are required.');
			setDisplayToast(true);
			return;
		}

		try {
			const res = await feedback.mutateAsync({
				text,
			});
			setToastIntent('success');
			setToastMessage('You have been heard!');
			setDisplayToast(true);
			setShowFeedback(false);
		} catch (e) {
			setToastIntent('error');
			setToastMessage('Something went wrong!');
			setDisplayToast(true);
		}
	}

	return (
		<motion.div
			className="fixed top-0 left-0 flex min-h-screen w-screen items-center justify-center font-spacemono"
			initial={FeedbackModalAnimations.hidden}
			animate={FeedbackModalAnimations.visible}
			exit={FeedbackModalAnimations.hidden}
			transition={FeedbackModalAnimations.transition}>
			<div className="flex min-h-[400px] w-[300px] flex-col items-center justify-center border-2 border-gray-300 bg-white">
				<div className="mb-2 flex">
					<BiUserVoice className="h-10 w-10" />
				</div>
				<div className="my-2 flex flex-col justify-center">
					<h1 className="text-center text-2xl font-semibold">Hear my voice</h1>
					<TextareaAutosize
						value={text}
						onChange={(e) => {
							if (e.target.value.length <= 1000) {
								setText(e.target.value);
							} else {
								setToastIntent('error');
								setToastMessage('Feedback must be less than 1000 characters long');
								setDisplayToast(true);
							}
						}}
						maxRows={6}
						className="my-2 min-h-fit w-full resize-none border-none p-2 text-center focus:border-white focus:ring-0"
						placeholder="Want a cool new feature? Found a bug? Let me know!"
					/>
				</div>
				<div className="my-2 flex flex-row gap-5">
					<Button
						type="button"
						width="fit"
						styles="opposite"
						onClick={() => {
							setShowFeedback(false);
						}}>
						Cancel
					</Button>
					<Button type="button" width="fit" styles="exotic" onClick={handleFeedbackSubmit}>
						Submit
					</Button>
				</div>
			</div>
		</motion.div>
	);
};
