<script setup lang="ts">
const titleEl = useTemplateRef('titleEl');
const textEl = useTemplateRef('textEl');

const { intersecting: isTitleVisible } = useIntersectionObserver(titleEl, { once: true });
const { intersecting: isTextVisible } = useIntersectionObserver(textEl, { once: true });
</script>

<template>
  <section id="more" class="main__why">
    <p
      ref="titleEl"
      class="font-wide main__why__title"
      :class="isTitleVisible && 'animate-in'"
    >
      Why?
    </p>

    <p
      ref="textEl"
      class="main__why__text"
      :class="isTextVisible && 'animate-in'"
    >
      I made Keycap to replace bloated Notion (sorry, not sorry). It's a beautifully designed
      note-taking app, crafted with care in every detail, simple, and doesn't rely on AI (at
      least for now) to keep things straightforward. Capturing your thoughts couldn't be
      easier, and you can share your notes with just a click. Perfect for anyone who loves both
      style and speed in their daily workflow!
    </p>
  </section>
</template>

<style lang="scss">
.main__why {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  text-align: center;

  width: 95vw;
  max-width: 1200px;

  margin: 0 auto;
  padding: 1rem 1rem 4rem;

  &__title {
    font-size: calc(min(calc(1.5rem + 2.75vw), 3.5rem) / 1.33);

    opacity: 0;
  }

  &__text {
    font-size: calc(min(calc(1.5rem + 2.75vw), 3.5rem) / 1.75);
    color: hsla(var(--text-color-hsl), 0.9);
    text-wrap: balance;

    opacity: 0;
  }
}
</style>
