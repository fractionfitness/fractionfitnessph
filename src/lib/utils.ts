// some server components may need to use this file | will this affect server-side rendering?
// import 'client-only';

import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
