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
    const cookies = document.cookie;

    const cookieNamePrefix = `${name}=`;
    const cookieValueStart = cookies.indexOf(cookieNamePrefix) + cookieNamePrefix.length;

    if (cookieValueStart < cookieNamePrefix.length) {
      return undefined;
    }

    const cookieValueEnd = cookies.indexOf('; ', cookieValueStart);
    const cookieValue = cookies.substring(
      cookieValueStart,
      cookieValueEnd === -1 ? cookies.length : cookieValueEnd,
    );

    return cookieValue as T;
  }
}

/**
 * sets a cookie universally (nuxt side) on server and client
 */
export function setUCookie(name: string, value: unknown, options?: CookieSerializeOptions) {
  value = `${value}`;

  if (import.meta.server) {
    setCookie(useRequestEvent()!, name, value as string, options);
  }
  else {
    document.cookie = serialize(name, value as string, options);
  }
}
