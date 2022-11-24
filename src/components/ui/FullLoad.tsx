import { motion } from "framer-motion";

export const FullLoad = () => {
	return (
		<motion.div
			className="fixed top-0 left-0 flex h-screen w-screen flex-row items-center justify-center bg-white "
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}>
			<div className="flex h-6 w-6 animate-spin rounded-full border-b-2 border-black"></div>
		</motion.div>
	);
};
