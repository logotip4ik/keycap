import type { User } from '@prisma/client';

export const useUser = () => useState<Pick<User, 'id' | 'email' | 'username'> | null>('user', () => null);
