import { trpc } from '@utils/trpc';
import { useAtom } from 'jotai';

// Components
import { Button } from '@components/ui/Button';
import { NoteModal } from '@components/ui/NoteModal';
import React from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

// Icons
import { BiBookOpen, BiEdit } from 'react-icons/bi';
import { IoAdd } from 'react-icons/io5';
import { MdOutlineDeleteOutline } from 'react-icons/md';

// Types
import { type Note, type ToastIntent } from '@utils/client.typing';

// Atoms
import { userInfo } from '@utils/store';
import { Toast } from '@components/ui/Toast';

export const Notes: React.FC = () => {
	const [selectedNote, setSelectedNote] = React.useState<Note>();

	// TRPC
	const deleteNote = trpc.post.delete.useMutation();

	// Atoms
	const [user, _] = useAtom(userInfo);

	// Required Toast State
	const [showToast, setShowToast] = React.useState(false);
	const [toastIntent, setToastIntent] = React.useState<ToastIntent>('success');
	const [toastMessage, setToastMessage] = React.useState('');

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
			setSelectedNote(undefined);
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

	const [showModal, setShowModal] = React.useState(false);
	const [modalType, setModalType] = React.useState<'add' | 'edit' | 'parse'>('edit');
	return (
		<motion.div
			className="mt-[60px] flex flex-col p-10"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}>
			<div className="fixed bottom-10 right-10 flex flex-col">
				<Button
					type="button"
					onClick={() => {
						// Show Note Modal with add properties! :)
						setSelectedNote(undefined);
						setModalType('edit');
						setShowModal(true);
					}}
					flex="row"
					width="fit"
					styles="opposite">
					<IoAdd className="h-6 w-6" />
				</Button>
			</div>
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
									<motion.div className="my-3 flex flex-col">
										<h1 className="text-xl font-bold">{note.User?.username}</h1>
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
										{note.userId === user?.id ? (
											<>
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
											</>
										) : null}
									</div>
								</motion.li>
							);
						});
					})}
				</AnimatePresence>
			</motion.ul>
			<AnimatePresence>
				{
					// Show Note Modal
					showModal && <NoteModal controller={setShowModal} type={modalType} selectedNote={selectedNote} />
				}
				{showToast ? (
					<Toast
						key="toastKey"
						intent={toastIntent}
						message={toastMessage}
						onClose={() => {
							setShowToast(!showToast);
						}}
					/>
				) : null}
			</AnimatePresence>
		</motion.div>
	);
};
