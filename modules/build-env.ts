import { defineNuxtModule, useLogger } from '@nuxt/kit';
import { nanoid } from 'nanoid';
import Git from 'simple-git';

import type { BuildInfo, PrivateBuildInfo } from '~/types';

const logger = useLogger('build-env');

export default defineNuxtModule({
  meta: {
    name: 'build-env',
  },
  async setup(_options, nuxt) {
    const commit = await getCommitSha();

    const buildInfo: BuildInfo = {
      time: +Date.now(),
      commit,
    };

    const privateBuildInfo: PrivateBuildInfo = {
      id: nanoid(),
    };

    nuxt.options.appConfig = nuxt.options.appConfig || {};
    nuxt.options.appConfig.buildInfo = buildInfo;

    nuxt.options.runtimeConfig.build = privateBuildInfo;

    logger.log(`Unique build id: ${privateBuildInfo.id}`);
  },
});

const git = Git();

async function getCommitSha(): Promise<string> {
  return await git.revparse(['--short', 'HEAD']);
}
