import { motion } from 'framer-motion';
import { RiArrowRightSLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import {
  allowPagesDisplayAtom,
  currentPageAtom,
  menuOpenAtom,
  showSettingsModalAtom,
} from '@utils/store';
import { useAtom } from 'jotai';
import Link from 'next/link';

export const Menu = () => {
  const router = useRouter();

  const [, setShowPage] = useAtom(currentPageAtom);
  const [, setAllowPagesDisplay] = useAtom(allowPagesDisplayAtom);
  const [, setShowSettingsModal] = useAtom(showSettingsModalAtom);
  const [menuOpen, setMenuOpen] = useAtom(menuOpenAtom);

  return menuOpen ? (
    <motion.div className="fixed top-[50%] flex min-h-fit w-screen translate-y-[-50%] flex-col items-center justify-center bg-black p-5 font-spacemono text-white">
      <ul className="lg:hidden">
        <button
          className="flex flex-row items-center justify-start"
          onClick={() => {
            setShowPage(0);
            setMenuOpen(false);
          }}
        >
          <li className="px-5 hover:underline">Notes</li>
          <RiArrowRightSLine />
        </button>
        <button
          className="flex flex-row items-center justify-start"
          onClick={() => {
            setShowPage(1);
            setMenuOpen(false);
          }}
        >
          <li className="px-5 hover:underline">Journals</li>
          <RiArrowRightSLine />
        </button>
        <button
          className="flex flex-row items-center justify-start"
          onClick={() => {
            setShowPage(2);
            setMenuOpen(false);
          }}
        >
          <li className="px-5 hover:underline">Private</li>
          <RiArrowRightSLine />
        </button>
      </ul>
      <ul>
        <button
          className="flex flex-row items-center justify-start"
          onClick={() => {
            setAllowPagesDisplay(false);
            setShowSettingsModal(true);
            setMenuOpen(false);
          }}
        >
          <li className="px-5 hover:underline">Settings</li>
          <RiArrowRightSLine />
        </button>
        <button
          className="flex flex-row items-center justify-start"
          onClick={() => {
            setCookie(null, 'token', '', {
              maxAge: -1,
              path: '/',
            });
            router.refresh();
          }}
        >
          <li className="px-5 hover:underline">Logout</li>
          <RiArrowRightSLine />
        </button>
      </ul>
    </motion.div>
  ) : null;
};
