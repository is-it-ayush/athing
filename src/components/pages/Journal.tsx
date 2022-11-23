import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { trpc } from '@utils/trpc';
import { formatDate } from '@utils/client.util';
import { allowPagesDisplayAtom, selectedJournalAtom, showJournalIndexModalAtom } from '@utils/store';
import { useAtom } from 'jotai';
import { type Journal as JournalType } from '@prisma/client';
import { TiArrowShuffle } from 'react-icons/ti';
import getTheme from '@utils/PatternController';

export const Journal: React.FC = () => {
	const [len, setLen] = useState(0);

	// TRPC
	const journalQuery = trpc.journals.getLatest.useInfiniteQuery(
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
	const [, setAllowPagesDisplay] = useAtom(allowPagesDisplayAtom);

	async function handleOpenJournal(journal: JournalType) {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		setAllowPagesDisplay(false);
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
			<div className="fixed bottom-10 left-10 flex">
				<button
					className="flex flex-col items-center border-2 bg-black p-3 text-white duration-200 hover:bg-white hover:text-black"
					type="button"
					onClick={() => {
						journalQuery.fetchNextPage();
						if (journalQuery.data) {
							if (journalQuery.data.pages.length - 1 === len) {
								setLen(0);
							} else {
								setLen(len + 1);
							}
						}
					}}>
					<TiArrowShuffle className="h-6 w-6" />
				</button>
			</div>
			<motion.ul className="flex h-full flex-col items-center justify-center lg:flex-row">
				<AnimatePresence mode="wait">
					{journalQuery.status === 'success' ? (
						journalQuery.data?.pages[len]?.map((journal) => {
							return (
								<motion.li
									key={journal.id}
									onClick={() => handleOpenJournal(journal)}
									className="flex flex-col items-center justify-center"
									initial={{ x: '100vw' }}
									animate={{ x: 0 }}
									exit={{ x: '-100vw' }}
									transition={{ duration: 0.5 }}>
									<div
										className={
											`m-5 flex h-[400px] max-w-[200px] cursor-pointer flex-col items-center justify-center border-2 bg-white p-5 text-start hover:border-black ` +
											getTheme(journal.styling)
										}>
										<h1 className="my-2 flex h-[250px] items-center text-ellipsis break-all text-3xl font-bold">
											{journal.title}
										</h1>
										<h1 className="flex font-semibold">Updated At</h1>
										<p className="my-2 flex bg-pink-600 p-1 text-center text-sm text-white">
											{formatDate(journal.updatedAt, 'dateAndTime')}
										</p>
									</div>
								</motion.li>
							);
						})
					) : (
						<motion.ul className="flex h-full flex-col items-center justify-center lg:flex-row">
							{[...Array(3)].map((_, i) => {
								return (
									<motion.li
										key={i}
										className="flex flex-col items-center justify-center"
										initial={{ x: '100vw' }}
										animate={{ x: 0 }}
										exit={{ x: '-100vw' }}
										transition={{ duration: 0.5 }}>
										<div className="m-5 flex h-[300px] min-w-[150px] animate-pulse flex-col items-center justify-center border-none bg-gray-200 p-5 text-start"></div>
										<div className="m-5 flex h-[100px] min-w-[150px] animate-pulse flex-col items-center justify-center border-none bg-gray-200 p-5 text-start"></div>
									</motion.li>
								);
							})}
						</motion.ul>
					)}
				</AnimatePresence>
			</motion.ul>
		</motion.div>
	);
};
