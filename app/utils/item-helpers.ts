import type { NavigateToOptions } from '#app/composables/router';

import escapeRE from 'escape-string-regexp';
import invariant from 'tiny-invariant';

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

export function showItem(item: ItemWithPath, options?: NavigateToOptions) {
  const itemRouteParams = generateItemPath(item);

  return navigateTo(itemRouteParams, options);
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

/**
 * @param {string} name
 * @param {NoteMinimal} self - must be a vue's **reactive object**
 * @param {FolderWithContents} parent - must be a vue's **reactive object**
 */
export async function createItem(name: string, self: NoteMinimal, parent: FolderWithContents) {
  invariant(isReactive(self), 'Self in createFolder must be reactive.');
  invariant(isReactive(parent), 'Parent in createFolder must be reactive.');

  const isCreatingFolder = name.at(-1) === '/';
  if (isCreatingFolder) {
    name = name.substring(0, name.length - 1);
  }

  const user = getUser();
  const currentFolderPath = parent.path.replace(`/${user.username}`, '');
  const newItemPath = `${currentFolderPath}/${encodeURIComponent(name.trim())}`;

  const res = await kfetch<{ data: FolderWithContents | NoteWithContent }>(
    isCreatingFolder
      ? `/api/folder${newItemPath}`
      : `/api/note${newItemPath}`,
    {
      method: 'POST',
      body: { name, parentId: parent.id },
    },
  );

  if (!res) {
    // todo: notify user that we failed creating item...
    return;
  }

  const { data } = res;

  const { ws, state: wsState } = getZeenkWs();
  if (wsState.value === 'OPEN' && ws.value) {
    sendZeenkEvent(
      ws.value,
      makeZeenkEvent('item-created', {
        path: data.path,
      }),
    );
  }

  data.state = undefined;
  if (checkIsFolder(data)) {
    parent.subfolders.push(data);
    // self is always a note, but when we crate a folder, we need to remove it from `notes`
    remove(parent.notes, self);

    const cache = useFoldersCache();
    cache.set(data.path, data);
  }
  else {
    data.content ||= '';
    extend(self, data);

    const cache = useNotesCache();
    cache.set(data.path, data);
  }

  const offlineStorage = getOfflineStorage();
  offlineStorage.setItem(data.path, data);

  const fuzzyWorker = getFuzzyWorker();
  fuzzyWorker.value?.addItemToCache(data);

  await showItem(data);

  return data;
}

/**
 * @param {string} newName
 * @param {NoteMinimal | FolderMinimal} self - must be a vue's **reactive object**
 */
export async function renameItem<T extends NoteMinimal | FolderMinimal>(
  newName: string,
  self: T,
  parent: FolderMinimal,
) {
  invariant(isReactive(self), 'Self in renameItem must be reactive.');

  const newItem = { name: newName.trim() } as T;

  const user = getUser();
  const currentFolderPath = parent.path.replace(`/${user.username}`, '');
  const itemPath = `${currentFolderPath}/${encodeURIComponent(self.name)}`;

  const isFolder = checkIsFolder(self);

  await kfetch(
    isFolder ? `/api/folder${itemPath}` : `/api/note${itemPath}`,
    { method: 'PATCH', body: newItem },
  );

  const cache = (isFolder ? useFoldersCache : useNotesCache)();
  const offlineStorage = getOfflineStorage();
  const fuzzyWorker = getFuzzyWorker();
  const { ws, state: wsState } = getZeenkWs();

  const selfPath = self.path;
  const cachedItem = cache.get(selfPath);

  cache.remove(selfPath);
  offlineStorage.removeItem(selfPath).then(validateOfflineStorage);

  const noteNameRegex = new RegExp(`${escapeRE(encodeURIComponent(self.name))}$`);
  newItem.path = selfPath.replace(noteNameRegex, encodeURIComponent(newItem.name));
  newItem.state = undefined;

  extend(self, newItem);
  fuzzyWorker.value?.refreshItemsCache();

  const item = { ...cachedItem, ...toRaw(self) };

  if (isFolder) {
    (item as FolderWithContents).notes ??= [];
    (item as FolderWithContents).subfolders ??= [];
  }
  else {
    (item as NoteWithContent).content ??= '';
  }

  cache.set(item.path, item as any);
  offlineStorage.setItem(item.path, item);

  if (wsState.value === 'OPEN' && ws.value) {
    sendZeenkEvent(
      ws.value,
      makeZeenkEvent('item-renamed', {
        path: item.path,
        oldPath: selfPath,
      }),
    );
  }
}

/**
 * @param {NoteMinimal | FolderMinimal} self - must be a vue's **reactive object**
 * @param {FolderWithContents} parent - must be a vue's **reactive object**
 */
export async function deleteItem(self: FolderMinimal | NoteMinimal, parent: FolderWithContents) {
  invariant(isReactive(self), 'Self in deleteItem must be reactive.');
  invariant(isReactive(parent), 'Parent in deleteItem must be reactive.');

  const user = getUser();
  const currentFolderPath = parent.path.replace(`/${user.username}`, '');
  const itemPath = `${currentFolderPath}/${encodeURIComponent(self.name)}`;

  const isFolder = checkIsFolder(self);

  const res = await kfetch.raw(
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
export async function preloadItem(self: FolderMinimal | NoteMinimal, parent: FolderMinimal) {
  const user = getUser();
  const currentFolderPath = parent.path.replace(`/${user.username}`, '');
  const itemPath = `${currentFolderPath}/${encodeURIComponent(self.name)}`;

  const res = await kfetch<{ data: FolderWithContents | NoteWithContent }>(
    checkIsFolder(self)
      ? `/api/folder${itemPath}`
      : `/api/note${itemPath}`,
  );

  if (!res) {
    return;
  }

  const { data } = res;

  if (checkIsFolder(data)) {
    const foldersCache = useFoldersCache();
    foldersCache.set(data.path, data);
  }
  else {
    const notesCache = useNotesCache();
    notesCache.set(data.path, data);
  }

  const offlineStorage = getOfflineStorage();
  offlineStorage.setItem(data.path, data);
}
