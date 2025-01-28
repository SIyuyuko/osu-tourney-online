<template>
  <div class="flex flex-row gap-4">
    <!-- 标签 -->
    <span class="text-gray-700 dark:text-gray-200 font-medium">{{ label }}</span>

    <!-- 单选按钮组 -->
    <div class="flex flex-row gap-4">
      <label v-for="option in options" :key="option" class="flex items-center gap-1 cursor-pointer">
        <div class="relative flex items-center justify-center w-4 h-4">
          <div class="absolute w-4 h-4 border border-[#13c2c2] rounded-full transition-all" :class="{ 'border-[#13c2c2]': modelValue === option }"></div>
          <div v-if="modelValue === option" class="absolute w-2.5 h-2.5 bg-[#13c2c2] rounded-full"></div>
          <input type="radio" :value="option" :checked="modelValue === option" @change="handleValueChange(option)" class="absolute opacity-0 w-full h-full cursor-pointer" />
        </div>
        <span class="text-gray-700 dark:text-gray-200">{{ option }} {{ $t('command.sec') }}</span>
      </label>
    </div>

    <!-- 数字输入框 -->
    <div class="flex flex-row h-[1.8rem] w-32">
      <input
        type="number"
        :value="modelValue"
        :min="0"
        @input="handleInputChange($event)"
        class="w-24 border bg-transparent border-[#d9d9d9] dark:border-[#424242] text-gray-700 dark:text-gray-200 rounded-l-[0.6rem] pl-3 text-left focus:outline-hidden"
      />
      <span class="w-16 border border-[#d9d9d9] dark:border-[#424242] border-l-0 rounded-r-[0.6rem] bg-[#fafafa] dark:bg-[#1d1d1d] flex justify-center items-center text-gray-700 dark:text-gray-200">
        {{ $t('command.sec') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  modelValue: string | number;
  options: number[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  change: [value: string | number];
}>();

const handleValueChange = (value: string | number) => {
  emit('update:modelValue', value);
  emit('change', value);
};

const handleInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  if (target) {
    const value = target.value;
    handleValueChange(value);
  }
};
</script>
