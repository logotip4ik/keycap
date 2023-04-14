<script setup lang="ts">
import sanitizeHtml from 'sanitize-html';

interface Props { content: string }
const props = defineProps<Props>();

const sanitized = sanitizeHtml(props.content, {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    'label',
    'input',
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    label: ['contenteditable', 'class'],
    input: ['type', 'checked'],
    ul: ['data-type'],
    li: ['data-checked'],
    a: ['href', 'name', 'target', 'rel'],
  },
  transformTags: {
    // disabled state modifies accent color :(
    label: sanitizeHtml.simpleTransform('label', { class: 'readonly' }, true),
  },
});
</script>

<template>
  <div class="note-editor">
    <div class="ProseMirror ProseMirror--renderer" v-html="sanitized" />
  </div>
</template>

<style src="~/assets/styles/note-editor.scss" />
