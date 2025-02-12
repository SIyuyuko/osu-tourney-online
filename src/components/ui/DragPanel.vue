<template>
  <div class="drag-panel flex overflow-hidden">
    <!-- 左侧面板 -->
    <div class="left-panel flex-none overflow-auto" :style="{ flex: `0 0 ${leftWidth}px` }">
      <slot name="left"></slot>
    </div>

    <!-- 拖拽分割线 -->
    <div class="divider w-2 bg-gray-200 dark:bg-gray-700 cursor-col-resize" @mousedown="startDrag"></div>

    <!-- 右侧面板 -->
    <div class="right-panel flex-1 overflow-hidden" :style="{ minWidth: `${rightMinWidth}px` }">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  leftWidth: { type: Number, default: 350 },
  rightMinWidth: { type: Number, default: 500 },
  leftMinWidth: { type: Number, default: 200 },
});

const emit = defineEmits(['update:leftWidth']);

const leftWidth = ref(props.leftWidth);

// 监听 props.leftWidth 的变化
watch(
  () => props.leftWidth,
  (newVal) => {
    leftWidth.value = newVal;
  }
);

// 拖拽逻辑
const startDrag = (e: MouseEvent) => {
  e.preventDefault();
  const initialX = e.clientX;
  const initialLeftWidth = leftWidth.value;
  const dragPanelWidth = (e.currentTarget as HTMLElement).parentElement?.clientWidth || 0;

  const onMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - initialX;
    const newLeftWidth = initialLeftWidth + deltaX;

    // 限制左侧最小宽度和右侧最小宽度
    if (newLeftWidth >= props.leftMinWidth && newLeftWidth <= dragPanelWidth - props.rightMinWidth) {
      leftWidth.value = newLeftWidth;
    }
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};
</script>
