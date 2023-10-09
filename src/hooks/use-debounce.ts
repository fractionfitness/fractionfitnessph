import { useState, useEffect } from 'react';

// based on sadmann7/skateshop repo
// export function useDebounce<T>(value: T, delay?: number): T {
//   const [debouncedValue, setDebouncedValue] = React.useState<T>(value)
export function useDebounce(value: string, delay?: number) {
  const [debouncedValue, setDebouncedValue] = useState('');
  const defaultDelay = 500;

  useEffect(() => {
    // dont execute if empty
    if (value.length === 0) {
      setDebouncedValue('');
      return;
    }
    const timer = setTimeout(
      () => setDebouncedValue(value),
      delay ?? defaultDelay,
    );

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
