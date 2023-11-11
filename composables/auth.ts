import type { Serialize } from 'nitropack';
import type { SafeUser } from '~/types/server';

export function useUser() {
  return useState<Serialize<SafeUser> | null>('user', () => null);
}
