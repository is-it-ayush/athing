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
	const notesQuery = 0;

	const [showModal, setShowModal] = React.useState(false);
	const [modalType, setModalType] = React.useState<'add' | 'edit' | 'parse'>('add');

	return (
		<div className="mt-[60px] flex h-screen flex-col p-10">
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
			<AnimatePresence>
				{
					// Show Note Modal
					showModal && <NoteModal controller={setShowModal} type={modalType} />
				}
				
			</AnimatePresence>
		</div>
	);
};
