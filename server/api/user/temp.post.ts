// import type { User } from '@prisma/client';
// import { readBody } from 'h3';

// import getPrisma from '~/prisma';

export default defineEventHandler(async (_event) => {
  // const body = await readBody<{ id: string }>(event);
  // const prisma = getPrisma();

  // const deletedUser = await prisma.user.delete({ where: { email: body.email } });

  // console.log('deleted user:', deletedUser);

  // return { status: 'ok' };

  // const users: Pick<User, 'id' | 'email'>[] = await prisma.user.findMany({ select: { email: true, id: true } });

  //   const folder = await prisma.folder.findUnique({ where: { id: BigInt(body.id) } });

  //   console.log(folder);
  return { status: 'ok' };

  // return JSON.stringify(
  //   users,
  //   (_key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
  // );
});
