import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IoArrowBack, IoClose } from 'react-icons/io5';

const RulesData = {
	0: {
		title: 'All Opinions Are Welcome',
		description:
			'We believe that everyone has the right to express their opinions. We vow to never censor or moderate content based on the opinions expressed in it. However, we do not tolerate hate speech, harassment, or threats of violence.',
	},
	1: {
		title: 'If you want to tell a story, always use made up names, characters and locations.',
		description:
			'You can tell all stories about your life, but you must use made up names, characters and locations. This is to protect your privacy and the privacy of others. We do not tolerate doxing or outing.',
	},
	2: {
		title: 'If you do not agree with someone, scroll past them.',
		description:
			'If you do not agree with someone, scroll past them. You can also put your phone down and go outside, have some fresh air and enjoy some time without your phone. It is necessary.',
	},
	3: {
		title: "Anything illegal under Indian Jurisdiction is strictly not allowed. It'll lead to a permanent ban.",
		description:
			"Anything illegal under Indian Jurisdiction is strictly not allowed. It'll lead to a permanent ban. The title is self explanatory. It'll lead to an instant permanent ban.",
	},
	4: {
		title: "You're free to say whatever you want, except for hate.",
		description:
			"You're free to say whatever you want, except for hate. We are responsible for our words. The more internet has become a part of our lives, the smaller this world has become. It might feel like your words are harmless, but they can have a huge impact on someone's life. We do not tolerate hate speech, harassment, or threats of violence. Act responsibly.",
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
			transition={{ duration: 0.5 }}>
			<NextSeo title="Rules" description="The Rule's Page Of A Thing." />
			<div className="mt-[60px] flex w-full flex-col gap-5 lg:flex-row">
				<div className="absolute top-5 left-5 cursor-pointer rounded-full bg-white p-2" onClick={() => router.back()}>
					<IoArrowBack className="h-10 w-10 p-2 text-black" />
				</div>
				<div className="flex w-fit flex-col justify-center gap-5 border-2 bg-white p-5 hover:border-black">
					<h1 className="text-2xl font-bold">Note</h1>
					<div className="flex flex-col font-normal">
						<h6 className=""></h6>
						<p className="">
							Hi,{<br />} &lsquo;Freedom Of Speech&lsquo; is a fundamental right. All of us deserve our opinions to be heard.
							However, It comes at a cost. The cost to convey your opinions responsibly even when you&apos;re anonymous.{' '}
							<b className="font-semibold text-green-600 underline decoration-wavy">A Thing</b> has{' '}
							<b>zero tolerance</b> for anyone that break&apos;s the following rules as defined. Not Doing so
							<b className="font-semibold text-red-600"> will result in a Ban.</b> If you have any suggestions, drop us
							a{' '}
							<a
								href="https://twitter.com/intent/tweet?screen_name=athing_app"
								className="cursor-pointer font-semibold text-blue-600 underline decoration-wavy"
								target="_blank"
								rel="noreferrer">
								tweet
							</a>
							. {<br />}
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
							}}>
							1. All opinions are welcome.
						</h6>
						<h6
							className="cursor-pointer p-2 hover:bg-black hover:text-white"
							onClick={() => {
								setRuleInfo(RulesData[1]);
								setShowRuleInfo(true);
							}}>
							2. If you want to tell a story, always use made up names, characters and locations.
						</h6>
						<h6
							className="cursor-pointer p-2 hover:bg-black hover:text-white"
							onClick={() => {
								setRuleInfo(RulesData[2]);
								setShowRuleInfo(true);
							}}>
							3. If you do not agree with someone, scroll past them.
						</h6>
						<h6
							className="cursor-pointer p-2 hover:bg-black hover:text-white"
							onClick={() => {
								setRuleInfo(RulesData[3]);
								setShowRuleInfo(true);
							}}>
							4. Anything illegal under <b className="font-semibold text-yellow-600">Indian Jurisdiction</b> is strictly
							not allowed. It&apos;ll lead to a permanent ban.
						</h6>
						<h6
							className="cursor-pointer p-2 hover:bg-black hover:text-white"
							onClick={() => {
								setRuleInfo(RulesData[4]);
								setShowRuleInfo(true);
							}}>
							5. You&apos;re free to say whatever you want, except for hate.
						</h6>
					</div>
				</div>
				{showRuleInfo ? (
					<motion.div
						className="fixed top-[50%] left-[50%] flex h-fit w-[300px] -translate-x-[50%] -translate-y-[50%] flex-col gap-2 border-2 border-black bg-white p-10 lg:w-fit"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}>
						<div
							className="absolute -top-5 -right-5 cursor-pointer rounded-full border-2 border-black bg-white p-5"
							onClick={() => setShowRuleInfo(false)}>
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
