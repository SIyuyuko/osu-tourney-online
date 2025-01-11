// src/utils/tauriManager.ts
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { Window } from '@tauri-apps/api/window';

export class WindowManager {
  private window: Window | null = null;
  private isDestroyed = false;
  private isMaximized = false;
  private static instance: WindowManager | null = null;
  private windowRefreshInterval: number | null = null;

  private constructor() {
    // 设置定期刷新窗口引用
    this.setupWindowRefresh();
  }

  static getInstance(): WindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  }

  private setupWindowRefresh(): void {
    // 每5分钟刷新一次窗口引用
    this.windowRefreshInterval = setInterval(
      () => {
        if (!this.isDestroyed) {
          this.refreshWindow();
        }
      },
      5 * 60 * 1000
    ) as unknown as number;
  }

  private async refreshWindow(): Promise<void> {
    try {
      const tempWindow = getCurrentWebviewWindow();
      if (tempWindow) {
        this.window = tempWindow;
      }
    } catch (error) {
      console.error('Failed to refresh window reference:', error);
    }
  }

  private async getWindow(): Promise<Window> {
    try {
      // 每次获取都刷新窗口引用
      const currentWindow = getCurrentWebviewWindow();
      if (!currentWindow) {
        throw new Error('Failed to get window instance');
      }
      this.window = currentWindow;
      return currentWindow;
    } catch (error) {
      console.error('Error getting window instance:', error);
      throw error;
    }
  }

  async initialize(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error('Window manager has been destroyed');
    }

    try {
      if (!this.window) {
        this.window = await this.getWindow();
        this.isMaximized = await this.window.isMaximized();
      }
    } catch (error) {
      console.error('Failed to initialize window manager:', error);
      throw error;
    }
  }

  // Window state management methods
  async toggleMaximize(): Promise<boolean> {
    try {
      this.window = await this.getWindow();

      this.isMaximized = await this.window.isMaximized();
      if (this.isMaximized) {
        await this.window.unmaximize();
        this.isMaximized = false;
      } else {
        await this.window.maximize();
        this.isMaximized = true;
      }
      return this.isMaximized;
    } catch (error) {
      console.error('Failed to toggle window state:', error);
      return false;
    }
  }

  async minimize(): Promise<void> {
    try {
      this.window = await this.getWindow();
      await this.window?.minimize();
    } catch (error) {
      console.error('Failed to minimize window:', error);
    }
  }

  async close(): Promise<void> {
    try {
      console.log('Starting window close process...');
      const window = await this.getWindow();

      if (this.isDestroyed) {
        console.warn('Window is already destroyed');
        return;
      }

      // 清理定时器
      if (this.windowRefreshInterval) {
        clearInterval(this.windowRefreshInterval);
        this.windowRefreshInterval = null;
      }

      // 标记为已销毁
      this.isDestroyed = true;

      // 强制关闭窗口
      console.log('Forcing window close...');
      await window.close();

      // 清理实例
      WindowManager.instance = null;
      this.window = null;
    } catch (error) {
      console.error('Failed to close window:', error);

      // 即使出错也尝试强制关闭
      try {
        if (this.window) {
          await this.window.close();
        }
      } catch (finalError) {
        console.error('Failed final attempt to close window:', finalError);
      }

      throw error;
    }
  }

  isInitialized(): boolean {
    return !!this.window && !this.isDestroyed;
  }

  getIsMaximized(): boolean {
    return this.isMaximized;
  }

  destroy(): void {
    if (this.windowRefreshInterval) {
      clearInterval(this.windowRefreshInterval);
      this.windowRefreshInterval = null;
    }
    this.isDestroyed = true;
    this.window = null;
    WindowManager.instance = null;
  }
}

// 初始化Tauri相关功能
let isInitializing = false;

export async function initializeTauri(): Promise<void> {
  if (isInitializing) return;

  isInitializing = true;
  try {
    const windowManager = WindowManager.getInstance();
    await windowManager.initialize();
  } catch (error) {
    console.error('Failed to initialize Tauri:', error);
    throw error;
  } finally {
    isInitializing = false;
  }
}
