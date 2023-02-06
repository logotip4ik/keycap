import manifestSchema from '~/assets/constants/webmanifest.json';

export default defineEventHandler((event) => {
  const { user } = event.context;

  const manifest: typeof manifestSchema = { ...manifestSchema };

  if (user)
    manifest.start_url += `@${user.username}`;

  return manifest;
});
