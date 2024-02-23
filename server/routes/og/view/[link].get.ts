// https://antfu.me/posts/break-lines-in-js
const splitByLineLengthRE = /(.{0,20})(?:\s|$)/g;
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

  let textLines = noteDetails.name.split(splitByLineLengthRE).filter(Boolean);

  if (textLines.length > 2) {
    textLines = textLines.slice(0, 2);
    textLines[textLines.length - 1] = `${textLines.at(-1)}...`;
  }

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
