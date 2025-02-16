import type { Mock } from 'vitest';
import { WorkspaceNoteEditor as NoteEditor } from '#components';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/vue';
import { describe, expect, it, vi } from 'vitest';

mockNuxtImport('useRequiredUser', () => {
  return () => ref({ id: '1', username: 'testing', email: 'help' });
});

mockNuxtImport('getUser', () => {
  return () => ({ id: '1', username: 'testing', email: 'help' });
});

async function getComponent(opts?: { content?: string, onUpdate?: Mock }) {
  const component = await renderSuspended(NoteEditor, {
    props: {
      note: { content: opts?.content || '' } as NoteWithContent,
      editable: true,
      onRefresh: vi.fn(),
      onUpdate: opts?.onUpdate || vi.fn(),
    },
    global: {
      stubs: {
        transition: false,
        teleport: true,
      },
    },
  });

  return {
    component,
    user: userEvent.setup(),
  };
}

describe('component NoteEditor', () => {
  it('should render correct content', async () => {
    const onUpdate = vi.fn();
    const { user, component } = await getComponent({ onUpdate });

    const editor = component.getByLabelText('Rich text editor');

    await waitFor(async () => {
      await userEvent.click(editor);

      expect(editor).toHaveFocus();

      await user.type(editor, 'hello world');

      expect(editor.textContent).toEqual('hello world');
    });

    expect(onUpdate).toBeCalled();
  });

  it('should trigger formatter to show correct applied styles', async () => {
    const { user, component } = await getComponent({
      content: '<h1>hello</h1><p><a href="https://keycapthenotes.com">keycap</a></p>',
    });

    await user.pointer({
      keys: '[MouseLeft][MouseLeft>]',
      target: component.getByText('hello'),
      offset: 0,
    });

    expect(document.getSelection()?.toString()).toEqual('hello');

    const cycleHeadingButton = component.getByLabelText('cycle heading');

    expect(cycleHeadingButton).toHaveAttribute('aria-pressed', 'true');

    await user.pointer({
      keys: '[MouseLeft][MouseLeft>]',
      target: component.getByText('keycap'),
      offset: 0,
    });

    expect(document.getSelection()?.toString()).toEqual('keycap');

    await waitFor(() => {
      expect(cycleHeadingButton).toHaveAttribute('aria-pressed', 'false');
    });
  });
});
