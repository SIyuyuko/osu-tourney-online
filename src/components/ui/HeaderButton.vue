<template>
  <button class="flex justify-center items-center cursor-pointer w-6 h-6" :class="props.class" @click="handleClick">
    <font-awesome-icon class="text-[#36cfc9]" :icon="props.icon" :fade="props.fade" />
  </button>
</template>

<script setup lang="ts">
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { PropType } from 'vue';

const emit = defineEmits(['click']);

const props = defineProps({
  class: {
    type: String,
    default: '',
  },
  icon: {
    type: Object as PropType<IconDefinition>,
  },
  fade: {
    type: Boolean,
    default: false,
  },
});

const handleClick = () => {
  emit('click');
};
</script>
