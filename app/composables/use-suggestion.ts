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

  const floating = shallowRef<FloatingUI>();
  watchEffect(() => {
    const container = toValue(containerEl);

    if (!container || !isVisible.value || !props.getBoundingClientRect || !floating.value) {
      return;
    }

    floating.value.computePosition(
      { getBoundingClientRect: props.getBoundingClientRect },
      container,
      {
        placement: 'bottom-start',
        middleware: [
          floating.value.offset(8),
          floating.value.shift({ padding: 8 }),
          floating.value.flip(),
        ],
      },
    ).then(({ x, y }) => {
      container.style.setProperty('top', `${y}px`);
      container.style.setProperty('left', `${x}px`);
    });
  });

  useFocusTrap(containerEl);

  onBeforeMount(() => {
    loadFloatingUi().then((loaded) => {
      floating.value = loaded;
    });
  });

  return { isVisible, selectedItem };
}
