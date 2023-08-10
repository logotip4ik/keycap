export default defineEventHandler(async (event) => {
  await roulette()
    .catch(async (err) => {
      const now = performance.now();
      await event.context.logger.info({ err }, 'roulette was not successfull, but test was');
      const duration = performance.now() - now;

      await event.context.logger.info({ time: duration }, `log time: ${duration}`);
    });

  return {
    hello: 'world',
  };
});

function roulette() {
  return new Promise((...args) => {
    const func = args[Math.random() > 0.5 ? 1 : 0];

    func('nonono');
  });
}
