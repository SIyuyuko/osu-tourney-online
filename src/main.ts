import './assets/css/main.css';
import 'ant-design-vue/dist/reset.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { useApp } from "@/stores/appStore";
import { router } from '@/router';
import initApp from '@/utils/initApp';
import i18n from '@/i18n';
import App from '@/App.vue';
import { useBeatmapStore } from '@/stores/beatmapStore';
import { initializeTauri } from '@/utils/tauriManager';

library.add(fas, far, fab);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia)
  .use(Antd)
  .use(i18n)
  .use(router)
  .use(initApp)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');

const appStore = useApp();
const beatmapStore = useBeatmapStore();
beatmapStore.restoreCache();

// 定期清理过期缓存
setInterval(() => {
  beatmapStore.clearExpiredCache();
}, 60 * 60 * 1000); // 每小时清理一次

// 定期保存缓存
setInterval(() => {
  beatmapStore.persistCache();
}, 5 * 60 * 1000);

const { isTauri } = useApp();
console.log('isTauri:', isTauri);
if (isTauri) {
  initializeTauri();
}

if (appStore.isTauri) {
  appStore.initializeWindowManager().catch(console.error);
}
