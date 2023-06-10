'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  // session: any;
}

const Providers = ({ children }: Props) => {
  // const Providers = ({ children, session }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;

  // `session` comes from `getServerSideProps` or `getInitialProps`
  // Avoids flickering/session loading on first load.
  // only useful if session is stored in the DB and there is a server-rendered page (getServerSideProps) or server comp (api fetch req to db)
  // return (
  //   <SessionProvider session={session} refetchInterval={5 * 60}>
  //     {children}
  //   </SessionProvider>
  // );
};

export default Providers;
