import type { InjectionKey, ShallowRef } from 'vue';

import invariant from 'tiny-invariant';

export const NoteContainerKey = Symbol('__note_container__') as InjectionKey<Readonly<ShallowRef<HTMLElement | null>>>;
export function useNoteContainer() {
  const container = inject(NoteContainerKey);

  invariant(container, 'note container must exists');

  return container;
}
