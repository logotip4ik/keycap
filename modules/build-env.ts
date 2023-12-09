import { defineNuxtModule, useLogger } from '@nuxt/kit';
import { randomUUID } from 'uncrypto';
import Git from 'simple-git';
import colors from 'picocolors';

import { version } from '../package.json';

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
      time: +Date.now(),
      commit,
      version: `v${version}`,
    };

    const privateBuildInfo: PrivateBuildInfo = {
      // TODO: export to common key generation utility
      id: `build_${randomUUID().replace(/-/g, '')}`,
    };

    nuxt.options.runtimeConfig.build = privateBuildInfo;
    nuxt.options.runtimeConfig.public.build = buildInfo;

    logger.info(`Unique build.id: ${colors.bold(colors.cyan(privateBuildInfo.id))}`);
  },
});

const git = Git();

async function getCommitSha(): Promise<string> {
  return await git.revparse(['--short', 'HEAD']);
}
