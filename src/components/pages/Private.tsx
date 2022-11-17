import { Note } from '@utils/client.typing';
import { trpc } from '@utils/trpc';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAtom } from 'jotai';
import {
	noteModal,
	selectedNoteAtom,
	showToastAtom,
	toastIntentAtom,
	toastMessageAtom,
	userInfo,
	showModal,
} from '@utils/store';
import React from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { Post, type Journal } from '@prisma/client';

// Icons
import { BiLockOpenAlt, BiLockAlt, BiBookOpen, BiEdit, BiBook, BiPlus } from 'react-icons/bi';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { NoteModal } from '@components/ui/NoteModal';
import { formatDate, handleError } from '@utils/client.util';
import { Button } from '@components/ui/Button';

export const Private: React.FC = () => {
	// State
	const [notes, setNotes] = useState<Post[]>([]);
	const [journals, setJournals] = useState<Journal[]>([]);

	const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

	const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);
	const [, setModalType] = useAtom(noteModal);
	const [, setShowModal] = useAtom(showModal);
	const [, setToastIntent] = useAtom(toastIntentAtom);
	const [, setToastMessage] = useAtom(toastMessageAtom);
	const [, setShowToast] = useAtom(showToastAtom);

	// Atoms
	const [user, _] = useAtom(userInfo);

	// TRPC
	const deleteNote = trpc.post.delete.useMutation();
	const allPostsData = trpc.post.getPostsByUserId.useQuery(
		{
			id: user.id,
		},
		{
			onError(err) {
				console.log(`Yo! I think something happened! :)`);
				setNotes([]);
			},
		},
	);
	const journalsQuery = trpc.journals.getJournalsByUserId.useQuery(
		{
			id: user.id,
		},
		{
			onError(err) {
				setJournals([]);
			},
		},
	);

	React.useEffect(() => {
		if (allPostsData.data) {
			setNotes(allPostsData.data.posts);
		}
	}, [allPostsData.data]);

	React.useEffect(() => {
		if (journalsQuery.data) {
			setJournals(journalsQuery.data);
		}
	}, [journalsQuery.data]);

	// --todo-- Extract these functions:
	async function handleNoteDelete(note_id: string) {
		const res = await deleteNote.mutateAsync({ id: note_id });
		if (res.result) {
			setSelectedNote(null);
			setShowToast(true);
			setToastIntent('success');
			setToastMessage('Your note has been deleted successfully.');
			allPostsData.refetch();
		}
	}

	return (
		<motion.div
			className="mt-[60px] flex w-screen flex-col overflow-hidden p-10"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}>
			<div className="flex flex-col">
				<h1 className="flex text-xl font-semibold">Your Notes</h1>
				<div>
					{notes.length > 0 ? (
						<motion.ul
							className="no-select no-scrollbar flex flex-grow snap-x snap-mandatory flex-row overflow-x-auto"
							layout="position">
							<ScrollContainer className=" flex flex-row">
								{notes.map((note) => {
									return (
										<motion.li
											key={note.id}
											className={`m-5 flex min-h-[200px] min-w-[300px] cursor-pointer snap-center flex-col justify-evenly border-2 p-5 transition-all hover:border-black `}
											layout
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ duration: 0.3 }}>
											<motion.div className="my-3 flex flex-col">
												{note.isPublished ? (
													<div className="flex flex-row text-pink-600">
														<BiLockOpenAlt className="mx-2 h-6 w-6 " />
														<p className="text-xl font-semibold">Public</p>
													</div>
												) : (
													<div className="flex flex-row text-gray-600">
														<BiLockAlt className="mx-2 h-6 w-6 " />
														<p className="text-xl font-semibold">Private</p>
													</div>
												)}
												<h1 className="flex text-sm text-gray-700">
													{note.at
														? Intl.DateTimeFormat('en-US', {
																year: 'numeric',
																month: 'long',
																day: '2-digit',
																hour: 'numeric',
																minute: 'numeric',
														  }).format(new Date(note.at))
														: 'Sometime ago.'}
												</h1>
											</motion.div>
											<h6 className="whitespace-normal break-all	">
												{note.text.length > 25 ? `${note.text.substring(0, 25)}...` : note.text}
											</h6>
											<div className="mt-2 flex w-full flex-row justify-start">
												<button
													className="mr-2 w-fit cursor-pointer rounded-full p-2 transition-all duration-200 hover:bg-gray-300"
													onClick={() => {
														setSelectedNote(note);
														setModalType('parse');
														setShowModal(true);
													}}>
													<BiBookOpen className="h-6 w-6" />
												</button>
												<button
													className="mr-2 w-fit cursor-pointer rounded-full p-2 transition-all duration-200 hover:bg-gray-300"
													onClick={() => {
														setSelectedNote(note);
														setModalType('edit');
														setShowModal(true);
													}}>
													<BiEdit className="h-6 w-6" />
												</button>
												<button
													className="mr-2 w-fit cursor-pointer rounded-full p-2 transition-all duration-200 hover:bg-gray-300"
													onClick={() => {
														handleNoteDelete(note.id);
													}}>
													<MdOutlineDeleteOutline className="h-6 w-6" />
												</button>
											</div>
										</motion.li>
									);
								})}
							</ScrollContainer>
						</motion.ul>
					) : (
						<div className="mt-10 flex w-full flex-col items-center justify-center">
							<h1 className="w-full text-center text-xl font-semibold text-gray-400">
								I found nothing. Tell me about you!
							</h1>
						</div>
					)}
				</div>
			</div>
			<div className="mt-10 flex flex-col">
				<h1 className="flex text-xl font-semibold">Your Journals</h1>
				<div className="flex w-full flex-row items-center justify-center">
					<div>
						{journals.length > 0 ? (
							<motion.ul className="no-select flex flex-grow flex-row overflow-x-auto" layout="position">
								<ScrollContainer className="flex flex-row" hideScrollbars={true}>
									{journals.map((journal) => {
										return (
											<motion.li
												key={journal.id}
												className={`m-5 flex min-h-[200px] min-w-[300px] cursor-pointer flex-col justify-evenly border-2 p-5 transition-all hover:border-black `}
												layout
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{ duration: 0.3 }}>
												<div className="flex flex-col">
													<h1 className="flex text-xl">{journal.title}</h1>
													<h4 className=" text-sm text-gray-600">{formatDate(journal.createdAt)}</h4>
												</div>
											</motion.li>
										);
									})}
								</ScrollContainer>
							</motion.ul>
						) : (
							<div className="mt-10 flex w-full flex-col items-center justify-center">
								<h1 className="w-full text-center text-xl font-semibold text-gray-400">
									It's all empty. Wanna create one?
								</h1>
							</div>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
};
