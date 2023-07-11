import type { Emitter } from 'mitt';
import mitt from 'mitt';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Events = {
  'save:note'?: Partial<{ force: boolean }>
  'cache:populated'?: Partial<object>
};

const emitter = mitt<Events>();

export default (): Emitter<Events> => {
  return {
    ...emitter,
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore we still return correct type from function
    on: (type, handler) => {
      emitter.on(type, handler);

      onScopeDispose(() => {
        emitter.off(type, handler);
      });
    },
  };
};
