<template>
  <div class="page px-3 mt-[-1px] h-full">
    <DragPanel :leftWidth="350" :rightMinWidth="500" :leftMinWidth="200" class="h-full w-full">
      <template #left>
        <CommandList />
      </template>

      <template #right>
        <a-collapse class="referee-list h-full" v-model:activeKey="activeKey" :bordered="false" ghost>
          <a-collapse-panel v-for="panel in panels" :key="panel.key" :header="panel.header">
            <component :is="panel.component" v-bind="panel.props || {}" />
          </a-collapse-panel>
        </a-collapse>
      </template>
    </DragPanel>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import DragPanel from '@/components/ui/DragPanel.vue';
import CommandList from '@/components/command/CommandList.vue';

const { t } = useI18n();
const activeKey = ref([1, 2]);

const panels = [
  {
    key: '1',
    header: t('command.refereeTitle'),
    component: defineAsyncComponent(() => import('@/components/command/TournamentSetupPanel.vue')),
  },
  {
    key: '2',
    header: t('command.scoreBoard'),
    component: defineAsyncComponent(() => import('@/components/command/ScoreboardPanel.vue')),
  },
  {
    key: '3',
    header: t('command.mappool'),
    component: defineAsyncComponent(() => import('@/components/map/poolSelector.vue')),
    props: { class: 'max-w-[100%]', isReferee: true },
  },
];
</script>
