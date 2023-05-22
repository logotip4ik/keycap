import { Buffer } from 'node:buffer';

import sharp from 'sharp';

import { getPrisma } from '~/prisma';

export default defineEventHandler(async (event) => {
  let [link, type] = (getRouterParam(event, 'id') as string).split('.');

  if (type === 'jpg')
    type = 'jpeg';

  if (type !== 'webp' && type !== 'jpeg')
    type = 'webp';

  if (!isShareLinkValid(link))
    return createError({ statusCode: 404 });

  const prisma = getPrisma();

  const note = await prisma.note.findFirst({
    select: { name: true },
    where: { shares: { some: { link } } },
  }).catch(() => null);

  if (!note)
    return sendRedirect(event, '/og-image.webp');

  const storage = useStorage('assets:server');
  const ogTemplate = await storage.getItem('og-template.svg') as string;

  if (!ogTemplate)
    return sendRedirect(event, '/og-image.webp');

  const title = note.name.split(' ').slice(0, 12).join(' ');
  const lines = title.trim().split(/(.{0,23})(?:\s|$)/g).filter(Boolean);
  const data = {
    line1: lines[0],
    line2: (lines[1] && lines[1].length === 23) ? `${lines[1]}...` : lines[1],
  };

  type Lines = 'line1' | 'line2';
  const ogSvg = ogTemplate.replace(/\{\{([^}]+)}}/g, (_: any, name: Lines) => data[name] || '');

  const ogBuffer = await sharp(Buffer.from(ogSvg))
    [type]() // eslint-disable-line no-unexpected-multiline
    .toBuffer();

  setHeader(event, 'Content-Type', `image/${type}`);

  return ogBuffer;
});
