<template>
  <Dropdown :item="menuItems" :trigger="['contextmenu']">
    <slot></slot>
    <template #overlay>
      <a-menu class="custom-context-menu">
        <template v-for="(item, index) in menuItems" :key="index">
          <a-menu-divider v-if="item.type === 'divider'" />
          <a-menu-item v-else :key="item.key" @click="item.onClick && item.onClick()">
            <template #icon v-if="item.icon">
              <FontAwesomeIcon :icon="item.icon" />
            </template>
            {{ item.label }}
          </a-menu-item>
        </template>
      </a-menu>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { Dropdown } from 'ant-design-vue';
import {
  faPenToSquare as faPenToSquareSolid,
  faDeleteLeft as faDeleteLeftSolid,
  faCopy as faCopySolid,
  faShare as faShareSolid,
  faRotateRight as faRotateRightSolid,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { copyToClipboard } from '@/utils/helpers';

const menuItems = [
  {
    key: 'edit',
    label: '编辑',
    icon: faPenToSquareSolid,
    onClick: () => console.log('编辑'),
  },
  {
    key: 'share',
    label: '分享',
    icon: faShareSolid,
    onClick: () => console.log('分享'),
  },
  {
    key: 'copy',
    label: '复制',
    icon: faCopySolid,
    onClick: () => copyToClipboard(window.getSelection()?.toString() || ''),
  },
  {
    key: 'delete',
    label: '删除',
    icon: faDeleteLeftSolid,
    onClick: () => console.log('删除'),
  },
  { type: 'divider' },
  {
    key: 'refresh',
    label: '刷新',
    icon: faRotateRightSolid,
    onClick: () => {
      window.location.reload();
    },
  },
];
</script>
