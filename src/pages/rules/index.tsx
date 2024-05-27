import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IoArrowBack, IoClose } from 'react-icons/io5';

const RulesData = {
  0: {
    title: 'All Opinions Are Welcome',
    description:
      'Express your opinions freely, but we do not tolerate hate speech, harassment, or threats of violence. We will determine what constitutes hate speech. Act responsibly.',
  },
  1: {
    title: 'Use Fictional Names and Locations',
    description:
      'Share your stories with fictional names, characters, and locations to protect privacy. We do not tolerate doxing or outing.',
  },
  2: {
    title: 'Scroll Past Disagreements',
    description:
      'If you disagree with someone, scroll past their post or take a break from your phone. Enjoy some time offline.',
  },
  3: {
    title: 'Prohibited/Illegal Content Policy',
    description:
      'Our platform operates under Indian jurisdiction. Any prohibited or illegal content will be removed, and the responsible account terminated. Zero tolerance for illegal activities. Act responsibly.',
  },
  4: {
    title: 'Respect Others',
    description:
      'Say what you want, but do not spread hate. Your words matter. We do not tolerate hate speech, harassment, or threats of violence. Act responsibly.',
  },
};

const RulesPage = () => {
  const [showRuleInfo, setShowRuleInfo] = React.useState(false);
  const [ruleInfo, setRuleInfo] = React.useState(RulesData[0]);
  const router = useRouter();

  return (
    <motion.div
      className={`flex min-h-screen w-screen flex-col items-center justify-center bg-opacity-[10%] bg-clouds-pattern p-10 font-spacemono font-semibold text-black`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NextSeo title="Rules" description="The Rule's Page Of A Thing." />
      <div className="mt-[60px] flex w-full flex-col gap-5 lg:flex-row">
        <div
          className="absolute top-5 left-5 cursor-pointer rounded-full bg-white p-2"
          onClick={() => router.back()}
        >
          <IoArrowBack className="h-10 w-10 p-2 text-black" />
        </div>
        <div className="flex w-fit flex-col justify-center gap-5 border-2 bg-white p-5 hover:border-black">
          <h1 className="text-2xl font-bold">Note</h1>
          <div className="flex flex-col font-normal">
            <h6 className=""></h6>
            <p className="">
              Hi,
              <br />
              Freedom of speech is a fundamental right, and everyone deserves to
              have their opinions heard. However, with this freedom comes the
              responsibility to express your opinions responsibly, even when
              anonymous. We have zero tolerance for violations of the following
              rules.{' '}
              <span className="font-bold text-red-600">
                Breaking them will result in a ban.
              </span>
              <br />
              <br />
              You can click on the rules for an explaination. If you have any
              suggestions or feedback, feel free to{' '}
              <a
                href="https://twitter.com/intent/tweet?screen_name=is_it_ayush"
                className="cursor-pointer font-semibold text-blue-600 underline decoration-wavy"
                target="_blank"
                rel="noreferrer"
              >
                tweet
              </a>{' '}
              me.
              <br />
              <br />
              Regards,{<br />}
              Ayush
            </p>
          </div>
        </div>
        <div className="flex flex-col border-2 bg-white p-5 hover:border-black">
          <h1 className="text-2xl font-bold">Rules</h1>
          <div className="flex flex-col font-normal">
            <h6
              className="cursor-pointer p-2 hover:bg-black hover:text-white"
              onClick={() => {
                setRuleInfo(RulesData[0]);
                setShowRuleInfo(true);
              }}
            >
              1. All Opinions Are Welcome.
            </h6>
            <h6
              className="cursor-pointer p-2 hover:bg-black hover:text-white"
              onClick={() => {
                setRuleInfo(RulesData[1]);
                setShowRuleInfo(true);
              }}
            >
              2. Use Fictional Names and Locations.
            </h6>
            <h6
              className="cursor-pointer p-2 hover:bg-black hover:text-white"
              onClick={() => {
                setRuleInfo(RulesData[2]);
                setShowRuleInfo(true);
              }}
            >
              3. Scroll Past Disagreements.
            </h6>
            <h6
              className="cursor-pointer p-2 hover:bg-black hover:text-white"
              onClick={() => {
                setRuleInfo(RulesData[3]);
                setShowRuleInfo(true);
              }}
            >
              4. Prohibited/Illegal Content Policy.
            </h6>
            <h6
              className="cursor-pointer p-2 hover:bg-black hover:text-white"
              onClick={() => {
                setRuleInfo(RulesData[4]);
                setShowRuleInfo(true);
              }}
            >
              5. Respect Others.
            </h6>
          </div>
        </div>
        {showRuleInfo ? (
          <motion.div
            className="fixed top-[50%] left-[50%] flex h-fit w-[300px] -translate-x-[50%] -translate-y-[50%] flex-col gap-2 border-2 border-black bg-white p-10 lg:w-fit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute -top-5 -right-5 cursor-pointer rounded-full border-2 border-black bg-white p-5"
              onClick={() => setShowRuleInfo(false)}
            >
              <IoClose className="sq-6" />
            </div>
            <h1 className="text-2xl font-bold">What?</h1>
            <p className="font-normal">{ruleInfo.title}</p>
            <h1 className="text-2xl font-bold">Why?</h1>
            <p className="font-normal">{ruleInfo.description}</p>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default RulesPage;
