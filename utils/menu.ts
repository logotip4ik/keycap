import { SearchAction } from '~/types/common';

import type { SearchActionValues } from '~/types/common';

interface Command {
  key: SearchActionValues
  name: string
  handler: (args?: Array<string>) => void
}

export const commandActions: Record<Command['key'], Command['handler']> = {
  [SearchAction.New]: (args) => {
    const { state } = useContentsSidebar();
    const folder = useNuxtApp()._asyncData.folder;

    if (!folder) {
      return;
    }

    const folderData = folder.data as Ref<FolderWithContents>;

    if (!folderData.value) {
      return;
    }

    preCreateItem(folderData.value, args ? { name: args.join(' ') } : undefined);

    if (state.value === 'hidden') {
      state.value = 'visible';
    }
  },
  [SearchAction.Refresh]: () => {
    refreshNuxtData(['note', 'folder']);
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
    const route = useRoute();
    const noNote = !route.params.note || route.params.note === BLANK_NOTE_NAME;

    useMitt().emit(`details:show:${noNote ? 'folder' : 'note'}`);
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
