import { WorkspaceToolbox as Toolbox } from '#components';
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

registerEndpoint('/api/recent', (): { data: Array<{ id: string, name: string, path: string }> } => {
  return {
    data: [
      { id: '1', name: 'help 1', path: 'path 1' },
      { id: '2', name: 'help 2', path: 'path 2' },
      { id: '3', name: 'help 3', path: 'path 3' },
      { id: '4', name: 'help 4', path: 'path 4' },
    ],
  };
});

async function getComponent() {
  const component = await renderSuspended(Toolbox, {
    route: `/@${username}/${folder}/note`,
    global: { stubs: { transition: false } },
  });

  const openButton = component.getByLabelText('open toolbox sidebar');

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

  it('should fetch and render correct recents with open sidebar', async () => {
    const component = await getComponent();

    await waitFor(() => {
      const recentList = component.container.querySelector('.toolbox__recent .toolbox__section__list');
      expect(recentList).toBeTruthy();
      expect(recentList?.children.length).toBe(4);
    });

    const items = [
      'help 1',
      'help 2',
      'help 3',
      'help 4',
    ];

    for (const item of items) {
      const list = component.getByRole('link', { name: `open note '${item}'` });
      expect(list).toBeTruthy();
    }
  });

  it('should receive focus when keyboard short cut is pressed', async () => {
    const { user, ...component } = await getComponent();

    document.body.focus();

    expect(document.activeElement).toEqual(document.body);

    await waitFor(async () => {
      await user.keyboard('{Control>}{Shift>}x{/Shift}{/Control}');
      await nextTick();
      await nextTick();
    });

    const sidebar = component.getByTestId('sidebar');

    expect(sidebar).toHaveFocus();
  });
});
