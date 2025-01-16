// src/stores/themeStore.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';

export type Theme = 'light' | 'dark';
const VALID_THEMES: Theme[] = ['light', 'dark'];

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('dark');

  // 主题验证
  const isValidTheme = (value: string): value is Theme => {
    return VALID_THEMES.includes(value as Theme);
  };

  // 设置主题的公共逻辑
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const initTheme = async () => {
    try {
      // 1. 尝试从 localStorage 获取
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && isValidTheme(savedTheme)) {
        setTheme(savedTheme);
        return;
      }

      // 2. 尝试从系统偏好获取
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme: Theme = prefersDark ? 'dark' : 'light';

      // 3. 在生产环境下等待用户信息
      if (import.meta.env.PROD) {
        try {
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('等待用户信息超时'));
            }, 5000); // 设置超时时间

            const checkUser = () => {
              if (window.user) {
                clearTimeout(timeout);
                resolve();
              } else {
                requestAnimationFrame(checkUser);
              }
            };
            checkUser();
          });

          if (window.user?.theme && isValidTheme(window.user.theme)) {
            setTheme(window.user.theme);
            return;
          }
        } catch (error) {
          console.warn('获取用户主题设置失败:', error);
        }
      }

      // 4. 回退到系统主题
      setTheme(systemTheme);

      // 5. 监听系统主题变化（可选）
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          // 只在用户未手动设置主题时响应
          setTheme(e.matches ? 'dark' : 'light');
        }
      });
    } catch (error) {
      console.error('主题初始化失败:', error);
      setTheme('dark'); // 使用默认主题作为最后的回退选项
    }
  };

  return {
    theme,
    toggleTheme,
    initTheme,
  };
});
