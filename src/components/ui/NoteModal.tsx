import React from 'react';
import { trpc } from '@utils/trpc';
import { handleError } from '@utils/client.util';
import { motion } from 'framer-motion';
import { Button } from './Button';

// Atoms
import {
  userInfo,
  showModal,
  noteModal,
  selectedNoteAtom,
  showToastAtom,
  toastIntentAtom,
  toastMessageAtom,
  allowPagesDisplayAtom,
} from '@utils/store';

// Icons
import { RiSaveLine } from 'react-icons/ri';
import { BiLockOpenAlt, BiLockAlt } from 'react-icons/bi';

// Types
import { useAtom } from 'jotai';

export const NoteModal = () => {
  // Atoms
  const [noteModelType] = useAtom(noteModal);
  const [, setDisplayModal] = useAtom(showModal);
  const [selectedNote] = useAtom(selectedNoteAtom);
  const [, setToastIntent] = useAtom(toastIntentAtom);
  const [, setToastMessage] = useAtom(toastMessageAtom);
  const [, setShowToast] = useAtom(showToastAtom);
  const [, setAllowPagesDisplay] = useAtom(allowPagesDisplayAtom);

  // Add Properties
  const [text, setText] = React.useState(selectedNote?.text ?? '');
  const [isNotePrivate, setIsNotePrivate] = React.useState(
    !selectedNote?.isPublished,
  );

  const createNoteMutation = trpc.post.create.useMutation();
  const updateNoteMutation = trpc.post.edit.useMutation();

  // Helpers
  const utils = trpc.useUtils();
  const [user] = useAtom(userInfo);

  React.useEffect(() => {
    if (isNotePrivate) {
      setShowToast(true);
      setToastIntent('info');
      setToastMessage('Your note is now private.');
    } else {
      setShowToast(true);
      setToastIntent('info');
      setToastMessage('Your note is now public.');
    }
  }, [isNotePrivate]);

  async function handleNoteSave() {
    try {
      let res;
      if (selectedNote !== null) {
        res = await updateNoteMutation.mutateAsync({
          id: selectedNote.id,
          text,
          isPrivate: isNotePrivate,
        });
      } else {
        res = await createNoteMutation.mutateAsync({
          text,
          isPrivate: isNotePrivate,
        });
      }
      if (res.result) {
        setToastIntent('success');
        setToastMessage('The note was saved successfully.');
        setShowToast(true);

        // Invalidate the query
        utils.post.get.refetch();
        utils.post.getPostsByUserId.refetch({ id: user.id });

        setAllowPagesDisplay(true);
        setDisplayModal(false);
      }
    } catch (err) {
      const errorMessage = await handleError(err);
      setToastIntent('error');
      setToastMessage(errorMessage);
      setShowToast(true);
    }
  }

  // Exceed Handler
  React.useEffect(() => {
    if (text.length >= 3000 && noteModelType === 'add') {
      setToastIntent('error');
      setToastMessage('Your note is too long! Checkout Journals?');
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  }, [text]);

  return (
    <motion.div
      className="font-monospace fixed top-0 left-0 z-[998] flex h-screen w-screen bg-white text-black"
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.5 }}
    >
      {
        <div className="fixed top-0 left-0 flex h-3 w-screen">
          <span
            className="transition-all duration-300 "
            style={{
              backgroundColor: '#000000',
              width: `${(text.length / 3000) * 100}%`,
            }}
          ></span>
        </div>
      }
      <div className="absolute bottom-[100px] right-5 flex flex-col lg:top-5">
        <Button
          flex="row"
          type="button"
          onClick={() => {
            setAllowPagesDisplay(true);
            setDisplayModal(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
        {noteModelType === 'add' || noteModelType === 'edit' ? (
          <>
            <Button
              flex="row"
              type="button"
              onClick={() => {
                handleNoteSave();
              }}
            >
              <RiSaveLine className="h-6 w-6" />
            </Button>
            <Button
              flex="row"
              type="button"
              onClick={() => {
                setIsNotePrivate(!isNotePrivate);
              }}
            >
              {isNotePrivate ? (
                <BiLockAlt className="h-6 w-6 text-red-600 " />
              ) : (
                <BiLockOpenAlt className="h-6 w-6 text-green-600" />
              )}
            </Button>
          </>
        ) : null}
      </div>
      {
        // Add Note Modal
        noteModelType === 'edit' || noteModelType === 'add' ? (
          // Textarea
          <textarea
            className="h-screen w-full resize-none border-none p-20 focus:border-white focus:ring-0"
            placeholder="hey, it'll get better. tell me all about it!!!"
            minLength={20}
            maxLength={3000}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
        ) : noteModelType === 'parse' ? (
          <textarea
            readOnly={true}
            className="h-screen w-full resize-none border-none p-20 focus:border-white focus:ring-0"
            placeholder="hey, it'll get better. tell me all about it!!!"
            minLength={20}
            maxLength={3000}
            value={selectedNote?.text}
          />
        ) : null
      }
    </motion.div>
  );
};
