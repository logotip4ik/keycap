export default defineEventHandler(async (event) => {
  await roulette()
    .catch(async () => {
      await event.context.logger.info('roulette was not successfull, but test was');
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
