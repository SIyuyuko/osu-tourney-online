<template>
  <div style="height: 100%; display: flex" :data-theme="theme">
    <a-layout>
      <SiderLayout />
      <a-layout>
        <Header data-tauri-drag-region />
        <a-layout-content>
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
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>

  <SettingDrawer />

  <FloatButton />
</template>

<script setup lang="ts">
import { onBeforeMount, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/stores/themeStore';
import ContextMenu from '@/components/global/ContextMenu.vue';
import SiderLayout from '@/layout/SiderLayout.vue';
import Header from '@/layout/HeaderLayout.vue';
import FloatButton from '@/components/global/FloatButton.vue';
import SettingDrawer from '@/components/global/SettingDrawer.vue';
import i18n from '@/i18n';

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);

const isProd = computed(() => import.meta.env.PROD);

if (isProd.value) {
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    console.log('contextmenu');
  });
}

onBeforeMount(() => {
  i18n.global.locale = window.user?.language ?? 'zh';
});
</script>

<style lang="scss">
.ant-layout-content {
  margin: 25px 15px;
  padding: 20px;
  min-height: 280px;
  overflow: auto;
  border-radius: 10px;

  &:has(.no-scroll) {
    overflow: hidden;
  }
}
</style>
