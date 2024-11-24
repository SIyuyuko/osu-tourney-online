/*
 * @Author: SIyuyuko
 * @Date: 2024-05-06 16:18:40
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-08-28 10:36:22
 * @FilePath: /tourney-site/src/init.ts
 * @Description: 全局初始化
 */
import type { App } from 'vue'
import { ref } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// 全局状态
export const globalState = {
  siderCollapsed: ref(false)
}

// 插件安装函数
export const install = (app: App) => {
  // 提供全局状态
  app.provide('collapsed', globalState.siderCollapsed)

  // 初始化日期本地化
  dayjs.locale('zh-cn')
}

// 导出默认对象
export default { install }