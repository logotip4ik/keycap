import { send } from 'h3';

import { getUserFromEvent, setAuthCookies } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event);

  if (!user) return send(event);

  await setAuthCookies(event, user);

  return { status: 'ok' };
});
