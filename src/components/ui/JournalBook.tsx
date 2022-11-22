import type { JournalBookProps } from '@utils/client.typing';
import { formatDate } from '@utils/client.util';
import {
	allowPagesDisplayAtom,
	selectedJournalAtom,
	showJournalIndexModalAtom,
	showJournalPickerAtom,
	showToastAtom,
	toastIntentAtom,
	toastMessageAtom,
} from '@utils/store';
import getTheme from '@utils/ThemeConfig';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';

export const JournalBook = ({ journal, type }: JournalBookProps) => {
	const [, setSelectedJournal] = useAtom(selectedJournalAtom);
	const [, setShowJournalIndexModal] = useAtom(showJournalIndexModalAtom);

	const [, setShowJournalPickerModal] = useAtom(showJournalPickerAtom);
	const [, setAllowPagesDisplay] = useAtom(allowPagesDisplayAtom);

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
					setAllowPagesDisplay(false);
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
			className={
				`m-5 flex min-h-[300px] min-w-[200px] max-w-[200px] cursor-pointer flex-col justify-evenly border-2 bg-white p-5 transition-all hover:border-black ` +
				getTheme(journal.styling)
			}
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}>
			<div className="flex flex-col">
				<div className="my-3 flex flex-col">
					<h1 className="flex h-[120px] items-center overflow-hidden text-ellipsis break-words text-xl font-bold text-black">
						{journal.title.length > 25 ? `${journal.title.substring(0, 25)}...` : journal.title}
					</h1>
					<div className="mt-2 w-fit text-white">
						{journal.isPublic ? (
							<h1 className=" bg-pink-600 p-2">Public</h1>
						) : (
							<h1 className="bg-black p-2">Private</h1>
						)}
					</div>
				</div>
				<h4 className=" text-sm text-gray-600">{formatDate(journal.createdAt)}</h4>
			</div>
		</motion.li>
	);
};
