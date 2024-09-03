export default defineEventHandler(async (event) => {
  if (event.context.user) {
    return null;
  }

  const data = await readSecureBody(event, emailRegisterValidator);

  const { resend, public: { site } } = useRuntimeConfig();
  const assets = useStorage('assets:server');

  const template = await assets.getItem('templates:continue-onboarding.html') as string;

  const code = createKey(KeyPrefix.Register, 32);
  const siteLink = `https://${site}`;
  const templateVariables = {
    site: siteLink,
    year: new Date().getFullYear(),
    verifyLink: `${siteLink}/register-continue?code=${code}`,
  };

  const html = processTemplate(template, templateVariables);

  if (import.meta.prod) {
    const res = await $fetch<{ id: string }>(resend.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resend.apiKey}`,
      },
      body: {
        from: `Keycap <onboarding@${resend.site}>`,
        to: data.email,
        subject: 'Continue Onboarding - Keycap',
        html,
        text: `Continue Onboarding - ${templateVariables.verifyLink}\nKeycap © ${templateVariables.year}`,
      },
    }).catch((e) => e as Error);

    if (res instanceof Error) {
      throw createError({
        status: 424,
        message: 'Failed to send onboarding letter. Please double check your email.',
      });
    }
  }
  else {
    console.log({ code });
  }

  await kvStorage.setItem(
    `${KeyPrefix.Register}:continue:${code}`,
    { email: data.email },
    { ttl: parseDuration('5 minutes', 's') },
  );

  if (data.browserAction !== undefined) {
    return sendRedirect(event, '/');
  }

  return null;
});

// export default defineEventHandler(async (event) => {
//   if (event.context.user) {
//     return null;
//   }
//
//   const body = await readBody<RegisterFields>(event) || {};
//
//   if (typeof body.email === 'string') {
//     body.email = body.email.trim();
//   }
//   if (typeof body.username === 'string') {
//     body.username = body.username.trim().replace(/\s/g, '_');
//   }
//   if (typeof body.password === 'string') {
//     body.password = body.password.trim();
//   }
//
//   const error = registerValidator.Errors(body).First();
//
//   // TODO: add data to error and match schemaPath with client inputs to highlight wrong inputs
//   if (error) {
//     throw createError({
//       status: 400,
//       message: formatTypboxError(error),
//     });
//   }
//
//   const [usernameTaken, captchaValid] = await Promise.all([
//     checkIfUsernameTaken(event, body.username),
//     import.meta.config.turnstileEnabled ? validateTurnstileReponse(body['cf-turnstile-response']) : true,
//   ]);
//
//   if (usernameTaken) {
//     throw createError({
//       status: 400,
//       message: 'Sorry... But this username is already taken',
//     });
//   }
//
//   if (!captchaValid) {
//     throw createError({
//       status: 422,
//       message: 'Verification failed. Maybe try reloading the page ?',
//     });
//   }
//
//   const hashedPassword = await hashPassword(body.password)
//     .catch(async (err) => {
//       await logger.error(event, { err, msg: 'password hashing failed' });
//
//       throw createError({ status: 500 });
//     });
//
//   const kysely = getKysely();
//   const now = new Date();
//
//   const user = await kysely.transaction().execute(async (tx) => {
//     const user = await tx
//       .insertInto('User')
//       .values({
//         email: body.email,
//         username: body.username,
//         password: hashedPassword,
//         updatedAt: now,
//       })
//       .returning(['id'])
//       .executeTakeFirst()
//       .catch((error) => {
//         if (
//           error instanceof postgres.PostgresError
//           && error.code === PostgresErrorCode.PG_UNIQUE_VIOLATION
//         ) {
//           throw createError({
//             status: 400,
//             message: 'user with this email or username might already exist',
//           });
//         }
//       });
//
//     if (!user) {
//       throw createError({ status: 500 });
//     }
//
//     await tx
//       .insertInto('Folder')
//       .values({
//         name: `${body.username}'s workspace'`,
//         root: true,
//         path: generateRootFolderPath(body.username),
//         ownerId: user.id,
//         updatedAt: now,
//       })
//       .executeTakeFirst();
//
//     (user as SafeUser).email = body.email;
//     (user as SafeUser).username = body.username;
//
//     return user as SafeUser;
//   }).catch(async (err) => {
//     await logger.error(event, { err, msg: 'auth.register failed' });
//
//     throw err;
//   });
//
//   await Promise.all([
//     setAuthCookies(event, user),
//     updateCacheEntry(
//       getUserCacheKey(user.username, UserCacheName.Taken),
//       true,
//     ),
//   ]);
//
//   if (body.browserAction !== undefined) {
//     return sendRedirect(event, `/@${user.username}`);
//   }
//
//   setResponseStatus(event, 201);
//
//   return { data: user };
// });
