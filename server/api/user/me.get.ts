import { getUserFromEvent, removeAuthCookies } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event);

  if (!user) {
    await removeAuthCookies(event);

    return sendError(event, createError({ statusCode: 401 }));
  }

  return user;
});
