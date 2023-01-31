import { defineNuxtModule } from '@nuxt/kit';
import Git from 'simple-git';

import type { BuildInfo } from '~/types';

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

    nuxt.options.appConfig = nuxt.options.appConfig || {};
    nuxt.options.appConfig.buildInfo = buildInfo;
  },
});

const git = Git();

async function getCommitSha(): Promise<string> {
  return await git.revparse(['--short', 'HEAD']);
}
