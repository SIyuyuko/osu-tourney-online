<template>
  <div style="height: 100%; display: flex" :data-theme="theme">
    <a-layout>
      <Sider />
      <a-layout>
        <Header data-tauri-drag-region />
        <a-layout-content>
          <!-- <ContextMenu :menuItems="menuItems"> -->
          <RouterView />
          <!-- </ContextMenu> -->
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>

  <SettingDrawer />

  <FloatButton />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/stores/themeStore';
// import ContextMenu from '@/components/global/ContextMenu.vue';
import Sider from '@/components/nav/Sider.vue';
import Header from '@/components/nav/Header.vue';
import FloatButton from '@/components/global/FloatButton.vue';
import SettingDrawer from '@/components/global/SettingDrawer.vue';
import i18n from '@/i18n';
// import { message } from 'ant-design-vue';
// import { EditOutlined, DeleteOutlined, CopyOutlined, ShareAltOutlined, ReloadOutlined } from '@ant-design/icons-vue';

// interface MenuItem {
//   key?: string;
//   label?: string;
//   icon?: any;
//   type: 'item' | 'divider';
//   action?: () => void;
// }

// const menuItems: MenuItem[] = [
//   {
//     key: 'edit',
//     label: '编辑',
//     icon: EditOutlined,
//     type: 'item',
//     action: () => console.log('编辑'),
//   },
//   {
//     key: 'share',
//     label: '分享',
//     icon: ShareAltOutlined,
//     type: 'item',
//     action: () => console.log('分享'),
//   },
//   {
//     key: 'copy',
//     label: '复制',
//     icon: CopyOutlined,
//     type: 'item',
//     action: async () => {
//       try {
//         await navigator.clipboard.writeText(window.getSelection()?.toString() || '');
//         message.success('Text copied to clipboard');
//         console.log('Text copied to clipboard');
//       } catch (err) {
//         console.error('Failed to copy text: ', err);
//       }
//     },
//   },
//   {
//     key: 'delete',
//     label: '删除',
//     icon: DeleteOutlined,
//     type: 'item',
//     action: () => console.log('删除'),
//   },
//   { type: 'divider' },
//   {
//     key: 'refresh',
//     label: '刷新',
//     icon: ReloadOutlined,
//     type: 'item',
//     action: () => {
//       window.location.reload();
//     },
//   },
// ];

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);

onBeforeMount(() => {
  i18n.global.locale = window.user?.language ?? 'zh';
});

// document.addEventListener("contextmenu", function (e) {
//     e.preventDefault();
// });
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
