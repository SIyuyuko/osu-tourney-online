<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-14 16:24:14
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-07-24 15:11:19
 * @FilePath: /osu!tourney-site/tourney-site/src/views/mappool/poolView.vue
 * @Description: 图池信息组件
-->
<template>
  <div v-for="(pool, index) in poolData?.children" :key="index">
    <span class="pool-title">{{ pool?.title }}</span>
    <div class="pool-content">
      <Map v-for="(map, index) in pool?.map" :key="index" :item="map" :isCard="false"></Map>
    </div>
    <a-divider dashed />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Map from '@/components/map/map.vue';

const route = useRoute();
const poolData = ref();
const emit = defineEmits(['pool-selected']);

watch(
  () => route.params.title,
  (title) => {
    if (title) {
      poolData.value = (window as any).mappool?.list?.find((p: any) => p.title === title);
      if (poolData.value) {
        emit('pool-selected', poolData.value);
      }
    }
  },
  { immediate: true }
);
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
  row-gap: 10px;
  column-gap: 10px;
}
</style>
