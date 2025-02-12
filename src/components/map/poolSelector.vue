<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-07 22:20:39
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-09-13 14:37:38
 * @FilePath: /tourney-site/src/components/map/poolSelector.vue
 * @Description: 图池选择器组件
-->
<template>
  <a-card class="pool-body" v-if="hasMappool">
    <!-- Card Title -->
    <template #title>
      <span>{{ mappoolTitle }}</span>
    </template>

    <!-- Card Extra -->
    <template #extra>
      <div class="controls">
        <div class="reset-btn" v-if="isReferee" :title="$t('mappool.reset')" @click="resetMapStatus()">
          <font-awesome-icon :icon="faArrowsRotateSolid" />
        </div>
        <div class="star-btn">
          <font-awesome-icon :icon="currentMappool?.isDefault ? faStarSolid : faStarRegular" />
        </div>
        <div class="copy-btn" :title="$t('mappool.switch')">
          <a-dropdown placement="bottomRight">
            <div>
              <font-awesome-icon :icon="faAngleDownSolid" />
            </div>
            <template #overlay>
              <a-menu class="operate-button-menu">
                <a-menu-item v-for="(pool, index) in poolData?.children" :key="index" @click="changeMappool(pool)">
                  {{ pool?.title }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </template>
    <div class="pool-content" ref="poolRef">
      <Map
        :class="{ wrap: isWrap }"
        v-for="(map, index) in currentMappool?.map"
        :key="index"
        :item="map"
        :isCard="true"
        :isReferee="isReferee"
        @update="handleMapUpdate"
      ></Map>
    </div>
  </a-card>
  <a-empty v-else :description="$t('mappool.emptyActive')" :image="Empty.PRESENTED_IMAGE_SIMPLE" style="width: 100%" />
</template>

<script setup lang="ts">
import {
  faArrowsRotate as faArrowsRotateSolid,
  faStar as faStarSolid,
  faAngleDown as faAngleDownSolid,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { ref, onMounted, nextTick, computed } from 'vue';
import { Empty } from 'ant-design-vue';
import { useResizeObserver } from '@vueuse/core';
import type { MapInfo, Pool } from '@/types/mappool';
import Map from './Map.vue';

interface Mappool {
  title: string;
  map: MapInfo[];
  isDefault?: boolean;
}

// Props
withDefaults(defineProps<{ isReferee: boolean }>(), {
  isReferee: false,
});

// Refs
const poolRef = ref<HTMLElement | null>(null);
const poolData = ref<Pool>();
const currentMappool = ref<Mappool>();
const elementSize = ref<{ width: number; height: number }>();

// Computed
const isWrap = computed(() => (elementSize.value?.width ? elementSize.value.width < 400 : false));
const mappoolTitle = computed(() => `${poolData.value?.title} ${currentMappool.value?.title} Mappool`);
const hasMappool = computed(() => !!currentMappool.value?.map?.length);

// 切换图池轮次
const changeMappool = async (pool: Mappool) => {
  await nextTick();
  currentMappool.value = pool;
};

// 处理单个地图的更新
const handleMapUpdate = (updatedMap: MapInfo) => {
  if (!currentMappool.value?.map) return;

  const updatedMaps = currentMappool.value.map.map((map) => (map.id === updatedMap.id ? updatedMap : map));
  currentMappool.value.map = updatedMaps;
};

// 重置谱面标记状态
const resetMapStatus = () => {
  if (!currentMappool.value?.map) return;

  currentMappool.value.map = currentMappool.value.map.map((item) => ({
    ...item,
    checkStatus: false,
  }));
};

useResizeObserver(poolRef, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  elementSize.value = { width, height };
});

onMounted(() => {
  const data = window.mappool;
  if (!data.list) return;

  const targetPool = data.list.find((pool) => pool.title === data.homeMappool);
  if (!targetPool) return;

  poolData.value = targetPool;

  // Find default or first mappool
  const defaultPool = targetPool.children.find((child) => child.isDefault || targetPool.children.length === 1);

  if (defaultPool) {
    currentMappool.value = defaultPool;
  }
});
</script>

<style lang="scss" scoped>
.pool-body {
  display: flex;
  color: #ffffff;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  max-width: calc(100% - 520px);

  :deep(.ant-card-head) {
    padding: 0 20px;

    .ant-card-extra {
      display: flex;
      column-gap: 10px;
      margin: 0 1px 0 0;
    }
  }

  :deep(.ant-card-body) {
    padding: 20px;
    box-shadow: 0 0 0 1px var(--border-color);
  }

  .controls {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .pool-content {
    display: flex;
    justify-content: center;
    row-gap: 20px;
    column-gap: 20px;
    flex-wrap: wrap;

    :deep(.map-panel) {
      .ant-card-body {
        padding: 0;
        height: 60px;
        overflow: hidden;
        position: relative;

        div {
          margin: 0;
          color: #ffffff;
          background-position: center;
        }

        &:has(.referee) {
          height: auto;

          div {
            color: inherit;
          }
        }
      }

      .ant-card-actions {
        height: 20px;
        align-items: center;
        border-top: 1px solid transparent;

        & > li > span {
          font-size: 10px;
        }
      }

      &.wrap {
        width: 100%;
      }
    }
  }
}

:deep(*) {
  font-family: TorusSemiBold, Puhui;
}

[data-theme='light'] {
  :deep(.ant-card-body) {
    box-shadow: 0 0 0 1px #f0f0f0;
  }
}

[data-theme='dark'] {
  :deep(.ant-card-body) {
    box-shadow: 0 0 0 1px #303030;
  }
}

[class*='-btn'] {
  cursor: pointer;
}

.loading {
  display: flex;
  flex-direction: column;
  margin: auto;
  text-align: center;
  text-align: -webkit-center;
  row-gap: 10px;
}

* > input {
  visibility: hidden;
  display: none;
}

.operate-button-menu :deep(*) {
  font-size: 14px;
}

:deep(.ant-skeleton-content) {
  height: 500px;
}

@media (max-width: 1024px) {
  .pool-body {
    max-width: 100%;
  }
}
</style>
