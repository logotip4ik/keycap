import type { Promisable } from 'type-fest';

import type { SearchActionValues } from '~/types/common';

import { SearchAction } from '~/types/common';

interface Command {
  key: SearchActionValues
  name: string
  handler: (arg?: string) => Promisable<void>
}

export const commandActions: Record<Command['key'], Command['handler']> = {
  [SearchAction.New]: (arg) => {
    useMitt().emit('precreate:item', arg ? { name: arg } : undefined);
  },
  [SearchAction.Refresh]: () => {
    const mitt = useMitt();

    mitt.emit('refresh:note');
    mitt.emit('refresh:folder');
  },
  [SearchAction.RefreshNote]: () => {
    useMitt().emit('refresh:note');
  },
  [SearchAction.RefreshFolder]: () => {
    useMitt().emit('refresh:folder');
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
  [SearchAction.Workspace]: async () => {
    const user = getUser();

    await navigateTo(`/@${user.username}`);
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
  [SearchAction.Workspace, { name: 'workspace', key: SearchAction.Workspace }],
]);

export function generateSearchRelativeItemPath(path: string, username: string) {
  const pathWithoutWorkspacePrefix = path.substring(1 + username.length + 1);

  const lastSlashIdx = pathWithoutWorkspacePrefix.lastIndexOf('/');

  return decodeURIComponent(pathWithoutWorkspacePrefix.substring(0, lastSlashIdx));
}
