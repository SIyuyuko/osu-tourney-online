<template>
  <div class="command-list" :class="{ 'grid-mode': isGridMode }">
    <div class="nav flex items-center sticky top-0 z-10 mb-2 bg-white dark:bg-[#141414]">
      <span class="text-gray-700 dark:text-gray-200">{{ $t('command.list') }}</span>
      <a :href="wikiUrl" target="_blank" :title="$t('command.seeWiki')" class="ml-2 text-black hover:text-[#13c2c2] dark:text-white dark:hover:text-[#13c2c2]">wiki</a>
    </div>

    <div class="commands-container">
      <div class="command-item mb-2" v-for="(item, index) in commandStore.commandList" :key="index">
        <span class="text-gray-700 dark:text-gray-200 mr-2">{{ index + 1 }}.</span>
        <span class="text-gray-700 dark:text-gray-200 font-medium">{{ item.name }}</span>
        <div class="flex items-center">
          <button
            class="operate-btn h-7 bg-[#13c2c2] hover:bg-[#11b3b3] text-white px-2 flex items-center rounded-l-lg focus:outline-none"
            @click="copyToClipboard(item.value || '', index)"
          >
            <font-awesome-icon :icon="copiedIndex === index ? 'fa-solid fa-check' : 'fa-regular fa-copy'" />
          </button>
          <input
            type="text"
            :value="item.value"
            @input="handleInputChange(index, $event)"
            :ref="(el) => (inputRef[index] = el as HTMLInputElement)"
            class="h-7 px-2 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50 dark:text-gray-200"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommandStore } from '@/stores/commandStore';
import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize();
const isGridMode = computed(() => width.value <= 980);

const { locale } = useI18n();
const commandStore = useCommandStore();

const inputRef = ref<HTMLInputElement[]>([]); // 改为数组类型
const copiedIndex = ref<number | null>(null); // 复制状态

const wikiUrl = computed(() => {
  return `https://osu.ppy.sh/wiki/${locale.value}/osu%21_tournament_client/osu%21tourney/Tournament_management_commands`;
});

// 复制到剪贴板
const copyToClipboard = async (text: string, index: number) => {
  try {
    await navigator.clipboard.writeText(text);
    copiedIndex.value = index;
    setTimeout(() => (copiedIndex.value = null), 2000); // 2秒后重置复制状态
  } catch (err) {
    console.error('复制失败:', err);
  }
};

// 计算输入框内容的宽度
const calculateInputWidth = () => {
  inputRef.value.forEach((input) => {
    if (input) {
      const span = document.createElement('span');
      span.style.visibility = 'hidden'; // 隐藏 span
      span.style.whiteSpace = 'pre'; // 保留空格和换行
      span.style.fontSize = window.getComputedStyle(input).fontSize; // 字体大小一致
      span.style.fontFamily = window.getComputedStyle(input).fontFamily; // 字体一致
      span.textContent = input.value || input.placeholder || ''; // 内容或占位符
      document.body.appendChild(span);
      const width = span.offsetWidth + 20; // 加上 padding 的宽度
      document.body.removeChild(span);
      input.style.width = `${Math.max(width, 90)}px`; // 直接设置 input 的宽度
    }
  });
};

// 处理输入事件
const handleInputChange = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  const newValue = target.value;

  // 直接更新 commandStore 中的数据
  if (commandStore.commandList[index]) {
    commandStore.commandList[index].value = newValue;
  }

  calculateInputWidth(); // 更新宽度
};

// 初始化时计算宽度
onMounted(() => {
  commandStore.initCommands();
  calculateInputWidth();
});

watch(
  () => commandStore.commandList,
  async () => {
    await nextTick(); // 等待 DOM 更新
    calculateInputWidth();
  },
  { deep: true }
);
</script>
