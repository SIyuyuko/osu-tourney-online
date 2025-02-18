<template>
  <div class="py-2 h-full flex flex-col justify-between px-[2px]">
    <a-menu
      class="menu"
      :selectable="true"
      v-model:selectedKeys="selectedKeys"
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
    <div class="logo text-center text-black dark:text-gray-200 hidden lg:block">
      <span>Tourney Web</span>
    </div>
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
.ant-menu-light.ant-menu-root.ant-menu-inline,
.ant-menu-root.ant-menu-vertical.menu {
  border-inline-end: none;
  background-color: transparent;
}
</style>
