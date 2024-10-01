const logDefaults = {
  browser: true,
  nitro: false,
};

export default defineEventHandler(async (event) => {
  const data = await readSecureBody(event, clientLogValidator);

  Object.assign(
    data.payload,
    logDefaults,
    { userAgent: getHeader(event, 'User-Agent') },
  );

  await logger[data.type](event, data.payload);

  return sendNoContent(event);
});
