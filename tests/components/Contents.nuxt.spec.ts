import { WorkspaceContents as Contents } from '#components';
import { mockNuxtImport, registerEndpoint, renderSuspended } from '@nuxt/test-utils/runtime';
import userEvent from '@testing-library/user-event';
import { fireEvent, waitFor } from '@testing-library/vue';

import proxy from 'unenv/runtime/mock/proxy';

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

const username = 'testing';
const folder = 'something';

mockNuxtImport('useRequiredUser', () => {
  return () => ref({ id: '1', username: 'testing', email: 'help' });
});

mockNuxtImport('getUser', () => {
  return () => ({ id: '1', username: 'testing', email: 'help' });
});

mockNuxtImport('useRoute', () => {
  return () => ({
    path: '/@testing/something/note',
    params: {
      user: 'testing',
      folders: ['something'],
      note: 'note',
    },
  });
});

mockNuxtImport('loadFloatingUi', () => {
  return () => ({
    computePosition: proxy,
    flip: proxy,
    offset: proxy,
  });
});

registerEndpoint('/api/folder/something', (): { data: FolderWithContents } => {
  return {
    data: {
      id: '1',
      name: 'Folder',
      path: `/${username}/${folder}`,
      root: false,
      notes: [
        { id: '1', name: 'Note', path: `/${username}/${folder}/note` },
      ],
      subfolders: [
        { id: '2', name: 'Subfolder', path: `/${username}/${folder}/subfolder`, root: false },
      ],
    },
  };
});

async function getComponent() {
  const component = await renderSuspended(Contents, {
    global: { stubs: { transition: false } },
  });

  const openButton = component.getByLabelText('open contents sidebar');

  await fireEvent.click(openButton);

  return {
    ...component,
    user: userEvent.setup(),
  };
}

describe('component Contents', () => {
  beforeAll(() => {
    vi.stubGlobal('indexedDB', proxy);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('should render correct item list', async () => {
    const component = await getComponent();

    await waitFor(() => {
      const list = component.container.querySelector('.contents__list');
      expect(list).toBeTruthy();
    });

    await waitFor(() => {
      const items = component.container.querySelectorAll('.contents__list__item');
      expect(items).toBeTruthy();

      expect(items[0].textContent).not.toBe('');

      expect(items.length).toEqual(2);
    });
  });

  it('should show create input when create button pressed', async () => {
    const component = await getComponent();

    const createButton = component.getByRole('button', { name: 'Create new note or folder' });

    await fireEvent.click(createButton);

    const createInput = await component.findByRole('textbox');

    expect(createInput.getAttribute('placeholder')).toEqual('note or folder/');

    await fireEvent.blur(createInput);
  });

  it('should show edit input when rename button pressed', async () => {
    const component = await getComponent();

    const note = await component.findByText('Note');

    await waitFor(async () => {
      await fireEvent.contextMenu(note);

      const renameButton = await component.findByText('rename');

      await fireEvent.click(renameButton);
    });

    // idk why, but when this test runs last, the rename buttons needs to be pressed twice ?
    // but when this is the **only** test which runs, it needs only one press as it should...
    try {
      await waitFor(async () => {
        await fireEvent.contextMenu(note);

        const renameButton = await component.findByText('rename');

        await fireEvent.click(renameButton);
      });
    }
    catch {}

    const editInput = await component.findByRole('textbox');

    await waitFor(() => {
      expect(editInput.getAttribute('placeholder')).toEqual('new note name');
    });

    await fireEvent.blur(editInput);
  });

  it('should receive focus when keyboard short cut is pressed', async () => {
    const { user, ...component } = await getComponent();

    document.body.focus();

    expect(document.activeElement).toEqual(document.body);

    await waitFor(async () => {
      await user.keyboard('{Control>}{Shift>}f{/Shift}{/Control}');
      await nextTick();
      await nextTick();
    });

    const sidebar = component.getByTestId('sidebar');

    expect(sidebar).toHaveFocus();
  });

  it('should render correct crumbs', async () => {
    const { user, ...component } = await getComponent();

    const workspace = component.getByText('WS');
    expect(workspace).toHaveAttribute('href', '/@testing/_blank');

    const somethingFolder = component.getByText('something');
    expect(somethingFolder).toHaveAttribute('href', '/@testing/something/_blank');
  });
});
