import { defineStore } from 'pinia';

export const useSettingStore = defineStore('setting', {
  state: () => ({ showSetting: false }),
  actions: {
    toggleSetting() {
      this.showSetting = !this.showSetting;
    },
  },
});
