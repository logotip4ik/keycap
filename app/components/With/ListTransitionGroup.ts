import type { BaseHTMLAttributes, PropType, TransitionGroupProps } from 'vue';

import { defineComponent, h, TransitionGroup } from 'vue';

import '~/assets/styles/list-transition.scss';

const defaultTransitionProps = { name: 'list', tag: 'div' };

export default defineComponent({
  name: 'WithListTransitionGroup',
  props: {
    handleArrowsPress: {
      type: String as PropType<'vertical'>,
      required: false,
    },
  },
  setup(props, { slots, attrs }) {
    const merged = { ...defaultTransitionProps, ...attrs } as TransitionGroupProps & BaseHTMLAttributes;

    if (props.handleArrowsPress) {
      merged.onKeydown = handleArrowsPress;
    }

    return () => h(
      TransitionGroup,
      merged,
      slots.default,
    );
  },
});

function handleArrowsPress(event: KeyboardEvent) {
  const key = event.key;

  const diff = key === 'ArrowUp'
    ? -1
    : key === 'ArrowDown'
      ? +1
      : 0;

  const listElement = (event.target as HTMLElement).offsetParent;

  if (!diff || !listElement) {
    return;
  }

  const currentIdx = Array.from(listElement.children)
    .findIndex((node) =>
    // event.target will be anchor tag, but it is wrapped in li, which is list element child
      node === (event.target as HTMLElement).parentElement,
    );

  const newSelectedResult = (currentIdx + diff) % listElement.childElementCount;
  const loopedNewSelectedResult = newSelectedResult < 0 ? listElement.childElementCount - 1 : newSelectedResult;
  const elementToFocus = listElement.children[loopedNewSelectedResult].firstElementChild as HTMLElement | undefined;

  elementToFocus?.focus();
  event.preventDefault();
}
