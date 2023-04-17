import type { ComputedRef, InjectionKey } from 'vue';

export const IsSmallScreenKey = Symbol('') as InjectionKey<ComputedRef<Boolean>>;
export const IsNoteNameEmptyKey = Symbol('') as InjectionKey<ComputedRef<Boolean>>;
