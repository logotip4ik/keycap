import type { User } from '@prisma/client';

export function useUser() {
  return useState<Pick<User, 'id' | 'email' | 'username'> | null>('user', () => null);
}
