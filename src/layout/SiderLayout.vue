<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-06 15:55:48
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-05-07 11:11:08
 * @FilePath: /tourney-site/src/components/nav/sider.vue
 * @Description: 侧边导航栏
-->
<template>
  <a-layout-sider
    class="sider hidden lg:block bg-white dark:bg-[#141414]"
    v-model:collapsed="collapsed"
    :trigger="null"
    collapsible
    breakpoint="xl"
    theme="light"
    :width="150"
    :collapsedWidth="80"
  >
    <Menu />
  </a-layout-sider>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import Menu from '@/components/nav/Menu.vue';

let collapsed = inject('collapsed');
</script>

<style lang="scss" scoped>
.sider :deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  background: transparent;
}
</style>
