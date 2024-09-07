import type { H3Event } from 'h3';
import type { InternalApi } from 'nitropack';
import type { Promisable } from 'type-fest';

// true | undefined | void - should pass, else - should disallow
type RuleFunction = (event: H3Event) => Promisable<boolean | undefined | void>;

interface Rule {
  path: keyof InternalApi | (string & NonNullable<unknown>)
  handler: RuleFunction
}

function withUserOnly(event: H3Event) {
  return !!event.context.user;
}

async function getEmailFromCode(event: H3Event) {
  const query = getQuery(event);

  if (query.code) {
    const metadata = await registerStorage.getItem(`continue:${query.code}`) as { email?: string };
    event.context.registerEmail = metadata?.email;
  }
}

const rules: Array<Rule> = [
  { path: '/register', handler: getEmailFromCode },
  { path: '/api/note', handler: withUserOnly },
  { path: '/api/folder', handler: withUserOnly },
  { path: '/api/search', handler: withUserOnly },
  { path: '/api/recent', handler: withUserOnly },
  { path: '/api/users/me', handler: withUserOnly },
  { path: '/api/share/note', handler: withUserOnly },
];

export default defineEventHandler(async (event) => {
  if (isPreflightRequest(event)) {
    return null;
  }

  if (
    !import.meta.config.benchmarking
    && import.meta.ci
    && event.method !== 'GET'
    && isOriginMismatched(event)
  ) {
    throw createError({ status: 403, message: 'Origin mismatched' });
  }

  const rule = rules.find((rule) => event.path.startsWith(rule.path));

  if (!rule) {
    return;
  }

  let shouldPass = rule.handler(event);
  if (shouldPass instanceof Promise) {
    shouldPass = await shouldPass;
  }

  if (shouldPass === false) {
    throw createError({ status: 401 });
  }
});
