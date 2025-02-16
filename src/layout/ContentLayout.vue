<template>
  <div class="content px-4 py-6 bg-[#f5f5f5] dark:bg-black">
    <div class="router-wrapper h-full rounded-lg bg-white dark:bg-[#141414] dark:text-white overflow-auto p-6">
      <template v-if="isProd">
        <ContextMenu>
          <RouterView />
        </ContextMenu>
      </template>
      <template v-else>
        <!-- <ContextMenu> -->
        <RouterView />
        <!-- </ContextMenu> -->
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ContextMenu from '@/components/global/ContextMenu.vue';

const isProd = computed(() => import.meta.env.PROD);

if (isProd.value) {
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    console.log('contextmenu');
  });
}
</script>
