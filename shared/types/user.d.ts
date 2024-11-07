import type { User } from '~~/kysely/db/types';

import type { Selectable } from 'kysely';

export type SafeUser = Pick<Selectable<User>, 'id' | 'email' | 'username'>;
