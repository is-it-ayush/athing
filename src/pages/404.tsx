import { Button } from '@components/ui/Button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AiFillBackward } from 'react-icons/ai';
import { NextSeo } from 'next-seo';

const NotFoundAnimations = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
	transition: { duration: 0.5 },
};

export default function NotFound() {
	const router = useRouter();

	return (
		<motion.div
			className="flex h-screen w-screen flex-col items-center justify-center font-spacemono"
			initial={NotFoundAnimations.hidden}
			animate={NotFoundAnimations.visible}
			exit={NotFoundAnimations.hidden}
			transition={NotFoundAnimations.transition}>
			<NextSeo title="404" />
			<div className="flex flex-col items-center justify-center p-5 text-center">
				<h1 className="text-9xl font-bold text-pink-600">404</h1>
				<h2 className="my-3 text-3xl">You are lost. Lets get you back.</h2>
				<Button
					flex="row"
					width="fit"
					onClick={() => {
						router.back();
					}}>
					<AiFillBackward className="h-6 w-6" />
					<h1 className="ml-2">Head Back</h1>
				</Button>
			</div>
		</motion.div>
	);
}
