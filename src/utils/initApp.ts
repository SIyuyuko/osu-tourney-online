import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '@/stores/settingStore';

export function initApp() {
  // 获取全局设置
  const settingsStore = useSettingsStore();
  settingsStore.loadSettings();
  const savedLanguage = settingsStore.settings.language;

  const { locale } = useI18n();

  // 初始化语言
  if (savedLanguage === 'zh') {
    dayjs.locale('zh-cn');
    locale.value = 'zh';
  } else if (savedLanguage === 'en') {
    dayjs.locale('en');
    locale.value = 'en';
  }

  // 返回清理函数
  return () => {
    // 清理操作
  };
}
