import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

// Icons
import { GrFormView, GrFormViewHide } from 'react-icons/gr';

const InputStyles = cva(
  'mt-1 block w-full border-gray-300 shadow-sm outline-none duration-200',
  {
    variants: {
      intent: {
        default:
          'border-gray-300 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50',
        error:
          'border-red-300 focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50',
        warning:
          'border-yellow-300 focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50',
        success:
          'border-green-300 focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50',
      },
      fullWidth: {
        default: 'w-full',
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      intent: 'default',
    },
  },
);

export interface InputProps extends VariantProps<typeof InputStyles> {
  id: string;
  type: string;
  label?: string;
  customLabel?: React.ReactNode;
  value?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >['value'];
  onChange?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >['onChange'];
  checked?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >['checked'];
  onBlur?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >['onBlur'];
}

export const Input = ({
  id,
  type,
  label,
  value,
  checked,
  onChange,
  customLabel = null,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const getType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return type;
  };

  if (type === 'checkbox') {
    return (
      <div className="my-2 flex items-center justify-center">
        <input
          id={id}
          type="checkbox"
          className={InputStyles(props)}
          checked={checked}
          onChange={onChange}
          style={{
            width: '1.0rem',
            backgroundColor: checked ? 'green' : 'white',
          }}
        />
        <label
          htmlFor={id}
          className="ml-2 flex h-full w-full items-center justify-center whitespace-nowrap text-sm"
        >
          {customLabel ? customLabel : label}
        </label>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col">
      <div className="my-2 flex flex-col">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={getType()}
          className={InputStyles(props)}
          value={value}
          onChange={onChange}
        />
      </div>
      {type === 'password' && (
        <div
          className="animate-fade-in absolute right-2 top-[50%] flex cursor-pointer duration-200"
          onClick={() => {
            setShowPassword(!showPassword);
          }}
        >
          {showPassword ? (
            <GrFormView className="flex h-[28px] w-[28px]" />
          ) : (
            <GrFormViewHide className="flex h-[28px] w-[28px]" />
          )}
        </div>
      )}
    </div>
  );
};
