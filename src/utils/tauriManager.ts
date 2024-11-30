// src/utils/tauriManager.ts
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { Window } from '@tauri-apps/api/window';
import { UnlistenFn } from '@tauri-apps/api/event';
import { ref } from 'vue';

interface WindowCleanupOptions {
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export class WindowManager {
  private window: Window | null = null;
  private cleanupTimeout: NodeJS.Timeout | null = null;
  private isDestroyed = ref(false);
  private static instance: WindowManager | null = null;
  private listeners: UnlistenFn[] = [];

  private constructor() {}

  static getInstance(): WindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isDestroyed.value) {
      throw new Error('Window manager has been destroyed');
    }

    try {
      if (!this.window) {
        this.window = getCurrentWebviewWindow();
        await this.setupWindowListeners();

        // 禁用浏览器默认的beforeunload行为
        this.disableBeforeUnloadPrompt();
      }
    } catch (error) {
      console.error('Failed to initialize window manager:', error);
      throw error;
    }
  }

  private async setupWindowListeners(): Promise<void> {
    if (!this.window) return;

    try {
      const unlisten = await this.window.listen('tauri://close-requested', async () => {
        this.window?.close();
        await this.cleanup();
      });
      this.listeners.push(unlisten);
    } catch (error) {
      console.error('Failed to setup window listeners:', error);
    }
  }

  private disableBeforeUnloadPrompt(): void {
    // 移除所有现有的beforeunload监听器
    window.onbeforeunload = null;

    // 阻止页面添加新的beforeunload监听器
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
      if (type === 'beforeunload') {
        // 忽略beforeunload事件监听器
        return;
      }
      originalAddEventListener.call(window, type, listener, options);
    };
  }

  async cleanup(options: WindowCleanupOptions = {}): Promise<void> {
    const { timeout = 1000, retryAttempts = 3, retryDelay = 200 } = options;

    if (this.isDestroyed.value) return;

    this.isDestroyed.value = true;

    try {
      // 使用 Promise.race 确保清理操作不会无限阻塞
      await Promise.race([
        this.performCleanup(retryAttempts, retryDelay),
        new Promise((_, reject) => {
          this.cleanupTimeout = setTimeout(() => {
            reject(new Error('Cleanup timeout'));
          }, timeout);
        }),
      ]);
    } catch (error) {
      console.error('Error during cleanup:', error);
    } finally {
      if (this.cleanupTimeout) {
        clearTimeout(this.cleanupTimeout);
        this.cleanupTimeout = null;
      }
    }
  }

  private async performCleanup(attempts: number, delay: number): Promise<void> {
    for (let i = 0; i < attempts; i++) {
      try {
        if (this.window) {
          // 清理所有事件监听器
          await Promise.all(this.listeners.map((unlisten) => unlisten()));
          this.listeners = [];

          // 清理窗口引用
          this.window = null;
          return;
        }
        return;
      } catch (error) {
        if (i === attempts - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  isInitialized(): boolean {
    return !!this.window && !this.isDestroyed.value;
  }

  // 添加新的事件监听器
  async addListener(event: string, callback: () => void): Promise<void> {
    if (!this.window || this.isDestroyed.value) {
      throw new Error('Window manager is not initialized or has been destroyed');
    }

    try {
      const unlisten = await this.window.listen(event, callback);
      this.listeners.push(unlisten);
    } catch (error) {
      console.error(`Failed to add listener for event ${event}:`, error);
      throw error;
    }
  }

  // 获取当前窗口实例
  getWindow(): Window | null {
    return this.window;
  }
}

// 初始化Tauri相关功能
let isInitializing = false;
async function handleWindowClose() {
  const windowManager = WindowManager.getInstance();
  if (windowManager.isInitialized()) {
    await windowManager.cleanup();
    const window = windowManager.getWindow();
    if (window) {
      await window.close();
    }
  }
}

export async function initializeTauri(): Promise<void> {
  if (isInitializing) return;

  isInitializing = true;
  try {
    const windowManager = WindowManager.getInstance();
    await windowManager.initialize();
    await windowManager.addListener('tauri://close-requested', handleWindowClose);
  } catch (error) {
    console.error('Failed to initialize Tauri:', error);
    throw error;
  } finally {
    isInitializing = false;
  }
}
