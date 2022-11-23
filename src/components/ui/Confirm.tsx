import { motion } from 'framer-motion';

export const Confirm = () => {
	return (
		<motion.div
			className="top-50 left-50 absolute -translate-x-[50%] -translate-y-[50%] bg-white p-10"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}>
			<h1>Are You Sure?</h1>
		</motion.div>
	);
};
