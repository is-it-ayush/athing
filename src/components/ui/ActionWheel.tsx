import {
  allowPagesDisplayAtom,
  noteModal,
  selectedEntryTypeAtom,
  selectedNoteAtom,
  showActionWheelAtom,
  showEntryModalAtom,
  showJournalModalAtom,
  showModal,
} from '@utils/store';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { BiBook, BiPencil } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { Button } from './Button';
import { TbNotes } from 'react-icons/tb';

const animationVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

const animationComponentVariants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export const ActionWheel = () => {
  const [, setShowActionWheel] = useAtom(showActionWheelAtom);
  const [, setAllowPagesDisplay] = useAtom(allowPagesDisplayAtom);

  const [, setSelectedNoteAtom] = useAtom(selectedNoteAtom);
  const [, setNoteModalType] = useAtom(noteModal);
  const [, setDisplayModal] = useAtom(showModal);
  const [, setShowAddJournalModal] = useAtom(showJournalModalAtom);

  const [, setShowEntryModal] = useAtom(showEntryModalAtom);
  const [, setSelectedEntryType] = useAtom(selectedEntryTypeAtom);

  return (
    <motion.div
      initial={animationVariants.hidden}
      animate={animationVariants.visible}
      exit={animationVariants.hidden}
      className="fixed bottom-10 right-10"
    >
      <div className="flex w-full flex-col items-end justify-center">
        <motion.div
          initial={animationComponentVariants.hidden}
          animate={animationComponentVariants.visible}
          exit={animationComponentVariants.hidden}
          className="my-2 flex w-fit cursor-pointer flex-row bg-black p-2 text-white"
          onClick={() => {
            setShowActionWheel(false);
            setShowAddJournalModal(true);
          }}
        >
          <BiBook className="h-6 w-6" />
          <h1 className="mx-2">Add Journal</h1>
        </motion.div>
        <motion.div
          initial={animationComponentVariants.hidden}
          animate={animationComponentVariants.visible}
          exit={animationComponentVariants.hidden}
          className="my-2 flex w-fit cursor-pointer flex-row bg-black p-2 text-white"
          onClick={() => {
            setShowActionWheel(false);
            setSelectedEntryType('edit');
            setAllowPagesDisplay(false);
            setShowEntryModal(true);
          }}
        >
          <BiPencil className="h-6 w-6" />
          <h1 className="mx-2">Add Entry</h1>
        </motion.div>
        <motion.div
          initial={animationComponentVariants.hidden}
          animate={animationComponentVariants.visible}
          exit={animationComponentVariants.hidden}
          className="my-2 flex w-fit cursor-pointer flex-row bg-black p-2 text-white"
          onClick={() => {
            setAllowPagesDisplay(false);
            setShowActionWheel(false);
            setSelectedNoteAtom(null);
            setNoteModalType('edit');
            setDisplayModal(true);
          }}
        >
          <TbNotes className="h-6 w-6" />
          <h1 className="mx-2">Add Note</h1>
        </motion.div>
        <Button
          onClick={() => {
            setShowActionWheel(false);
          }}
          width="fit"
          styles="opposite"
        >
          <IoClose className="h-6 w-6" />
        </Button>
      </div>
    </motion.div>
  );
};
