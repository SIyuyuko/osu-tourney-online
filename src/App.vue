<template>
  <ThemeConfigurator />
  <StyleProvider hash-priority="high">
    <Layout />
  </StyleProvider>
</template>

<script setup lang="ts">
import { StyleProvider } from 'ant-design-vue';
import ThemeConfigurator from '@/components/global/ThemeConfigurator.vue';
import Layout from '@/layout/LayoutHub.vue';
import { onBeforeMount } from 'vue';
import i18n from '@/i18n';

onBeforeMount(() => {
  i18n.global.locale = window.user?.language ?? 'zh';
});
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
