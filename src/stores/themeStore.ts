// src/stores/themeStore.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';

// 将类型定义提取出来
export type Theme = 'light' | 'dark';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('light');

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme.value);
    // 可以添加其他主题切换时的副作用，比如修改 HTML 的 data-theme 属性
    document.documentElement.setAttribute('data-theme', theme.value);
  };

  const initTheme = async () => {
    try {
      // 优先从 localStorage 获取
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        theme.value = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        return;
      }

      // 如果需要等待用户信息
      if ((import.meta as any).env.PROD) {  // 只在生产环境等待用户信息
        await new Promise<void>((resolve) => {
          const checkUser = () => {
            if ((window as any).user) {
              resolve();
            } else {
              requestAnimationFrame(checkUser);
            }
          };
          checkUser();
        });
        theme.value = (window as any).user?.theme ?? 'light';
      }
    } catch (error) {
      console.warn('主题初始化失败:', error);
    } finally {
      document.documentElement.setAttribute('data-theme', theme.value);
    }
  };

  return {
    theme,
    toggleTheme,
    initTheme,
  };
});