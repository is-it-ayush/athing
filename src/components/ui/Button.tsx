import { cva, VariantProps } from 'class-variance-authority';

const ButtonStyles = cva(
	'flex p-3 my-2 border-2 border-gray-400 text-center justify-center items-center duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
	{
		variants: {
			styles: {
				default: 'bg-white text-black border-gray-200 hover:bg-black hover:text-white hover:border-black',
				opposite: 'bg-black text-white border-black hover:bg-white hover:text-black hover:border-white',
			},
			letterSpaced: {
				default: 'tracking-normal',
				true: 'tracking-widest',
				false: 'tracking-normal',
			},
			flex: {
				col: 'flex-col',
				row: 'flex-row',
			},
			width: {
				full: 'w-full',
				fit: 'w-fit',
			},
		},
		defaultVariants: {
			styles: 'default',
			letterSpaced: 'default',
			flex: 'col',
			width: 'full',
		},
	},
);

export interface ButtonProps extends VariantProps<typeof ButtonStyles> {
	children: React.ReactNode;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
}

export const Button = ({ children, onClick, disabled, type, ...props }: ButtonProps) => {
	return (
		<button onClick={onClick} className={ButtonStyles(props)} disabled={disabled} type={type ?? 'button'}>
			{children}
		</button>
	);
};
