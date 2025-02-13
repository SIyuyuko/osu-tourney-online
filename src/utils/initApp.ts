import type { App } from 'vue';
import { ref } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// 全局状态
export const globalState = {
  siderCollapsed: ref(false),
};

// 插件安装函数
export const install = (app: App) => {
  app.provide('collapsed', globalState.siderCollapsed); // 提供全局状态
  dayjs.locale('zh-cn'); // 初始化日期本地化
};

// 导出默认对象
export default { install };
