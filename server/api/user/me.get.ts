import { getUserFromEvent } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event);

  if (!user)
    return sendError(event, createError({ statusCode: 401 }));

  return user;
});
