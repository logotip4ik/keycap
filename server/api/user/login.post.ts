import { isProduction } from 'std-env';
import { compile, v } from 'suretype';

import type { User } from '@prisma/client';

import { getPrisma } from '~/prisma';

const loginSchema = v.object({
  email: v.string().format('email').required(),
  password: v.string().minLength(8).required(),
});

const useLoginValidator = compile(loginSchema, { colors: false });

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {};

  const validation = useLoginValidator(body);

  if (body.email) body.email = body.email.trim();
  if (body.password) body.password = body.password.trim();

  if (isProduction && !validation.ok) {
    return createError({
      statusCode: 400,
      statusMessage: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const prisma = getPrisma();

  const user = await prisma.user.findUnique({
    where: { email: body.email },
    select: { id: true, email: true, username: true, password: true },
  }).catch(() => null);

  if (!user) {
    const error = createError({ statusCode: 400, statusMessage: 'email or password is incorrect' });

    return sendError(event, error);
  }

  try {
    if (!(await verifyPassword(user.password, body.password))) {
      const error = createError({ statusCode: 400, statusMessage: 'email or password is incorrect' });

      return sendError(event, error);
    }
  }
  catch {
    const error = createError({ statusCode: 500 });

    return sendError(event, error);
  }

  const safeUser: Pick<User, 'id' | 'username' | 'email'> = { id: user.id, username: user.username, email: user.email };

  await setAuthCookies(event, safeUser);

  return safeUser;
});
