<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-06 15:55:22
 * @LastEditors: SIyuyuko 3228981717@qq.com
 * @LastEditTime: 2024-10-12 23:03:48
 * @FilePath: /osu-tourney-online/src/components/nav/header.vue
 * @Description: 页头导航栏
-->
<template>
  <div class="header bg-white dark:bg-[#141414] flex flex-row items-center justify-between px-5 py-5">
    <!-- 左侧样式设置组 -->
    <div class="flex flex-row items-center gap-5">
      <!-- 桌面端折叠按钮 -->
      <Button
        class="hidden lg:block"
        @click="toggleSidebar"
        :icon="settings.sidebarCollapsed ? faIndentSolid : faOutdentSolid"
      />

      <!-- 移动端折叠按钮 -->
      <a-dropdown v-model:open="mobileCollapsed" :trigger="['click']">
        <Button
          class="block lg:hidden"
          @click="mobileCollapsed = !mobileCollapsed"
          :icon="faBarsSolid"
          :fade="mobileCollapsed"
        />
        <template #overlay>
          <Menu />
        </template>
      </a-dropdown>

      <!-- 主题切换按钮 -->
      <Button @click="setTheme(!isDarkMode)" :icon="isDarkMode ? faMoonSolid : faSunSolid" />

      <!-- 多语言切换按钮 -->

      <a-dropdown placement="bottomLeft" :trigger="['click']">
        <Button type="link" v-if="$i18n.locale" :icon="faLanguageSolid" />
        <template #overlay>
          <a-menu>
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
    </div>

    <!-- 右侧用户操作按钮组 -->
    <div class="user-header flex flex-row items-center gap-8">
      <div class="flex flex-row items-center gap-6">
        <Button @click="handleAuth" :icon="isLoggedIn ? faRightFromBracketSolid : faRightToBracketSolid" />
        <Button @click="openExternalLink(REPO_URL)" :icon="faGithubBrands" />
        <Button @click="settings.showSettingDrawer = true" :icon="faGearSolid" />
      </div>

      <!-- Tauri窗口控制按钮 -->
      <div class="window-controls flex flex-row items-center gap-2" v-if="isTauri">
        <Button class="w-10 h-7" @click="minimizeWindow" :icon="faMinusSolid" />
        <Button class="w-10 h-7" @click="toggleMaximizeWindow" :icon="maximizeIcon" />
        <Button
          class="w-10 h-7 rounded-[10px] hover:bg-[#ff4d4f] hover:text-white"
          @click="closeWindow"
          :icon="faXmarkSolid"
        />
      </div>
    </div>
  </div>
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
import { useSettingsStore } from '@/stores/settingStore';
import { openExternalLink } from '@/utils/helpers';
import { authApi } from '@/api';
import Menu from '@/components/nav/Menu.vue';
import Button from '@/components/ui/HeaderButton.vue';

const themeStore = useThemeStore();
const { setTheme } = themeStore;
const { isDarkMode } = storeToRefs(themeStore);

const appStore = useApp();
const settingsStore = useSettingsStore();
const { isTauriApp: isTauri, currentMaximizeIcon: maximizeIcon } = storeToRefs(appStore);
const { minimizeWindow, toggleMaximizeWindow, closeWindow } = appStore;
const { locale } = useI18n();
const { settings } = storeToRefs(settingsStore);
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
  'background-color': isDarkMode.value ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
}));

const toggleSidebar = () => {
  settings.value.sidebarCollapsed = !settings.value.sidebarCollapsed;
  settingsStore.saveSettings();
};

const changeLocale = (newLocale: string) => {
  locale.value = newLocale;
  settingsStore.setLocale(newLocale);
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
});
</script>
