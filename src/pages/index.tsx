import React from 'react';
import { type NextPage } from 'next';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NextSeo } from 'next-seo';

// Icons
import { Button } from '@components/ui/Button';

const Home: NextPage = () => {
  const [tabState, setTabState] = React.useState(0);
  const [showMenu, setShowMenu] = React.useState(false);
  const router = useRouter();

  return (
    <AnimatePresence>
      <NextSeo
        key="seo"
        title="Home"
        description="A Thing is a place where you can anonymously share about daily life in short notes or log them in a journal."
      />
      <motion.div
        key="main"
        className={`flex h-screen w-screen flex-col items-center justify-center bg-opacity-[10%] bg-clouds-pattern p-10 font-spacemono font-semibold text-black`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="z-[10] flex w-full flex-col">
          <div className="fixed top-0 left-0 flex h-[60px] w-full ">
            <ul className="hidden w-full list-none flex-row justify-center gap-10 p-5 lg:flex">
              <li className="inline-block hover:underline">
                <Link href="/stats">stats.</Link>
              </li>
              <li className="inline-block hover:underline">
                <Link
                  href="https://github.com/is-it-ayush/athing"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.
                </Link>
              </li>
              <li className="inline-block hover:underline">
                <Link href="/rules" rel="noreferrer">
                  rules.
                </Link>
              </li>
              <li className="inline-block hover:underline">
                <Link href="/auth/login">login.</Link>
              </li>
              <li className="inline-block hover:underline">
                <Link href="/auth/signup">signup.</Link>
              </li>
            </ul>
            <ul className="flex w-full items-center justify-center p-5 lg:hidden">
              <li
                className="inline-block hover:underline"
                onClick={() => setShowMenu(!showMenu)}
              >
                {showMenu ? 'close.' : 'menu.'}
              </li>
            </ul>
          </div>
          {showMenu ? (
            <div className="fixed top-[50%] left-0 z-[999] w-full -translate-y-[50%] bg-black p-5 font-normal text-white">
              <ul className="flex flex-col items-center justify-center">
                <li className="inline-block hover:underline">
                  <Link href="/stats">stats.</Link>
                </li>
                <li className="inline-block hover:underline">
                  <Link
                    href="https://github.com/is-it-ayush/athing"
                    target="_blank"
                    rel="noreferrer"
                  >
                    github.
                  </Link>
                </li>
                <li className="inline-block hover:underline">
                  <Link href="/rules" rel="noreferrer">
                    rules.
                  </Link>
                </li>

                <li className="inline-block hover:underline">
                  <Link href="/auth/login">login.</Link>
                </li>
                <li className="inline-block hover:underline">
                  <Link href="/auth/signup">signup.</Link>
                </li>
              </ul>
            </div>
          ) : null}
          <div className="flex w-full flex-col text-center">
            <AnimatePresence mode="wait">
              {tabState === 0 ? (
                <motion.div
                  key={1}
                  className="flex w-full flex-col items-center justify-evenly border-2 border-black bg-white p-5 lg:flex-row"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="my-5 flex p-5 text-5xl font-bold">
                    <h1 className="flex">athing.</h1>
                  </div>
                  <div className="flex flex-col items-center justify-center p-5">
                    <p className="font-regular prose my-2 w-[250px] lg:w-[400px]">
                      a small place where you can vent and log your daily life
                      anonymously.
                    </p>
                    <div className="flex flex-row gap-5">
                      <Button
                        width="fit"
                        onClick={() => {
                          setTabState(1);
                        }}
                      >
                        know more.
                      </Button>
                      <Button
                        width="fit"
                        onClick={() => {
                          router.push('/auth/signup');
                        }}
                      >
                        signup.
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : tabState === 1 ? (
                <motion.div
                  key={2}
                  className="flex w-full flex-col items-start justify-evenly border-2 border-black bg-white text-start lg:flex-row lg:items-center"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="my-5 flex p-5 text-5xl font-bold">
                    <h1 className="flex">goal.</h1>
                  </div>
                  <div className="flex flex-col items-start p-5">
                    <p className="font-regular prose my-2 min-w-[200px]">
                      we wrote 'athing.' because we sometimes struggled with
                      sharing things. the idea of being judged, vulnerable or
                      misunderstood is scary. the whole point of 'athing.' is
                      provide an anonymouse space for people to share their
                      feelings and lives without fear. we hope you find it
                      helpful because we did when we wrote it. there are limits
                      to what you can share, checkout the{' '}
                      <Link href="/rules" rel="noreferrer">
                        rules
                      </Link>{' '}
                      and follow them to keep everyone safe.
                    </p>
                    <Button
                      width="fit"
                      onClick={() => {
                        setTabState(2);
                      }}
                    >
                      but...my data?
                    </Button>
                  </div>
                </motion.div>
              ) : tabState === 2 ? (
                <motion.div
                  key={3}
                  className="flex w-full flex-col items-center justify-evenly border-2 border-black bg-white p-5 text-start lg:flex-row"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-regular prose my-2 min-w-[200px]">
                    athing. is completely{' '}
                    <span className="font-semibold text-green-600">
                      open source under MIT License
                    </span>
                    . yes! you can verify through the source code yourself{' '}
                    <Link
                      className="font-semibold text-blue-600 underline decoration-wavy"
                      href="https://github.com/is-it-ayush/athing"
                    >
                      here
                    </Link>
                    . we don&apos;t store any personal data that could be tied
                    back to you. the account can also be deleted at any time.
                  </p>
                  <Button
                    width="fit"
                    onClick={() => {
                      router.push('/auth/signup');
                    }}
                  >
                    signup.
                  </Button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="fixed bottom-5 left-0 flex w-full justify-center p-5">
            <div className="w-fit">
              with 💙 from{' '}
              <a
                href="https://twitter.com/is_it_ayush"
                target="_blank"
                className="hover:underline"
                rel="noreferrer"
              >
                ayush
              </a>{' '}
              &{' '}
              <a
                href="https://instagram.com/devesh9431"
                target="_blank"
                className="hover:underline"
                rel="noreferrer"
              >
                devesh
              </a>{' '}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;
