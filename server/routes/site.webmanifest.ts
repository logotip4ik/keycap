import { isDevelopment } from 'std-env';

import manifestSchema from '~/assets/constants/webmanifest.json';

export default defineEventHandler((event) => {
  const { user } = event.context;

  const protocol = isDevelopment ? 'http://' : 'https://';
  const siteOrigin = process.env.SITE_ORIGIN || 'localhost:3000';
  const siteUrl = protocol + siteOrigin;

  const manifest: typeof manifestSchema = {
    ...manifestSchema,
    id: siteUrl,
    scope: siteUrl,
    start_url: siteUrl,
  };

  if (user) {
    const userSuffix = `/@${user.username}`;

    manifest.id += userSuffix;
    manifest.start_url += userSuffix;
  }

  return manifest;
});
