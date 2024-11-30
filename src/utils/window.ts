import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

const isMaximized: boolean = false;

const toggleMaximizeWindow = async (): Promise<boolean> => {
  try {
    const window = getCurrentWebviewWindow();
    const maximized = await window.isMaximized();

    if (maximized) {
      await window.unmaximize();
      return false;
    } else {
      await window.maximize();
      return true;
    }
  } catch (error) {
    console.error('Failed to toggle window state:', error);
    return false;
  }
};

const minimizeWindow = () => {
  getCurrentWebviewWindow().minimize();
};

const closeWindow = async() => {
  try {
    const window = getCurrentWebviewWindow();
    // 触发关闭请求事件，而不是直接关闭
    await window.emit('tauri://close-requested');
  } catch (error) {
    console.error('Failed to close window:', error);
  }
};

export { toggleMaximizeWindow, minimizeWindow, closeWindow, isMaximized };
