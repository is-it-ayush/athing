import { Note, ShortNote, ToastIntent } from '@utils/client.typing';
import { trpc } from '@utils/trpc';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { userInfo } from '@utils/store';
import React from 'react';

// Icons
import { BiLockOpenAlt, BiLockAlt, BiBookOpen, BiEdit } from 'react-icons/bi';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { NoteModal } from '@components/ui/NoteModal';

export const Private: React.FC = () => {
	// State
	const [notes, setNotes] = useState<ShortNote[]>([]);
	const [selectedNote, setSelectedNote] = useState<ShortNote>();
	const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
	const [showModal, setShowModal] = React.useState(false);
	const [modalType, setModalType] = React.useState<'add' | 'edit' | 'parse'>('edit');

	// Required Toast State
	const [showToast, setShowToast] = React.useState(false);
	const [toastIntent, setToastIntent] = React.useState<ToastIntent>('success');
	const [toastMessage, setToastMessage] = React.useState('');

	// Atoms
	const [user, _] = useAtom(userInfo);

	// TRPC
	const allPostsData = trpc.post.getAllByUserId.useQuery({
		id: user.id,
	});
	const deleteNote = trpc.post.delete.useMutation();

	React.useEffect(() => {
		if (allPostsData.data) {
			setNotes(allPostsData.data.posts);
			setIsPageLoading(false);
		}
	}, [allPostsData.data]);

	// --todo-- Extract these functions:
	async function handleNoteDelete(note_id: string) {
		const res = await deleteNote.mutateAsync({ id: note_id });
		if (res.result) {
			setSelectedNote(undefined);
			setShowToast(true);
			setToastIntent('success');
			setToastMessage('Your note has been deleted successfully.');
			allPostsData.refetch();
		}
	}

	return (
		<motion.div
			className="mt-[60px] flex flex-col p-10"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}>
			<h1 className="flex text-xl font-semibold">Your Notes</h1>
			{notes.length > 0 ? (
				<motion.ul className="no-scroll flex flex-col flex-wrap justify-center lg:flex-row" layout="position">
					<AnimatePresence>
						{notes.map((note) => {
							return (
								<motion.li
									key={note.id}
									className={`m-5 flex h-[200px] w-[300px] cursor-pointer flex-col justify-evenly border-2 p-5 transition-all hover:border-black lg:m-5 lg:p-5 `}
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
					</AnimatePresence>
				</motion.ul>
			) : (
				<div className="mt-10 flex flex-col items-center justify-center">
					<h1 className="text-2xl font-semibold">You have no notes</h1>
				</div>
			)}
			<AnimatePresence>
				{
					// Show Note Modal
					showModal && <NoteModal controller={setShowModal} type={modalType} selectedNote={selectedNote} />
				}
			</AnimatePresence>
		</motion.div>
	);
};
