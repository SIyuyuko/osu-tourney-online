<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-07 01:54:03
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-08-05 09:19:46
 * @FilePath: /osu!tourney-site/tourney-site/src/views/mappool/index.vue
 * @Description: 图池页面组件
-->
<template>
  <div class="page no-scroll">
    <div class="nav">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <router-link to="/mappool/list">
            {{ $t('mappool.list') }}
          </router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item v-if="currentPool">
          {{ currentPool.title }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="view">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" @pool-selected="updateCurrentPool" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentPool = ref();

const updateCurrentPool = (pool: any) => {
  currentPool.value = pool;
};

// 监听路由变化更新当前图池
watch(
  () => route.params.title,
  async (title) => {
    if (title) {
      currentPool.value = (window as any).mappool?.list?.find((p: any) => p.title === title) || null;
    } else {
      currentPool.value = null;
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;

  .nav {
    padding: 0 10px;
  }

  .view {
    overflow-x: hidden;
    overflow-y: auto;
    padding: 10px;
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
