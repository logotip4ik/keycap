import { defineNuxtModule, useLogger } from '@nuxt/kit';
import { execa } from 'execa';
import colors from 'picocolors';

import { version } from '../package.json';
import { KeyPrefix, createKey } from '../utils/keys';

import type { BuildInfo, PrivateBuildInfo } from '~/types';

export default defineNuxtModule({
  meta: {
    name: 'build-env',
  },
  async setup(_options, nuxt) {
    if (nuxt.options._prepare)
      return;

    const logger = useLogger('build-env');

    const commit = await getCommitSha();

    const buildInfo: BuildInfo = {
      time: Date.now(),
      commit,
      version: `v${version}`,
    };

    const privateBuildInfo: PrivateBuildInfo = {
      id: createKey(KeyPrefix.Build),
    };

    nuxt.options.runtimeConfig.build = privateBuildInfo;
    nuxt.options.runtimeConfig.public.build = buildInfo;

    logger.info(`Unique build.id: ${colors.bold(colors.cyan(privateBuildInfo.id))}`);
  },
});

async function getCommitSha(): Promise<string> {
  const { stdout } = await execa('git', ['rev-parse', '--short', 'HEAD']);

  return stdout;
}
