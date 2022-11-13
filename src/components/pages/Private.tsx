import { motion } from "framer-motion";

export const Private: React.FC = () => {
	return (
		<motion.div
		className="mt-[60px] flex flex-col p-10"
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		transition={{ duration: 0.3 }}>
			<h1>Private Page</h1>
		</motion.div>
	);
};
