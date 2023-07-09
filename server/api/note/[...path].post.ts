import type { TypeOf } from 'suretype';



export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const path = getRouterParam(event, 'path');

  if (!path)
    return createError({ statusCode: 400 });

  const body = await readBody<TypeOf<typeof noteCreateSchema>>(event) || {};

  body.path = generateNotePath(user.username, path);

  const validation = useNoteCreateValidation(body);

  if (!validation.ok) {
    return createError({
      statusCode: 400,
      statusMessage: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const selectParams = getNoteSelectParamsFromEvent(event);

  timer.start('db');
  const note = await prisma.note.create({
    data: {
      // last route param always should be note name
      name: body.name,
      content: '',
      path: body.path,
      owner: { connect: { id: user.id } },
      parent: { connect: { id: toBigInt(body.parentId) } },
    },
    select: { ...selectParams },
  }).catch(() => null);
  timer.end();

  if (!note)
    return createError({ statusCode: 400 });

  timer.appendHeader(event);

  return note;
});
