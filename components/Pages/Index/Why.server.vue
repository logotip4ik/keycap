<template>
  <section id="more" class="main__why">
    <p class="font-wide main__why__title">
      Why?
    </p>

    <p class="main__why__text">
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
    font-size: min(1rem + 1vw, 1.75rem);
  }

  &__text {
    font-size: min(0.85rem + 1vw, 1.25rem);
    opacity: 0.9;
  }
}
</style>
