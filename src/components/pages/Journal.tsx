import { motion } from 'framer-motion';

export const Journal: React.FC = () => {
	return (
		<motion.div
			className="mt-[60px] flex flex-col p-10"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}>
                <h1>Journal Page</h1>
            </motion.div>
	);
};
