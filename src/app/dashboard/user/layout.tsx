import Link from 'next/link';

// import { getAuthSession } from '@/lib/auth';
import { buttonVariants } from '@/components/ui-shadcn/Button';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // no need to protect page route since middleware already catches requests to this route before reaching server
  // const session = await getAuthSession();
  // if (!session?.user) {
  //   return redirect('/api/auth/signin?callbackUrl=/dashboard/user');
  // }
  return (
    <>
      {/* NavUserDashboard */}
      <nav>
        <ul className="m-2 space-x-1 flex justify-center">
          <li>
            <Link
              href="/dashboard/user/groups"
              className={buttonVariants({ variant: 'default' })}
            >
              Groups
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/user/sessions"
              className={buttonVariants({ variant: 'default' })}
            >
              Sessions
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/user/checkins"
              className={buttonVariants({ variant: 'default' })}
            >
              Check-ins
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </>
  );
}