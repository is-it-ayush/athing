import React from 'react';
import { trpc } from '@utils/trpc';
import { AnimatePresence, motion } from 'framer-motion';
import { useAtom } from 'jotai';
import {
  noteModal,
  selectedNoteAtom,
  showToastAtom,
  toastIntentAtom,
  toastMessageAtom,
  userInfo,
  showModal,
} from '@utils/store';

// Icons
import { BiLockOpenAlt, BiLockAlt, BiBookOpen, BiEdit } from 'react-icons/bi';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { JournalBook } from '@components/ui/JournalBook';
import ScrollContainer from 'react-indiana-drag-scroll';

export const Private: React.FC = () => {
  const [, setSelectedNote] = useAtom(selectedNoteAtom);
  const [, setModalType] = useAtom(noteModal);
  const [, setShowModal] = useAtom(showModal);
  const [, setToastIntent] = useAtom(toastIntentAtom);
  const [, setToastMessage] = useAtom(toastMessageAtom);
  const [, setShowToast] = useAtom(showToastAtom);

  // Atoms
  const [user] = useAtom(userInfo);

  // TRPC
  const deleteNote = trpc.post.delete.useMutation();
  const allPostsData = trpc.post.getPostsByUserId.useQuery({
    id: user.id,
  });
  const journalsQuery = trpc.journals.getJournalsByUserId.useQuery({
    id: user.id,
  });

  // --todo-- Extract these functions:
  async function handleNoteDelete(note_id: string) {
    const res = await deleteNote.mutateAsync({ id: note_id });
    if (res.result) {
      setSelectedNote(null);
      setShowToast(true);
      setToastIntent('success');
      setToastMessage('Your note has been deleted successfully.');
      allPostsData.refetch();
    }
  }

  return (
    <motion.div
      className="flex h-screen w-screen flex-col justify-center overflow-hidden p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col">
        <AnimatePresence mode="wait">
          {allPostsData.status === 'success' &&
          allPostsData.data !== undefined ? (
            allPostsData.data.posts.length > 0 ? (
              <ul className="no-select no-scrollbar flex flex-grow snap-x snap-mandatory flex-row overflow-x-auto">
                <ScrollContainer className=" flex flex-row">
                  {allPostsData.data.posts.map((note) => {
                    return (
                      <motion.li
                        key={note.id}
                        className={`mx-5 mt-5 flex min-h-[200px] min-w-[300px] cursor-pointer snap-center flex-col justify-evenly border-2 bg-white p-5 transition-all hover:border-black `}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="my-3 flex flex-col">
                          {note.isPublished ? (
                            <div className="flex flex-row text-pink-600">
                              <BiLockOpenAlt className="mx-2 h-6 w-6 " />
                              <p className="text-xl font-semibold">Public</p>
                            </div>
                          ) : (
                            <div className="flex flex-row text-gray-600">
                              <BiLockAlt className="mx-2 h-6 w-6 " />
                              <p className="text-xl font-semibold">Private</p>
                            </div>
                          )}
                          <h1 className="flex text-sm text-gray-700">
                            {note.at
                              ? Intl.DateTimeFormat('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: '2-digit',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                }).format(new Date(note.at))
                              : 'Sometime ago.'}
                          </h1>
                        </div>
                        <h6 className="whitespace-normal break-all	">
                          {note.text.length > 25
                            ? `${note.text.substring(0, 25)}...`
                            : note.text}
                        </h6>
                        <div className="mt-2 flex w-full flex-row justify-start">
                          <button
                            className="mr-2 w-fit cursor-pointer rounded-full p-2 transition-all duration-200 hover:bg-gray-300"
                            onClick={() => {
                              setSelectedNote(note);
                              setModalType('parse');
                              setShowModal(true);
                            }}
                          >
                            <BiBookOpen className="h-6 w-6" />
                          </button>
                          <button
                            className="mr-2 w-fit cursor-pointer rounded-full p-2 transition-all duration-200 hover:bg-gray-300"
                            onClick={() => {
                              setSelectedNote(note);
                              setModalType('edit');
                              setShowModal(true);
                            }}
                          >
                            <BiEdit className="h-6 w-6" />
                          </button>
                          <button
                            className="mr-2 w-fit cursor-pointer rounded-full p-2 transition-all duration-200 hover:bg-gray-300"
                            onClick={() => {
                              handleNoteDelete(note.id);
                            }}
                          >
                            <MdOutlineDeleteOutline className="h-6 w-6" />
                          </button>
                        </div>
                      </motion.li>
                    );
                  })}
                </ScrollContainer>
              </ul>
            ) : (
              <motion.li
                className={`my-5 flex min-h-[200px] w-[300px] cursor-pointer snap-center flex-col justify-evenly border-2 bg-white p-5 transition-all hover:border-black `}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div className="my-3 flex flex-col">
                  <div className="flex flex-row text-pink-600">
                    <BiLockOpenAlt className="mx-2 h-6 w-6 " />
                    <p className="text-xl font-semibold">For You!</p>
                  </div>
                  <h1 className="mx-2 flex text-sm text-gray-700">
                    Sometime ago...
                  </h1>
                </motion.div>
                <h6 className="whitespace-normal break-all">
                  Welcome! Create your first note.
                </h6>
              </motion.li>
            )
          ) : (
            <motion.li
              className={`my-5 flex min-h-[200px] w-[300px] animate-pulse snap-center flex-col justify-evenly border-2 border-none bg-white p-5`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="my-3 flex flex-col">
                <div className="flex w-full animate-pulse flex-row bg-gray-300 p-3" />
              </div>
              <div className="mt-3 flex flex-col">
                <div className="flex w-full animate-pulse flex-row bg-gray-300 p-10" />
              </div>
            </motion.li>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-5 flex flex-col">
        <h1 className="flex text-xl font-semibold">Journals</h1>

        <div>
          <AnimatePresence mode="wait">
            {journalsQuery.status === 'success' ? (
              journalsQuery.data.length > 0 ? (
                <motion.ul
                  className="no-select no-scrollbar flex flex-grow snap-x snap-mandatory flex-row overflow-x-auto"
                  layout="position"
                >
                  <ScrollContainer
                    className="flex flex-row"
                    hideScrollbars={true}
                  >
                    {journalsQuery.data.map((journal) => {
                      return (
                        <JournalBook
                          type="view"
                          journal={journal}
                          key={journal.id}
                        />
                      );
                    })}
                  </ScrollContainer>
                </motion.ul>
              ) : (
                <motion.div
                  key="initialJournalKey"
                  className={`m-5 flex min-h-[300px] min-w-[200px] max-w-[200px] cursor-pointer flex-col justify-evenly border-2 bg-white bg-overlapcrc-pattern p-5 transition-all hover:border-black`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col">
                    <div className="my-3 flex flex-col">
                      <h1 className="flex h-[120px] items-center break-all text-xl font-bold text-black">
                        No Journals
                      </h1>
                      <div className="mt-2 w-fit">
                        <h1 className=" bg-pink-600 p-2 text-white">
                          Create One?
                        </h1>
                      </div>
                    </div>
                    <h4 className=" text-sm text-gray-600">
                      Hey! Click the Plus icon.
                    </h4>
                  </div>
                </motion.div>
              )
            ) : (
              <motion.div
                className={`m-5 flex min-h-[300px] min-w-[200px] max-w-[200px] animate-pulse cursor-pointer flex-col justify-evenly border-none bg-white p-5`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col">
                  <div className="my-3 flex flex-col">
                    <div className="flex w-full animate-pulse flex-row bg-gray-300 p-3" />
                  </div>
                  <div className="mt-3 flex flex-col">
                    <div className="flex w-full animate-pulse flex-row bg-gray-300 p-10" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
