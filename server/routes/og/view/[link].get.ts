const textLineRE = /\{\{line(\d)\}\}/g;
const splitLineLengthRE = /(.{0,20})(?:\s|$)/g;

export default defineEventHandler(async (event) => {
  const link = getRouterParam(event, 'link');

  if (!link || !isShareLinkValid(link))
    throw createError({ statusCode: 400 });

  const storage = useStorage('assets:server');

  const [image, noteDetails] = await Promise.all([
    storage.getItem<string>('view-og-image.svg'),
    getNoteDetailsByLink(link),
  ]);

  if (!image)
    throw createError({ statusCode: 500 });

  if (!noteDetails)
    throw createError({ statusCode: 404, message: 'Seems like this link is expired' });

  let nameLines = noteDetails.name.split(splitLineLengthRE).filter(Boolean);

  if (nameLines.length > 2) {
    nameLines = nameLines.slice(0, 2);
    nameLines[nameLines.length - 1] = `${nameLines.at(-1)}...`;
  }

  setResponseHeader(event, 'Content-Type', 'image/svg+xml');

  return image.replace(
    textLineRE,
    (_, i) => nameLines[Number.parseInt(i) - 1] || '',
  );
});
