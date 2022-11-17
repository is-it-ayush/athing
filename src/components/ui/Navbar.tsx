import { trpc } from '@utils/trpc';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

// Icons
import { RiCloseLine } from 'react-icons/ri';
import { CgOptions, CgMenuRight } from 'react-icons/cg';

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

	return (
		<motion.div
			className=" no-select fixed top-5 flex w-screen items-center justify-center  font-spacemono backdrop-blur-[3px] backdrop-filter"
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			exit={{ y: -100 }}
			transition={{ duration: 0.5 }}>
			<div className="flex h-[60px] w-[95%] flex-row items-center justify-between rounded-full  px-5 ">
				<div className="flex font-semibold">@{res.data?.username}</div>
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
					{menuController[0] === false ? <CgMenuRight className="h-8 w-8" /> : <RiCloseLine className="h-8 w-8" />}
				</div>
			</div>
		</motion.div>
	);
}
