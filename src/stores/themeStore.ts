// src/stores/themeStore.ts
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { theme as antTheme } from 'ant-design-vue';

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref(true);
  const skin = computed(() => (isDarkMode.value ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm));

  // 设置主题的公共逻辑
  const executeSetTheme = (newTheme: boolean) => {
    isDarkMode.value = newTheme;
    localStorage.setItem('theme', String(newTheme));
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setTheme = (newTheme: boolean) => {
    if (!document.startViewTransition) {
      executeSetTheme(newTheme);
      return;
    }

    document.startViewTransition(() => executeSetTheme(newTheme));
  };

  const initTheme = async () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setTheme(savedTheme === 'true');
  };

  return {
    isDarkMode,
    skin,
    setTheme,
    initTheme,
  };
});
