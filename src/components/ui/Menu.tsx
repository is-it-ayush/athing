import { motion } from 'framer-motion';
import { RiArrowRightSLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import { currentPageAtom } from '@utils/store';
import { useAtom } from 'jotai';

export const Menu = ({ menuController }: { menuController: boolean }) => {
	const router = useRouter();

	const [, setShowPage] = useAtom(currentPageAtom);

	return menuController ? (
		<motion.div className="fixed top-[50%] flex min-h-fit w-screen translate-y-[-50%] flex-col items-center justify-center bg-black p-5 font-spacemono text-white">
			<ul className="lg:hidden">
				<button
					className="flex flex-row items-center justify-center"
					onClick={() => {
						setShowPage(0);
					}}>
					<li className="px-5 hover:underline">Notes</li>
					<RiArrowRightSLine />
				</button>
				<button
					className="flex flex-row items-center justify-center"
					onClick={() => {
						setShowPage(1);
					}}>
					<li className="px-5 hover:underline">Journals</li>
					<RiArrowRightSLine />
				</button>
				<button
					className="flex flex-row items-center justify-center"
					onClick={() => {
						setShowPage(2);
					}}>
					<li className="px-5 hover:underline">Private</li>
					<RiArrowRightSLine />
				</button>
			</ul>
			<ul>
				<button className="flex flex-row items-center justify-center">
					<li className="px-5 hover:underline">Settings</li>
					<RiArrowRightSLine />
				</button>
				<button
					className="flex flex-row items-center justify-center"
					onClick={() => {
						setCookie(null, 'token', '', {
							maxAge: -1,
							path: '/',
						});
						router.refresh();
					}}>
					<li className="px-5 hover:underline">Logout</li>
					<RiArrowRightSLine />
				</button>
			</ul>
		</motion.div>
	) : null;
};
