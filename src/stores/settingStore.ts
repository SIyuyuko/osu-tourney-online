import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('setting', () => {
  const settings = ref({
    sidebarCollapsed: false,
    showSettingDrawer: false,
    language: 'zh',
  });

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      Object.assign(settings.value, JSON.parse(savedSettings));
    }
  };

  const saveSettings = () => {
    localStorage.setItem('settings', JSON.stringify(settings.value));
  };

  const setLocale = (locale: string) => {
    settings.value.language = locale;
    saveSettings();
  };

  return {
    settings,
    loadSettings,
    saveSettings,
    setLocale,
  };
});
