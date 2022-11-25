import { trpc } from '@utils/trpc';
import { motion } from 'framer-motion';
import React from 'react';

// Icons
import { RiCloseLine } from 'react-icons/ri';
import { CgMenuRight } from 'react-icons/cg';
import { useAtom } from 'jotai';
import { currentPageAtom, menuOpenAtom, showFeedbackModalAtom } from '@utils/store';
import { BiUserVoice } from 'react-icons/bi';

export function Navbar() {
	const res = trpc.user.me.useQuery(void 0, {
		staleTime: 1000 * 60 * 10,
	});

	const [, setShowPage] = useAtom(currentPageAtom);
	const [, setShowFeedback] = useAtom(showFeedbackModalAtom);
	const [menuOpen, setMenuOpen] = useAtom(menuOpenAtom);

	return (
		<motion.div
			className="fixed top-5 z-[996] flex w-screen items-center justify-center font-spacemono backdrop-blur-[3px] backdrop-filter"
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			exit={{ y: -100 }}
			transition={{ duration: 0.5 }}>
			<div className="flex h-[60px] w-[95%] flex-row items-center justify-between rounded-full px-5">
				<div className="flex font-semibold">@{res.data?.username}</div>
				<div className="hidden no-select flex-row divide-x-2 divide-gray-300 lg:flex">
					<button
						className="duration-400 flex px-5 hover:font-semibold"
						onClick={() => {
							setShowPage(0);
						}}>
						<h1>Notes</h1>
					</button>
					<button
						className="duration-400 flex px-5 hover:font-semibold"
						onClick={() => {
							setShowPage(1);
						}}>
						<h1>Journals</h1>
					</button>
					<button
						className="duration-400 flex px-5 hover:font-semibold"
						onClick={() => {
							setShowPage(2);
						}}>
						<h1>Private</h1>
					</button>
				</div>
				<div className="flex flex-row gap-5">
					<div
						className="flex cursor-pointer flex-col rounded-full p-2 transition duration-300 hover:bg-gray-200"
						onClick={() => setShowFeedback(true)}>
						<BiUserVoice className="h-6 w-6" />
					</div>
					<div
						className="flex flex-col rounded-full p-2 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-200"
						onClick={() => {
							setMenuOpen(!menuOpen);
						}}>
						{!menuOpen ? <CgMenuRight className="h-6 w-6" /> : <RiCloseLine className="h-6 w-6" />}
					</div>
				</div>
			</div>
		</motion.div>
	);
}
