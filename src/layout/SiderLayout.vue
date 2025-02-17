<template>
  <a-layout-sider
    class="sider hidden lg:block bg-white dark:bg-[#141414] border-r dark:border-[#313131] border-[#f0f0f0]"
    v-model:collapsed="collapsed"
    :trigger="null"
    collapsible
    breakpoint="xl"
    theme="light"
    :width="148"
    :collapsedWidth="84"
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
  height: 100%;
}
</style>
