import process from 'node:process';
import { isProduction } from 'std-env';
import { withLeadingSlash, withoutTrailingSlash } from 'ufo';

export function getServerUserAgent() {
  const postfix = isProduction ? '' : 'Dev';
  const serverName = process.env.SERVER_NAME || 'Keycap';

  return `${serverName} ${postfix}`.trim();
}

export function generateFolderPath(username: string, path: string): string {
  // prepending leading slash to username + leading slash path + remove trailing slash
  return withoutTrailingSlash(`${withLeadingSlash(username)}${withLeadingSlash(path)}`);
}

export function generateNotePath(username: string, path: string): string {
  return generateFolderPath(username, path);
}

export function generateRootFolderPath(username: string) {
  return `/${username}`;
}

export const stringifiedBigIntRE = /([0-9]{18})/;

export function toBigIntId(string: string): bigint {
  const match = string.match(stringifiedBigIntRE);

  if (match)
    return BigInt(match[1]);

  try {
    return BigInt(string);
  }
  catch {
    return BigInt(-1);
  }
}
