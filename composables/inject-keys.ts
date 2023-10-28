import type { ComputedRef, InjectionKey } from 'vue';

export const IsSmallScreenKey = Symbol(import.meta.dev ? '__is-small-screen-key__' : '') as InjectionKey<boolean>;
export const IsNoteNameEmptyKey = Symbol(import.meta.dev ? '__is-note-name-empty__' : '') as InjectionKey<ComputedRef<boolean>>;
export const IsFirefoxKey = Symbol(import.meta.dev ? '__is-firefox__' : '') as InjectionKey<boolean>;
