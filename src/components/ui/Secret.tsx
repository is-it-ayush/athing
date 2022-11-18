import { motion } from 'framer-motion';
export const Secret = () => {
	return (
		<motion.div
			className="mt-[60px] flex w-screen flex-col overflow-hidden p-10"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}>
			<div className="flex flex-col">
				<h1 className="flex text-center text-xl">
					WAIT WHAT? you aren&apos;t supposed to be here. I don&apos;t do easter eggs. Or Do I?. :(
				</h1>
			</div>
		</motion.div>
	);
};
