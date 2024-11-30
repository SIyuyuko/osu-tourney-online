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
    @click="handleMenuClick"
    :forceSubMenuRender="true"
    triggerSubMenuAction="click"
  >
    <template v-for="item in menuItems" :key="item.key">
      <a-menu-item>
        <router-link :to="{ name: item.key }">
          <span class="anticon">
            <font-awesome-icon :icon="item.icon" />
          </span>
          <span>{{ $t(item.i18nKey) }}</span>
        </router-link>
      </a-menu-item>
    </template>
  </a-menu>
  <div class="logo">
    <span>Tourney Web</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 菜单配置
const menuItems = [
  {
    key: 'Home',
    icon: 'fa-solid fa-house-user',
    i18nKey: 'menu.home',
    path: '/home',
  },
  {
    key: 'Tournament',
    icon: 'fa-solid fa-chess',
    i18nKey: 'menu.tournament',
    path: '/tournament',
  },
  {
    key: 'Mappool',
    icon: 'fa-solid fa-map',
    i18nKey: 'menu.mappool',
    path: '/mappool/list',
  },
  {
    key: 'Songlist',
    icon: 'fa-solid fa-compact-disc',
    i18nKey: 'menu.songlist',
    path: '/songlist',
  },
  {
    key: 'Command',
    icon: 'fa-solid fa-terminal',
    i18nKey: 'menu.command',
    path: '/command',
  },
];

// 当前选中的菜单项
const selectedKeys = ref<string[]>([route.name as string]);

// 处理菜单点击
const handleMenuClick = ({ key }: { key: string }) => {
  router.push({ name: key });
};

// 监听路由变化更新选中项
watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName) {
      selectedKeys.value = [newRouteName as string];
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
  background: #fff; // 亮色主题背景
  transition: background var(--theme-transition-duration) var(--theme-transition-timing);
}

.logo {
  text-align: center;
  margin: auto 0 0 0;
  padding: 0 0 0.5rem 0;
  background: #fff; // 亮色主题背景
  transition: background var(--theme-transition-duration) var(--theme-transition-timing);

  span {
    font-weight: 600;
    transition: color var(--theme-transition-duration) var(--theme-transition-timing);
  }
}

[data-theme='dark'] {
  .menu {
    background: var(--theme-black, #141414);
  }

  .logo {
    background: var(--theme-black, #141414);
    span {
      color: #fff;
    }
  }
}

// 处理折叠状态
:deep(.ant-menu-inline-collapsed) {
  .menu-title {
    display: none;
  }

  .anticon {
    margin-right: 0;
  }

  .ant-menu-item {
    padding: 0 calc(50% - 16px / 2);
  }
}

@media (max-width: 1024px) {
  .logo {
    display: none;
  }
}
</style>
