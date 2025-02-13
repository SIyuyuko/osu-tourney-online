import { useApp } from '@/stores/appStore';
import { open } from '@tauri-apps/plugin-shell';
import { message } from 'ant-design-vue';

export const openExternalLink = async (url: string | undefined) => {
  if (url === undefined) {
    console.error('URL is undefined');
    return;
  }

  const { isTauriApp: isTauri } = useApp();
  isTauri ? await open(url) : window.open(url, '_blank');
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success('Text copied to clipboard');
        console.log('Text copied to clipboard');
      })
      .catch((err) => {
        message.error('Could not copy text');
        console.error('Could not copy text: ', err);
      });
  }

  // Fallback for legacy browsers
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.cssText = 'position:fixed;pointer-events:none;z-index:-9999;opacity:0;';

    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);

    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error('Legacy clipboard copy also failed:', err);
    return false;
  }
};
