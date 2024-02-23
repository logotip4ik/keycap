const textLineRE = /\{\{line(\d)\}\}/g;
// https://antfu.me/posts/break-lines-in-js
const splitByLineLengthRE = /(.{0,20})(?:\s|$)/g;

let _svgTemplate: string | undefined;
export default defineEventHandler(async (event) => {
  const link = getRouterParam(event, 'link');

  if (!link || !isShareLinkValid(link))
    throw createError({ statusCode: 400 });

  const storage = useStorage('assets:server');

  const [svgTemplate, noteDetails] = await Promise.all([
    _svgTemplate || storage.getItem<string>('view-og-image.svg'),
    getNoteDetailsByLink(link),
  ]);

  if (!svgTemplate)
    throw createError({ statusCode: 500 });

  if (!noteDetails) {
    throw createError({
      statusCode: 404,
      message: 'Seems like this link is expired',
    });
  }

  // cache template as it is not gonna change
  if (!_svgTemplate)
    _svgTemplate = svgTemplate;

  let textLines = noteDetails.name.split(splitByLineLengthRE).filter(Boolean);

  if (textLines.length > 2) {
    textLines = textLines.slice(0, 2);
    textLines[textLines.length - 1] = `${textLines.at(-1)}...`;
  }

  setResponseHeader(event, 'Content-Type', 'image/svg+xml');

  return svgTemplate.replace(
    textLineRE,
    (_, i) => {
      const text = textLines[Number.parseInt(i) - 1];

      return text ? escapeHtml(text) : '';
    },
  );
});
