import { defu } from 'defu';
import type { CacheEntry } from 'nitropack';

/**
 * @param {string} key - should be full key, including base, group, name, entry + .json
 * @param {any} value - new value for entry.value
 */
export async function updateCacheEntry(key: string, value: any) {
  const storage = useStorage();
  const entry = await storage.getItem(key) as CacheEntry | undefined;

  if (!entry) {
    // noop
    return;
  }

  // NOTE: idk how it handles arrays
  if (typeof value === 'object')
    entry.value = defu(entry.value, value);
  else
    entry.value = value;

  entry.mtime = Date.now();

  await storage.setItem(key, entry);
}
