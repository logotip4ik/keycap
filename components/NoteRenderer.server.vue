<script setup lang="ts">
import sanitizeHTML from 'sanitize-html';

interface Props { content: string }
const props = defineProps<Props>();

const sanitized = sanitizeHTML(props.content, {
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
  <div class="note-editor">
    <div class="ProseMirror ProseMirror--renderer" v-html="sanitized" />
  </div>
</template>
