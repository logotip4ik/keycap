import '~/assets/styles/list-transition.scss';

import { TransitionGroup, defineComponent, h } from 'vue';

const defaultTransitionProps = { name: 'list', tag: 'div' };

export default defineComponent({
  name: 'WithListTransitionGroup',
  setup(_, { slots, attrs }) {
    const merged = { ...defaultTransitionProps, ...attrs };

    return () => h(
      TransitionGroup,
      merged,
      slots.default,
    );
  },
});
