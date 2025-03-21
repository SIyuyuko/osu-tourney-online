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
</script>
