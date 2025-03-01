export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  if (!query.code) {
    throw createError({ status: 400 });
  }

  const registerStorage = useRegisterStorage();

  const metadata = await registerStorage.getItem(`continue:${query.code}`);

  return metadata?.email ? { data: metadata } : null;
});
