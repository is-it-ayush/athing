import {
  allowPagesDisplayAtom,
  showSettingsModalAtom,
  showCustomizationModalAtom,
  selectedCustomizationAtom,
  showToastAtom,
  toastIntentAtom,
  toastMessageAtom,
  showConfirmDialogAtom,
  confirmDialogStateAtom,
  confirmDialogMessageAtom,
} from '@utils/store';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { Button } from './Button';
import { useRouter } from 'next/navigation';
import { trpc } from '@utils/trpc';
import { handleError } from '@utils/client.util';
import { IoSave } from 'react-icons/io5';
import React from 'react';
import { setCookie } from 'nookies';

const SettingsAnimations = {
  hidden: {
    y: '-100%',
  },
  visible: {
    y: 0,
  },
  transition: {
    duration: 0.2,
  },
};

export const Settings = () => {
  const [, setShowSettingsModal] = useAtom(showSettingsModalAtom);
  const [, setAllowPagesDisplay] = useAtom(allowPagesDisplayAtom);
  const [, setShowCustomizationModalAtom] = useAtom(showCustomizationModalAtom);
  const [selectedCustomization, setSelectedCustomization] = useAtom(
    selectedCustomizationAtom,
  );
  const [, setDisplayToast] = useAtom(showToastAtom);
  const [, setToastIntent] = useAtom(toastIntentAtom);
  const [, setToastMessage] = useAtom(toastMessageAtom);
  const router = useRouter();

  const [, setShowConfirmDialog] = useAtom(showConfirmDialogAtom);
  const [confirmDialogState, setConfirmDialogState] = useAtom(
    confirmDialogStateAtom,
  );
  const [, setConfirmDialogMessage] = useAtom(confirmDialogMessageAtom);

  const [hasSwitchedTheme, setHasSwitchedTheme] = React.useState(false);

  // tRPC
  const updateThemeMutation = trpc.user.update.useMutation();
  const deleteAccountMutation = trpc.user.delete.useMutation();
  const utils = trpc.useContext();

  async function handleClose() {
    setAllowPagesDisplay(true);
    setConfirmDialogState(false);
    setSelectedCustomization(0);
    setShowSettingsModal(false);
  }

  async function handleDelete() {
    if (!confirmDialogState) {
      setConfirmDialogMessage(
        'You will lose all your data and will not be able to recover it. You will be logged out.',
      );
      setShowConfirmDialog(true);
      return;
    } else {
      setShowConfirmDialog(false);
      deleteHelper();
    }
  }

  async function deleteHelper() {
    try {
      await deleteAccountMutation.mutateAsync({});

      // Logout
      setToastIntent('success');
      setToastMessage("You've successfully deleted your account.");
      setDisplayToast(true);

      setCookie(null, 'token', '', {
        maxAge: -1,
        path: '/',
      });
      router.refresh();
    } catch (err) {
      const message = await handleError(err);
      setToastIntent('error');
      setToastMessage(message);
      setDisplayToast(true);
    }
  }

  async function handleThemeSwitch() {
    try {
      console.log(`Updating theme to ${selectedCustomization}`);
      await updateThemeMutation.mutateAsync({
        styling: selectedCustomization,
      });
      setSelectedCustomization(0);
      utils.user.me.invalidate();
      setToastIntent('success');
      setToastMessage('Your background is now updated!');
      setDisplayToast(true);
    } catch (error) {
      const message = await handleError(error);
      setToastIntent('error');
      setToastMessage(message);
      setDisplayToast(true);
    }
  }

  async function handleHelp() {
    window.open(
      'https://twitter.com/intent/tweet?screen_name=athing_app',
      '_blank',
    );
  }

  return (
    <motion.div
      className="absolute top-0 left-0 z-[998] flex min-h-screen w-screen flex-col items-center justify-center bg-white p-10"
      initial={SettingsAnimations.hidden}
      animate={SettingsAnimations.visible}
      exit={SettingsAnimations.hidden}
      transition={SettingsAnimations.transition}
    >
      <div className="absolute right-5 top-5 flex gap-5">
        {hasSwitchedTheme ? (
          <Button
            styles="opposite"
            width="fit"
            onClick={() => {
              handleThemeSwitch();
            }}
          >
            <IoSave />
          </Button>
        ) : null}
        <Button
          styles="opposite"
          width="fit"
          onClick={() => {
            handleClose();
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
      </div>
      <div className="flex min-w-fit flex-col items-center justify-between">
        <div className="mb-5 w-full items-start border-2 border-gray-300 p-10">
          <h1 className="text-2xl font-bold">Theme</h1>
          <div className="my-2 flex flex-col items-center justify-center">
            <Button
              styles="opposite"
              width="full"
              onClick={() => {
                setShowCustomizationModalAtom(true);
                setHasSwitchedTheme(true);
              }}
            >
              Background
            </Button>
          </div>
        </div>
        <div className="m-5 w-full border-2 border-gray-300 p-10">
          <h1 className="text-2xl font-bold">Help</h1>
          <div className="my-2 flex flex-col items-center justify-center">
            <Button
              styles="twitter"
              width="full"
              onClick={() => {
                handleHelp();
              }}
            >
              Twitter
            </Button>
          </div>
        </div>
        <div className="mt-5 w-full border-2 border-red-400 p-10">
          <h1 className="text-2xl font-bold text-red-600">Danger</h1>
          <div className="my-2 flex-row justify-between">
            <Button
              type="button"
              styles="danger"
              width="full"
              onClick={() => {
                handleDelete();
              }}
            >
              {confirmDialogState ? 'Okay! Bye Bye.' : 'Delete Account'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
