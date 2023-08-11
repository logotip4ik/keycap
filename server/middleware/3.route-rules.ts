import type { H3Event } from 'h3';

interface Rule { path: string; handler: RuleFunction }
// true and undefined - shouldPass else - shouldDisallow
type RuleFunction = (event: H3Event) => boolean | undefined | Promise<boolean | undefined | void>;

const rules: Array<Rule> = [
  { path: '/api/note', handler: withUserOnly },
  { path: '/api/folder', handler: withUserOnly },
  { path: '/api/search', handler: withUserOnly },
  { path: '/api/user/refresh', handler: withUserOnly },
  { path: '/api/share/note', handler: withUserOnly },

  { path: '/api/oauth', handler: withoutUser },
];

export default defineEventHandler(async (event) => {
  let handler: RuleFunction | undefined;

  for (const rule of rules) {
    if (event.path.startsWith(rule.path)) {
      handler = rule.handler;

      break;
    }
  }

  if (!handler)
    return;

  const shouldPass = await handler(event);

  if (event.handled)
    return;

  if (shouldPass === false)
    throw createError({ statusCode: 401 });
});

function withoutUser(event: H3Event) {
  const { oauthEnabled } = useRuntimeConfig(event).public;

  if (!oauthEnabled)
    throw createError({ statusCode: 404 });

  const user = event.context.user;

  if (!user)
    return true;

  return sendRedirect(event, `/@${user.username}`);
}

function withUserOnly(event: H3Event) {
  return !!event.context.user;
}
