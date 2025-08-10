<script setup lang="ts">
import { usePinToolbox } from '../../config';

const { setting, posibleValues } = useSetting(settings.autoFloatTask);
const pinToolbox = usePinToolbox();
</script>

<template>
  <div class="toolbox__settings__setting" @mousedown.capture="pinToolbox">
    <label for="auto-float-task">Auto float checked tasks:</label>

    <select
      id="auto-float-task"
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
