export function getRecentForUser(user: { id: string }) {
  const kysely = getKysely();

  // TODO: more advanced recent algorithm :P
  return kysely
    .selectFrom('Note')
    .where('ownerId', '=', user.id)
    .select(['id', 'name', 'path'])
    .limit(4)
    .orderBy('updatedAt', 'desc')
    .execute();
}
