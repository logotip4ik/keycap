export default defineEventHandler(async (event) => {
  event.context.user = await getUserFromEvent(event);
});
