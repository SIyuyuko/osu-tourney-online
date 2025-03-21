import { zh, en } from './locales';

const savedLanguage = localStorage.getItem('local') ?? 'zh'; // 从用户信息中获取语言

export const i18nConfig = {
  legacy: false,
  locale: savedLanguage,
  fallbackLocale: 'zh',
  messages: { zh, en },
};
