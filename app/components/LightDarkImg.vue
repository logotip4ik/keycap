<script setup lang="ts">
import type { ImgHTMLAttributes } from 'vue';

interface Props extends /* @vue-ignore */ Omit<ImgHTMLAttributes, 'src'> {
  lightSrc: string
  darkSrc: string
}

defineProps<Props>();

const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

onPrehydrate((el) => {
  const img = el as HTMLImageElement;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  img.src = mediaQuery.matches ? img.getAttribute('dark-src')! : img.getAttribute('light-src')!;
});
</script>

<template>
  <img
    :light-src
    :dark-src
    :src="prefersDarkMode ? darkSrc : lightSrc"
  >
</template>
