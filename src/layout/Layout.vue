<template>
  <div style="height: 100%; display: flex" :data-theme="theme">
    <a-layout>
      <Sider />
      <a-layout>
        <Header />
        <a-layout-content>
          <RouterView />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>

  <!-- Setting -->
  <a-drawer v-model:open="showSetting" :title="$t('setting.title')" :width="450" :data-theme="theme">
    <Setting />
  </a-drawer>

  <!-- MusicPlayBar -->
  <Floatbutton />
</template>

<script setup lang="ts">
import { ref, onBeforeMount, provide } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/stores/themeStore';
import Floatbutton from '@/components/FloatButton.vue';
import Header from '@/components/nav/Header.vue';
import Sider from '@/components/nav/Sider.vue';
import Setting from '@/components/setting.vue';
import i18n from '@/i18n';

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);
const showSetting = ref(false);

provide('showSetting', showSetting);

onBeforeMount(() => {
  i18n.global.locale = (window as any).user?.language ?? 'zh';
});

// watch(
//   () => route.query.code,
//   (code) => {
//     if (code) {
//       handleLogin(Array.isArray(code) ? code[0] : code);
//     }
//   },
//   { immediate: true }
// );
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
