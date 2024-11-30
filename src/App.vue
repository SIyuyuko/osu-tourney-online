<template>
  <ThemeConfigurator />
  <Layout />
</template>

<script setup lang="ts">
import ThemeConfigurator from '@/components/global/ThemeConfigurator.vue';
import Layout from '@/layout/Layout.vue';
</script>

<style lang="scss">
#app {
  user-select: none;
  shape-outside: margin-box;
}

body {
  overflow: hidden;
  user-select: none;
  cursor: default;
}
</style>