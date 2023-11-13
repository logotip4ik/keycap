<script setup lang="ts">
const { build } = useRuntimeConfig().public;

const lastTimeBuild = Intl.DateTimeFormat('en-UK', { dateStyle: 'medium' }).format(build.time);
const shortCommitSha = build.commit;
</script>

<template>
  <p class="index__build-info">
    Last build at {{ lastTimeBuild }}
    <br>
    Commit sha:
    <NuxtLink
      class="index__build-info__commit-link"
      target="_blank"
      :href="`https://github.com/logotip4ik/keycap/tree/${shortCommitSha}`"
    >
      {{ shortCommitSha }}
    </NuxtLink>
  </p>
</template>
