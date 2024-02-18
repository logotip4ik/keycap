import { defineNuxtModule, useLogger } from '@nuxt/kit';
import { execa } from 'execa';
import colors from 'picocolors';

import { version } from '../package.json';
import { KeyPrefix, createKey } from '../utils/keys';

export default defineNuxtModule({
  meta: {
    name: 'build-env',
  },
  async setup(_options, nuxt) {
    if (nuxt.options._prepare)
      return;

    const logger = useLogger('build-env');

    const commit = await getCommitSha();

    const uniqueBuildId = createKey(KeyPrefix.Build);
    nuxt.options.runtimeConfig.build = {
      id: uniqueBuildId,
    };

    nuxt.options.runtimeConfig.public.build = {
      time: Date.now(),
      commit,
      version: `v${version}`,
    };

    logger.info(`Unique build.id: ${colors.bold(colors.cyan(uniqueBuildId))}`);
  },
});

async function getCommitSha(): Promise<string> {
  const { stdout } = await execa('git', ['rev-parse', '--short', 'HEAD']);

  return stdout;
}
