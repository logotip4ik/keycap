import { defineNuxtModule, useLogger } from '@nuxt/kit';
import colors from 'picocolors';

export default defineNuxtModule({
  meta: {
    name: 'route-groups',
  },
  async setup(_options, nuxt) {
    const logger = useLogger('route-groups');

    nuxt.hook('pages:extend', (pages) => {
      for (const page of pages) {
        if (!page.name || !page.path)
          continue;

        const groupName = getGroupName(page.name);

        if (!groupName)
          continue;

        const prevPath = page.path;
        const groupPath = `/(${groupName})`;

        page.path = page.path.replace(groupPath, '');

        logger.info(`${prevPath.replace(groupPath, colors.cyan(groupPath))} ➜ ${page.path}`);
      }
    });
  },
});

const groupRE = /\((?<name>.+)\)/;
function getGroupName(text: string) {
  const match = text.match(groupRE);

  return match?.groups?.name;
}
