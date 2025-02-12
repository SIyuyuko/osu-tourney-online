<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-06 11:54:10
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-08-27 12:30:35
 * @FilePath: /tourney-site/src/components/theme/theme.vue
 * @Description: 项目主题配置
-->
<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#13c2c2', // 主题色
        wireframe: true, // 是否为线框风格
        borderRadius: 10,
        fontSize: 16,
        colorLink: '#13c2c2', // 链接文本色
        colorLinkActive: '#08979c',
        colorLinkHover: '#36cfc9',
      },
      algorithm: skin,
    }"
  ></a-config-provider>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore';
import { theme as antTheme } from 'ant-design-vue';
import { onBeforeMount, watch, ref } from 'vue';

const themeStore = useThemeStore();
const { initTheme } = themeStore;

let skin = ref();

function toggleGlobalTheme(val: string) {
  skin.value = val === 'light' ? antTheme.defaultAlgorithm : antTheme.darkAlgorithm;
}

onBeforeMount(() => {
  initTheme();
});

watch(
  () => themeStore.theme,
  (val) => {
    toggleGlobalTheme(val);
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
