import type { Static } from '@sinclair/typebox';

type EmailRegisterFields = Static<typeof emailRegisterSchema>;

export default defineEventHandler(async (event) => {
  if (event.context.user) {
    return null;
  }

  const body = await readBody<EmailRegisterFields>(event) || {};

  if (typeof body?.email === 'string') {
    body.email = body.email.trim();
  }

  const error = emailRegisterValidator.Errors(body).First();

  if (error) {
    throw createError({
      status: 400,
      message: formatTypboxError(error),
    });
  }

  const kysely = getKysely();

  const user = await kysely
    .selectFrom('User')
    .where('email', '=', body.email)
    .select((eb) => eb.lit(true).as('exists'))
    .executeTakeFirst();

  if (user?.exists) {
    throw createError({
      status: 422,
      message: 'User with such email already exists.',
    });
  }

  const { resend, public: { site } } = useRuntimeConfig();
  const template = await getHtmlTemplate('ContinueOnboarding');

  const code = createKey(KeyPrefix.Register, 32);
  const siteLink = `https://${site}`;
  const templateVariables = {
    site: siteLink,
    year: new Date().getFullYear(),
    verifyLink: `${siteLink}/register?code=${code}`,
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
        to: body.email,
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
    // eslint-disable-next-line no-console
    console.log(templateVariables);
  }

  await registerStorage.setItem(
    `continue:${code}`,
    { email: body.email },
    { ttl: parseDuration('5 minutes', 's') },
  );

  if (body.browserAction !== undefined) {
    return sendRedirect(event, '/');
  }

  return null;
});
