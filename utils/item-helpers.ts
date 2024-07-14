import escapeRE from 'escape-string-regexp';

import type { NavigateToOptions } from '#app/composables/router';

export function checkIsFolder(item: Record<string, unknown>): item is FolderWithContents {
  return 'root' in item;
}

type ItemWithPath = Record<string, unknown> & { root?: boolean, path: string };
export function generateItemPath(item: ItemWithPath): string {
  let path = item.path.replace('/', '/@');

  if (checkIsFolder(item)) {
    path += `/${BLANK_NOTE_NAME}`;
  }

  return path;
}

export async function showItem(item: ItemWithPath, options?: NavigateToOptions) {
  const itemRouteParams = generateItemPath(item);

  await navigateTo(itemRouteParams, options);
}

export function preCreateItem(folderToAppend: FolderWithContents, initialValues?: Partial<NoteMinimal>) {
  const id = Math.floor(Math.random() * 1000).toString();

  const noteValues = {
    id,
    name: '',
    path: '',
    creating: true,
  };

  if (initialValues) {
    extend(noteValues, initialValues);
  }

  folderToAppend.notes.unshift(noteValues);
}

export function getCurrentFolderPath(_route?: ReturnType<typeof useRoute>) {
  const route = _route || useRoute();

  return isArray(route.params.folders) && route.params.folders.length > 0
    ? `/${route.params.folders.map(encodeURIComponent).join('/')}/`
    : '/';
}

export function getItemPathFromHref(href: string) {
  const user = useUser();

  const workspacePrefix = `/@${user.value!.username}/`;
  const innerPartStart = href.indexOf(workspacePrefix) + workspacePrefix.length;

  const innerPart = href.substring(innerPartStart);
  const parts = innerPart.split('/');

  if (parts.at(-1) === BLANK_NOTE_NAME) {
    parts.pop();
  }

  return parts.map(decodeURIComponent).join('/');
}

export async function createFolder(folderName: string, self: FolderOrNote, parent: FolderWithContents) {
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
  const offlineStorage = useOfflineStorage();
  const fuzzyWorker = useFuzzyWorker();

  newlyCreatedFolder.creating = false;
  parent.subfolders.push(newlyCreatedFolder);

  remove(parent.notes, self);

  foldersCache.set(newlyCreatedFolder.path, newlyCreatedFolder);
  offlineStorage.setItem(newlyCreatedFolder.path, newlyCreatedFolder);
  fuzzyWorker.value?.addItemToCache(newlyCreatedFolder);
  extend(self, newlyCreatedFolder);

  showItem(newlyCreatedFolder);
}

export async function createNote(noteName: string, self: FolderOrNote, parent: FolderWithContents) {
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
  const offlineStorage = useOfflineStorage();
  const fuzzyWorker = useFuzzyWorker();

  newlyCreatedNote.content ||= '';
  newlyCreatedNote.creating = false;

  notesCache.set(newlyCreatedNote.path, newlyCreatedNote);
  offlineStorage.setItem(newlyCreatedNote.path, newlyCreatedNote);
  fuzzyWorker.value?.addItemToCache(newlyCreatedNote);
  extend(self, newlyCreatedNote);

  showItem(newlyCreatedNote);
}

export async function renameFolder(newName: string, self: FolderOrNote) {
  const newFolder: Record<string, string | boolean> = { name: newName.trim() };

  const currentFolderPath = getCurrentFolderPath();
  const folderPathName = encodeURIComponent(self.name);
  const folderPath = currentFolderPath + folderPathName;

  await $fetch<unknown>(`/api/folder${folderPath}`, { method: 'PATCH', body: newFolder });

  const notesCache = useNotesCache();
  const foldersCache = useFoldersCache();
  const offlineStorage = useOfflineStorage();
  const fuzzyWorker = useFuzzyWorker();

  const folderNameRegex = new RegExp(`${escapeRE(encodeURIComponent(self.name))}$`);
  newFolder.path = self.path.replace(folderNameRegex, encodeURIComponent(newFolder.name));
  newFolder.editing = false;

  const folder = foldersCache.get(self.path);

  foldersCache.remove(self.path);
  offlineStorage.removeItem(self.path);

  extend(self, newFolder);
  fuzzyWorker.value?.refreshItemsCache();

  const folderToCache = { ...toRaw(self), notes: [], subfolders: [] };
  foldersCache.set(self.path, folderToCache);
  offlineStorage.setItem(self.path, folderToCache);

  if (folder) {
    const itemsToRename = folder.notes.concat(folder.subfolders);

    for (const item of itemsToRename) {
      const cache = checkIsFolder(item) ? foldersCache : notesCache;

      cache.remove(item.path);
      offlineStorage.removeItem(item.path);
    }
  }
}

export async function renameNote(newName: string, self: FolderOrNote) {
  const newNote: Record<string, string | boolean> = { name: newName.trim() };

  const currentFolderPath = getCurrentFolderPath();
  const notePathName = encodeURIComponent(self.name);
  const notePath = currentFolderPath + notePathName;

  await $fetch(`/api/note${notePath}`, { method: 'PATCH', body: newNote });

  const notesCache = useNotesCache();
  const offlineStorage = useOfflineStorage();
  const fuzzyWorker = useFuzzyWorker();

  const noteNameRegex = new RegExp(`${escapeRE(encodeURIComponent(self.name))}$`);
  newNote.path = self.path.replace(noteNameRegex, encodeURIComponent(newNote.name));
  newNote.editing = false;

  const note = notesCache.get(self.path);

  notesCache.remove(self.path);
  offlineStorage.removeItem(self.path);

  extend(self, newNote);
  fuzzyWorker.value?.refreshItemsCache();

  if (note) {
    extend(note, newNote);

    notesCache.set(note.path, note);
    offlineStorage.setItem(note.path, note);
  }

  // @ts-expect-error setting path two lines before
  showItem(newNote);
}

export async function deleteNote(self: FolderOrNote, parent: FolderWithContents) {
  const currentFolderPath = getCurrentFolderPath();
  const notePathName = encodeURIComponent(self.name);
  const notePath = currentFolderPath + notePathName;

  const res = await $fetch.raw(`/api/note${notePath}`, { method: 'DELETE' });

  if (!res) {
    return;
  }

  const notesCache = useNotesCache();
  const offlineStorage = useOfflineStorage();
  const fuzzyWorker = useFuzzyWorker();

  showItem(parent);

  notesCache.remove(self.path);
  offlineStorage.removeItem(self.path);
  fuzzyWorker.value?.refreshItemsCache();
  remove(parent.notes, self);
}

export async function deleteFolder(self: FolderOrNote, parent: FolderWithContents) {
  const currentFolderPath = getCurrentFolderPath();
  const folderPathName = encodeURIComponent(self.name);
  const folderPath = currentFolderPath + folderPathName;

  const res = await $fetch.raw<null>(`/api/folder${folderPath}`, { method: 'DELETE' });

  if (!res) {
    return;
  }

  const foldersCache = useFoldersCache();
  const offlineStorage = useOfflineStorage();
  const fuzzyWorker = useFuzzyWorker();

  foldersCache.remove(self.path);
  offlineStorage.removeItem(self.path);

  const itemPathToCheck = `${self.path}/`;
  const itemsToDelete = await offlineStorage.getAllKeys()
    .then((keys) => keys.filter((key) => key.startsWith(itemPathToCheck)));
  await Promise.all(
    itemsToDelete.map((key) => offlineStorage.removeItem(key)),
  );

  remove(parent.subfolders, self);
  fuzzyWorker.value?.refreshItemsCache();
}

// NOTE: Refactor all functions above to use this approach ?
export async function preloadItem(self: FolderOrNote) {
  const isFolder = checkIsFolder(self);

  const currentFolderPath = getCurrentFolderPath();
  const pathPrefix = isFolder ? 'folder' : 'note';
  const pathName = encodeURIComponent(self.name);
  const path = pathPrefix + currentFolderPath + pathName;

  const res = await $fetch<{ data: FolderWithContents | NoteMinimal }>(`/api/${path}`);

  if (!res) {
    return;
  }

  const offlineStorage = useOfflineStorage();
  const notesCache = useNotesCache();
  const foldersCache = useFoldersCache();

  const item = res.data;
  const cache = isFolder ? foldersCache : notesCache;

  cache.set(item.path, item);
  offlineStorage.setItem(item.path, item);
}
