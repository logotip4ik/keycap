import type { ShallowRef } from 'vue';

import LRUCache from 'hashlru';

import proxy from 'unenv/runtime/mock/proxy';

interface LRU<T> {
  has: (key: string | number) => boolean
  remove: (key: string | number) => void
  get: (key: string | number) => T
  set: (key: string | number, value: T) => void
  clear: () => void
}

const detailsItem = import.meta.server ? proxy : /* #__PURE__ */ shallowRef();
export function useCurrentItemForDetails(): ShallowRef<FolderMinimal | NoteMinimal | undefined> {
  if (import.meta.server) {
    return shallowRef();
  }

  return detailsItem;
}

export function useUser() {
  return useState<SafeUser | undefined>('user', () => undefined);
}

export function useRequiredUser() {
  const user = useUser();

  const definedUser = user.value;
  if (import.meta.client) {
    if (!definedUser) {
      window.location.pathname = '/';
    }

    watch(user, (user) => !user && (window.location.pathname = '/'));
  }
  else {
    invariant(definedUser, 'User must be defined.');
  }

  return computed(() => user.value || definedUser as NonNullable<typeof definedUser>);
}

export function getUser() {
  const user = useUser().value;

  invariant(user, 'User must be defined');

  return user;
}

const notesCache = import.meta.server ? proxy : /* #__PURE__ */ LRUCache(20);
export function useNotesCache(): LRU<NoteWithContent> {
  return notesCache;
}

const foldersCache = import.meta.server ? proxy : /* #__PURE__ */ LRUCache(10);
export function useFoldersCache(): LRU<FolderWithContents> {
  return foldersCache;
}
