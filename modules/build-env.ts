import { defineNuxtModule, useLogger } from '@nuxt/kit';
import colors from 'picocolors';
import { exec } from 'tinyexec';

import { version } from '../package.json';
import { createKey, KeyPrefix } from '../utils/keys';

export default defineNuxtModule({
  meta: {
    name: 'build-env',
  },
  async setup(_options, nuxt) {
    if (nuxt.options._prepare) {
      return;
    }

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
  const SOURCE_COMMIT = process.env.SOURCE_COMMIT;

  if (typeof SOURCE_COMMIT === 'string' && SOURCE_COMMIT.length > 8) {
    return SOURCE_COMMIT.substring(0, 8);
  }

  const { stdout } = await exec('git', ['rev-parse', '--short', 'HEAD']);

  return stdout.trimEnd();
}
