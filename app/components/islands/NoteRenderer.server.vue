<script setup lang="ts">
import sanitizeHTML from 'sanitize-html';

const props = defineProps<{
  sharedLink: string
}>();

const fetch = useRequestFetch();
const { data: note } = await fetch<{ data: SharedNote }>(`/api/share/${props.sharedLink}`, {
  responseType: 'json',
  headers: protectionHeaders,
}).catch((e) => {
  sendError(e, { nuxt: true });

  throw createError('Failed fetching shared note.');
});

const sanitized = sanitizeHTML(note.content || '', {
  allowedTags: [
    ...sanitizeHTML.defaults.allowedTags,
    'label',
    'input',
  ],
  allowedAttributes: {
    ...sanitizeHTML.defaults.allowedAttributes,
    label: ['contenteditable', 'class'],
    input: ['type', 'checked', 'readonly'],
    ul: ['data-type'],
    li: ['data-checked'],
    a: ['href', 'name', 'target', 'rel'],
  },
  transformTags: {
    // disabled state modifies accent color :(
    label: sanitizeHTML.simpleTransform('label', { class: 'readonly' }, true),
  },
});
</script>

<template>
  <div v-if="sanitized.length > 0" class="note-editor">
    <div class="ProseMirror ProseMirror--renderer" v-html="sanitized" />
  </div>

  <div v-else class="note-editor">
    <p class="note-editor__empty">
      <span class="font-wide">Sadly note is empty :&lpar;</span>
      <br>
      <small>No keycaps was pressed yet</small>
    </p>
  </div>
</template>

<style src="~/assets/styles/note-editor.scss"></style>

<style lang="scss">
.note-editor__empty {
  display: block;

  font-size: calc(1.5rem + 1.5vw);
  text-align: center;

  margin-top: 7.5vh;

  small {
    font-weight: 300;
    color: hsla(var(--text-color-hsl), 0.75);
  }
}
</style>
