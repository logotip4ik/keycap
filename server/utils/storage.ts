import { prefixStorage } from 'unstorage';

export function useRegisterStorage() {
  return prefixStorage<{ email: string }>(
    useStorage(),
    `keycap:${KeyPrefix.Register}`,
  );
}

export function invalidateCacheEntry(key: string) {
  const storage = useStorage();
  return storage.removeItem(key);
}
