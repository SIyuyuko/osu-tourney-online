// src/stores/commandStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Command } from '@/types/config';
import type { MapInfo } from '@/types/mappool';

export const useCommandStore = defineStore('command', () => {
  // 基础状态
  const prefix = ref('');
  const redTeam = ref('');
  const blueTeam = ref('');
  const teamMode = ref<string | undefined>();
  const scoreMode = ref<string | undefined>();
  const bo = ref<number>();
  const ts = ref(1);
  const timer = ref<string | number>('');
  const startTime = ref<string | number>('');

  // 比分相关
  const redTeamScore = ref(0);
  const blueTeamScore = ref(0);
  const banTeam = ref('');
  const pickTeam = ref('');
  const narratorSetting = ref<string[]>([]);

  // 命令相关
  const commandList = ref<Command[]>([]);
  const defaultCommand = ref<Command[]>([]);

  // 图池相关
  const mappool = ref<string[]>([]);

  // 计算属性
  const maxWinRound = computed(() => {
    if (typeof bo.value !== 'number' || bo.value <= 0) return 100;
    return Math.ceil(bo.value / 2);
  });

  const winner = computed(() => {
    if (typeof bo.value !== 'number' || bo.value <= 0) return '';
    if (redTeamScore.value >= maxWinRound.value) return redTeam.value;
    if (blueTeamScore.value >= maxWinRound.value) return blueTeam.value;
    return '';
  });

  // 方法
  function initCommands() {
    defaultCommand.value = window.command.list;
    commandList.value = defaultCommand.value.map((e) => ({
      ...e,
      value: e.cmd,
    }));
  }

  const updateScores = (redScore: number, blueScore: number) => {
    if (maxWinRound.value) {
      redTeamScore.value = Math.min(redScore, maxWinRound.value);
      blueTeamScore.value = Math.min(blueScore, maxWinRound.value);
    }
  };

  const updateTeamCommands = () => {
    if (redTeam.value && blueTeam.value) {
      updateCommand('ban');
      updateCommand('pick');
    } else {
      banTeam.value = '';
      pickTeam.value = '';
      updateCommand('ban');
      updateCommand('pick');
    }
  };

  const updateCommand = (type: string) => {
    const index = commandList.value.findIndex((cmd) => cmd.type === type);
    if (index === -1) return;

    switch (type) {
      case 'create':
        if (prefix.value && redTeam.value && blueTeam.value) {
          commandList.value[index].value = `${defaultCommand.value[index].cmd} ${prefix.value}:(${redTeam.value})vs(${blueTeam.value})`;
        } else {
          commandList.value[index].value = defaultCommand.value[index]?.cmd ?? commandList.value[index].cmd;
        }
        break;

      case 'room':
        if (teamMode.value && scoreMode.value) {
          commandList.value[index].value = `${defaultCommand.value[index].cmd} ${teamMode.value} ${scoreMode.value}`;
        } else {
          commandList.value[index].value = defaultCommand.value[index]?.cmd ?? commandList.value[index].cmd;
        }
        break;

      case 'timer':
        commandList.value[index].value = `${defaultCommand.value[index].cmd} ${timer.value}`;
        break;

      case 'start':
        if (startTime.value !== undefined && startTime.value !== '') {
          commandList.value[index].value = `${defaultCommand.value[index].cmd} ${startTime.value}`;
        } else {
          commandList.value[index].value = defaultCommand.value[index]?.cmd ?? commandList.value[index].cmd;
        }
        break;

      case 'ban':
        if (redTeam.value && blueTeam.value && banTeam.value) {
          commandList.value[index].value = `${defaultCommand.value[index].cmd} ${banTeam.value}`;
        } else {
          commandList.value[index].value = defaultCommand.value[index]?.cmd ?? commandList.value[index].cmd;
        }
        break;

      case 'pick':
        if (redTeam.value && blueTeam.value && pickTeam.value) {
          commandList.value[index].value = `${defaultCommand.value[index].cmd} ${pickTeam.value}`;
        } else {
          commandList.value[index].value = defaultCommand.value[index]?.cmd ?? commandList.value[index].cmd;
        }
        break;

      case 'size':
        commandList.value[index].value = `${defaultCommand.value[index].cmd} ${ts.value}`;
        break;

      default:
        commandList.value[index].value = defaultCommand.value[index]?.cmd ?? commandList.value[index].cmd;
        break;
    }
  };

  function updateMappool(value: { title: string; map: MapInfo[] }) {
    if (value) {
      mappool.value = value.map.filter((item) => item.checkStatus === false || !item.checkStatus).map((item) => item.mod + item.index);
    }
  }

  return {
    // 状态
    prefix,
    redTeam,
    blueTeam,
    teamMode,
    scoreMode,
    bo,
    ts,
    timer,
    startTime,
    redTeamScore,
    blueTeamScore,
    banTeam,
    pickTeam,
    narratorSetting,
    commandList,
    mappool,
    // 计算属性
    maxWinRound,
    winner,
    // 方法
    initCommands,
    updateScores,
    updateTeamCommands,
    updateCommand,
    updateMappool,
  };
});
