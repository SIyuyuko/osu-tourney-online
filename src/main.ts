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
import { router } from '@/router';
import init from '@/utils/init';
import i18n from '@/language';
import App from '@/App.vue';

library.add(fas, far, fab);
const app = createApp(App);


app.use(Antd)
    .use(createPinia())
    .use(i18n)
    .use(router)
    .use(init)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app');
