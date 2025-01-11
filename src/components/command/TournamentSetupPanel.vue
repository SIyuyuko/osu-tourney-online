<template>
  <div class="config-panel">
    <!-- Prefix and Best of Settings -->
    <div class="prefix-bar">
      <a-input v-model:value="store.prefix" allow-clear :placeholder="$t('command.inputTour')" style="width: 70%" @change="handlePrefixChange">
        <template #prefix>
          <font-awesome-icon icon="fa-solid fa-chess" />
        </template>
      </a-input>

      <a-input-number v-model:value="store.bo" addon-before="Best of" :min="1" :step="2" style="width: 30%" />
    </div>

    <!-- Team Names -->
    <a-input v-model:value="store.redTeam" allow-clear :placeholder="$t('command.inputRedTeam')" @change="handleTeamChange">
      <template #prefix>
        <font-awesome-icon icon="fa-solid fa-users-line" style="color: var(--team-red)" />
      </template>
    </a-input>

    <a-input v-model:value="store.blueTeam" allow-clear :placeholder="$t('command.inputBlueTeam')" @change="handleTeamChange">
      <template #prefix>
        <font-awesome-icon icon="fa-solid fa-users-line" style="color: var(--team-blue)" />
      </template>
    </a-input>

    <!-- Mode Settings -->
    <div class="mode-bar">
      <a-select
        v-model:value="store.teamMode"
        :options="teamOptions"
        style="width: calc(50% - 5px)"
        allowClear
        :placeholder="$t('command.selectTeamMode')"
        @change="handleModeChange"
      >
        <template #suffixIcon>
          <font-awesome-icon icon="fa-solid fa-user-group" />
        </template>
      </a-select>

      <a-select
        v-model:value="store.scoreMode"
        :options="scoreOptions"
        style="width: calc(50% - 5px)"
        allowClear
        :placeholder="$t('command.selectScoreMode')"
        @change="handleModeChange"
      >
        <template #suffixIcon>
          <font-awesome-icon icon="fa-solid fa-ranking-star" />
        </template>
      </a-select>

      <a-input-number v-model:value="store.ts" :addon-before="$t('command.teamsize')" :min="1" style="width: calc(50% - 5px)" @change="handleTeamSizeChange" />
    </div>

    <!-- Time Settings -->
    <div class="time-bar">
      <TimeSetting :label="$t('command.timerTime')" v-model="store.timer" :options="[60, 90, 120]" @change="handleTimerChange" />

      <TimeSetting :label="$t('command.startTime')" v-model="store.startTime" :options="[10, 15, 30]" @change="handleStartTimeChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommandStore } from '@/stores/commandStore';
import { debounce } from 'lodash';
import TimeSetting from './TimeSetting.vue';

const store = useCommandStore();

// 内部维护的选项列表
const teamOptions = [
  { label: 'Head To Head', value: '0' },
  { label: 'Tag Coop', value: '1' },
  { label: 'Team Vs', value: '2' },
  { label: 'Tag Team Vs', value: '3' },
];

const scoreOptions = [
  { label: 'Score', value: '0' },
  { label: 'Accuracy', value: '1' },
  { label: 'Combo', value: '2' },
  { label: 'Score V2', value: '3' },
];

// Debounced handlers
const handlePrefixChange = debounce(() => {
  store.updateCommand('create');
}, 300);

const handleTeamChange = debounce(() => {
  store.updateCommand('create');
}, 300);

const handleModeChange = debounce(() => {
  store.updateCommand('room');
}, 300);

const handleTeamSizeChange = debounce(() => {
  store.updateCommand('size');
}, 300);

const handleTimerChange = debounce(() => {
  store.updateCommand('timer');
}, 300);

const handleStartTimeChange = debounce(() => {
  store.updateCommand('start');
}, 300);
</script>

<style lang="scss" scoped>
.config-panel {
  display: flex;
  flex-direction: column;
  row-gap: 10px;

  .prefix-bar,
  .mode-bar {
    display: flex;
    flex-wrap: nowrap;
    column-gap: 10px;
    align-items: center;
  }

  .time-bar {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    div {
      display: flex;
      flex-wrap: nowrap;
      column-gap: 10px;
      align-items: center;
      text-wrap: nowrap;
    }
  }
}
</style>
