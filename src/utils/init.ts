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

// 类型定义
type Theme = 'light' | 'dark'

// 全局状态
export const globalState = {
  theme: ref<Theme>('light'),
  siderCollapsed: ref(false)
}

// 初始化主题
const initTheme = async () => {
  try {
    // 等待用户配置加载完成
    await new Promise<void>((resolve) => {
      const checkUser = () => {
        if ((window as any).user) {
          resolve()
        } else {
          requestAnimationFrame(checkUser)
        }
      }
      checkUser()
    })

    // 设置主题
    globalState.theme.value = (window as any).user?.theme ?? 'light'
  } catch (error) {
    console.warn('Theme initialization failed:', error)
    // 保持默认主题
  }
}

// 插件安装函数
export const install = (app: App) => {
  // 提供全局状态
  app.provide('themeMode', globalState.theme)
  app.provide('collapsed', globalState.siderCollapsed)

  // 初始化日期本地化
  dayjs.locale('zh-cn')

  // 初始化主题
  initTheme()
}

// 导出默认对象
export default { install }