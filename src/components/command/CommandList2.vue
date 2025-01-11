<template>
  <div>
    <!-- 导航栏 -->
    <div class="sticky top-0 z-10 flex items-center mb-4 p-2 bg-[#ffffff] dark:bg-[#141414]">
      <span>{{ $t('command.list') }}</span>
      <a :href="wikiUrl" target="_blank" class="ml-4 text-[#13c2c2] hover:text-blue-500">wiki</a>
      <button class="ml-auto p-2 aspect-square rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors md:hidden" @click="$emit('toggle-show')">
        <font-awesome-icon class="text-[#13c2c2]" :icon="showCommand ? 'fa-solid fa-compress' : 'fa-solid fa-expand'" />
      </button>
    </div>

    <!-- 命令列表 -->
    <div v-for="(item, index) in commandList" :key="index" class="mb-4" :class="{ hidden: !showCommand }">
      <div class="flex items-center space-x-4">
        <span class="text-gray-600 dark:text-gray-400">{{ index + 1 }}.</span>
        <span class="text-gray-800 dark:text-gray-200">{{ item.name }}</span>

        <!-- 命令内容和操作按钮 -->
        <div class="flex-1 flex items-center justify-between">
          <div v-if="editingIndex === index" class="flex-1 flex space-x-2">
            <input
              v-model="commandCopy[index].value"
              type="text"
              class="flex-1 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              @blur="handleEditComplete(index)"
              @keyup.enter="handleEditComplete(index)"
              ref="editInput"
            />
          </div>
          <div v-else class="flex-1 flex items-center justify-between">
            <span class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {{ commandCopy[index].value }}
            </span>
            <div class="flex space-x-2">
              <button @click="handleEdit(index)" class="px-3 py-1 text-sm border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1">
                <font-awesome-icon icon="fa-solid fa-pencil" />
                <span class="ml-1">{{ $t('command.edit') }}</span>
              </button>
              <button
                @click="handleCopy(commandCopy[index].value ?? '', index)"
                class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center space-x-1"
              >
                <font-awesome-icon :icon="copyStatus[index] ? 'fa-solid fa-check' : 'fa-regular fa-copy'" />
                <span class="ml-1">{{ $t('command.copy') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Command } from '@/types/config';

const { locale } = useI18n();

// Props
defineProps({
  showCommand: { type: Boolean },
  commandCopy: {
    type: Array as PropType<Command[]>,
    required: true,
  },
});

// Emits
const emit = defineEmits(['toggle-show']);

// Data
const editingIndex = ref<number | null>(null);
const copyStatus = ref<Record<number, boolean>>({});
const editInput = ref<HTMLInputElement | null>(null);

// Computed
const wikiUrl = computed(() => {
  return `https://osu.ppy.sh/wiki/${locale.value}/osu%21_tournament_client/osu%21tourney/Tournament_management_commands`;
});

const commandList = computed(() => window.command.list);

// Methods
const handleEdit = (index: number) => {
  editingIndex.value = index;
  // 等待 DOM 更新后聚焦输入框
  nextTick(() => {
    if (editInput.value) {
      editInput.value.focus();
    }
  });
};

const handleEditComplete = (index: number) => {
  editingIndex.value = null;
};

const handleCopy = async (text: string, index: number) => {
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.value[index] = true;
    setTimeout(() => {
      copyStatus.value[index] = false;
    }, 2000);
  } catch (err) {
    console.error('复制失败:', err);
  }
};
</script>
