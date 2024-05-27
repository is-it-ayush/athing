import { cva, type VariantProps } from 'class-variance-authority';
import React, { useEffect } from 'react';

const StrengthBarStyles = cva('flex w-full h-2 transition-all', {
  variants: {},
});

export interface StrengthBarProps
  extends VariantProps<typeof StrengthBarStyles> {
  strength: number;
}

export const StrengthBar = ({ strength, ...props }: StrengthBarProps) => {
  const percentage = strength / 4;
  const [label, setLabel] = React.useState('Weak');
  const styles = {
    width: `${percentage * 100}%`,
    backgroundColor:
      percentage < 0.5 ? 'red' : percentage < 0.75 ? 'orange' : 'green',
  };

  useEffect(() => {
    if (percentage < 0.25) {
      setLabel('Weak');
    } else if (percentage < 0.5) {
      setLabel('Medium');
    } else if (percentage < 0.75) {
      setLabel('Strong');
    } else {
      setLabel('Very Strong');
    }
  }, [percentage]);

  return (
    <div className="flex h-full flex-col">
      <label className="my-2 flex text-xs" htmlFor="bar">
        {label}
      </label>
      <span id="bar" className={StrengthBarStyles(props)} style={styles}></span>
    </div>
  );
};
