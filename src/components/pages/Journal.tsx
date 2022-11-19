import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { trpc } from '@utils/trpc';
import { formatDate } from '@utils/client.util';
import { selectedJournalAtom, showJournalIndexModalAtom } from '@utils/store';
import { useAtom } from 'jotai';
import { type Journal as JournalType } from '@prisma/client';

export const Journal: React.FC = () => {
	// TRPC
	const journalQuery = trpc.journals.getRandom.useInfiniteQuery(
		{
			limit: 3,
		},
		{
			getNextPageParam: (lastPage) => {
				if (lastPage.length < 3) return undefined;
				return lastPage[lastPage.length - 1]?.id;
			},
		},
	);

	// Atoms
	const [, setSelectedJournal] = useAtom(selectedJournalAtom);
	const [, setShowJournalIndexModal] = useAtom(showJournalIndexModalAtom);

	async function handleOpenJournal(journal: JournalType) {
		setSelectedJournal(journal);
		setShowJournalIndexModal(true);
	}

	return (
		<motion.div
			className="mt-[60px] flex min-h-screen flex-col justify-center p-10 lg:mt-0"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}>
			<div className="flex h-full flex-col items-center justify-center lg:flex-row">
				<AnimatePresence>
					{journalQuery.data?.pages.map((page) => {
						return page.map((journal) => {
							return (
								<motion.div
									key={journal.id}
									onClick={() => handleOpenJournal(journal)}
									className="flex flex-col items-center justify-center"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}>
									<div className="m-5 flex h-[400px] max-w-[200px] cursor-pointer flex-col items-center justify-center border-2 bg-white p-5 text-start hover:border-black">
										<h1 className="my-2 flex break-all text-3xl font-bold">{journal.title}</h1>
										<h1 className="flex font-semibold">Updated At</h1>
										<p className="my-2 flex bg-pink-600 p-1 text-center text-sm text-white">
											{formatDate(journal.updatedAt, 'dateAndTime')}
										</p>
									</div>
								</motion.div>
							);
						});
					})}
				</AnimatePresence>
			</div>
		</motion.div>
	);
};
