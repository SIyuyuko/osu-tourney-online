<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-07 11:07:54
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-09-30 10:06:31
 * @FilePath: /osu-tourney-online/src/components/nav/menu.vue
 * @Description: 目录菜单组件
-->
<template>
  <a-menu
    class="menu"
    :selectable="true"
    v-model:selectedKeys="selectedKeys"
    theme="light"
    mode="inline"
    @click="router.push({ name: $event.key })"
    :forceSubMenuRender="true"
    triggerSubMenuAction="click"
  >
    <template v-for="item in menuItems" :key="item.key">
      <a-menu-item>
        <router-link :to="{ name: item.key }">
          <span class="anticon">
            <font-awesome-icon :icon="item.icon" />
          </span>
          <span class="menu-title">{{ $t(item.i18nKey) }}</span>
        </router-link>
      </a-menu-item>
    </template>
  </a-menu>
  <div class="logo text-center mx-auto mt-0 pb-2">
    <span>Tourney Web</span>
  </div>
</template>

<script setup lang="ts">
import {
  faHouseUser as faHouseUserSolid,
  faChess as faChessSolid,
  faMap as faMapSolid,
  faCompactDisc as faCompactDiscSolid,
  faTerminal as faTerminalSolid,
} from '@fortawesome/free-solid-svg-icons';
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 菜单配置
const menuItems = [
  {
    key: 'Home',
    icon: faHouseUserSolid,
    i18nKey: 'menu.home',
    path: '/home',
  },
  {
    key: 'Tournament',
    icon: faChessSolid,
    i18nKey: 'menu.tournament',
    path: '/tournament',
  },
  {
    key: 'Mappool',
    icon: faMapSolid,
    i18nKey: 'menu.mappool',
    path: '/mappool/list',
  },
  {
    key: 'Songlist',
    icon: faCompactDiscSolid,
    i18nKey: 'menu.songlist',
    path: '/songlist',
  },
  {
    key: 'Command',
    icon: faTerminalSolid,
    i18nKey: 'menu.command',
    path: '/command',
  },
];

// 当前选中的菜单项
const selectedKeys = ref<string[]>([String(route.name)]);

// 监听路由变化更新选中项
watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName) {
      selectedKeys.value = [String(newRouteName)];
    }
  }
);
</script>

<style lang="scss" scoped>

.menu {
  padding: 9px 0 0 0;
  height: 100%;
  padding-left: 0.3rem;
  padding-right: 0.3rem;

  :deep(.ant-menu-title-content) {
    display: flex;
    align-items: center;
    height: 100%;

    a {
      display: flex;
      align-items: center;
      height: 1.5rem;
    }
  }
}

// 处理折叠状态
:deep(.ant-menu-inline-collapsed) {
  .ant-menu-title-content {
    display: flex;
    align-items: center;
    height: 100%;

    a {
      display: flex;
      align-items: center;
      height: 1.5rem;
    }
  }

  .ant-menu-title-content {
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 1024px) {
  .menu {
    translate: 0.4rem;
  }
  .logo {
    display: none;
  }
}
</style>
