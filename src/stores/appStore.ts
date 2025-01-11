import { defineStore } from "pinia";
import { WindowManager } from "@/utils/tauriManager";

export const useApp = defineStore("app", {
    state: () => ({
        isTauri: Boolean((window as any).__TAURI__),
        windowManager: null as WindowManager | null,
        isMaximized: false,
        maximizeIcon: 'fa-solid fa-window-maximize',
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
            await this.windowManager.close();
        },

        updateMaximizeState(maximized: boolean) {
            this.isMaximized = maximized;
            this.maximizeIcon = maximized
                ? 'fa-solid fa-window-restore'
                : 'fa-solid fa-window-maximize';
        },

        async cleanup() {
            if (this.windowManager) {
                await this.windowManager.cleanup();
                this.windowManager = null;
            }
        },
    },
});
