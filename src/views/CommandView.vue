<!--
 * @Author: SIyuyuko
 * @Date: 2024-08-02 17:55:00
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-09-18 15:40:49
 * @FilePath: /tourney-site/src/views/command/index.vue
 * @Description: 指令列表组件
-->
<template>
  <div class="page no-scroll">
    <div class="view" ref="viewRef">
      <CommandList v-if="commandStore.commandList.length" :showCommand="showCommand" @toggle-show="showCommand = !showCommand" />

      <a-divider :type="showCommand ? 'vertical' : 'horizontal'" :style="!showCommand ? { margin: '20px 0' } : {}" style="height: auto" />

      <a-collapse class="referee-list" v-model:activeKey="activeKey" :bordered="false" ghost>
        <template #expandIcon="{ isActive }">
          <caret-right-outlined :rotate="isActive ? 90 : 0" />
        </template>

        <!-- Tournament Setup Panel -->
        <a-collapse-panel key="1" :header="$t('command.refereeTitle')">
          <TournamentSetupPanel />
        </a-collapse-panel>

        <!-- Scoreboard Panel -->
        <a-collapse-panel key="2" :header="$t('command.scoreBoard')">
          <ScoreboardPanel />
        </a-collapse-panel>

        <!-- Mappool Panel -->
        <a-collapse-panel key="3" :header="$t('command.mappool')">
          <PoolSelector class="pool-selector" v-if="commandStore.mappool.length" :isReferee="true" @update="commandStore.updateMappool" />
          <a-empty v-else :description="$t('mappool.empty')" :image="Empty.PRESENTED_IMAGE_SIMPLE" style="width: 100%" />
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Empty } from 'ant-design-vue';
import { CaretRightOutlined } from '@ant-design/icons-vue';
import { ref, onMounted, shallowRef, onBeforeUnmount } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { debounce } from 'lodash';
import { useCommandStore } from '@/stores/commandStore';
import PoolSelector from '@/components/map/poolSelector.vue';
import CommandList from '@/components/command/CommandList.vue';
import ScoreboardPanel from '@/components/command/ScoreboardPanel.vue';
import TournamentSetupPanel from '@/components/command/TournamentSetupPanel.vue';

const commandStore = useCommandStore();

// Refs
const viewRef = ref<HTMLElement | null>(null);
const activeKey = shallowRef([1, 2]);
const showCommand = ref(true);

// Methods

// Resize Observer
const handleResize = debounce((entries: readonly ResizeObserverEntry[]) => {
  const entry = entries[0];
  if (entry.contentRect.width > 810) {
    showCommand.value = true;
  }
}, 200);

const observer = useResizeObserver(viewRef, handleResize);

// Lifecycle
onMounted(() => {
  commandStore.initCommands();
  showCommand.value = true;
});

onBeforeUnmount(() => {
  if (observer) {
    observer.stop();
  }
});
</script>

<style lang="scss" scoped>
.page {
  padding: 0 10px;
  margin: -1px 0 0 0;
  height: 100%;

  .view {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
  }

  .command-list,
  .referee-list {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .command-list {
    width: 35%;
  }

  .referee-list {
    width: 65%;
  }
}

.pool-selector {
  max-width: 100%;
}

@media (max-width: 980px) {
  .page {
    .view {
      flex-wrap: wrap;
      display: block;
      .command-list,
      .referee-list {
        width: 100%;
      }
      .referee-list > div > * {
        padding: 0;
      }
    }
  }
}
</style>
