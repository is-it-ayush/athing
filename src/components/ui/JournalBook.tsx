import { type Journal } from '@prisma/client';
import { JournalBookProps } from '@utils/client.typing';
import { formatDate } from '@utils/client.util';
import {
	currentPageAtom,
	selectedJournalAtom,
	showJournalIndexModalAtom,
	showJournalPickerAtom,
	showToastAtom,
	toastIntentAtom,
	toastMessageAtom,
} from '@utils/store';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';

export const JournalBook = ({ journal, type }: JournalBookProps) => {
	const [, setSelectedJournal] = useAtom(selectedJournalAtom);
	const [, setShowJournalIndexModal] = useAtom(showJournalIndexModalAtom);
	const [, setCurrentPage] = useAtom(currentPageAtom);

	const [, setShowJournalPickerModal] = useAtom(showJournalPickerAtom);

	// Toast
	const [, setDisplayToast] = useAtom(showToastAtom);
	const [, setToastIntent] = useAtom(toastIntentAtom);
	const [, setToastMessage] = useAtom(toastMessageAtom);

	return (
		<motion.li
			key={journal.id}
			onClick={() => {
				setSelectedJournal(journal);
				if (type === 'view') {
					setCurrentPage(-1);
					setShowJournalIndexModal(true);
				} else if (type === 'select') {
					// Scroll to top smoothly
					window.scrollTo({
						top: 0,
						behavior: 'smooth',
					});
					setShowJournalPickerModal(false);
					setDisplayToast(true);
					setToastIntent('info');
					setToastMessage('The journal has been selected.');
				}
			}}
			className={`m-5 flex min-h-[300px] min-w-[200px] max-w-[200px] cursor-pointer flex-col justify-evenly border-2 bg-white bg-overlapcrc-pattern p-5 transition-all hover:border-black`}
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}>
			<div className="flex flex-col">
				<div className="my-3 flex flex-col">
					<h1 className="flex h-[120px] items-center break-all text-xl font-bold text-black">
						{journal.title.length > 25 ? `${journal.title.substring(0, 25)}...` : journal.title}
					</h1>
					<div className="mt-2 w-fit">
						{journal.isPublic ? (
							<h1 className=" bg-pink-600 p-2 text-black">Public</h1>
						) : (
							<h1 className="bg-black p-2 text-white">Private</h1>
						)}
					</div>
				</div>
				<h4 className=" text-sm text-gray-600">{formatDate(journal.createdAt)}</h4>
			</div>
		</motion.li>
	);
};
