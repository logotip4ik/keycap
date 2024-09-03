import { escapeHtml } from '@vue/shared';

export default defineEventHandler(async (event) => {
  const link = getRouterParam(event, 'link');

  if (!link || !isShareLinkValid(link)) {
    throw createError({ status: 400 });
  }

  const kysely = getKysely();

  const [svgTemplate, noteDetails] = await Promise.all([
    getOgTemplate('view'),
    kysely
      .selectFrom('Share')
      .where('Share.link', '=', link)
      .rightJoin('Note', 'Note.id', 'Share.noteId')
      .select('Note.name')
      .executeTakeFirst(),
  ]);

  if (!noteDetails) {
    throw createError({
      status: 404,
      message: 'Seems like this link is expired',
    });
  }

  const textLines = splitOgText(noteDetails.name, 2);

  setResponseHeader(event, 'Content-Type', 'image/png');

  const svg = processTemplate(svgTemplate, {
    line1: textLines[0] ? escapeHtml(textLines[0]) : '',
    line2: textLines[1] ? escapeHtml(textLines[1]) : '',
  });

  return generatePngFromSvg(svg);
});
