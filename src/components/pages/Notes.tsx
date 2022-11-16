import { trpc } from '@utils/trpc';
import { useAtom } from 'jotai';
import { formatDate } from '@utils/client.util';

// Components
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Icons
import { BiBookOpen, BiEdit } from 'react-icons/bi';
import { MdOutlineDeleteOutline } from 'react-icons/md';

// Atoms
import {
	userInfo,
	showToastAtom,
	toastIntentAtom,
	toastMessageAtom,
	selectedNoteAtom,
	noteModal,
	showModal,
} from '@utils/store';

export const Notes: React.FC = () => {
	const [, setSelectedNote] = useAtom(selectedNoteAtom);

	// TRPC
	const deleteNote = trpc.post.delete.useMutation();

	// Atoms
	const [user] = useAtom(userInfo);
	const [, setModalType] = useAtom(noteModal);
	const [, setDisplayModal] = useAtom(showModal);
	const [, setShowToast] = useAtom(showToastAtom);
	const [, setToastIntent] = useAtom(toastIntentAtom);
	const [, setToastMessage] = useAtom(toastMessageAtom);

	const notesQuery = trpc.post.get.useInfiniteQuery(
		{
			limit: 10,
		},
		{
			getNextPageParam: (lastPage) => {
				if (lastPage.length < 10) return undefined;
				return lastPage[lastPage.length - 1]?.id;
			},
		},
	);

	async function handleNoteDelete(note_id: string) {
		const res = await deleteNote.mutateAsync({ id: note_id });
		if (res.result) {
			setSelectedNote(null);
			setShowToast(true);
			setToastIntent('success');
			setToastMessage('Your note has been deleted successfully.');
			notesQuery.refetch();
		}
	}

	React.useEffect(() => {
		let fetching = false;
		const onScroll = (e: any) => {
			const { scrollHeight, scrollTop, clientHeight } = e.target.scrollingElement;

			if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
				fetching = true;
				notesQuery.fetchNextPage().then(() => {
					fetching = false;
				});
			}
		};

		document.addEventListener('scroll', onScroll);

		return () => {
			document.removeEventListener('scroll', onScroll);
		};
	}, []);

	return (
		<motion.div
			className="mt-[60px] flex flex-col p-10"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}>
			<motion.ul className="no-scroll flex flex-row flex-wrap justify-center lg:flex-row" layout="position">
				<AnimatePresence>
					{notesQuery.data?.pages.map((page) => {
						return page.map((note) => {
							return (
								<motion.li
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{
										layout: {
											type: 'tween',
											duration: 0.3,
										},
									}}
									key={note.id}
									className={`m-5 flex h-[200px] w-[300px] cursor-pointer flex-col justify-evenly border-2 p-5 transition-all hover:border-black lg:m-5 lg:p-5`}>
									<div className="my-3 flex flex-col">
										<h1 className="text-xl font-bold">{note.User?.username}</h1>
										<h1 className="flex text-sm text-gray-700">{formatDate(note.at)}</h1>
									</div>
									<h6 className="whitespace-normal break-all">
										{note.text.length > 25 ? `${note.text.substring(0, 25)}...` : note.text}
									</h6>
									<div className="mt-2 flex w-full flex-row justify-start">
										<button
											className="mr-2 w-fit cursor-pointer rounded-full p-2 transition-all duration-200 hover:bg-black hover:text-white"
											onClick={() => {
												setSelectedNote(note);
												setModalType('parse');
												setDisplayModal(true);
											}}>
											<BiBookOpen className="h-6 w-6" />
										</button>
										{note.userId === user?.id ? (
											<>
												<button
													className="mr-2 w-fit cursor-pointer rounded-full p-2 transition-all duration-200 hover:bg-black hover:text-white"
													onClick={() => {
														setSelectedNote(note);
														setModalType('edit');
														setDisplayModal(true);
													}}>
													<BiEdit className="h-6 w-6" />
												</button>
												<button
													className="mr-2 w-fit cursor-pointer rounded-full p-2 transition-all duration-200 hover:bg-black hover:text-white"
													onClick={() => {
														handleNoteDelete(note.id);
													}}>
													<MdOutlineDeleteOutline className="h-6 w-6" />
												</button>
											</>
										) : null}
									</div>
								</motion.li>
							);
						});
					})}
				</AnimatePresence>
			</motion.ul>
		</motion.div>
	);
};
