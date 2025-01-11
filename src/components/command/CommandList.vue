<template>
  <div class="command-list">
    <div class="nav">
      <span>{{ $t('command.list') }}</span>
      <a :href="wikiUrl" target="_blank" :title="$t('command.seeWiki')">wiki</a>
      <a-button class="expand-btn" type="link" @click="$emit('toggle-show')">
        <font-awesome-icon :icon="showCommand ? 'fa-solid fa-compress' : 'fa-solid fa-expand'" />
      </a-button>
    </div>

    <p v-for="(item, index) in commandList" :key="index" class="command" :class="showCommand ? '' : 'hidden'">
      <span>{{ index + 1 }}.</span>
      <span>{{ item.name }}</span>
      <a-typography-paragraph v-model:content="commandCopy[index].value" :editable="{ tooltip: false }" :copyable="{ tooltip: false }" keyboard>
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
            {{ $t('command.copy') }}
            <template #icon>
              <span v-if="!copied" key="copy-icon">
                <font-awesome-icon icon="fa-regular fa-copy" />
              </span>
              <span v-else key="copied-icon">
                <font-awesome-icon icon="fa-solid fa-check" />
              </span>
            </template>
          </a-button>
        </template>
      </a-typography-paragraph>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Command } from '@/types/config';

const { locale } = useI18n();

const wikiUrl = computed(() => {
  return `https://osu.ppy.sh/wiki/${locale.value}/osu%21_tournament_client/osu%21tourney/Tournament_management_commands`;
}); // 比赛指令wiki链接

const commandList = computed(() => window.command.list);

defineProps({
  showCommand: { type: Boolean },
  commandCopy: {
    type: Array as PropType<Command[]>,
    required: true,
  },
});

defineEmits(['toggle-show']);
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

@media (max-width: 900px) {
  .command-list {
    position: relative;

    .nav {
      position: fixed;
      top: auto;
      width: 90%;

      .expand-btn {
        visibility: visible;
      }
    }

    .nav + .command {
      margin: 30px 0 0 0;
    }
  }
}

@media (max-width: 900px) {
  .command-list {
    width: 100%;
    position: relative;
    .nav {
      position: fixed;
      top: auto;
      width: 90%;
    }

    .expand-btn {
      visibility: visible;
      transition: ease all 0.3s;
    }
    .nav + .command {
      margin: 30px 0 0 0;
    }
    .command.hidden {
      display: none;
    }
  }
}
</style>
