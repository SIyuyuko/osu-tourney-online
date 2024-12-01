import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { beatmapApi } from '@/api';
import type { BeatmapInfo, BeatmapParams, BeatmapResponse } from '@/types/beatmap';

export function useBeatmapData(initialItem?: BeatmapInfo, initialData?: BeatmapResponse) {
  const map = ref<BeatmapInfo | null>(null);
  const loading = ref(true);
  const error = ref<Error | null>(null);
  const abortController = new AbortController();

  const initBeatmap = async (item: BeatmapInfo) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await beatmapApi.getBeatmapInfo(String(item.id), {
        signal: abortController.signal,
      });
      // console.log('res:', res);
      if (res.code === 200) {
        // console.log('Fetched beatmap:', res.data);
        map.value = {
          ...item,
          data: res.data,
        };
        await fetchBeatmapParams();
      }
    } catch (err) {
      error.value = err as Error;
      // console.error('Error fetching beatmap:', err);
      // Retry after delay
      setTimeout(() => initBeatmap(item), 5000);
    }
  };

  const fetchBeatmapParams = async () => {
    if (!map.value?.data?.mode) return;

    const noModList = ['FM', 'TB', 'EX'];
    const params = {
      bid: map.value.id,
      mod: noModList.includes(map.value.mod) ? 'NM' : map.value.mod,
      mode: map.value.data.mode,
    };

    try {
      const res = await beatmapApi.getBeatmapAttributes(params);
      // console.log('Attributes response:', res); // 打印响应数据以检查结构

      // 确保在更新 map.value 之前数据是有效的
      if (res && typeof res === 'object') {
        const formattedParams = formatParams(res);
        // console.log('Formatted params:', formattedParams);

        // 使用 nextTick 确保视图更新
        nextTick(() => {
          if (map.value) {
            map.value = {
              ...map.value,
              params: formattedParams,
            };
          }
          loading.value = false;
        });
      }
    } catch (err) {
      error.value = err as Error;
      console.error('Error fetching params:', err);
    }
  };

  const formatParams = (data: Record<string, number>): BeatmapParams => {
    return {
      approach_rate: data.approach_rate.toFixed(1),
      overall_difficulty: data.overall_difficulty.toFixed(1),
      max_combo: data.max_combo,
      star_rating: data.star_rating.toFixed(2),
    };
  };

  // Reset data when map changes
  const resetData = () => {
    map.value = null;
    loading.value = true;
    error.value = null;
  };

  // Initialize with provided item
  if (initialItem) {
    onMounted(() => {
      initBeatmap(initialItem);
    });
  }

  onBeforeUnmount(() => {
    abortController.abort();
  });

  return {
    map,
    loading,
    error,
    initBeatmap,
    resetData,
  };
}
