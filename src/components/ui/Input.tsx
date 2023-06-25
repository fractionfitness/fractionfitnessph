import { forwardRef } from 'react';

const Input = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={`border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
