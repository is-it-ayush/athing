import { trpc } from '@utils/trpc';

// Components
import { Button } from '@components/ui/Button';
import { NoteModal } from '@components/ui/NoteModal';

// Icons
import { BiNote } from 'react-icons/bi';
import { IoAdd } from 'react-icons/io5';
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast, ToastIntent } from '@components/ui/Toast';

export const Notes: React.FC = () => {
	const [cursor, setCursor] = React.useState('');

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
		<div className="mt-[60px] flex flex-col p-10">
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
								className="prose my-5 inline-block h-[200px] w-[300px] flex-col border-2 border-gray-300 p-5 lg:m-5 ">
								<h1 className="mb-3 flex text-sm text-gray-700">
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
								<h6 className="truncate whitespace-pre-line">
									{note.text.length > 100 ? `${note.text.substring(0, 60)}...` : note.text}
								</h6>
							</li>
						);
					});
				})}
			</ul>
			<AnimatePresence>
				{
					// Show Note Modal
					showModal && <NoteModal controller={setShowModal} type={modalType} />
				}
			</AnimatePresence>
		</div>
	);
};
