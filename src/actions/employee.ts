'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';

export async function addUsersToGroupEmploymentAction(usersToAdd, groupId) {
  const employees = usersToAdd.map((user) => ({
    user_id: user.id,
    group_id: groupId,
  }));

  const result = await prisma.employee.createMany({
    data: employees,
    skipDuplicates: true,
  });

  revalidatePath(`/dashboard/group/${groupId}/employees`);
  // return result;
}

export async function editEmployeeAction(
  { user_id, group_id },
  role,
  // status,
) {
  // console.log('editing employee action');
  try {
    const editedEmployee = await prisma.employee.update({
      where: {
        user_id_group_id: {
          user_id,
          group_id,
        },
      },
      data: {
        role,
        // status
      },
    });
    revalidatePath(`/dashboard/group/${group_id}/employees`);
    return editedEmployee;
  } catch (err) {
    console.error(err);
  }
}

export async function removeEmployeeAction({ user_id, group_id }) {
  // console.log('removing employee action');

  const removedEmployee = await prisma['employee'].delete({
    where: {
      user_id_group_id: {
        user_id,
        group_id,
      },
    },
    select: {
      user_id: true,
      user: { include: { profile: { select: { full_name: true } } } },
    },
  });
  console.log('removed employee', removedEmployee);

  revalidatePath(`/dashboard/group/${group_id}/employee`);
  return removedEmployee;
}
