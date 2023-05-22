import type { SafeUser } from '~/types/server';

export function useUser() {
  return useState<SafeUser | null>('user', () => null);
}
