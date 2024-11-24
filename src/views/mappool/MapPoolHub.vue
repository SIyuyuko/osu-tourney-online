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
      <a-breadcrumb :routes="routes">
        <template #itemRender="{ route, paths }">
          <span v-if="routes.indexOf(route) === routes.length - 1">
            {{ $t(route.breadcrumbName) }}
          </span>
          <router-link v-else :to="generatePath(paths)">
            {{ $t(route.breadcrumbName) }}
          </router-link>
        </template>
      </a-breadcrumb>
    </div>
    <div class="view">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts" name="Mappool">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 路由配置
const routes = computed(() => {
  const baseRoute = {
    path: 'list',
    breadcrumbName: 'mappool.list'
  };

  const breadcrumbs = [baseRoute];

  if (route.name === 'MappoolView' || route.name === 'MappoolSetting') {
    // 添加图池详情路由
    breadcrumbs.push({
      path: `view/${route.params.id}`,
      breadcrumbName: typeof route.meta.poolTitle === 'string' ? route.meta.poolTitle : 'mappool.view'
    });
  }

  if (route.name === 'MappoolSetting') {
    // 添加设置路由
    breadcrumbs.push({
      path: `setting/${route.params.id}`,
      breadcrumbName: 'mappool.setting'
    });
  }

  return breadcrumbs;
});

const generatePath = (paths: string[]) => {
  return `/mappool/${paths.join('/')}`;
};

// 显示图池设置
// function showSettingPage(visible) {
//   showSetting.value = visible;
//   if (visible) {
//     changeCurPage('setting');
//   }
// }
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
