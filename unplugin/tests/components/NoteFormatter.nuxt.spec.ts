import { WorkspaceNoteFormatter as NoteFormatter } from '#components';
import { renderSuspended } from '@nuxt/test-utils/runtime';
import { fireEvent } from '@testing-library/vue';

import { describe, expect, it } from 'vitest';

import type { Editor } from '@tiptap/core';

describe('component NoteFormatter', () => {
  it('should get and show correct link from editor', async () => {
    const currentLink = 'https://keycap.io';

    const editor = {
      state: { selection: new Selection() },
      isActive: (type: string) => type === 'link',
      getAttributes: () => ({ href: currentLink }),
    } as unknown as Editor;

    const component = await renderSuspended(NoteFormatter, {
      props: {
        editor,
      },
      global: {
        stubs: { transition: false },
      },
    });

    const linkButton = await component.findByLabelText('toggle link');

    await fireEvent.click(linkButton);

    const linkInput = await component.findByRole('textbox') as HTMLInputElement;

    expect(linkInput.value).toBe(currentLink);
  });
});
