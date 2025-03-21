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
      algorithm: themeStore.skin,
    }"
  ></a-config-provider>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore';

const themeStore = useThemeStore();
</script>
