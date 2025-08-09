<script setup lang="ts">
import { useToolboxState } from '../../config';

const { state } = useToolboxState();
const { setting, posibleValues } = useSetting(settings.formatterPosition);

function pinToolbox() {
  if (state.value === 'pinned') {
    return;
  }

  state.value = 'pinned';
}
</script>

<template>
  <div class="toolbox__settings__setting" @mousedown.capture="pinToolbox">
    <label for="formatter-position-select">Formatter position:</label>

    <select
      id="formatter-position-select"
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
