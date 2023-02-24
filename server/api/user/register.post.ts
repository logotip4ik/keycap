import { compile, v } from 'suretype';

import getPrisma from '~/prisma';

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

  if (!validation.ok) {
    return createError({
      statusCode: 400,
      statusMessage: validation.errors.map((error) => error.message).join('\n'),
    });
  }

  body.email = body.email.trim();
  body.username = body.username.trim().replace(/\s/g, '_');
  body.password = body.username.trim();

  const prisma = getPrisma();

  try {
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
    });

    await setAuthCookies(event, user);

    return user;
  }
  catch {
    const error = createError({ statusCode: 400, statusMessage: 'user with this email or username might already exist' });

    return sendError(event, error);
  }
});
