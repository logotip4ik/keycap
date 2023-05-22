import type { User } from '@prisma/client';

export type SafeUser = Pick<User, 'id' | 'email' | 'username'>;

export function useUser() {
  return useState<SafeUser | null>('user', () => null);
}
