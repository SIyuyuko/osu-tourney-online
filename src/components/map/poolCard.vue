<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-14 16:34:48
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-08-08 15:52:15
 * @FilePath: /osu!tourney-site/tourney-site/src/components/map/PoolCard.vue
 * @Description: 图池列表卡片组件
-->
<template>
  <a-card
    :class="['pool-card', { 'add-card': isNewPool }]"
    @click="handleClick"
    hoverable
  >
    <template v-if="!isNewPool">
      <span :title="item.title">{{ item.title }}</span>
    </template>
    <template v-else>
      <div>
        <font-awesome-icon :icon="faFolderPlusSolid" />
        <span class="add-title">新建图池</span>
      </div>
    </template>
  </a-card>
</template>

<script setup lang="ts">
import { faFolderPlus as faFolderPlusSolid } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Pool } from '@/types/mappool';

const props = defineProps<{
  item: Partial<Pool>;
}>();

const router = useRouter();
const emit = defineEmits(['create']);

const isNewPool = computed(() => props.item.title === '新建图池');

const handleClick = () => {
  if (isNewPool.value) {
    emit('create');
  } else {
    router.push({
      name: 'MappoolDetail',
      params: { title: props.item.title }
    });
  }
};
</script>

<style lang="scss" scoped>
.pool-card {
  :deep(.ant-card-body) {
    text-wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.add-card {
  .add-title {
    margin-left: 10px;
  }
}
</style>
