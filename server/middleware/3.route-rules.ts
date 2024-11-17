import type { H3Event } from 'h3';
import type { InternalApi } from 'nitropack/types';
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

function withUserOnlyAndProtectionHeader(event: H3Event) {
  return event.headers.get(protectionHeaderKey) === protectionHeaderValue && withUserOnly(event);
}

const rules: Array<Rule> = [
  { path: '/api/note', handler: withUserOnlyAndProtectionHeader },
  { path: '/api/folder', handler: withUserOnlyAndProtectionHeader },
  { path: '/api/search', handler: withUserOnlyAndProtectionHeader },
  { path: '/api/recent', handler: withUserOnlyAndProtectionHeader },
  { path: '/api/users/me', handler: withUserOnlyAndProtectionHeader },
  { path: '/api/share/note', handler: withUserOnlyAndProtectionHeader },
  { path: '/_log', handler: withUserOnly },
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
