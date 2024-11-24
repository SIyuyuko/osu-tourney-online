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
      <a-dropdown v-model:open="mobileCollapsed" :trigger="['click', 'hover']">
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
        <font-awesome-icon :icon="theme === 'light' ? 'fa-regular fa-moon' : 'fa-solid fa-moon'" />
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
      <a-button type="link" @click="showSetting = true">
        <font-awesome-icon icon="fa-solid fa-gear" />
      </a-button>
    </div>
  </a-layout-header>
</template>
<script setup lang="ts">
import { inject, ref, onBeforeMount, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import { globalState } from '@/utils/init';
import { getOauthUrl } from '@/api/data_api';
import Menu from './menu.vue';

const { t, locale } = useI18n()
const showSetting = inject('showSetting')
const { theme, siderCollapsed: collapsed } = globalState
let mobileCollapsed = ref(false)
const isLoggedIn = ref(!!localStorage.getItem('userKey'))
const REPO_URL = 'https://github.com/SIyuyuko/osu-tourney-online'
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

// 切换主题
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};

const changeLocale = (newLocale: string) => {
  locale.value = newLocale;
};

// 网页跳转
const openExternalLink = (url: string) => {
  window.open(url, '_blank');
};

// 登录/登出
const handleAuth = async () => {
  // if (isLoggedIn.value) {
  //   // 处理登出逻辑
  //   localStorage.removeItem('userKey')
  //   isLoggedIn.value = false
  //   router.push('/')
  // } else {
  // 处理登录逻辑
  try {
    const response = await getOauthUrl();
    if (response.status === 200 && response.data) {
      window.location.href = response.data.message;
    }
  } catch (error) {
    console.error('Failed to get OAuth URL:', error);
  }
  // }
};

onBeforeMount(() => {
  if (localStorage.getItem('userKey')) {
    isLoggedIn.value = true;
  }
});
</script>
<style lang="scss" scoped>
.ant-layout-header {
  padding: 0;
  display: flex;

  .operate-button-group {
    display: flex;
    margin: auto 0;
  }

  .user-header {
    display: flex;
    margin: 0 0 0 auto;
    align-items: center;
    vertical-align: middle;
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
