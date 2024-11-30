<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-06 15:55:22
 * @LastEditors: SIyuyuko 3228981717@qq.com
 * @LastEditTime: 2024-10-12 23:03:48
 * @FilePath: /osu-tourney-online/src/components/nav/header.vue
 * @Description: 页头导航栏
-->
<template>
  <a-layout-header>
    <!-- 左侧操作按钮组 -->
    <div class="operate-button-group">
      <!-- 桌面端折叠按钮 -->
      <a-button class="collapse-btn" type="link" @click="toggleSidebar">
        <font-awesome-icon :icon="collapsed ? 'fa-solid fa-indent' : 'fa-solid fa-outdent'" />
      </a-button>

      <!-- 移动端折叠按钮 -->
      <a-dropdown v-model:open="mobileCollapsed" :trigger="['click']">
        <a-button class="collapse-btn-mobile" type="link" @click="mobileCollapsed = !mobileCollapsed">
          <font-awesome-icon icon="fa-solid fa-bars" :fade="mobileCollapsed" />
        </a-button>
        <template #overlay>
          <div>
            <Menu />
          </div>
        </template>
      </a-dropdown>

      <!-- 主题切换按钮 -->
      <a-button class="theme-btn" type="link" @click="toggleTheme()">
        <font-awesome-icon :icon="theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'" />
      </a-button>

      <!-- 多语言切换按钮 -->
      <a-button class="lang-btn" type="link" v-if="$i18n.locale">
        <a-dropdown placement="bottomLeft">
          <div>
            <font-awesome-icon icon="fa-solid fa-language" />
          </div>
          <template #overlay>
            <a-menu class="operate-button-menu">
              <a-menu-item v-for="locale in availableLocales" :key="locale.code" :style="currentLocale === locale.code ? selectedLangStyle : {}" @click="changeLocale(locale.code)">
                {{ locale.label }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-button>
    </div>

    <!-- 右侧用户操作按钮组 -->
    <div class="user-header">
      <!-- 登录/登出按钮 -->
      <a-button type="link" @click="handleAuth">
        <font-awesome-icon :icon="isLoggedIn ? 'fa-solid fa-right-from-bracket' : 'fa-solid fa-right-to-bracket'" />
      </a-button>

      <!-- GitHub链接 -->
      <a-button type="link" @click="openExternalLink(REPO_URL)">
        <font-awesome-icon icon="fa-brands fa-github" />
      </a-button>

      <!-- 设置按钮 -->
      <a-button class="setting-button" type="link" @click="showSetting = true">
        <font-awesome-icon icon="fa-solid fa-gear" />
      </a-button>

      <!-- Tauri窗口控制按钮 -->
      <div class="window-controls" v-if="isTauri">
        <a-button type="link" @click="minimizeWindow">
          <font-awesome-icon icon="fa-solid fa-minus" />
        </a-button>
        <a-button type="link" @click="toggleMaximizeWindow">
          <font-awesome-icon :icon="maximizeIcon" />
        </a-button>
        <a-button type="link" class="close-btn" @click="closeWindow">
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </a-button>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useApp } from "@/stores/useApp";
import { useThemeStore } from '@/stores/themeStore';
import { useSettingStore } from '@/stores/settingStore';
import { globalState } from '@/utils/initApp';
import { authApi } from '@/api';
import Menu from './Menu.vue';

const themeStore = useThemeStore();
const { toggleTheme } = themeStore;
const { theme } = storeToRefs(themeStore);
const appStore = useApp();
const { isTauri, maximizeIcon } = storeToRefs(appStore);
const { minimizeWindow, toggleMaximizeWindow, closeWindow } = appStore;
const { locale } = useI18n();
const { showSetting } = storeToRefs(useSettingStore());
const { siderCollapsed: collapsed } = globalState;
let mobileCollapsed = ref(false);
const isLoggedIn = ref(!!localStorage.getItem('userKey'));
const REPO_URL = 'https://github.com/SIyuyuko/osu-tourney-online';
// const wikiUrl = 'https://github.com/SIyuyuko/osu-tourney-online/wiki';

// 多语言配置
const currentLocale = computed(() => locale.value);
const availableLocales = [
  { code: 'zh', label: '简体中文' },
  { code: 'en', label: 'English' },
];

const selectedLangStyle = computed(() => ({
  'text-decoration': 'underline',
  'background-color': theme.value === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
}));

const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
};

const changeLocale = (newLocale: string) => {
  locale.value = newLocale;
  localStorage.setItem('locale', newLocale);
};

// 网页跳转
const openExternalLink = async (url: string) => {
  if (isTauri.value) {
    await open(url);
  } else {
    window.open(url, '_blank');
  }
};

// 登录/登出
const handleAuth = async () => {
  // if (isTauri.value) {
  //   try {
  //     // 调用Tauri后端处理OAuth
  //     const oauthUrl = await invoke('get_oauth_url');
  //     await open(oauthUrl as string);
  //   } catch (error) {
  //     console.error('Failed to handle auth:', error);
  //   }
  // } else {
    // if (isLoggedIn.value) {
    //   // 处理登出逻辑
    //   localStorage.removeItem('userKey')
    //   isLoggedIn.value = false
    //   router.push('/')
    // } else {
    // 处理登录逻辑
    try {
      const response = await authApi.getOauthUrl();
      if (response.code === 200 && response.message) {
        window.location.href = response.message;
      }
    } catch (error) {
      console.error('Failed to get OAuth URL:', error);
    }
    // }
  // }
};

onBeforeMount(() => {
  if (localStorage.getItem('userKey')) {
    isLoggedIn.value = true;
  }

  if (localStorage.getItem('locale')) {
    locale.value = localStorage.getItem('locale') as string;
  }
});
</script>

<style lang="scss" scoped>
.ant-layout-header {
  padding: 0;
  display: flex;

  .collapse-btn {
    margin-left: 0.7rem;
  }

  .operate-button-group {
    display: flex;
    margin: auto 0;
  }

  .user-header {
    display: flex;
    margin: 0 0 0 auto;
    align-items: center;
    vertical-align: middle;

    .setting-button {
      margin-right: 1rem;
    }

    .window-controls {
      display: flex;
      align-items: center;
      margin-right: 1rem;

      .close-btn:hover {
        background-color: #ff4d4f;
        color: white;
      }
    }
  }
}

.collapse-btn-mobile {
  display: none;
}

@media (max-width: 1024px) {
  .ant-layout-header {
    position: sticky;
    width: 100%;
    top: 0;
    z-index: 1;
  }

  .collapse-btn {
    display: none;
  }

  .collapse-btn-mobile {
    display: block;
  }
}
</style>
