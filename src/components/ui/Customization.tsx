import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import {
  allowPagesDisplayAtom,
  selectedCustomizationAtom,
  showCustomizationModalAtom,
  showSettingsModalAtom,
  showToastAtom,
  toastIntentAtom,
  toastMessageAtom,
} from '@utils/store';
import { Button } from './Button';
import getTheme, { THEME_CONFIG } from '@utils/PatternController';

const CustomizationAnimations = {
  hidden: {
    y: '100%',
  },
  visible: {
    y: 0,
  },
  transition: {
    duration: 0.2,
  },
};
const length = Object.keys(THEME_CONFIG).length;

export const Customization = () => {
  const [, setShowCustomizationModal] = useAtom(showCustomizationModalAtom);
  const [showSettingsModal] = useAtom(showSettingsModalAtom);
  const [, setAllowPagesDisplay] = useAtom(allowPagesDisplayAtom);
  const [selectedTheme, setSelectedTheme] = useAtom(selectedCustomizationAtom);
  const [, setToastIntent] = useAtom(toastIntentAtom);
  const [, setToastMessage] = useAtom(toastMessageAtom);
  const [, setShowToast] = useAtom(showToastAtom);

  async function handleClose() {
    // Special Case Wrap: If the user is in the settings modal.
    // We want to close the customization modal and still NOT* display pages.
    if (!showSettingsModal) {
      setAllowPagesDisplay(true);
    }
    setShowCustomizationModal(false);
  }

  async function handleThemeSelect(i: number) {
    setSelectedTheme(i);
    setToastIntent('success');
    setToastMessage('You theme has been selected!');
    setShowToast(true);
    handleClose();
  }

  return (
    <motion.div
      className="absolute top-0 left-0 z-[999] flex min-h-screen w-screen flex-col bg-white p-10"
      initial={CustomizationAnimations.hidden}
      animate={CustomizationAnimations.visible}
      exit={CustomizationAnimations.hidden}
      transition={CustomizationAnimations.transition}
    >
      <div className="absolute right-5 top-5 flex">
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
      <div className="mt-[60px] flex flex-col flex-wrap items-center justify-center gap-10 lg:flex-row">
        {[...Array(length)].map((_, i) => (
          <div
            key={i}
            className={
              `flex h-[150px] w-[300px] cursor-pointer flex-col border-2 hover:border-black ` +
              (selectedTheme === i ? 'border-black ' : 'border-gray-300 ') +
              getTheme(i)
            }
            onClick={() => {
              handleThemeSelect(i);
            }}
          ></div>
        ))}
      </div>
    </motion.div>
  );
};
