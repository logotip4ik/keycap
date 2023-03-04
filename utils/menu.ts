import { SearchAction } from '~/types/common';

import type { SearchActionValues } from '~/types/common';

interface Command {
  key: SearchActionValues
  name: string
  handler: (args?: string[]) => any
}

// NOTE: command could be only one word,
// or use '-' as space replace
// const commands: Command[] = [
//   {
//     key: SearchAction.New,
//     name: 'new',
//     handler: (args) => {
//       const { data: folder } = useNuxtData('folder');

//       if (folder.value)
//         preCreateItem(folder.value, { name: args?.join(' ') || '' });
//     },
//   },
//   {
//     key: SearchAction.Refresh,
//     name: 'refresh',
//     handler: () => {
//       refreshNuxtData('note');
//       refreshNuxtData('folder');
//     },
//   },
//   {
//     key: SearchAction.RefreshNote,
//     name: 'refresh-note',
//     handler: () => {
//       refreshNuxtData('note');
//     },
//   },
//   {
//     key: SearchAction.RefreshFolder,
//     name: 'refresh-folder',
//     handler: () => {
//       refreshNuxtData('folder');
//     },
//   },
//   {
//     key: SearchAction.SaveNote,
//     name: 'save-note',
//     handler: () => {
//       useMitt().emit('save:note');
//     },
//   },
// ];

// this works, but both fuzzy and search files import commands const,
// command actions and command actions min. If only there was some compile function for rollup ?

// export const commandActions = Object.fromEntries(
//   commands.map((command) => [command.key, command.handler]),
// );

// export const commandActionsMin = new Map(
//   commands.map((command) => [command.key, { name: command.name, key: command.key }]),
// );

export const commandActions: Record<SearchActionValues, Command['handler']> = {
  [SearchAction.New]: (args) => {
    const { data: folder } = useNuxtData('folder');

    if (folder.value)
      preCreateItem(folder.value, { name: args?.join(' ') || '' });
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
};

export const commandActionsMin: Map<SearchActionValues, Pick<Command, 'key' | 'name'>> = new Map([
  [SearchAction.New, { name: 'new', key: SearchAction.New }],
  [SearchAction.Refresh, { name: 'refresh', key: SearchAction.Refresh }],
  [SearchAction.RefreshNote, { name: 'refresh-note', key: SearchAction.RefreshNote }],
  [SearchAction.RefreshFolder, { name: 'refresh-folder', key: SearchAction.RefreshFolder }],
  [SearchAction.SaveNote, { name: 'save-note', key: SearchAction.SaveNote }],
]);
