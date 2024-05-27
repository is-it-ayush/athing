import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

const LoadingStyles = cva(
  'h-4 w-screen animate-pulse-slow bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))]',
  {
    variants: {
      styles: {
        normal: 'from-gray-700 via-gray-900 to-black',
        opposite: 'from-gray-200 via-white to-white',
      },
    },
    defaultVariants: {
      styles: 'normal',
    },
  },
);

export interface LoadingProps extends VariantProps<typeof LoadingStyles> {
  styles?: 'normal' | 'opposite';
}

export const Loading = ({ ...props }: LoadingProps) => {
  return (
    <motion.div
      className="absolute left-0 top-0 flex w-full"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className={LoadingStyles(props)}></div>
    </motion.div>
  );
};
