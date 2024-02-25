import { escapeHtml } from '@vue/shared';

const textLineRE = /\{\{line(\d)\}\}/g;

export default defineEventHandler(async (event) => {
  const link = getRouterParam(event, 'link');

  if (!link || !isShareLinkValid(link))
    throw createError({ status: 400 });

  const prisma = getPrisma();

  const [svgTemplate, noteDetails] = await Promise.all([
    getOgTemplate('view'),
    prisma.note.findFirst({
      select: { name: true },
      where: { shares: { some: { link } } },
    }),
  ]);

  if (!noteDetails) {
    throw createError({
      status: 404,
      message: 'Seems like this link is expired',
    });
  }

  const textLines = splitOgText(noteDetails.name, 2);

  setResponseHeader(event, 'Content-Type', 'image/png');

  const svg = svgTemplate.replace(
    textLineRE,
    (_, i) => {
      const text = textLines[Number.parseInt(i) - 1];

      return text ? escapeHtml(text) : '';
    },
  );

  return await generatePngFromSvg(svg);
});
