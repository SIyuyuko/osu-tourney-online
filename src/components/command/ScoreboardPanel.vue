<template>
  <div class="score-panel">
    <!-- Score Header -->
    <div class="vs-header" v-if="store.redTeam && store.blueTeam">
      <div>
        <span :title="store.redTeam">
          <font-awesome-icon :icon="winnerIcon(store.redTeam)" :style="{ color: iconColor(store.redTeam) }" />
          {{ store.redTeam }}
        </span>
        <a-input-number :value="store.redTeamScore" :min="0" :max="store.maxWinRound || 100" :bordered="false" @update:value="updateRedScore" />
      </div>

      <div class="vs">
        <span>VS</span>
        <span>:</span>
      </div>

      <div>
        <span :title="store.blueTeam">
          <font-awesome-icon :icon="winnerIcon(store.blueTeam)" :style="{ color: iconColor(store.blueTeam) }" />
          {{ store.blueTeam }}
        </span>
        <a-input-number :value="store.blueTeamScore" :min="0" :max="store.maxWinRound || 100" :bordered="false" @update:value="updateBlueScore" />
      </div>
    </div>

    <!-- Team Selection -->
    <div class="pick-bar" v-if="store.redTeam && store.blueTeam">
      <div>
        <span>{{ $t('command.banTeam') }}</span>
        <a-radio-group :value="store.banTeam" @update:value="updateBanTeam">
          <a-radio :value="store.redTeam">{{ store.redTeam }}</a-radio>
          <a-radio :value="store.blueTeam">{{ store.blueTeam }}</a-radio>
        </a-radio-group>
      </div>

      <div>
        <span>{{ $t('command.pickTeam') }}</span>
        <a-radio-group :value="store.pickTeam" @update:value="updatePickTeam">
          <a-radio :value="store.redTeam">{{ store.redTeam }}</a-radio>
          <a-radio :value="store.blueTeam">{{ store.blueTeam }}</a-radio>
        </a-radio-group>
      </div>
    </div>

    <!-- Bracket Info -->
    <div class="narrator-bar">
      <span>{{ $t('command.bracketTitle') }}</span>
      <a-typography-text v-if="bracketWords" copyable style="white-space: pre-line; display: flex; align-items: center" code>
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
      <a-checkbox-group v-model="store.narratorSetting" :options="narratorOptions" @update:value="updateNarratorSetting" />
    </div>

    <a-typography-text v-if="narratorText" copyable style="white-space: pre-line; display: flex; align-items: center" code>
      {{ narratorText }}
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommandStore } from '@/stores/commandStore';
import { debounce } from 'lodash';

const { t } = useI18n();
const store = useCommandStore();

const bracketWords = computed(() => {
  if (!store.redTeam || !store.blueTeam) return '';

  const redTeamWord = t('command.redTeam');
  const blueTeamWord = t('command.blueTeam');
  const slotWord = t('command.slot');

  return `${store.redTeam}:${redTeamWord} & ${slotWord} ${store.ts > 1 ? `1-${store.ts}` : 1} // ${store.blueTeam}:${blueTeamWord} & ${slotWord} ${store.ts > 1 ? `${store.ts + 1}-${store.ts * 2}` : 2}`;
});

// narrator 文字计算
const narratorText = computed(() => {
  if (!store.narratorSetting.length) return '';

  const parts = [];

  if (store.narratorSetting.includes('score')) {
    parts.push(`${store.redTeam} | ${store.redTeamScore} - ${store.blueTeamScore} | ${store.blueTeam}`);
  }

  if (store.narratorSetting.includes('pick')) {
    const pickCommand = store.commandList.find((cmd) => cmd.type === 'pick');
    if (pickCommand) parts.push(pickCommand.value);
  }

  if (store.narratorSetting.includes('mappool')) {
    parts.push(`Maps Remaining:${store.mappool.join(', ')}`);
  }

  if (store.narratorSetting.includes('winner') && store.winner) {
    parts.push(`${t('command.winPrefix')}${store.winner}${t('command.winSuffix')}`);
  }

  return parts.join(' // ');
});

// 报幕列表
const narratorOptions = computed(() => [
  { label: t('command.score'), value: 'score' },
  { label: t('command.pick'), value: 'pick' },
  { label: t('command.mapRemain'), value: 'mappool' },
  { label: t('command.winner'), value: 'winner' },
]);

// Event Handlers with Debounce
const updateRedScore = debounce((value: number) => {
  store.updateScores(value, store.blueTeamScore);
}, 300);

const updateBlueScore = debounce((value: number) => {
  store.updateScores(store.redTeamScore, value);
}, 300);

const updateBanTeam = debounce((value: string) => {
  store.banTeam = value;
  store.updateTeamCommands();
  store.updateCommand('ban');
}, 300);

const updatePickTeam = debounce((value: string) => {
  store.pickTeam = value;
  store.updateTeamCommands();
  store.updateCommand('pick');
}, 300);

const updateNarratorSetting = (value: string[]) => {
  store.narratorSetting = value;
};

// Helper Functions
const winnerIcon = (team: string) => (store.winner === team ? 'fa-solid fa-crown' : 'fa-solid fa-users-line');

const iconColor = (team: string) => (store.winner === team ? 'var(--team-winner)' : team === store.redTeam ? 'var(--team-red)' : 'var(--team-blue)');
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
