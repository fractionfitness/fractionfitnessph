import DashboardSelectGroups from '@/components/DashboardSelectGroups';
import { getAuthSession } from '@/lib/auth';
import getUserEmploymentGroups from '@/lib/prismaQueries/getUserEmploymentGroups';

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  const employmentGroups = await getUserEmploymentGroups(session?.user);

  return (
    <>
      <div className="flex flex-row items-center">
        <p>Dashboard: </p>&nbsp;
        <DashboardSelectGroups groups={employmentGroups} />
      </div>
      {children}
    </>
  );
}
