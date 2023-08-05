import type { ComputedRef, InjectionKey } from 'vue';

export const IsSmallScreenKey = Symbol('') as InjectionKey<ComputedRef<boolean>>;
export const IsNoteNameEmptyKey = Symbol('') as InjectionKey<ComputedRef<boolean>>;
export const IsFirefoxKey = Symbol('') as InjectionKey<boolean>;
