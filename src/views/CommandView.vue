<template>
  <div class="page px-3 mt-[-1px] h-full no-scroll">
    <div class="splitter flex h-full w-full overflow-hidden" ref="viewRef">
      <div class="left-panel flex-none overflow-auto" :style="{ flex: `0 0 ${leftWidth}px` }">
        <CommandList />
      </div>
      <div class="divider w-2 bg-gray-200 dark:bg-gray-700 cursor-col-resize" @mousedown="startDrag"></div>
      <div class="right-panel flex-1 overflow-hidden min-w-[500px]">
        <a-collapse class="referee-list h-full" v-model:activeKey="activeKey" :bordered="false" ghost>
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
            <PoolSelector class="pool-selector max-w-[100%]" :isReferee="true" />
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CommandList from '@/components/command/CommandList.vue';
import ScoreboardPanel from '@/components/command/ScoreboardPanel.vue';
import TournamentSetupPanel from '@/components/command/TournamentSetupPanel.vue';
import PoolSelector from '@/components/map/poolSelector.vue';

const viewRef = ref<HTMLElement | null>(null);
const activeKey = ref([1, 2]);
const leftWidth = ref(350); // 初始左侧宽度
const rightWidth = ref(520); // 初始右侧宽度

const startDrag = (e: MouseEvent) => {
  e.preventDefault();
  const initialX = e.clientX;
  const initialLeftWidth = leftWidth.value;
  const initialRightWidth = rightWidth.value;

  const onMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - initialX;
    const newLeftWidth = initialLeftWidth + deltaX;
    const newRightWidth = initialRightWidth - deltaX;

    // 限制左侧最小宽度和右侧最小宽度
    if (newLeftWidth >= 200 && newRightWidth >= 500) {
      leftWidth.value = newLeftWidth;
      rightWidth.value = newRightWidth;
    }
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};
</script>
