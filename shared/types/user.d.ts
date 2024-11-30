import type { Selectable } from 'kysely';

import type { User } from '~~/kysely/db/types';

export type SafeUser = Pick<Selectable<User>, 'id' | 'email' | 'username'>;
