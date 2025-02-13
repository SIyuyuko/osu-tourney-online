<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-06 15:55:22
 * @LastEditors: SIyuyuko 3228981717@qq.com
 * @LastEditTime: 2024-10-12 23:03:48
 * @FilePath: /osu-tourney-online/src/components/nav/header.vue
 * @Description: 页头导航栏
-->
<template>
  <a-layout-header class="bg-white dark:bg-[#141414] flex flex-row items-center justify-between">
    <!-- 左侧样式设置组 -->
    <div class="flex flex-row items-center">
      <!-- 桌面端折叠按钮 -->
      <a-button class="collapse-btn" type="link" @click="toggleSidebar">
        <font-awesome-icon :icon="collapsed ? faIndentSolid : faOutdentSolid" />
      </a-button>

      <!-- 移动端折叠按钮 -->
      <a-dropdown v-model:open="mobileCollapsed" :trigger="['click']">
        <a-button class="collapse-btn-mobile" type="link" @click="mobileCollapsed = !mobileCollapsed">
          <font-awesome-icon :icon="faBarsSolid" :fade="mobileCollapsed" />
        </a-button>
        <template #overlay>
          <div>
            <Menu />
          </div>
        </template>
      </a-dropdown>

      <!-- 主题切换按钮 -->
      <a-button class="theme-btn" type="link" @click="toggleTheme()">
        <font-awesome-icon :icon="theme === 'light' ? faMoonSolid : faSunSolid" />
      </a-button>

      <!-- 多语言切换按钮 -->
      <a-button class="lang-btn" type="link" v-if="$i18n.locale">
        <a-dropdown placement="bottomLeft">
          <div>
            <font-awesome-icon :icon="faLanguageSolid" />
          </div>
          <template #overlay>
            <a-menu class="operate-button-menu">
              <a-menu-item
                v-for="locale in availableLocales"
                :key="locale.code"
                :style="currentLocale === locale.code ? selectedLangStyle : {}"
                @click="changeLocale(locale.code)"
              >
                {{ locale.label }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-button>
    </div>

    <!-- 右侧用户操作按钮组 -->
    <div class="user-header flex flex-row items-center gap-3">
      <div class="flex flex-row items-center">
        <!-- 登录/登出按钮 -->
        <a-button type="link" @click="handleAuth">
          <font-awesome-icon :icon="isLoggedIn ? faRightFromBracketSolid : faRightToBracketSolid" />
        </a-button>

        <!-- GitHub链接 -->
        <a-button type="link" @click="openExternalLink(REPO_URL)">
          <font-awesome-icon :icon="faGithubBrands" />
        </a-button>

        <!-- 设置按钮 -->
        <a-button class="setting-button" type="link" @click="showSetting = true">
          <font-awesome-icon :icon="faGearSolid" />
        </a-button>
      </div>

      <!-- Tauri窗口控制按钮 -->
      <div class="window-controls flex flex-row items-center" v-if="isTauri">
        <a-button type="link" @click="minimizeWindow">
          <font-awesome-icon class="window-controls-icon" :icon="faMinusSolid" />
        </a-button>
        <a-button type="link" @click="toggleMaximizeWindow">
          <font-awesome-icon :icon="maximizeIcon" />
        </a-button>
        <a-button type="link" class="close-btn" @click="closeWindow">
          <font-awesome-icon class="window-controls-icon" :icon="faXmarkSolid" />
        </a-button>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import {
  faIndent as faIndentSolid,
  faOutdent as faOutdentSolid,
  faBars as faBarsSolid,
  faMoon as faMoonSolid,
  faSun as faSunSolid,
  faLanguage as faLanguageSolid,
  faRightFromBracket as faRightFromBracketSolid,
  faRightToBracket as faRightToBracketSolid,
  faGear as faGearSolid,
  faMinus as faMinusSolid,
  faXmark as faXmarkSolid,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub as faGithubBrands } from '@fortawesome/free-brands-svg-icons';
import { ref, onBeforeMount, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useApp } from '@/stores/appStore';
import { useThemeStore } from '@/stores/themeStore';
import { useSettingStore } from '@/stores/settingStore';
import { globalState } from '@/utils/initApp';
import { openExternalLink } from '@/utils/helpers';
import { authApi } from '@/api';
import Menu from '@/components/nav/Menu.vue';

const themeStore = useThemeStore();
const { toggleTheme } = themeStore;
const { theme } = storeToRefs(themeStore);

const appStore = useApp();
const { isTauriApp: isTauri, currentMaximizeIcon: maximizeIcon } = storeToRefs(appStore);
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
  padding-inline: 0.8rem;

  .user-header {
    .window-controls {
      .close-btn:hover {
        background-color: #ff4d4f;
        color: white;
      }

      .window-controls-icon {
        height: 1.2rem;
        width: 1.2rem;
        margin-bottom: -0.1rem;
      }
    }
  }
}

.collapse-btn-mobile {
  display: none;
}

@media (max-width: 1024px) {
  .collapse-btn {
    display: none;
  }

  .collapse-btn-mobile {
    display: block;
  }
}
</style>
