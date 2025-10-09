<script setup lang="ts">
import {
  LazyWorkspaceNoteFormatterBubbleBox as LazyBubbleBox,
  LazyWorkspaceNoteFormatterFixedBox as LazyFixedBox,
} from '#components';

import '~/assets/styles/tiptap.css';
import '~/assets/styles/note-editor.scss';

const props = defineProps<{
  content: string
}>();

const EditorContent = defineAsyncComponent(() =>
  import('@tiptap/vue-3').then((mod) => mod.EditorContent),
);

const titleEl = useTemplateRef('titleEl');
const editorEl = useTemplateRef('editorEl');

const showingQuickFind = ref(false);

const { shortcuts } = useAppConfig();
const { isSmallScreen } = useDevice();

const { editor } = useTiptap({
  content: () => props.content,
  class: 'ProseMirror--renderer',
  editable: () => true,
  onUpdate: () => {},
});

const { intersecting: isTitleVisible } = useIntersectionObserver(titleEl, { once: true });
const { intersecting: isEditorVisible } = useIntersectionObserver(editorEl, { once: true });
const { intersecting: shouldShowFormatter } = useIntersectionObserver(editorEl, {
  rootMargin: '-40% 0px -10% 0px',
});

useTinykeys({
  [shortcuts.edit]: (event) => {
    const target = event.target as HTMLElement;

    if (target.tagName !== 'INPUT' && target !== editor.view.dom) {
      event.preventDefault();
      editor.commands.focus();
    }
  },

  Escape: () => {
    editor.commands.blur();
  },

  [shortcuts.quickFind]: (event) => {
    event.preventDefault();

    showingQuickFind.value = true;
  },
});

watchEffect((onCleanup) => {
  if (!editorEl.value) {
    return;
  }

  onCleanup(
    on(editorEl.value, 'mouseenter', defineFuzzyWorker),
  );
});
</script>

<template>
  <section id="note-editor" class="editor-demo">
    <p
      ref="titleEl"
      class="editor-demo__title"
      :class="isTitleVisible && 'animate-in'"
    >
      Editor demo
    </p>

    <div
      ref="editorEl"
      class="editor-demo__wrapper"
      :class="isEditorVisible && 'animate-in'"
    >
      <EditorContent :editor />
    </div>

    <Component
      :is="isSmallScreen ? LazyFixedBox : LazyBubbleBox"
      v-if="editor && (!isSmallScreen || shouldShowFormatter)"
      :editor
    >
      <WorkspaceNoteFormatter :editor />
    </Component>

    <Teleport to="#teleports">
      <WithModalTransition>
        <LazyWorkspaceNoteQuickFind
          v-if="editor && showingQuickFind"
          :editor
          @close="showingQuickFind = false"
        />
      </WithModalTransition>
    </Teleport>
  </section>
</template>

<style lang="scss">
.editor-demo {
  width: 95vw;
  max-width: 900px;

  margin: 0 auto;
  padding: 1rem 1rem 4rem;

  &__title {
    font-size: calc(min(calc(1.5rem + 2.75vw), 3.5rem) / 1.33);
    text-align: center;

    opacity: 0;
  }

  &__wrapper {
    min-height: 400px;

    padding: 2rem 1.5rem;

    opacity: 0;
    border: 1px solid hsla(var(--selection-bg-color-hsl), 0.25);
    border-radius: 0.5rem;
    background-color: hsla(var(--text-color-hsl), 0.025);
    box-shadow:
      inset -1px -1px 0.1rem rgba($color: #000000, $alpha: 0.025),
      1.3px 1.3px 5.3px rgba(0, 0, 0, 0.028),
      4.5px 4.5px 17.9px rgba(0, 0, 0, 0.042),
      20px 20px 80px rgba(0, 0, 0, 0.07);
  }
}
</style>
