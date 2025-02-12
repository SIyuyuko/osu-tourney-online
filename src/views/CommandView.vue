<template>
  <div class="page px-3 mt-[-1px] h-full no-scroll">
    <DragPanel :leftWidth="350" :rightMinWidth="500" :leftMinWidth="200" class="h-full w-full">
      <template #left>
        <CommandList />
      </template>

      <template #right>
        <a-collapse class="referee-list h-full" v-model:activeKey="activeKey" :bordered="false" ghost>
          <a-collapse-panel key="1" :header="$t('command.refereeTitle')">
            <TournamentSetupPanel />
          </a-collapse-panel>
          <a-collapse-panel key="2" :header="$t('command.scoreBoard')">
            <ScoreboardPanel />
          </a-collapse-panel>
          <a-collapse-panel key="3" :header="$t('command.mappool')">
            <PoolSelector class="pool-selector max-w-[100%]" :isReferee="true" />
          </a-collapse-panel>
        </a-collapse>
      </template>
    </DragPanel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DragPanel from '@/components/ui/DragPanel.vue';
import CommandList from '@/components/command/CommandList.vue';
import ScoreboardPanel from '@/components/command/ScoreboardPanel.vue';
import TournamentSetupPanel from '@/components/command/TournamentSetupPanel.vue';
import PoolSelector from '@/components/map/poolSelector.vue';

const activeKey = ref([1, 2]);
</script>
