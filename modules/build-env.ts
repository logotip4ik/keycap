import { defineNuxtModule, useLogger } from '@nuxt/kit';
import { nanoid } from 'nanoid';
import Git from 'simple-git';
import colors from 'picocolors';

import { version } from '../package.json';

import type { BuildInfo, PrivateBuildInfo } from '~/types';

const logger = useLogger('build-env');

export default defineNuxtModule({
  meta: {
    name: 'build-env',
  },
  async setup(_options, nuxt) {
    if (nuxt.options._prepare)
      return;

    const commit = await getCommitSha();

    const buildInfo: BuildInfo = {
      time: +Date.now(),
      commit,
      version: `v${version}`,
    };

    const privateBuildInfo: PrivateBuildInfo = {
      id: nanoid(),
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
