import { trpc } from '@utils/trpc';
import { useAtom } from 'jotai';

// Components
import { Button } from '@components/ui/Button';
import { NoteModal } from '@components/ui/NoteModal';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Icons
import { BiNote, BiBookOpen } from 'react-icons/bi';
import { IoAdd } from 'react-icons/io5';

// Types
import { Note } from '@utils/client.typing';

// Atoms
import { userInfo } from '@utils/store';

export const Notes: React.FC = () => {
	const [selectedNote, setSelectedNote] = React.useState<Note>();

	// Atoms
	const [user, setUser] = useAtom(userInfo);

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
	const [modalType, setModalType] = React.useState<'add' | 'edit' | 'parse'>('add');

	return (
		<motion.div className="mt-[60px] flex flex-col p-10"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="flex w-fit flex-col">
				<Button
					type="button"
					onClick={() => {
						// Show Note Modal with add properties! :)
						setModalType('add');
						setShowModal(true);
					}}
					flex="row">
					<BiNote className="mr-2 hidden lg:flex" />
					<h1 className="hidden lg:flex">Add Note</h1>
					<IoAdd className="lg:hidden" />
				</Button>
			</div>
			<ul className="no-scroll  flex flex-col flex-wrap justify-center sm:flex-row">
				{notesQuery.data?.pages.map((page) => {
					return page.map((note) => {
						return (
							<li
								key={note.id}
								className={`my-5 flex h-[200px] w-[300px] cursor-pointer flex-col justify-evenly border-2 p-5 transition-all hover:border-black lg:m-5 lg:p-5 `}>
								<div className="my-3 flex flex-col">
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
								</div>
								<h6 className="whitespace-normal break-words">
									{note.text.length > 25 ? `${note.text.substring(0, 25)}...` : note.text}
								</h6>
								<div className="flex w-full flex-col justify-start">
									<button
										className="mr-2 w-fit cursor-pointer rounded-full p-2 transition-all duration-200 hover:bg-gray-300"
										onClick={() => {
											setSelectedNote(note);
											setModalType('parse');
											setShowModal(true);
										}}>
										<BiBookOpen className="h-6 w-6" />
									</button>
								</div>
							</li>
						);
					});
				})}
			</ul>
			<AnimatePresence>
				{
					// Show Note Modal
					showModal && <NoteModal controller={setShowModal} type={modalType} selectedNote={selectedNote} />
				}
			</AnimatePresence>
		</motion.div>
	);
};
