import { useApp } from '@/stores/appStore';
import { open } from '@tauri-apps/plugin-shell';

const { isTauriApp: isTauri } = useApp();

export const openExternalLink = async (url: string | undefined) => {
  if (url === undefined) {
    console.error('URL is undefined');
    return;
  }
  isTauri ? await open(url) : window.open(url, '_blank');
};
