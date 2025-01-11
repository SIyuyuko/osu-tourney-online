<template>
  <div>
    <span>{{ label }}</span>
    <a-radio-group :value="modelValue" @update:value="handleValueChange">
      <a-radio v-for="option in options" :key="option" :value="option">{{ option }}{{ $t('command.sec') }}</a-radio>
      <a-input-number :value="modelValue" :min="0" :addon-after="$t('command.sec')" @update:value="handleValueChange" />
    </a-radio-group>
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
  'change': [value: string | number];
}>();

const handleValueChange = (value: string | number) => {
  emit('update:modelValue', value);
  emit('change', value);
};
</script>
