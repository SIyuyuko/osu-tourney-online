<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-14 16:15:55
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-08-08 17:30:12
 * @FilePath: /osu!tourney-site/tourney-site/src/views/mappool/poolList.vue
 * @Description: 图池列表组件
-->
<template>
  <div class="list-page">
    <a-list v-if="pools.length" :grid="{ gutter: 16, column: 4 }" :data-source="listData">
      <template #renderItem="{ item }">
        <a-list-item>
          <PoolCard :item="item" @create="handleCreate" />
        </a-list-item>
      </template>
    </a-list>

    <a-empty v-else :description="$t('mappool.emptyText')" :image="Empty.PRESENTED_IMAGE_SIMPLE" style="width: 100%" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Empty } from 'ant-design-vue';
import PoolCard from '@/components/map/PoolCard.vue';
import type { Pool } from '@/types/mappool';

const pools = ref<Pool[]>((window as any).mappool.list || []);

const listData = computed(() => {
  return [...pools.value, { title: '新建图池' }];
});

const handleCreate = async () => {
  // 创建新图池
  const newPool = {
    id: Date.now(), // 临时ID生成方式
    title: '空白图池',
    children: []
  };

  pools.value.push(newPool);

  // 如果有API调用:
  // try {
  //   const response = await createPool(newPool);
  //   pools.value.push(response.data);
  // } catch (error) {
  //   message.error('创建失败');
  // }
};
</script>

<style lang="scss" scoped>
.list-page {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .list-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }

  :deep(.ant-list-item) {
    padding: 0;
  }

  &:has(.ant-empty-normal) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
}
</style>
