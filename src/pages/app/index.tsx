import { Button } from '@components/ui/Button';
import { trpc } from '@utils/trpc';
import { AnimatePresence, motion } from 'framer-motion';
import { NextPage } from 'next/types';

export const App: NextPage = () => {
	const muatation = trpc.user.logout.useMutation();

	return (
		<AnimatePresence>
			<motion.div className="fixed top-5 flex w-screen items-center justify-center">
				<div className="flex h-[60px] w-[95%] flex-row justify-around rounded-full border-2 border-gray-300">
					<div className="flex">
						{
							// wait
						}
					</div>
					<div className="flex"></div>
					<div className="flex"></div>
				</div>
			</motion.div>
			<motion.div
				className="flex h-screen w-screen flex-col items-center justify-center font-spacemono"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				key="main"
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5 }}>
				<main className="flex flex-col">
					<h1 className="my-2 text-4xl font-bold">This is supposed to be the dashboard!</h1>
					<Button
						letterSpaced={true}
						onClick={async () => {
							const res = await muatation.mutate();
							console.log(res);
						}}>
						Log Out
					</Button>
				</main>
			</motion.div>
		</AnimatePresence>
	);
};

export default App;
