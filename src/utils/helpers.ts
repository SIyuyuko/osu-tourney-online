import { ref, watch } from 'vue';
import dayjs from 'dayjs';
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

interface DailyWords {
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
}

export function useTimeBasedGreeting(greetings: DailyWords) {
  const currentTime = ref(dayjs().format('HH'));
  const dailyWords = ref('');

  const updateGreeting = () => {
    const hour = Number(currentTime.value);

    if (hour >= 6 && hour <= 12) {
      dailyWords.value = greetings.morning;
    } else if (hour >= 13 && hour <= 18) {
      dailyWords.value = greetings.afternoon;
    } else if (hour >= 19 && hour <= 24) {
      dailyWords.value = greetings.evening;
    } else {
      dailyWords.value = greetings.night;
    }
  };

  watch(currentTime, updateGreeting, { immediate: true });

  setInterval(() => {
    currentTime.value = dayjs().format('HH');
  }, 900000);

  return {
    dailyWords,
    currentTime,
  };
}

