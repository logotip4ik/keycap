import { escapeHtml } from '@vue/shared';

const textLineRE = /\{\{line(\d)\}\}/g;

export default defineEventHandler(async (event) => {
  const link = getRouterParam(event, 'link');

  if (!link || !isShareLinkValid(link))
    throw createError({ status: 400 });

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

  const svg = svgTemplate.replace(
    textLineRE,
    (_, i) => {
      const text = textLines[Number.parseInt(i) - 1];

      return text ? escapeHtml(text) : '';
    },
  );

  return generatePngFromSvg(svg);
});
