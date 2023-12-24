import { SearchAction } from '~/types/common';

import type { SearchActionValues } from '~/types/common';

interface Command {
  key: SearchActionValues
  name: string
  handler: (args?: Array<string>) => void
}

export const commandActions: Record<Command['key'], Command['handler']> = {
  [SearchAction.New]: (args) => {
    const contents = useContentsSidebarState();
    const folder = useNuxtApp()._asyncData.folder;

    if (!folder) return;

    const folderData = folder.data as Ref<FolderWithContents>;

    if (!folderData.value)
      return;

    preCreateItem(folderData.value, args ? { name: args.join(' ') } : undefined);

    if (contents.value === 'hidden')
      contents.value = 'visible';
  },
  [SearchAction.Refresh]: () => {
    refreshNuxtData('note');
    refreshNuxtData('folder');
  },
  [SearchAction.RefreshNote]: () => {
    refreshNuxtData('note');
  },
  [SearchAction.RefreshFolder]: () => {
    refreshNuxtData('folder');
  },
  [SearchAction.SaveNote]: () => {
    useMitt().emit('save:note');
  },
  [SearchAction.Details]: () => {
    useMitt().emit('details:show');
  },
};

export const commandActionsMin: Map<Command['key'], Pick<Command, 'key' | 'name'>> = new Map([
  [SearchAction.New, { name: 'new', key: SearchAction.New }],
  [SearchAction.Refresh, { name: 'refresh', key: SearchAction.Refresh }],
  [SearchAction.RefreshNote, { name: 'refresh-note', key: SearchAction.RefreshNote }],
  [SearchAction.RefreshFolder, { name: 'refresh-folder', key: SearchAction.RefreshFolder }],
  [SearchAction.SaveNote, { name: 'save-note', key: SearchAction.SaveNote }],
  [SearchAction.Details, { name: 'details', key: SearchAction.Details }],
]);
