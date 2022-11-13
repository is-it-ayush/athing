import { motion } from 'framer-motion';
import { cva, VariantProps } from 'class-variance-authority';

// Icons
import { IoInformationOutline, IoWarningOutline } from 'react-icons/io5';
import { TbDiamonds } from 'react-icons/tb';
import { MdNearbyError } from 'react-icons/md';

// Types
import { ToastIntent, ToastProps } from '@utils/client.typing';

const ToastIcons = {
  info: <IoInformationOutline className="h-[28px] w-[28px]" />,
  warning: <IoWarningOutline className="h-[28px] w-[28px]" />,
  error: <MdNearbyError className="h-[28px] w-[28px]" />,
  success: <TbDiamonds className="h-[28px] w-[28px]" />,
};



export const Toast = ({ message, intent, onClose }: ToastProps) => {
  return (
    <motion.div
      className={
        'fixed left-0 bottom-0 flex w-full flex-row items-center justify-center bg-black text-white lg:w-fit'
      }
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ duration: 0.5 }}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full">
        {ToastIcons[intent]}
      </div>
      <div className="flex w-full items-center justify-center p-2 text-sm">{message}</div>
      <div>
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full"
          onClick={onClose}>
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};
