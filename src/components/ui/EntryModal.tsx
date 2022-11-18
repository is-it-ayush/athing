import { selectedEntryAtom, selectedEntryTypeAtom, showEntryModalAtom } from '@utils/store';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { IoClose } from 'react-icons/io5';
import { Button } from './Button';

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

	return (
		<motion.div
			className="fixed top-0 left-0 flex min-h-screen w-screen flex-col bg-white p-10 font-spacemono"
			initial={EntryModalAnimations.hidden}
			animate={EntryModalAnimations.visible}
			exit={EntryModalAnimations.hidden}
			transition={{
				duration: 0.3,
			}}>
			<div className="absolute top-5 right-5">
				<Button
					type="button"
					onClick={() => {
						setShowEntryModal(false);
					}}
					width="fit"
					styles="opposite">
					<IoClose className="h-6 w-6" />
				</Button>
			</div>
			<div className="flex flex-col">
				{
					// This is where the parsing and editing logic would go!!
				}
			</div>
		</motion.div>
	);
};
