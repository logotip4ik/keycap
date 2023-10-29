import type { InternalApi } from 'nitropack';
import type { H3Event } from 'h3';

import parseDuration from 'parse-duration';

import { CorsHeaders, CorsMethods, CorsOrigin } from '~/headers.config';

interface Rule {
  path: keyof InternalApi | (string & NonNullable<unknown>)
  handler: RuleFunction
}
// true and undefined - shouldPass else - shouldDisallow
type RuleFunction = (event: H3Event) => boolean | undefined | Promise<boolean | undefined | void>;

function withoutUser(event: H3Event) {
  const { oauthEnabled } = useRuntimeConfig().public;

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

const rules: Array<Rule> = [
  { path: '/api/notes', handler: withUserOnly },
  { path: '/api/folders', handler: withUserOnly },
  { path: '/api/search', handler: withUserOnly },
  { path: '/api/recent', handler: withUserOnly },
  { path: '/api/users/me', handler: withUserOnly },
  { path: '/api/share/note', handler: withUserOnly },

  { path: '/api/oauth', handler: withoutUser },
];

export default defineEventHandler(async (event) => {
  if (isMethod(event, 'OPTIONS')) {
    appendCorsPreflightHeaders(event, {
      allowHeaders: CorsHeaders,
      methods: CorsMethods,
      origin: [CorsOrigin],
      maxAge: parseDuration('24 hours', 's')?.toString(),
    });
    return;
  }

  const rule = rules.find((rule) => event.path.startsWith(rule.path));

  if (!rule)
    return;

  const shouldPass = await rule.handler(event);

  if (event.handled)
    return;

  if (shouldPass === false)
    throw createError({ statusCode: 401 });
});
