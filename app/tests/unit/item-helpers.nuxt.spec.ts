import type { SafeUser } from '~~/shared/types/user';
import {
  createItem,
  deleteItem,
  generateItemPath,
  preCreateItem,
  preloadItem,
  renameItem,
} from '#imports';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it } from 'vitest';

const {
  kfetchMock,
  getUserMock,
  getZeenkWsMock,
  sendZeenkEventMock,
  offlineStorageMock,
} = vi.hoisted(() => {
  return {
    kfetchMock: vi.fn(() => {
      throw new Error('Mock me');
    }),
    getUserMock: vi.fn(() => {
      return { id: '1', username: 'user', email: '' } satisfies SafeUser;
    }),
    getZeenkWsMock: vi.fn(() => {
      return {
        state: computed(() => 'OPEN'),
        ws: computed(() => vi.fn() as any),
      } satisfies ReturnType<typeof getZeenkWs>;
    }),
    sendZeenkEventMock: vi.fn(() => {
      return () => {
        throw new Error('Mock me');
      };
    }),
    offlineStorageMock: vi.fn(() => {
      return () => {
        throw new Error('Mock me');
      };
    }),
  };
});

mockNuxtImport('kfetch', () => kfetchMock);
mockNuxtImport('getUser', () => getUserMock);
mockNuxtImport('getZeenkWs', () => getZeenkWsMock);
mockNuxtImport('sendZeenkEvent', () => sendZeenkEventMock);
mockNuxtImport('getOfflineStorage', () => offlineStorageMock);
mockNuxtImport('navigateTo', () => {
  return () => Promise.resolve();
});

describe('item helpers', () => {
  afterEach(() => {
    kfetchMock.mockRestore();
    sendZeenkEventMock.mockRestore();
    offlineStorageMock.mockRestore();
  });

  describe('generateItemPath', () => {
    it('should generate browser path with correct item path', () => {
      const path = '/help/me';

      expect(generateItemPath({ path })).toEqual('/@help/me');
      expect(generateItemPath({ path, root: false })).toEqual('/@help/me/_blank');
    });
  });

  function makePropsWithParent(user: SafeUser = getUserMock()) {
    return reactive({
      parent: {
        id: '1',
        name: `${user.username}'s workspace'`,
        path: `/${user.username}`,
        root: true,
        notes: [],
        subfolders: [],
      } as FolderWithContents,
    });
  }

  describe('preCreateItem', () => {
    it('should correctly add empty note', () => {
      const props = makePropsWithParent();

      preCreateItem(props.parent);

      const { id, ...note } = props.parent.notes[0];
      expect(note).toEqual({
        name: '',
        path: '',
        state: ItemState.Creating,
      });
    });

    it('should correctly add note with default values', () => {
      const props = makePropsWithParent();

      preCreateItem(props.parent, { name: 'testing' });

      const { id, ...note } = props.parent.notes[0];
      expect(note).toEqual({
        name: 'testing',
        path: '',
        state: ItemState.Creating,
      });
    });
  });

  it('should create note', async () => {
    const props = makePropsWithParent();

    preCreateItem(props.parent);

    expect(props.parent.notes[0]).toEqual(
      expect.objectContaining({
        name: '',
        path: '',
      }),
    );

    const itemName = 'testing';
    const itemPath = `${props.parent.path}/${itemName}`;

    // @ts-expect-error no types
    kfetchMock.mockImplementationOnce((path, opts) => {
      expect(path).toEqual(`/api/note/${itemName}`);
      expect(opts).toEqual({
        method: 'POST',
        body: { name: itemName, parentId: props.parent.id },
      });

      return {
        data: {
          name: itemName,
          path: itemPath,
        },
      };
    });

    // @ts-expect-error no types
    sendZeenkEventMock.mockImplementationOnce((_, event) => {
      expect(event).toEqual(
        makeZeenkEvent('item-created', { path: itemPath }),
      );
    });

    // @ts-expect-error no types
    offlineStorageMock.mockImplementationOnce(() => {
      return {
        setItem: (key: string, data: any) => {
          expect(key).toEqual(itemPath);
          expect(data).toEqual(
            expect.objectContaining({
              name: itemName,
              path: itemPath,
            }),
          );
        },
      };
    });

    await createItem(itemName, props.parent.notes[0], props.parent);

    const { id, ...createdNote } = props.parent.notes[0];
    expect(createdNote).toEqual({
      name: itemName,
      path: itemPath,
      content: '',
    });
  });

  it('should create folder', async () => {
    const props = makePropsWithParent();

    preCreateItem(props.parent);

    expect(props.parent.notes[0]).toEqual(
      expect.objectContaining({
        name: '',
        path: '',
      }),
    );

    const itemName = 'testing';
    const itemPath = `${props.parent.path}/${itemName}`;

    // @ts-expect-error no types
    kfetchMock.mockImplementationOnce((path, opts) => {
      expect(path).toEqual(`/api/folder/${itemName}`);
      expect(opts).toEqual({
        method: 'POST',
        body: { name: itemName, parentId: props.parent.id },
      });

      return {
        data: {
          name: itemName,
          path: itemPath,
          root: false,
        },
      };
    });

    // @ts-expect-error no types
    sendZeenkEventMock.mockImplementationOnce((_, event) => {
      expect(event).toEqual(
        makeZeenkEvent('item-created', { path: itemPath }),
      );
    });

    // @ts-expect-error no types
    offlineStorageMock.mockImplementationOnce(() => {
      return {
        setItem: (key: string, data: any) => {
          expect(key).toEqual(itemPath);
          expect(data).toEqual(
            expect.objectContaining({
              name: itemName,
              path: itemPath,
            }),
          );
        },
      };
    });

    // `/` at the end means - create subfolder instead of note
    await createItem(`${itemName}/`, props.parent.notes[0], props.parent);

    expect(props.parent.notes).toEqual([]);

    const { id, ...createdFolder } = props.parent.subfolders[0];
    expect(createdFolder).toEqual({
      name: itemName,
      path: itemPath,
      root: false,
    });
  });

  it('should delete note', async () => {
    const props = makePropsWithParent();

    const itemName = 'to-be-deleted';
    const itemPath = `/${props.parent.path}/${itemName}`;

    props.parent.notes.push({
      id: 'note-to-delete',
      name: itemName,
      path: itemPath,
    });

    expect(props.parent.notes.length).toBe(1);

    // @ts-expect-error no types
    kfetchMock.raw = vi.fn((path, opts) => {
      expect(path).toEqual(`/api/note/${itemName}`);
      expect(opts).toEqual({ method: 'DELETE' });
      return {}; // Successful delete returns no body
    });

    // @ts-expect-error no types
    sendZeenkEventMock.mockImplementationOnce((_, event) => {
      expect(event).toEqual(
        makeZeenkEvent('item-deleted', { path: itemPath }),
      );
    });

    // @ts-expect-error no types
    offlineStorageMock.mockImplementationOnce(() => {
      return {
        removeItem: (path: string) => {
          expect(path).toEqual(itemPath);
          return Promise.resolve();
        },
      };
    });

    await deleteItem(props.parent.notes[0], props.parent);

    // Ensure the item is removed from the parent's list
    expect(props.parent.notes.length).toBe(0);

    // @ts-expect-error assigned `raw` only for `deleteItem` and above few lines
    delete kfetchMock.raw;
  });

  it('should delete folder', async () => {
    const props = makePropsWithParent();

    const itemName = 'to-be-deleted';
    const itemPath = `/${props.parent.path}/${itemName}`;

    props.parent.subfolders.push({
      id: 'folder-to-delete',
      name: itemName,
      path: itemPath,
      root: false,
    });
    expect(props.parent.subfolders.length).toBe(1);

    // @ts-expect-error no types
    kfetchMock.raw = vi.fn((path, opts) => {
      expect(path).toEqual(`/api/folder/${itemName}`);
      expect(opts).toEqual({ method: 'DELETE' });
      return {}; // Successful delete returns no body
    });

    // @ts-expect-error no types
    sendZeenkEventMock.mockImplementationOnce((_, event) => {
      expect(event).toEqual(
        makeZeenkEvent('item-deleted', { path: itemPath }),
      );
    });

    // @ts-expect-error no types
    offlineStorageMock.mockImplementationOnce(() => {
      return {
        removeItem: (path: string) => {
          expect(path).toEqual(itemPath);
          return Promise.resolve();
        },
      };
    });

    await deleteItem(props.parent.subfolders[0], props.parent);

    // Ensure the item is removed from the parent's list
    expect(props.parent.subfolders.length).toBe(0);

    // @ts-expect-error assigned `raw` only for `deleteItem` and above few lines
    delete kfetchMock.raw;
  });

  it('should rename note', async () => {
    const props = makePropsWithParent();
    const oldName = 'old-name';
    const newName = 'new-name';
    const oldPath = `${props.parent.path}/${oldName}`;
    const newPath = `${props.parent.path}/${newName}`;

    props.parent.notes.push({
      id: 'note-1',
      name: oldName,
      path: oldPath,
    });

    // @ts-expect-error no types
    kfetchMock.mockImplementationOnce((path, opts) => {
      expect(path).toEqual(`/api/note/${oldName}`);
      expect(opts).toEqual({
        method: 'PATCH',
        body: { name: newName },
      });

      return {
        data: {
          name: newName,
          path: newPath,
        },
      };
    });

    // @ts-expect-error no types
    sendZeenkEventMock.mockImplementationOnce((_, event) => {
      expect(event).toEqual(
        makeZeenkEvent('item-renamed', { oldPath, path: newPath }),
      );
    });

    const offlineStorage = {
      removeItem: vi.fn(() => Promise.resolve()),
      setItem: vi.fn(() => Promise.resolve()),
    };

    // @ts-expect-error no types
    offlineStorageMock.mockImplementationOnce(() => {
      return offlineStorage;
    });

    await renameItem(newName, props.parent.notes[0], props.parent);

    expect(offlineStorage.removeItem).toHaveBeenCalledWith(oldPath);
    expect(offlineStorage.setItem).toHaveBeenCalledWith(
      newPath,
      expect.objectContaining({ name: newName, path: newPath }),
    );

    // Also ensure the item in the parent list is updated
    expect(props.parent.notes[0].name).toEqual(newName);
    expect(props.parent.notes[0].path).toEqual(newPath);
  });

  it('should rename folder', async () => {
    const props = makePropsWithParent();
    const oldName = 'old-name';
    const newName = 'new-name';
    const oldPath = `${props.parent.path}/${oldName}`;
    const newPath = `${props.parent.path}/${newName}`;

    props.parent.subfolders.push({
      id: 'note-1',
      name: oldName,
      path: oldPath,
      root: false,
    });

    // @ts-expect-error no types
    kfetchMock.mockImplementationOnce((path, opts) => {
      expect(path).toEqual(`/api/folder/${oldName}`);
      expect(opts).toEqual({
        method: 'PATCH',
        body: { name: newName },
      });

      return {
        data: {
          name: newName,
          path: newPath,
        },
      };
    });

    // @ts-expect-error no types
    sendZeenkEventMock.mockImplementationOnce((_, event) => {
      expect(event).toEqual(
        makeZeenkEvent('item-renamed', { oldPath, path: newPath }),
      );
    });

    const offlineStorage = {
      removeItem: vi.fn(() => Promise.resolve()),
      setItem: vi.fn(() => Promise.resolve()),
    };

    // @ts-expect-error no types
    offlineStorageMock.mockImplementationOnce(() => {
      return offlineStorage;
    });

    await renameItem(newName, props.parent.subfolders[0], props.parent);

    expect(offlineStorage.removeItem).toHaveBeenCalledWith(oldPath);
    expect(offlineStorage.setItem).toHaveBeenCalledWith(
      newPath,
      expect.objectContaining({ name: newName, path: newPath }),
    );

    // Also ensure the item in the parent list is updated
    expect(props.parent.subfolders[0].name).toEqual(newName);
    expect(props.parent.subfolders[0].path).toEqual(newPath);
  });

  it('should preload item', async () => {
    const props = makePropsWithParent();
    const itemName = 'item-to-preload';
    const itemPath = `${props.parent.path}/${itemName}`;

    props.parent.notes.push({
      id: 'note-to-preload',
      name: itemName,
      path: itemPath,
    });

    // @ts-expect-error no types
    kfetchMock.mockImplementationOnce((path, opts) => {
      expect(path).toEqual(`/api/note/${itemName}`);
      expect(opts).toBeUndefined(); // Should be a simple GET request
      return { data: {} };
    });

    // @ts-expect-error no types
    offlineStorageMock.mockImplementationOnce(() => {
      return { setItem: vi.fn() };
    });

    await preloadItem(props.parent.notes[0], props.parent);
  });
});
