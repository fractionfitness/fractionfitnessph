import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import AddUserCommand from '@/components/AddUserCommand';
import { DataTable } from '@/components/DataTable';
import { Employee as EmployeeColumns, columns } from './columns';

export default async function UserGroups({ params: { groupId } }) {
  try {
    // console.log('params check===>', groupId);
    const session = await getAuthSession();

    // currently only querying one group at a time
    // correct query should search children and all descendants?
    const group = await prisma.group.findFirst({
      where: {
        id: +groupId,
      },
      include: {
        employees: {
          include: {
            user: { include: { profile: true } },
          },
        },
      },
    });

    // INSERT FUNCTION HERE THAT GETS ALL OF THE GROUP'S DESCENDANTS AND CREATES A HIERARCHY
    const groupAndDescendantsNames = [group?.name, 'test group'];

    // const groupEmployees = group?.employees.map((employee) => ({
    //   role: employee.role,
    //   group,
    //   user: { id: employee.user.id, email: employee.user.email },
    //   userProfile: employee.user.profile,
    // }));

    const groupEmployees: EmployeeColumns[] = group?.employees.map(
      ({ user, role }) => ({
        name: user.profile?.full_name!,
        email: user.email,
        group: group.name,
        user_id: user.id,
        group_id: group.id,
        role,
        // status,
      }),
    )!;

    return (
      <div className="space-y-2">
        <hr />
        <p>Group Employees</p>

        <AddUserCommand mode="employee" />

        <div className="container mx-auto mt-1 mb-1">
          <DataTable
            columns={columns}
            data={groupEmployees}
            groups={groupAndDescendantsNames}
          />
        </div>
      </div>
    );
  } catch (err) {
    console.error(err);
  }
}
