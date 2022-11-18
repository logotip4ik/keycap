import { withLeadingSlash, withoutTrailingSlash } from 'ufo';

export function generateFolderPath(username: string, path: string): string {
  // prepending leading slash to username + leading slash path + remove trailing slash
  return withoutTrailingSlash(`${withLeadingSlash(username)}${withLeadingSlash(path)}`);
}

export function generateNotePath(username: string, path: string): string {
  return generateFolderPath(username, path);
}

export function toBigInt(string: string): bigint {
  if (string.at(-1) === 'n') return BigInt(string.substring(0, string.length - 1));

  let res = BigInt(-1);

  try {
    res = BigInt(string);
  }
  catch { }

  return res;
}
