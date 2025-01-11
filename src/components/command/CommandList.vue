<template>
  <div class="command-list" :class="{ 'grid-mode': isGridMode }">
    <div class="nav">
      <span>{{ $t('command.list') }}</span>
      <a :href="wikiUrl" target="_blank" :title="$t('command.seeWiki')">wiki</a>
      <a-button class="expand-btn" type="link" @click="$emit('toggle-show')">
        <font-awesome-icon :icon="showCommand ? 'fa-solid fa-compress' : 'fa-solid fa-expand'" />
      </a-button>
    </div>

    <div class="commands-container">
      <div class="command-item" v-for="(item, index) in commandStore.commandList" :key="index">
        <span>{{ index + 1 }}.</span>
        <span>{{ item.name }}</span>
        <a-typography-paragraph v-model:content="item.value" :editable="{ tooltip: false }" :copyable="{ tooltip: false }" keyboard @change="handleCommandChange(index, $event)">
          <template #editableIcon>
            <a-button class="operate-btn" type="default" size="small">
              {{ $t('command.edit') }}
              <template #icon>
                <span><font-awesome-icon icon="fa-solid fa-pencil" /></span>
              </template>
            </a-button>
          </template>
          <template #copyableIcon="{ copied }">
            <a-button class="operate-btn" type="primary" size="small">
              {{ copied ? $t('command.copied') : $t('command.copy') }}
              <template #icon>
                <span>
                  <font-awesome-icon :icon="copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'" />
                </span>
              </template>
            </a-button>
          </template>
        </a-typography-paragraph>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommandStore } from '@/stores/commandStore';
import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize();
const isGridMode = computed(() => width.value <= 980);

const { locale } = useI18n();
const commandStore = useCommandStore();

defineProps({
  showCommand: { type: Boolean, required: true },
});

defineEmits(['toggle-show']);

const wikiUrl = computed(() => {
  return `https://osu.ppy.sh/wiki/${locale.value}/osu%21_tournament_client/osu%21tourney/Tournament_management_commands`;
}); // 比赛指令wiki链接

const handleCommandChange = (index: number, newValue: string) => {
  if (commandStore.commandList[index]) {
    commandStore.commandList[index].value = newValue;
  }
};
</script>

<style lang="scss" scoped>
.command-list {
  .nav {
    margin: 0 0 10px 0;
    position: sticky;
    top: 0;
    z-index: 2;
    align-items: center;
    display: flex;
    background-color: #ffffff;

    [data-theme='dark'] & {
      background-color: #141414;
    }

    span + a {
      margin: 0 0 0 10px;
    }

    .expand-btn {
      visibility: hidden;
      transition: ease all 0.3s;
    }
  }

  .command {
    :deep(.ant-typography) {
      word-break: break-all;
      align-items: center;
      display: flex;
    }

    :deep(.ant-typography-edit-content) {
      inset-inline-start: 2px;
      margin: 0;
    }

    .operate-btn {
      font-size: 14px;
      display: flex;
      align-items: center;

      :deep(span + span) {
        margin-inline-start: 4px;
      }
    }

    &.hidden {
      display: none;
    }
  }
}

// 网格布局模式
.command-list.grid-mode {
  .commands-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
    padding: 1rem;

    .command-item {
      background: var(--background-secondary);
      border-radius: 8px;
      margin-bottom: 0;

      :deep(.ant-typography) {
        flex-direction: column;
        align-items: flex-start;

        .operate-btn {
          width: 100%;
          justify-content: center;
        }
      }
    }
  }
}

@media (max-width: 640px) {
  .command-list.grid-mode {
    .commands-container {
      grid-template-columns: 1fr;
    }
  }
}
</style>
