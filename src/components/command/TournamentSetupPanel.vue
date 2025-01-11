<template>
  <div class="config-panel">
    <!-- Prefix and Best of Settings -->
    <div class="prefix-bar">
      <a-input v-model:value="prefix" allow-clear :placeholder="$t('command.inputTour')" style="width: 70%">
        <template #prefix>
          <font-awesome-icon icon="fa-solid fa-chess" />
        </template>
      </a-input>

      <a-input-number v-model:value="bo" addon-before="Best of" :min="1" :step="2" style="width: 30%" />
    </div>

    <!-- Team Names -->
    <a-input v-model:value="redTeam" allow-clear :placeholder="$t('command.inputRedTeam')">
      <template #prefix>
        <font-awesome-icon icon="fa-solid fa-users-line" style="color: var(--team-red)" />
      </template>
    </a-input>

    <a-input v-model:value="blueTeam" allow-clear :placeholder="$t('command.inputBlueTeam')">
      <template #prefix>
        <font-awesome-icon icon="fa-solid fa-users-line" style="color: var(--team-blue)" />
      </template>
    </a-input>

    <!-- Mode Settings -->
    <div class="mode-bar">
      <a-select v-model:value="teamMode" :options="teamOptions" style="width: calc(50% - 5px)" allowClear :placeholder="$t('command.selectTeamMode')">
        <template #suffixIcon>
          <font-awesome-icon icon="fa-solid fa-user-group" />
        </template>
      </a-select>

      <a-select v-model:value="scoreMode" :options="scoreOptions" style="width: calc(50% - 5px)" allowClear :placeholder="$t('command.selectScoreMode')">
        <template #suffixIcon>
          <font-awesome-icon icon="fa-solid fa-ranking-star" />
        </template>
      </a-select>

      <a-input-number v-model:value="ts" :addon-before="$t('command.teamsize')" :min="1" style="width: calc(50% - 5px)" />
    </div>

    <!-- Time Settings -->
    <div class="time-bar">
      <div>
        <span>{{ $t('command.timerTime') }}</span>
        <a-radio-group v-model:value="timer">
          <a-radio :value="60">60{{ $t('command.sec') }}</a-radio>
          <a-radio :value="90">90{{ $t('command.sec') }}</a-radio>
          <a-radio :value="120">120{{ $t('command.sec') }}</a-radio>
          <a-input-number v-model:value="timer" :min="0" :addon-after="$t('command.sec')" />
        </a-radio-group>
      </div>

      <div>
        <span>{{ $t('command.startTime') }}</span>
        <a-radio-group v-model:value="startTime">
          <a-radio :value="10">10{{ $t('command.sec') }}</a-radio>
          <a-radio :value="15">15{{ $t('command.sec') }}</a-radio>
          <a-radio :value="30">30{{ $t('command.sec') }}</a-radio>
          <a-input-number v-model:value="startTime" :min="0" :addon-after="$t('command.sec')" />
        </a-radio-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import type { Command } from '@/types/config';

const prefix = defineModel('prefix', {
  type: String,
  default: '',
});
const bo = defineModel('bo', {
  type: Number,
  default: 0,
});
const redTeam = defineModel('redTeam', {
  type: String,
  default: '',
});
const blueTeam = defineModel('blueTeam', {
  type: String,
  default: '',
});
const teamMode = defineModel('teamMode', {
  type: [String, null],
  default: null,
});
const scoreMode = defineModel('scoreMode', {
  type: [String, null],
  default: null,
});
const ts = defineModel('ts', {
  type: Number,
  default: 1,
});
const timer = defineModel<string | number>('timer', {
  default: '',
});
const startTime = defineModel<string | number>('startTime', {
  default: '',
});

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

// 监听并更新命令
watch([prefix, redTeam, blueTeam], () => {
  const index = props.commandCopy.findIndex((value) => value.type === 'create');
  if (index === -1) return;

  if (prefix.value && redTeam.value && blueTeam.value) {
    props.commandCopy[index].value = `${props.defaultCommand[index].cmd} ${prefix.value}:(${redTeam.value})vs(${blueTeam.value})`;
  } else {
    props.commandCopy[index].value = props.defaultCommand[index]?.cmd ?? props.commandCopy[index].cmd;
  }
});

// 比赛模式监听
watch([scoreMode, teamMode], () => {
  const index = props.commandCopy.findIndex((value) => value.type === 'room');
  if (index === -1) return;

  if (teamMode.value && scoreMode.value) {
    props.commandCopy[index].value = `${props.defaultCommand[index].cmd} ${teamMode.value} ${scoreMode.value}`;
  } else {
    props.commandCopy[index].value = props.defaultCommand[index]?.cmd ?? props.commandCopy[index].cmd;
  }
});

// 时间监听
watch(timer, () => {
  const timerIndex = props.commandCopy.findIndex((value) => value.type === 'timer');
  if (timerIndex === -1) return;

  props.commandCopy[timerIndex].value = `${props.defaultCommand[timerIndex].cmd} ${timer.value}`;
});

watch(startTime, () => {
  const startIndex = props.commandCopy.findIndex((value) => value.type === 'start');
  if (startIndex === -1) return;

  props.commandCopy[startIndex].value = `${props.defaultCommand[startIndex].cmd} ${startTime.value}`;
});

// 获取命令列表
const props = defineProps<{
  commandCopy: Command[];
  defaultCommand: Command[];
}>();
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
