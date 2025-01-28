<template>
  <div class="config-panel">
    <!-- Prefix and Best of Settings -->
    <div class="prefix-bar">
      <a-input v-model:value="store.prefix" allow-clear :placeholder="$t('command.inputTour')" style="width: 70%">
        <template #prefix>
          <font-awesome-icon :icon="faChessSolid" />
        </template>
      </a-input>

      <a-input-number v-model:value="store.bo" addon-before="Best of" :min="1" :step="2" style="width: 30%" />
    </div>

    <!-- Team Names -->
    <a-input v-model:value="store.redTeam" allow-clear :placeholder="$t('command.inputRedTeam')">
      <template #prefix>
        <font-awesome-icon :icon="faUsersLineSolid" style="color: var(--team-red)" />
      </template>
    </a-input>

    <a-input v-model:value="store.blueTeam" allow-clear :placeholder="$t('command.inputBlueTeam')">
      <template #prefix>
        <font-awesome-icon :icon="faUsersLineSolid" style="color: var(--team-blue)" />
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
      >
        <template #suffixIcon>
          <font-awesome-icon :icon="faUserGroupSolid" />
        </template>
      </a-select>

      <a-select
        v-model:value="store.scoreMode"
        :options="scoreOptions"
        style="width: calc(50% - 5px)"
        allowClear
        :placeholder="$t('command.selectScoreMode')"
      >
        <template #suffixIcon>
          <font-awesome-icon :icon="faRankingStarSolid" />
        </template>
      </a-select>

      <a-input-number v-model:value="store.ts" :addon-before="$t('command.teamsize')" :min="1" style="width: calc(50% - 5px)" />
    </div>

    <!-- Time Settings -->
    <div class="time-bar">
      <TimeSetting :label="$t('command.timerTime')" v-model="store.timer" :options="[60, 90, 120]" />

      <TimeSetting :label="$t('command.startTime')" v-model="store.startTime" :options="[10, 15, 30]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { faChess as faChessSolid, faUsersLine as faUsersLineSolid, faUserGroup as faUserGroupSolid, faRankingStar as faRankingStarSolid } from '@fortawesome/free-solid-svg-icons';
import { useCommandStore } from '@/stores/commandStore';
import { watch } from 'vue';
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

// 监听 prefix、redTeam、blueTeam 的变化
watch([() => store.prefix, () => store.redTeam, () => store.blueTeam], () => {
  store.updateCommand('create');
});

// 监听 teamMode、scoreMode 的变化
watch([() => store.teamMode, () => store.scoreMode], () => {
  store.updateCommand('room');
});

// 监听 timer 的变化
watch(() => store.timer, () => {
  store.updateCommand('timer');
});

// 监听 startTime 的变化
watch(() => store.startTime, () => {
  store.updateCommand('start');
});

// 监听 ts 的变化
watch(() => store.ts, () => {
  store.updateCommand('size');
});
</script>

<style lang="scss" scoped>
.config-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .prefix-bar,
  .mode-bar {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .time-bar {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
