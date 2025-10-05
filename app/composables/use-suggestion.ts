export function useSuggestion<T>(containerEl: MaybeRef<HTMLElement | undefined | null>, props: {
  shouldBeVisible: boolean
  items: Array<T>
  getBoundingClientRect?: () => DOMRect
}) {
  const isVisible = computed(() => props.shouldBeVisible && props.items.length > 0);

  const selectedItem = ref(0);
  watch(() => props.items, () => {
    selectedItem.value = 0;
  });

  const floatingUi = shallowRef<FloatingUI>();
  function updatePosition() {
    const floating = floatingUi.value;
    const container = toValue(containerEl);
    const getBoundingClientRect = props.getBoundingClientRect;

    if (!floating || !container || !getBoundingClientRect) {
      return;
    }

    floating.computePosition({ getBoundingClientRect }, container, {
      placement: 'bottom-start',
      middleware: [
        floating.offset(8),
        floating.shift({ padding: 8 }),
        floating.flip(),
      ],
    })
      .then(({ x, y }) => {
        container.style.setProperty('top', `${y}px`);
        container.style.setProperty('left', `${x}px`);
      });
  }

  watchEffect(() => {
    const container = toValue(containerEl);
    const floating = floatingUi.value;
    const getBoundingClientRect = props.getBoundingClientRect;

    if (!container || !isVisible.value || !getBoundingClientRect || !floating) {
      return;
    }

    updatePosition();
  });

  useFocusTrap(containerEl);

  onBeforeMount(() => {
    loadFloatingUi().then((loaded) => {
      floatingUi.value = loaded;
    });
  });

  if (import.meta.client) {
    onBeforeUnmount(
      on(document, 'scroll', updatePosition, { passive: true, capture: true }),
    );
  }

  return { isVisible, selectedItem, updatePosition };
}
