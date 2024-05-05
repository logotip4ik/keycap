import { serialize } from 'cookie-es';
import { getCookie, setCookie } from 'h3';

import type { CookieSerializeOptions } from 'cookie-es';

/**
 * gets a cookie universally (nuxt side) on server and client
 */
export function getUCookie<T extends string>(name: string): T | undefined {
  if (import.meta.server) {
    return getCookie(useRequestEvent()!, name) as T;
  }
  else {
    return document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(name))
      ?.split('=')[1] as T;
  }
}

/**
 * sets a cookie universally (nuxt side) on server and client
 */
export function setUCookie(name: string, value: unknown, options?: CookieSerializeOptions) {
  const _value = `${value}`;

  if (import.meta.server) {
    setCookie(useRequestEvent()!, name, _value, options);
  }
  else {
    document.cookie = serialize(name, _value, options);
  }
}
