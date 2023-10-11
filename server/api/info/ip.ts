export default defineEventHandler((event) => {
  return {
    ip: getRequestIP(event),
    ipForwarded: getRequestIP(event, { xForwardedFor: true }),
  };
});
