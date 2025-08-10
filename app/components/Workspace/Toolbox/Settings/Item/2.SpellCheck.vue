<script setup lang="ts">
import { usePinToolbox } from '../../config';

const { setting, posibleValues } = useSetting(settings.spellcheck);
const pinToolbox = usePinToolbox();
</script>

<template>
  <div class="toolbox__settings__setting" @mousedown.capture="pinToolbox">
    <label for="spellcheck-enabled-select">
      Spellcheck enabled:
    </label>

    <select
      id="spellcheck-enabled-select"
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
