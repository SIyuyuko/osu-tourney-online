<template>
  <div class="content px-4 py-6 bg-[#f5f5f5] dark:bg-black">
    <div class="router-wrapper h-full rounded-lg bg-white dark:bg-[#141414] dark:text-white overflow-auto p-6">
      <RouterView v-if="isProd" v-slot="{ Component }">
        <ContextMenu>
          <component :is="Component" />
        </ContextMenu>
      </RouterView>
      <RouterView v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ContextMenu from '@/components/global/ContextMenu.vue';

const isProd = import.meta.env.PROD;

onMounted(() => {
  if (isProd) {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      console.log('contextmenu');
    });
  }
});
</script>
