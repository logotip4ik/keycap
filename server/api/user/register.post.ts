import { compile, v } from 'suretype';

import { getPrisma } from '~/prisma';

const registrationSchema = v.object({
  username: v.string().minLength(4).required(),
  email: v.string().format('email').required(),
  password: v.string().minLength(8).required(),
});

const useRegistrationValidator = compile(registrationSchema, { colors: false });

export default defineEventHandler(async (event) => {
  if (event.context.user) return null;

  const body = await readBody(event) || {};

  const validation = useRegistrationValidator(body);

  if (body.email) body.email = body.email.trim();
  if (body.username) body.username = body.username.trim().replace(/\s/g, '_');
  if (body.password) body.password = body.username.trim();

  if (!validation.ok) {
    return createError({
      statusCode: 400,
      statusMessage: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const prisma = getPrisma();

  const user = await prisma.user.create({
    data: {
      email: body.email,
      username: body.username,
      password: await hashPassword(body.password),
      folders: {
        create: {
          name: `${body.username}'s workspace`,
          root: true,
          path: generateRootFolderPath(body.username),
        },
      },
    },

    select: { id: true, email: true, username: true },
  }).catch(() => null);

  if (!user)
    return createError({ statusCode: 400, statusMessage: 'user with this email or username might already exist' });

  await setAuthCookies(event, user);

  return user;
});
