import parseDuration from 'parse-duration';

export async function getRecentForUser(user: { id: bigint }) {
  const prisma = getPrisma();

  // TODO: more advanced recent algorithm :P
  return await prisma.note.findMany({
    where: { ownerId: user.id },
    select: { id: true, name: true, path: true },
    take: 4,
    orderBy: { updatedAt: 'desc' },
  });
}

export const cachedGetRecentForUser = cachedFunction(getRecentForUser, {
  swr: true,
  maxAge: parseDuration('5 minutes', 's'),
  staleMaxAge: parseDuration('30 minutes', 's'),
  getKey: (event) => `${event.context.user!.username}-recent`,
});
