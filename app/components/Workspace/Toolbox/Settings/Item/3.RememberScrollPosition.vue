<script setup lang="ts">
import { usePinToolbox } from '../../config';

const { setting, posibleValues } = useSetting(settings.scrollPosition);
const pinToolbox = usePinToolbox();
</script>

<template>
  <div class="toolbox__settings__setting" @mousedown.capture="pinToolbox">
    <label for="remember-scroll-position-select">
      Remember scroll position:
    </label>

    <select
      id="remember-scroll-position-select"
      v-model="setting"
      class="toolbox__settings__setting__select"
      @click="pinToolbox"
    >
      <option v-for="value in posibleValues" :key="value" :value="value">
        {{ value }}
      </option>
    </select>
  </div>
</template>
