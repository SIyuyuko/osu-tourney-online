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
    <div class="list-header">
      <a-button type="primary" @click="createPool" v-if="hasCreatePermission"> 创建新图池 </a-button>
    </div>

    <a-list v-if="pools.length" :grid="{ gutter: 16, column: 4 }" :data-source="pools">
      <template #renderItem="{ item }">
        <a-list-item>
          <PoolCard :item="item" @click="navigateToPool(item)" @delete="handleDeletePool" />
        </a-list-item>
      </template>
    </a-list>

    <a-empty v-else :description="$t('mappool.emptyText')" :image="Empty.PRESENTED_IMAGE_SIMPLE" style="width: 100%" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Empty, message } from 'ant-design-vue';
import PoolCard from '@/components/map/poolCard.vue';
const data = window.mappool; // 图池配置
const list = data.list.length > 0 ? data.list : null; // 图池列表
function createPool() {
  let pool = { title: '空白图池' };
  data.value.push(pool);
}
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
