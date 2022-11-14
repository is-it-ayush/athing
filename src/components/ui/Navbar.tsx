import { trpc } from '@utils/trpc';
import { motion } from 'framer-motion';
import React from 'react';

// Icons
import { RiMenu5Fill, RiCloseLine } from 'react-icons/ri';

export function Navbar({
	pageController,
	menuController,
}: {
	pageController: React.Dispatch<React.SetStateAction<number>>;
	menuController: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
	const res = trpc.user.me.useQuery(void 0, {
		staleTime: 1000 * 60 * 10,
	});

	// Skeleton
	if (res.isLoading) {
		return (
			<motion.div
				className="fixed top-0 left-0 flex h-screen w-screen flex-row items-center justify-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3 }}>
				<div className="flex h-6 w-6 animate-spin rounded-full border-b-2 border-black"></div>
			</motion.div>
		);
	}

	return (
		<motion.div
			className="fixed top-5 flex w-screen items-center justify-center  font-spacemono backdrop-blur-[3px] backdrop-filter"
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			exit={{ y: -100 }}
			transition={{ duration: 0.5 }}>
			<div className="flex h-[60px] w-[95%] flex-row items-center justify-between rounded-full border-2 border-gray-300 px-5 ">
				<div className="flex">
					Hi!
					<b className="px-2">{res.data?.username}</b>
				</div>
				<div className="hidden flex-row divide-x-2 divide-gray-300 lg:flex">
					<button
						className="duration-400 flex px-5 hover:font-semibold"
						onClick={() => {
							pageController(0);
						}}>
						<h1>Notes</h1>
					</button>
					<button
						className="duration-400 flex px-5 hover:font-semibold"
						onClick={() => {
							pageController(1);
						}}>
						<h1>Journals</h1>
					</button>
					<button
						className="duration-400 flex px-5 hover:font-semibold"
						onClick={() => {
							pageController(2);
						}}>
						<h1>Private</h1>
					</button>
				</div>
				<div
					className="flex flex-col rounded-full p-2 transition-colors duration-300 hover:cursor-pointer hover:bg-gray-200"
					onClick={() => {
						menuController[1](!menuController[0]);
					}}>
					{menuController[0] === false ? <RiMenu5Fill className="h-8 w-8" /> : <RiCloseLine className="h-8 w-8" />}
				</div>
			</div>
		</motion.div>
	);
}
