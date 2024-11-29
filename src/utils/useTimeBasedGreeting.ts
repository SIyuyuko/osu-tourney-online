import { ref, watch } from 'vue';
import dayjs from 'dayjs';

// 定义传入的参数类型
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
