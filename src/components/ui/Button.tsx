'use client';

import { cva, VariantProps } from 'class-variance-authority';

const ButtonStyles = cva(
  'flex flex-col p-3 my-2 border-2 border-gray-400 text-center justify-center items-center w-full duration-200',
  {
    variants: {
      styles: {
        default:
          'bg-white text-black border-gray-200 hover:bg-black hover:text-white hover:border-black',
      },
      letterSpaced: {
        default: 'tracking-normal',
        true: 'tracking-widest',
        false: 'tracking-normal',
      },
    },
    defaultVariants: {
      styles: 'default',
      letterSpaced: 'default',
    },
  },
);

export interface ButtonProps extends VariantProps<typeof ButtonStyles> {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button = ({ children, onClick, ...props }: ButtonProps) => {
  return (
    <button onClick={onClick} className={ButtonStyles(props)}>
      {children}
    </button>
  );
};
