const textLineRE = /\{\{line(\d)\}\}/g;

export default defineEventHandler(async (event) => {
  const link = getRouterParam(event, 'link');

  if (!link || !isShareLinkValid(link))
    throw createError({ statusCode: 400 });

  const [svgTemplate, noteDetails] = await Promise.all([
    getOgTemplate('view'),
    getNoteDetailsByLink(link),
  ]);

  if (!noteDetails) {
    throw createError({
      statusCode: 404,
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
