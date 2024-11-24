// themeStore.ts
import { ref, computed } from 'vue';
import { theme as antTheme } from 'ant-design-vue';

export const useThemeStore = () => {
  // 主题状态
  type Theme = 'light' | 'dark'
  const theme = ref<Theme>('light');

  // 计算主题算法
  const themeAlgorithm = computed(() => (theme.value === 'light' ? antTheme.defaultAlgorithm : antTheme.darkAlgorithm));

  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme.value);
  };

  // 初始化主题
  const initTheme = async () => {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        theme.value = savedTheme;
        return;
      }

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
    } catch (error) {
      console.warn('主题初始化失败:', error);
      theme.value = 'light' // 使用默认主题
    }
  };

  return {
    theme,
    themeAlgorithm,
    toggleTheme,
    initTheme,
  };
};
