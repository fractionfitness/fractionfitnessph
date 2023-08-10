'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // handle error in client here
    console.error('client-side error handling', error);
  }, [error]);

  return (
    <>
      <p>Error Page</p>
      <button onClick={(e) => reset()} />
      <p>{error.message}</p>
    </>
  );
}
