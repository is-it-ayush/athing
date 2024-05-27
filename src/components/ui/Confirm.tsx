import {
  confirmDialogMessageAtom,
  confirmDialogStateAtom,
  showConfirmDialogAtom,
} from '@utils/store';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { Button } from './Button';

export const Confirm = () => {
  const [confirmDialogMessage] = useAtom(confirmDialogMessageAtom);
  const [, setShowConfirmDialog] = useAtom(showConfirmDialogAtom);
  const [, setConfirmDialogState] = useAtom(confirmDialogStateAtom);

  return (
    <motion.div
      className="fixed top-[50%] left-[50%] z-[1000] h-fit w-[350px] -translate-x-[50%] -translate-y-[50%] border-2 border-gray-300 bg-white p-5 lg:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex w-full flex-col items-start justify-center">
        <h1 className="flex text-2xl font-bold">Are You Sure?</h1>
        <p className="prose">{confirmDialogMessage}</p>
        <div className="flex flex-row gap-5">
          <Button
            type="button"
            onClick={() => {
              setConfirmDialogState(true);
              setShowConfirmDialog(false);
            }}
            flex="row"
            width="fit"
            styles="danger"
          >
            Confirm
          </Button>
          <Button
            type="button"
            onClick={() => {
              setConfirmDialogState(false);
              setShowConfirmDialog(false);
            }}
            flex="row"
            width="fit"
            styles="opposite"
          >
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
