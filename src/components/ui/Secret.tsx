import { motion } from 'framer-motion';

export const Secret = () => {
  return (
    <motion.div
      className="mt-[60px] flex w-screen flex-col overflow-hidden p-10 font-spacemono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="flex text-center text-xl font-bold">
          You found a secret. Tweet me @is_it_ayush. : )
        </h1>
      </div>
    </motion.div>
  );
};
