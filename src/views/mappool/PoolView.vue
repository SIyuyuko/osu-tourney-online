<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-14 16:24:14
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-07-24 15:11:19
 * @FilePath: /osu!tourney-site/tourney-site/src/views/mappool/PoolView.vue
 * @Description: 图池信息组件
-->
<template>
  <div v-for="(pool, index) in poolSections" :key="index">
    <span class="pool-title">{{ pool?.title }}</span>
    <div class="pool-content">
      <MapComponent v-for="(map, mapIndex) in pool?.map" :key="mapIndex" :item="map" :isCard="false" :isReferee="false" :beatmap-data="beatmapDataMap.get(map.id)" />
    </div>
    <a-divider dashed />
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch, computed, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { RequestQueue } from '@/utils/requestQueue';
import MapComponent from '@/components/map/Map.vue';
import { useBeatmapStore } from '@/stores/beatmapStore';
import type { Pool } from '@/types/mappool';
import type { BeatmapResponse } from '@/types/beatmap';

// 创建请求队列实例
const requestQueue = new RequestQueue(3);

// 定义组件属性
const props = defineProps<{
  title?: string;
}>();

const beatmapStore = useBeatmapStore();
const route = useRoute();
const emit = defineEmits(['pool-selected']);
const pool = ref<Pool | null>(null);
const beatmapDataMap: Ref<Map<number, BeatmapResponse>> = ref(new Map());
const currentController = ref<AbortController | null>(null);

const cancelPreviousRequest = () => {
  if (currentController.value) {
    currentController.value.abort();
    currentController.value = null;
  }
  requestQueue.clear();
};

const poolSections = computed(() => pool.value?.children || []);

const loadPoolData = async (title: string) => {
  // 取消之前的请求,创建新的控制器
  cancelPreviousRequest();
  currentController.value = new AbortController();

  if (!title || !(window as any).mappool?.list) return;

  try {
    pool.value = (window as any).mappool.list.find((p: Pool) => p.title === title) || null;
    if (!pool.value) return;

    emit('pool-selected', pool.value);

    const allMaps = pool.value.children.flatMap((section) => section.map);
    const ids = allMaps.map((map) => map.id);

    await requestQueue.push(ids, async (id) => {
      if (!currentController.value || currentController.value.signal.aborted) return;
      await beatmapStore.getBeatmapInfo(id, {
        signal: currentController.value.signal,
      });
    });
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Error loading pool:', error);
    }
  }
};

watch(
  () => route.params.title,
  async (title) => {
    if (typeof title === 'string') {
      await loadPoolData(title);
    }
  },
  { immediate: true }
);

watch(
  () => props.title,
  async (title) => {
    if (title) {
      await loadPoolData(title);
    }
  }
);

// 组件卸载时取消所有请求
onBeforeUnmount(() => {
  cancelPreviousRequest();
});
</script>

<style lang="scss" scoped>
.pool-title {
  font-size: 24px;
}

.pool-content {
  display: flex;
  width: 100%;
  position: relative;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 1rem;
  column-gap: 1rem;
}
</style>
