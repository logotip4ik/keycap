import { SearchAction } from '~/types/common';

import type { SearchActionValues } from '~/types/common';

interface Command {
  key: SearchActionValues
  name: string
  handler: (arg?: string) => void
}

export const commandActions: Record<Command['key'], Command['handler']> = {
  [SearchAction.New]: (arg) => {
    const { state } = useContentsSidebar();
    const folder = useNuxtApp()._asyncData.folder;

    if (!folder) {
      return;
    }

    const folderData = folder.data as Ref<FolderWithContents>;

    if (!folderData.value) {
      return;
    }

    preCreateItem(folderData.value, arg ? { name: arg } : undefined);

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
  [SearchAction.Details]: (arg) => {
    const route = useRoute();
    const mitt = useMitt();

    if (arg === 'folder') {
      mitt.emit('details:show:folder');
    }
    else if (arg === 'note') {
      mitt.emit('details:show:note');
    }

    else {
      const noNote = !route.params.note || route.params.note === BLANK_NOTE_NAME;
      mitt.emit(`details:show:${noNote ? 'folder' : 'note'}`);
    }
  },
  [SearchAction.Shortcuts]: () => {
    useMitt().emit('shortcuts:show');
  },
};

export const commandActionsMin: Map<Command['key'], Pick<Command, 'key' | 'name'>> = new Map([
  [SearchAction.New, { name: 'new', key: SearchAction.New }],
  [SearchAction.Refresh, { name: 'refresh', key: SearchAction.Refresh }],
  [SearchAction.RefreshNote, { name: 'refresh-note', key: SearchAction.RefreshNote }],
  [SearchAction.RefreshFolder, { name: 'refresh-folder', key: SearchAction.RefreshFolder }],
  [SearchAction.SaveNote, { name: 'save-note', key: SearchAction.SaveNote }],
  [SearchAction.Details, { name: 'details', key: SearchAction.Details }],
  [SearchAction.Shortcuts, { name: 'shortcuts', key: SearchAction.Shortcuts }],
]);

export function generateSearchRelativeItemPath(path: string, username: string) {
  const pathWithoutWorkspacePrefix = path.substring(1 + username.length + 1);

  const lastSlashIdx = pathWithoutWorkspacePrefix.lastIndexOf('/');

  return decodeURIComponent(pathWithoutWorkspacePrefix.substring(0, lastSlashIdx));
}
