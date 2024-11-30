import { defineStore } from "pinia";
import { toggleMaximizeWindow, minimizeWindow, closeWindow } from "@/utils/window";
import { set } from "lodash";

export const useApp = defineStore("app", {
    state: () => ({
        isTauri: (window as any).__TAURI__,
        isMaximized: false,
        maximizeIcon: 'fa-solid fa-window-maximize',
    }),
    actions: {
        async toggleMaximizeWindow() {
            toggleMaximizeWindow().then((maximized) => {
                this.isMaximized = maximized;
                this.maximizeIcon = maximized
                    ? 'fa-solid fa-window-restore'
                    : 'fa-solid fa-window-maximize';
            });
        },
        minimizeWindow() { minimizeWindow() },
        closeWindow() { closeWindow() },
        getIsTauri() {
            return this.isTauri;
        },
        getMaximizeIcon() {
            return this.maximizeIcon;
        },
        getIsMaximized() {
            return this.isMaximized;
        },
        setIsMaximized(value: boolean) {
            set(this, 'isMaximized', value);
            if (value) {
                set(this, 'maximizeIcon', 'fa-solid fa-window-restore');
            }
        },
    },
});
