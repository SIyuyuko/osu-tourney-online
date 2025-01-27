<template>
  <div class="flex justify-center items-center min-h-screen p-5 bg-linear-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900">
    <div class="text-center bg-white/90 dark:bg-gray-800/90 p-10 rounded-2xl shadow-lg backdrop-blur-xs max-w-lg w-full">
      <!-- 错误图标 -->
      <div class="relative mb-8">
        <div class="text-[120px] md:text-[80px] font-bold leading-none bg-linear-to-r from-red-400 to-gray-600 bg-clip-text text-transparent font-arial">404</div>
        <div class="absolute right-12 top-5 text-4xl md:text-3xl text-red-400 opacity-80 animate-bounce">
          <font-awesome-icon icon="fa-solid fa-circle-question" />
        </div>
      </div>

      <!-- 错误信息 -->
      <div class="mb-8">
        <h2 class="text-2xl md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">Page Not Found</h2>
        <p class="text-base md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Sorry, the page you're looking for doesn't exist or has been moved.</p>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a-button
          type="primary"
          @click="goHome"
          class="min-w-[120px] h-10 flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <template #icon>
            <font-awesome-icon icon="fa-solid fa-house" />
          </template>
          Back to Home
        </a-button>

        <a-button @click="goBack" class="min-w-[120px] h-10 flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <template #icon>
            <font-awesome-icon icon="fa-solid fa-arrow-left" />
          </template>
          Go Back
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => router.push('/');
const goBack = () => router.back();
</script>
