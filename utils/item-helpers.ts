import { withoutLeadingSlash } from 'ufo';

import type { RouteLocationNamedRaw } from 'vue-router';

import { blankNoteName } from '~/assets/constants';

export function generateItemRouteParams(item: Partial<FolderOrNote> & FuzzyItem): RouteLocationNamedRaw {
  const isFolder = 'root' in item;

  const routeName = isFolder ? blankNoteName : (item as NoteMinimal).name;
  const routeFolders = withoutLeadingSlash(item.path)
    .split('/')
    .slice(1)
    // removing last item in array if item is note
    .filter((_, i, array) => isFolder ? true : i !== array.length - 1)
    .map(decodeURIComponent);

  return {
    name: '@user-folders-note',
    params: { folders: routeFolders, note: routeName },
  };
}

export function preCreateItem(folderToAppend: FolderWithContents, initialValues?: Partial<NoteMinimal>) {
  const id = BigInt(Math.floor(Math.random() * 1000));

  const noteValues = {
    id,
    name: '',
    creating: true,
    ...(initialValues || {}),
  };

  folderToAppend.notes.unshift(noteValues);

  nextTick(() => {
    (document.querySelector('.item[data-creating="true"] > form > input') as HTMLInputElement | null)?.focus();
  });
}
