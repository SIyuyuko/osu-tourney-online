<template>
  <a-dropdown :trigger="['contextmenu']">
    <slot></slot>
    <template #overlay>
      <a-menu class="custom-context-menu">
        <template v-for="(item, index) in menuItems" :key="index">
          <a-menu-divider v-if="item.type === 'divider'" />
          <a-menu-item v-else :key="item.key" @click="handleMenuClick(item)">
            <template #icon v-if="item.icon">
              <component :is="item.icon" />
            </template>
            {{ item.label }}
          </a-menu-item>
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

interface MenuItem {
  key?: string;
  label?: string;
  icon?: any;
  type: 'item' | 'divider';
  action?: () => void;
}

defineProps({
  menuItems: {
    type: Array as PropType<MenuItem[]>,
    default: () => [],
  },
});

const handleMenuClick = (item: MenuItem) => {
  if (item.action) {
    item.action();
  }
};
</script>

<style lang="scss">
.custom-context-menu {
  .ant-dropdown-menu-item {
    &:hover {
      background-color: #f5f5f5;
    }
  }
}
</style>
