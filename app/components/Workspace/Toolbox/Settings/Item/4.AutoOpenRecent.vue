<script setup lang="ts">
import { usePinToolbox } from '../../config';

const { setting, posibleValues } = useSetting(settings.autoOpenRecent);
const pinToolbox = usePinToolbox();
</script>

<template>
  <div class="toolbox__settings__setting" @mousedown.capture="pinToolbox">
    <label for="auto-open-recent">Auto open most recent note:</label>

    <select
      id="auto-open-recent"
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
