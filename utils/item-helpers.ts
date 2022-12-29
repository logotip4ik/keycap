import { withoutLeadingSlash } from 'ufo';

import { blankNoteName } from '~/assets/constants';

import type { FolderOrNote, NoteMinimal } from '~/composables/store';

export function generateItemRouteParams(item: FolderOrNote) {
  const route = useRoute();

  const isFolder = 'root' in item;

  if (isFolder) {
    // skipping username
    const folders = withoutLeadingSlash(item.path).split('/').slice(1).map(decodeURIComponent);

    return { name: '@user-folders-note', params: { folders, note: blankNoteName } };
  }
  else {
    return { name: '@user-folders-note', params: { ...route.params, note: (item as NoteMinimal).name } };
  }
}
