import type { NavigateToOptions } from '#app/composables/router';

import escapeRE from 'escape-string-regexp';

export function checkIsFolder(item: object): item is FolderWithContents {
  return 'root' in item;
}

interface ItemWithPath {
  root?: boolean
  path: string
}
export function generateItemPath(item: ItemWithPath): string {
  let path = `/@${item.path.substring(1)}`;

  if (checkIsFolder(item)) {
    path += `/${BLANK_NOTE_NAME}`;
  }

  return path;
}

export async function showItem(item: ItemWithPath, options?: NavigateToOptions) {
  const itemRouteParams = generateItemPath(item);

  await navigateTo(itemRouteParams, options);
}

export function preCreateItem(folderToAppend: FolderWithContents, initialValues?: Partial<Pick<NoteMinimal, 'name' | 'path'>>) {
  const id = Math.floor(Math.random() * 1000).toString();

  folderToAppend.notes.unshift({
    id,
    name: initialValues?.name ?? '',
    path: initialValues?.path ?? '',
    state: ItemState.Creating,
  });
}

export function getCurrentFolderPath(_route?: ReturnType<typeof useRoute>) {
  const route = _route || useRoute();

  return isArray(route.params.folders) && route.params.folders.length > 0
    ? `/${route.params.folders.map(encodeURIComponent).join('/')}/`
    : '/';
}

export function getItemPathFromHref(href: string) {
  const user = getUser();

  const workspacePrefix = `/@${user.username}/`;
  const innerPartStart = href.indexOf(workspacePrefix) + workspacePrefix.length;

  const innerPart = href.substring(innerPartStart);
  const parts = innerPart.split('/');

  if (parts.at(-1) === BLANK_NOTE_NAME) {
    parts.pop();
  }

  return parts.map(decodeURIComponent).join('/');
}

export async function createFolder(folderName: string, self: NoteMinimal, parent: FolderWithContents) {
  const currentFolderPath = getCurrentFolderPath();
  const newFolderPathName = encodeURIComponent(folderName.trim());
  const newFolderPath = currentFolderPath + newFolderPathName;

  const res = await $fetch<{ data: FolderWithContents }>(`/api/folder${newFolderPath}`, {
    method: 'POST',
    body: { name: folderName, parentId: parent.id },
  });

  if (!res) {
    return;
  }

  const { data: newlyCreatedFolder } = res;
  const foldersCache = useFoldersCache();
  const offlineStorage = getOfflineStorage();
  const fuzzyWorker = getFuzzyWorker();
  const { ws, state: wsState } = getZeenkWs();

  if (wsState.value === 'OPEN' && ws.value) {
    sendZeenkEvent(
      ws.value,
      makeZeenkEvent('item-created', {
        path: newlyCreatedFolder.path,
      }),
    );
  }

  newlyCreatedFolder.state = undefined;
  parent.subfolders.push(newlyCreatedFolder);

  remove(parent.notes, self);

  foldersCache.set(newlyCreatedFolder.path, newlyCreatedFolder);
  offlineStorage.setItem(newlyCreatedFolder.path, newlyCreatedFolder);
  fuzzyWorker.value?.addItemToCache(newlyCreatedFolder);
  extend(self, newlyCreatedFolder);

  await showItem(newlyCreatedFolder);

  return newlyCreatedFolder;
}

export async function createNote(noteName: string, self: NoteMinimal, parent: FolderWithContents) {
  const currentFolderPath = getCurrentFolderPath();
  const newNotePathName = encodeURIComponent(noteName.trim());
  const newNotePath = currentFolderPath + newNotePathName;

  const res = await $fetch<{ data: NoteWithContent }>(`/api/note${newNotePath}`, {
    method: 'POST',
    body: { name: noteName, parentId: parent.id },
  });

  if (!res) {
    return;
  }

  const { data: newlyCreatedNote } = res;
  const notesCache = useNotesCache();
  const offlineStorage = getOfflineStorage();
  const fuzzyWorker = getFuzzyWorker();
  const { ws, state: wsState } = getZeenkWs();

  if (wsState.value === 'OPEN' && ws.value) {
    sendZeenkEvent(
      ws.value,
      makeZeenkEvent('item-created', {
        path: newlyCreatedNote.path,
      }),
    );
  }

  newlyCreatedNote.content ||= '';
  newlyCreatedNote.state = undefined;

  notesCache.set(newlyCreatedNote.path, newlyCreatedNote);
  offlineStorage.setItem(newlyCreatedNote.path, newlyCreatedNote);
  fuzzyWorker.value?.addItemToCache(newlyCreatedNote);
  extend(self, newlyCreatedNote);

  await showItem(newlyCreatedNote);

  return newlyCreatedNote;
}

export async function renameItem<T extends NoteMinimal | FolderMinimal>(newName: string, self: T) {
  const newItem = { name: newName.trim() } as T;

  const currentFolderPath = getCurrentFolderPath();
  const itemPathName = encodeURIComponent(self.name);
  const itemPath = currentFolderPath + itemPathName;

  const isFolder = checkIsFolder(self);

  await $fetch(
    isFolder ? `/api/folder${itemPath}` : `/api/note${itemPath}`,
    { method: 'PATCH', body: newItem },
  );

  const cache = (isFolder ? useFoldersCache : useNotesCache)();
  const offlineStorage = getOfflineStorage();
  const fuzzyWorker = getFuzzyWorker();
  const { ws, state: wsState } = getZeenkWs();

  const selfPath = self.path;
  const item = cache.get(selfPath);

  cache.remove(selfPath);
  offlineStorage.removeItem(selfPath).then(validateOfflineStorage);

  const noteNameRegex = new RegExp(`${escapeRE(encodeURIComponent(self.name))}$`);
  newItem.path = selfPath.replace(noteNameRegex, encodeURIComponent(newItem.name));
  newItem.state = undefined;

  extend(self, newItem);
  fuzzyWorker.value?.refreshItemsCache();

  if (wsState.value === 'OPEN' && ws.value) {
    sendZeenkEvent(
      ws.value,
      makeZeenkEvent('item-renamed', {
        path: newItem.path,
        oldPath: selfPath,
      }),
    );
  }

  if (item) {
    extend(item, newItem);

    (newItem as FolderWithContents).notes = (item as FolderWithContents).notes || [];
    (newItem as FolderWithContents).subfolders = (item as FolderWithContents).subfolders || [];

    cache.set(newItem.path, newItem as any);
    offlineStorage.setItem(newItem.path, newItem);
  }
}

export async function deleteItem(self: FolderMinimal | NoteMinimal, parent: FolderWithContents) {
  const currentFolderPath = getCurrentFolderPath();
  const itemPathName = encodeURIComponent(self.name);
  const itemPath = currentFolderPath + itemPathName;

  const isFolder = checkIsFolder(self);

  const res = await $fetch.raw(
    isFolder ? `/api/folder${itemPath}` : `/api/note${itemPath}`,
    { method: 'DELETE' },
  );

  if (!res) {
    return;
  }

  const cache = (isFolder ? useFoldersCache : useNotesCache)();
  const offlineStorage = getOfflineStorage();
  const fuzzyWorker = getFuzzyWorker();
  const { ws, state: wsState } = getZeenkWs();

  cache.remove(self.path);
  offlineStorage.removeItem(self.path).then(validateOfflineStorage);
  fuzzyWorker.value?.refreshItemsCache();

  if (isFolder) {
    remove(parent.subfolders, self);
  }
  else {
    await showItem(parent);

    remove(parent.notes, self);
  }

  if (wsState.value === 'OPEN' && ws.value) {
    sendZeenkEvent(
      ws.value,
      makeZeenkEvent('item-deleted', {
        path: self.path,
      }),
    );
  }
}

// NOTE: Refactor all functions above to use this approach ?
export async function preloadItem(self: FolderMinimal | NoteMinimal) {
  const isFolder = checkIsFolder(self);

  const currentFolderPath = getCurrentFolderPath();
  const pathPrefix = isFolder ? 'folder' : 'note';
  const pathName = encodeURIComponent(self.name);
  const path = pathPrefix + currentFolderPath + pathName;

  const res = await $fetch<{ data: FolderWithContents | NoteWithContent }>(`/api/${path}`);

  if (!res) {
    return;
  }

  const offlineStorage = getOfflineStorage();
  const notesCache = useNotesCache();
  const foldersCache = useFoldersCache();

  const item = res.data;

  if (checkIsFolder(item)) {
    foldersCache.set(item.path, item);
  }
  else {
    notesCache.set(item.path, item);
  }

  offlineStorage.setItem(item.path, item);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('generateItemPath', () => {
    it('should generate browser path with correct item path', () => {
      const path = '/help/me';

      expect(generateItemPath({ path })).toEqual('/@help/me');
      expect(generateItemPath({ path, root: false })).toEqual('/@help/me/_blank');
    });
  });
}
