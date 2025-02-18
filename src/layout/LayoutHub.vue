<template>
  <div class="h-full flex bg-[#f5f5f5] dark:bg-black dark:text-white">
    <SiderLayout />
    <div class="flex flex-col h-full w-full relative transform-3d">
      <HeaderLayout class="fixed top-0 w-full" data-tauri-drag-region />
      <ContentLayout class="h-[calc(100%-4rem)] mt-16" />
    </div>
  </div>

  <SettingDrawer />

  <FloatButton />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FloatButton from '@/components/global/FloatButton.vue';
import SettingDrawer from '@/components/global/SettingDrawer.vue';
import SiderLayout from './SiderLayout.vue';
import HeaderLayout from './HeaderLayout.vue';
import ContentLayout from './ContentLayout.vue';

const isProd = computed(() => import.meta.env.PROD);

if (isProd.value) {
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    console.log('contextmenu');
  });
}
</script>
