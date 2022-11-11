import { motion } from 'framer-motion';

export const Loading = () => {
  return (
    <motion.div
      className="absolute left-0 top-0 flex w-full"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ duration: 0.5 }}>
      <div className="h-4 w-screen animate-pulse-slow bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"></div>
    </motion.div>
  );
};
