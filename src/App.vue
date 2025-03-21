<template>
  <ThemeConfigurator />
  <StyleProvider hash-priority="high">
    <Layout />
  </StyleProvider>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { StyleProvider } from 'ant-design-vue';
import ThemeConfigurator from '@/components/global/ThemeConfigurator.vue';
import Layout from '@/layout/LayoutHub.vue';
import { initApp } from './utils/initApp';

onMounted(() => {
  const cleanup = initApp();
  onUnmounted(cleanup);
});
</script>
