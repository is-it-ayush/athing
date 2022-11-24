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
	const router = useRouter();

	const getColor = () => {
		const colors = [
			'to-blue-900',
			'to-green-900',
			'to-yellow-900',
			'to-red-900',
			'to-purple-800',
			'to-pink-900',
			'to-indigo-900',
			'to-rose-900',
			'to-emerald-900',
			'to-cyan-900',
			'to-teal-900',
			'to-orange-900',
		];
		const random = Math.floor(Math.random() * colors.length);
		return colors[random];
	};

	return (
		<AnimatePresence>
			<NextSeo
				title="Home"
				description="A Thing is a place where you can anonymously share about daily life in short notes or log them in a journal."
			/>
			<motion.div
				className={`flex h-screen w-screen flex-col items-center justify-center bg-clouds-pattern p-10 font-spacemono text-black`}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}>
				<div className="z-[10] flex w-full flex-col">
					<div className="fixed top-0 left-0 flex h-[60px] w-full ">
						<ul className="flex w-full list-none flex-row justify-center gap-10 p-5">
							<li className="inline-block hover:underline">
								<Link href="/stats">Stats</Link>
							</li>
							<li className="inline-block hover:underline">
								<Link href="https://github.com/is-it-ayush/athing" target="_blank" rel="noreferrer">
									Github
								</Link>
							</li>
							<li className="inline-block hover:underline">
								<Link href="/auth/login" prefetch={true}>
									Login
								</Link>
							</li>
							<li className="inline-block hover:underline">
								<Link href="/auth/signup" prefetch={true}>
									Signup
								</Link>
							</li>
						</ul>
					</div>
					<div className="flex w-full flex-col text-center">
						<AnimatePresence>
							{tabState === 0 ? (
								<motion.div
									className="flex w-full flex-col items-center justify-evenly p-5 lg:flex-row"
									initial={{ x: '-100%' }}
									animate={{ x: 0 }}
									exit={{ x: '100%' }}
									transition={{ duration: 0.3 }}>
									<div className="m-5 flex h-[300px] w-[300px] items-center justify-center border-[10px] border-black text-center text-5xl font-bold">
										<h1 className="absolute flex rotate-90">A-THING</h1>
										<h1 className="absolute flex">A-THING</h1>
									</div>
									<div className="flex flex-col items-center justify-center p-5">
										<p className="prose my-2 w-[300px] font-light lg:w-[400px]">
											A place where you can vent and log your daily life anonymously.
										</p>
										<div className="flex flex-row gap-5">
											<Button
												width="fit"
												onClick={() => {
													setTabState(1);
												}}>
												Know More
											</Button>
											<Button
												width="fit"
												onClick={() => {
													router.push('/auth/signup');
												}}>
												Sign Up
											</Button>
										</div>
									</div>
								</motion.div>
							) : tabState === 1 ? (
								<motion.div
									className="flex w-full flex-col items-start justify-evenly text-start lg:flex-row lg:items-center"
									initial={{ x: '-100%' }}
									animate={{ x: 0 }}
									exit={{ x: '100%' }}
									transition={{ duration: 0.3 }}>
									<div className="my-5 flex p-5 text-5xl font-bold">
										<h1 className="flex">HERE&apos; A THING</h1>
									</div>
									<div className="flex flex-col items-start p-5">
										<p className="prose my-2 w-[300px] font-light">
											A Thing is a place where you can anonymously share about daily life in short notes. You can also
											write journals and log your entries. Make them public or private, it&apos;s up to you.
										</p>
										<Button
											width="fit"
											onClick={() => {
												setTabState(2);
											}}>
											Ah, But My Data?
										</Button>
									</div>
								</motion.div>
							) : tabState === 2 ? (
								<motion.div
									className="flex w-full flex-col items-center justify-evenly p-5 text-start lg:flex-row"
									initial={{ x: '-100%' }}
									animate={{ x: 0 }}
									exit={{ x: '100%' }}
									transition={{ duration: 0.3 }}>
									<p className="prose my-2 min-w-[300px] font-light">
										The Project is completely{' '}
										<a className="font-semibold text-green-600 underline decoration-wavy">Open Source</a> under{' '}
										<a className="font-semibold text-yellow-600 underline decoration-wavy">MIT License</a>. Yes, You can
										verify through the source code yourself. We don&apos;t store any personal data that could be tied
										back to you. The account can also be deleted at any time.
									</p>
									<Button
										width="fit"
										onClick={() => {
											router.push('/auth/signup');
										}}>
										Sign Up
									</Button>
								</motion.div>
							) : null}
						</AnimatePresence>
					</div>
					<div className="fixed bottom-5 left-0 flex w-full p-5">
						<ul className="flex w-full justify-evenly">
							<li className="items-center justify-center">
								[A Thing By{' '}
								<a href="https://twitter.com/is_it_ayush" target="_blank" className="hover:underline" rel="noreferrer">
									Ayush
								</a>{' '}
								&{' '}
								<a href="https://instagram.com/devesh9431" target="_blank" className="hover:underline" rel="noreferrer">
									Devesh
								</a>{' '}
								]
							</li>
						</ul>
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default Home;
