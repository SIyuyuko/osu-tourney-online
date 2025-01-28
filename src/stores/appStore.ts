import { faWindowMaximize as faWindowMaximizeSolid, faWindowRestore as faWindowRestoreSolid } from '@fortawesome/free-solid-svg-icons';
import { defineStore } from 'pinia';
import { WindowManager } from '@/utils/tauriManager';

export const useApp = defineStore('app', {
  state: () => ({
    isTauri: Boolean((window as any).__TAURI__),
    windowManager: null as WindowManager | null,
    isMaximized: false,
    maximizeIcon: faWindowMaximizeSolid,
  }),

  getters: {
    isTauriApp: (state) => state.isTauri,
    currentMaximizeIcon: (state) => state.maximizeIcon,
  },

  actions: {
    async initializeWindowManager() {
      if (this.isTauri && !this.windowManager) {
        this.windowManager = WindowManager.getInstance();
        await this.windowManager.initialize();
        this.isMaximized = this.windowManager.getIsMaximized();
        this.updateMaximizeState(this.isMaximized);
      }
    },

    async toggleMaximizeWindow() {
      if (!this.windowManager) return;
      const maximized = await this.windowManager.toggleMaximize();
      this.updateMaximizeState(maximized);
    },

    async minimizeWindow() {
      if (!this.windowManager) return;
      await this.windowManager.minimize();
    },

    async closeWindow() {
      if (!this.windowManager) return;
      try {
        console.log('Initiating window close...');
        await this.windowManager.close();
      } catch (error) {
        console.error('Failed to close window from store:', error);
      }
    },

    updateMaximizeState(maximized: boolean) {
      this.isMaximized = maximized;
      this.maximizeIcon = maximized ? faWindowRestoreSolid : faWindowMaximizeSolid;
    },
  },
});
