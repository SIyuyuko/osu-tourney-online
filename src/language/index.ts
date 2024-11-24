import { createI18n } from 'vue-i18n'
import { zh, en } from './locales'

const i18n = createI18n({
  locale: 'zh', // 默认显示语言
  fallbackLocale: 'zh',
  messages: { zh, en }
})

export default i18n