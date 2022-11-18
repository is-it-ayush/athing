import { JournalEntryOnlyTitle } from '@utils/client.typing';
import { selectedJournalAtom, showJournalIndexModalAtom } from '@utils/store';
import { trpc } from '@utils/trpc';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { Button } from './Button';

const JournalIndexAnimation = {
	hidden: {
		y: '100%',
	},
	visible: {
		y: 0,
	},
};

export const JournalIndex = () => {
	// Atoms
	const [selectedJournal] = useAtom(selectedJournalAtom);
	const [, setShowJournalIndexModal] = useAtom(showJournalIndexModalAtom);
	const [entries, setEntries] = useState<JournalEntryOnlyTitle>([]);

	//TRPC
	const getJournalEntryTitles = trpc.entry.getAll.useQuery({
		journalId: selectedJournal?.id ? selectedJournal.id : '',
	});

	useEffect(() => {
		if (getJournalEntryTitles.data) {
			setEntries(getJournalEntryTitles.data);
		}
	}, [getJournalEntryTitles.data]);

	console.log(`entries`, entries);

	return (
		<motion.div
			className="fixed top-0 left-0 flex min-h-screen w-screen items-center justify-center bg-black font-spacemono"
			initial={JournalIndexAnimation.hidden}
			animate={JournalIndexAnimation.visible}
			exit={JournalIndexAnimation.hidden}
			transition={{
				duration: 0.3,
			}}>
			<div className="absolute top-5 right-5">
				<Button
					type="button"
					onClick={() => {
						setShowJournalIndexModal(false);
					}}
					width="fit"
					styles="opposite">
					<IoClose className="h-6 w-6" />
				</Button>
			</div>
			<div className="flex flex-col text-white">
				{entries.length > 0 ? (
					entries.map((entry, i) => {
						return (
							<div key={entry.id} className="flex my-2">
								<h1>
									Chapter ${i.toString().toUpperCase()}:{' '}
									{entry.title.length > 20 ? entry.title.slice(0, 20) + '...' : entry.title}
								</h1>
							</div>
						);
					})
				) : (
					<div>
						<p>No entries found</p>
					</div>
				)}
			</div>
		</motion.div>
	);
};
