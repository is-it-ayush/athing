import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { showCustomizationModalAtom } from '@utils/store';

const CustomizationAnimations = {
	hidden: {
		y: '100%',
	},
	visible: {
		y: 0,
	},
	transition: {
		duration: 0.5,
	},
};

export const Customization = () => {
	const [, setShowCustomizationModal] = useAtom(showCustomizationModalAtom);

	return (
		<motion.div
			className="absolute flex min-h-screen w-screen flex-col bg-white"
			initial={CustomizationAnimations.hidden}
			animate={CustomizationAnimations.visible}
			exit={CustomizationAnimations.hidden}
			transition={CustomizationAnimations.transition}>
			<div className="fixed top-5 right-5 cursor-pointer" onClick={() => setShowCustomizationModal(false)}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
				</svg>
			</div>
		</motion.div>
	);
};
