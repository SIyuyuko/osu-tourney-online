<template>
  <div class="score-panel">
    <!-- Score Header -->
    <div class="vs-header" v-if="redTeam && blueTeam">
      <div>
        <span :title="redTeam">
          <font-awesome-icon
            :icon="winner === redTeam ? 'fa-solid fa-crown' : 'fa-solid fa-users-line'"
            :style="{ color: winner === redTeam ? 'var(--team-winner)' : 'var(--team-red)' }"
          />
          {{ redTeam }}
        </span>
        <a-input-number v-model:value="redTeamScore" :min="0" :max="maxWinRound || 100" :bordered="false" />
      </div>

      <div class="vs">
        <span>VS</span>
        <span>:</span>
      </div>

      <div>
        <span :title="blueTeam">
          <font-awesome-icon
            :icon="winner === blueTeam ? 'fa-solid fa-crown' : 'fa-solid fa-users-line'"
            :style="{ color: winner === blueTeam ? 'var(--team-winner)' : 'var(--team-blue)' }"
          />
          {{ blueTeam }}
        </span>
        <a-input-number v-model:value="blueTeamScore" :min="0" :max="maxWinRound || 100" :bordered="false" />
      </div>
    </div>

    <!-- Team Selection -->
    <div class="pick-bar" v-if="redTeam && blueTeam">
      <div>
        <span>{{ $t('command.banTeam') }}</span>
        <a-radio-group v-model:value="banTeam">
          <a-radio :value="redTeam">{{ redTeam }}</a-radio>
          <a-radio :value="blueTeam">{{ blueTeam }}</a-radio>
        </a-radio-group>
      </div>

      <div>
        <span>{{ $t('command.pickTeam') }}</span>
        <a-radio-group v-model:value="pickTeam">
          <a-radio :value="redTeam">{{ redTeam }}</a-radio>
          <a-radio :value="blueTeam">{{ blueTeam }}</a-radio>
        </a-radio-group>
      </div>
    </div>

    <!-- Bracket Info -->
    <div class="narrator-bar">
      <span>{{ $t('command.bracketTitle') }}</span>
      <a-typography-text v-if="bracketWords.length > 0" copyable style="white-space: pre-line; display: flex; align-items: center" code>
        {{ bracketWords }}
        <template #copyableIcon="{ copied }">
          <span v-if="!copied" key="copy-icon">
            <font-awesome-icon icon="fa-regular fa-copy" />
          </span>
          <span v-else key="copied-icon">
            <font-awesome-icon icon="fa-solid fa-check" />
          </span>
        </template>
        <template #copyableTooltip="{ copied }">
          <span v-if="!copied" key="copy-tooltip">{{ $t('command.copy') }}</span>
          <span v-else key="copied-tooltip">{{ $t('command.copied') }}</span>
        </template>
      </a-typography-text>
    </div>

    <!-- Narrator Settings -->
    <div class="narrator-bar">
      <span>{{ $t('command.narratorTitle') }}</span>
      <a-checkbox-group v-model="narratorSetting" :options="narratorOptions" />
    </div>

    <a-typography-text v-if="narratorSetting.length > 0" copyable style="white-space: pre-line; display: flex; align-items: center" code>
      {{ narrator }}
      <template #copyableIcon="{ copied }">
        <span v-if="!copied" key="copy-icon">
          <font-awesome-icon icon="fa-regular fa-copy" />
        </span>
        <span v-else key="copied-icon">
          <font-awesome-icon icon="fa-solid fa-check" />
        </span>
      </template>
      <template #copyableTooltip="{ copied }">
        <span v-if="!copied" key="copy-tooltip">{{ $t('command.copy') }}</span>
        <span v-else key="copied-tooltip">{{ $t('command.copied') }}</span>
      </template>
    </a-typography-text>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, PropType } from 'vue';
import type { Command } from '@/types/config';
import i18n from '@/i18n';

const redTeamScore = defineModel('redTeamScore', {
  type: Number,
  default: 0,
});
const blueTeamScore = defineModel('blueTeamScore', {
  type: Number,
  default: 0,
});
const banTeam = defineModel('banTeam', {
  type: String,
  default: '',
});
const pickTeam = defineModel('pickTeam', {
  type: String,
  default: '',
});
const narratorSetting = defineModel('narratorSetting', {
  type: Array as PropType<string[]>,
  default: () => [],
});

// 内部计算属性
const maxWinRound = computed((): number => {
  if (typeof props.bo !== 'number' || props.bo <= 0) return 100;
  return Math.ceil(props.bo / 2);
});

const winner = computed(() => {
  if (typeof props.bo !== 'number' || props.bo <= 0) return ''; // 如果没有设置 BO，不显示胜利者
  if (redTeamScore.value >= maxWinRound.value) return props.redTeam;
  if (blueTeamScore.value >= maxWinRound.value) return props.blueTeam;
  return '';
});

const bracketWords = computed(() => {
  const redTeamWord = i18n.global.t('command.redTeam');
  const blueTeamWord = i18n.global.t('command.blueTeam');
  const slotWord = i18n.global.t('command.slot');

  return `${props.redTeam ? props.redTeam + ':' + redTeamWord : redTeamWord} & ${slotWord} ${props.ts > 1 ? `1-${props.ts}` : 1} // ${props.blueTeam ? props.blueTeam + ':' + blueTeamWord : blueTeamWord} & ${slotWord} ${props.ts > 1 ? `${props.ts + 1}-${props.ts * 2}` : 2}`;
});

// narrator 文字计算
const narrator = computed(() => {
  if (narratorSetting.value.length === 0) return '';

  const scoreWords = narratorSetting.value.includes('score') ? `${props.redTeam} | ${redTeamScore.value} - ${blueTeamScore.value} | ${props.blueTeam}` : '';

  const pickIndex = props.commandCopy.findIndex((value) => value.type === 'pick');
  const pickWords = narratorSetting.value.includes('pick') ? props.commandCopy[pickIndex].value : '';

  const poolWords = narratorSetting.value.includes('mappool') ? `Maps Remaining:${props.mappool}` : '';

  const winPrefix = i18n.global.t('command.winPrefix');
  const winSuffix = i18n.global.t('command.winSuffix');
  const winnerWords = narratorSetting.value.includes('winner') ? `${winPrefix}${winner.value}${winSuffix}` : '';

  return `${scoreWords}${narratorSetting.value.length > 1 && narratorSetting.value.includes('score') ? ' // ' : ''}${pickWords}${narratorSetting.value.length >= 2 && narratorSetting.value.includes('pick') ? ' // ' : ''}${poolWords}${narratorSetting.value.length >= 2 && narratorSetting.value.includes('mappool') && narratorSetting.value.includes('winner') ? ' // ' : ''}${winnerWords}`;
});

// 报幕列表
const narratorOptions = computed(() => [
  { label: i18n.global.t('command.score'), value: 'score' },
  { label: i18n.global.t('command.pick'), value: 'pick' },
  { label: i18n.global.t('command.mapRemain'), value: 'mappool' },
  { label: i18n.global.t('command.winner'), value: 'winner' },
]);

const props = defineProps({
  redTeam: { type: String, required: true },
  blueTeam: { type: String, required: true },
  bo: { type: Number, default: 0 },
  ts: { type: Number, default: 1 },
  commandCopy: {
    type: Array as PropType<Command[]>,
    required: true,
  }, // 用于生成 pickWords
  defaultCommand: {
    type: Array as PropType<Command[]>,
    required: true,
  },
  mappool: { type: Array, default: () => [] },
});

// 监听分数变化，超过最大值时自动调整
watch([redTeamScore, blueTeamScore], ([red, blue]) => {
  if (maxWinRound.value) {
    if (red > maxWinRound.value) {
      redTeamScore.value = maxWinRound.value;
    }
    if (blue > maxWinRound.value) {
      blueTeamScore.value = maxWinRound.value;
    }
  }
});

watch(
  [banTeam, pickTeam],
  () => {
    const banIndex = props.commandCopy.findIndex((value) => value.type === 'ban');
    const pickIndex = props.commandCopy.findIndex((value) => value.type === 'pick');

    if (props.redTeam && props.blueTeam) {
      if (banIndex !== -1) {
        props.commandCopy[banIndex].value = `${props.defaultCommand[banIndex].cmd} ${banTeam.value}`;
      }
      if (pickIndex !== -1) {
        props.commandCopy[pickIndex].value = `${props.defaultCommand[pickIndex].cmd} ${pickTeam.value}`;
      }
    } else {
      banTeam.value = '';
      pickTeam.value = '';
      if (banIndex !== -1) {
        props.commandCopy[banIndex].value = props.defaultCommand[banIndex]?.cmd ?? props.commandCopy[banIndex].cmd;
      }
      if (pickIndex !== -1) {
        props.commandCopy[pickIndex].value = props.defaultCommand[pickIndex]?.cmd ?? props.commandCopy[pickIndex].cmd;
      }
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.score-panel {
  display: flex;
  flex-direction: column;
  row-gap: 10px;

  .vs-header {
    display: inline-flex;
    justify-content: center;
    width: 100%;
    align-items: center;
    flex-wrap: nowrap;

    div {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      text-align: center;
      width: 100%;

      * {
        margin: auto;

        :deep(.ant-input-number-input) {
          text-align: center;
          font-size: 30px;
        }
      }

      &.vs {
        width: 10%;

        span:last-child {
          font-size: 18px;
        }
      }
    }
  }

  .pick-bar {
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

  .narrator-bar {
    display: flex;
    flex-wrap: nowrap;
    column-gap: 10px;
    text-wrap: nowrap;
  }
}
</style>
