import { defineNuxtModule, useLogger } from '@nuxt/kit';
import { nanoid } from 'nanoid';
import Git from 'simple-git';
import chalk from 'chalk';

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
    };

    const privateBuildInfo: PrivateBuildInfo = {
      id: nanoid(),
    };

    nuxt.options.appConfig = nuxt.options.appConfig || {};
    nuxt.options.appConfig.buildInfo = buildInfo;

    nuxt.options.runtimeConfig.build = privateBuildInfo;

    logger.info(`Unique build id: ${chalk.bold.cyan(privateBuildInfo.id)}`);
  },
});

const git = Git();

async function getCommitSha(): Promise<string> {
  return await git.revparse(['--short', 'HEAD']);
}
